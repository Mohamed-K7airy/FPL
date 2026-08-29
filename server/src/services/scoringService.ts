import { supabase } from '../db/supabase.js';
import { ScoringEngine, PickItem, PlayerStatItem, ChipType } from './scoringEngine.js';
import { logger } from '../utils/logger.js';
import { SyncService } from './syncService.js';

export class ScoringService {
  /**
   * Takes an immutable snapshot of all user squads into gw_picks at deadline time
   */
  static async snapshotPicks(gw: number): Promise<number> {
    logger.info({ gw }, 'Snapshotting user picks for Gameweek');

    // Fetch all users with completed squads
    const { data: squads, error } = await supabase
      .from('squad')
      .select('user_id, player_id, slot, is_captain, is_vice, players(position)');

    if (error || !squads) {
      logger.error(error, 'Failed to fetch squads for snapshot');
      throw error;
    }

    const picksToInsert = squads.map((s: any) => ({
      gw,
      user_id: s.user_id,
      player_id: s.player_id,
      slot: s.slot,
      is_captain: Boolean(s.is_captain),
      is_vice: Boolean(s.is_vice),
      multiplier: s.slot <= 5 ? (s.is_captain ? 2 : 1) : 0,
      auto_subbed: false,
    }));

    const { error: insertErr } = await supabase.from('gw_picks').upsert(picksToInsert);
    if (insertErr) {
      logger.error(insertErr, 'Failed to insert gw_picks snapshot');
      throw insertErr;
    }

    logger.info({ gw, snapshotCount: picksToInsert.length }, 'Gameweek picks snapshot completed');
    return picksToInsert.length;
  }

  /**
   * Calculates scores for all users in a gameweek (Idempotent)
   */
  static async calculateScores(gw: number, isFinal: boolean = false): Promise<number> {
    logger.info({ gw, isFinal }, 'Calculating user scores for Gameweek');

    // 1. Fetch live player stats for this GW
    let { data: statsData } = await supabase
      .from('player_gw_stats')
      .select('*')
      .eq('gw', gw);

    if (!statsData || statsData.length === 0) {
      try {
        await SyncService.syncLive(gw);
        const { data: syncedStats } = await supabase
          .from('player_gw_stats')
          .select('*')
          .eq('gw', gw);
        statsData = syncedStats || [];
      } catch (err) {
        logger.warn({ gw, err }, 'Failed to auto-sync live stats in calculateScores');
      }
    }

    const statsMap = new Map<number, PlayerStatItem>();
    (statsData || []).forEach((s: any) => {
      statsMap.set(s.player_id, {
        points: s.total_points || 0,
        played: Boolean(s.played),
        fixturesDone: Boolean(s.is_final),
      });
    });

    // 2. Fetch all picks snapshot for this GW
    const { data: picksData } = await supabase
      .from('gw_picks')
      .select('*, players(position)')
      .eq('gw', gw);

    if (!picksData || picksData.length === 0) {
      logger.warn({ gw }, 'No picks snapshot found for gameweek score calculation');
      return 0;
    }

    // Group picks by user_id
    const userPicksMap = new Map<number, PickItem[]>();
    picksData.forEach((p: any) => {
      const userList = userPicksMap.get(p.user_id) || [];
      userList.push({
        playerId: p.player_id,
        slot: p.slot,
        position: p.players.position as 1 | 2 | 3 | 4,
        isCaptain: Boolean(p.is_captain),
        isVice: Boolean(p.is_vice),
      });
      userPicksMap.set(p.user_id, userList);
    });

    // 3. Fetch active chips for this GW
    const { data: chipsData } = await supabase
      .from('chips_used')
      .select('user_id, chip')
      .eq('gw', gw);

    const userChipMap = new Map<number, ChipType>();
    (chipsData || []).forEach((c: any) => {
      userChipMap.set(c.user_id, c.chip as ChipType);
    });

    // 4. Fetch transfers cost for this GW (0 for GW <= 1)
    const userTransferCostMap = new Map<number, number>();
    if (gw > 1) {
      const { data: transfersData } = await supabase
        .from('transfers')
        .select('user_id, cost')
        .eq('gw', gw);

      (transfersData || []).forEach((t: any) => {
        const currentCost = userTransferCostMap.get(t.user_id) || 0;
        userTransferCostMap.set(t.user_id, currentCost + t.cost);
      });
    }

    // 5. Fetch previous cumulative scores up to gw - 1
    const userPreviousScoresMap = new Map<number, number>();
    if (gw > 1) {
      const { data: prevScores } = await supabase
        .from('gw_scores')
        .select('user_id, net_points')
        .lt('gw', gw);

      (prevScores || []).forEach((ps: any) => {
        const currentTotal = userPreviousScoresMap.get(ps.user_id) || 0;
        userPreviousScoresMap.set(ps.user_id, currentTotal + (ps.net_points || 0));
      });
    }

    // 6. Calculate score for each user
    const scoreRows: any[] = [];
    const updatedPickRows: any[] = [];

    for (const [userId, picks] of userPicksMap.entries()) {
      const chip = userChipMap.get(userId);
      const transferCost = userTransferCostMap.get(userId) || 0;

      const scoreResult = ScoringEngine.scoreGameweek(picks, statsMap, {
        transferCost,
        chip,
        isFinal,
      });

      const previousTotal = userPreviousScoresMap.get(userId) || 0;
      const cumulativeTotal = previousTotal + scoreResult.netPoints;

      // Prepare gw_scores row
      scoreRows.push({
        gw,
        user_id: userId,
        raw_points: scoreResult.rawPoints,
        transfer_cost: scoreResult.transferCostApplied,
        net_points: scoreResult.netPoints,
        total_points: cumulativeTotal,
        chip: chip || null,
        is_final: isFinal,
        calculated_at: new Date().toISOString(),
      });

      // Prepare updated gw_picks (slots & multipliers after auto-subs & captain inheritance)
      scoreResult.lineup.forEach((p) => {
        updatedPickRows.push({
          gw,
          user_id: userId,
          player_id: p.playerId,
          slot: p.slot,
          is_captain: p.isCaptain,
          is_vice: p.isVice,
          multiplier: p.multiplier,
          auto_subbed: p.autoSubbed,
        });
      });
    }

    // Upsert gw_scores
    const { error: scoreErr } = await supabase.from('gw_scores').upsert(scoreRows);
    if (scoreErr) {
      logger.error(scoreErr, 'Failed to upsert gw_scores');
      throw scoreErr;
    }

    // Upsert updated gw_picks
    if (updatedPickRows.length > 0) {
      const { error: picksErr } = await supabase.from('gw_picks').upsert(updatedPickRows);
      if (picksErr) {
        logger.error(picksErr, 'Failed to update gw_picks');
        throw picksErr;
      }
    }

    logger.info({ gw, usersCalculated: userPicksMap.size }, 'Gameweek scores calculated successfully');
    return userPicksMap.size;
  }
}
