import { supabase } from '../db/supabase.js';
import { FplClient } from '../clients/fplClient.js';
import { logger } from '../utils/logger.js';

export class SyncService {
  /**
   * Syncs teams, players, and gameweeks from bootstrap-static
   */
  static async syncBootstrap(): Promise<{ teams: number; players: number; gameweeks: number }> {
    const startTime = Date.now();
    try {
      const data = await FplClient.getBootstrapStatic();

      // 1. Sync Teams
      const teams = data.teams.map((t: any) => ({
        id: t.id,
        name: t.name,
        short_name: t.short_name,
      }));
      const { error: teamErr } = await supabase.from('fpl_teams').upsert(teams);
      if (teamErr) throw teamErr;

      // 2. Sync Players
      const players = data.elements.map((p: any) => ({
        id: p.id,
        code: p.code,
        web_name: p.web_name,
        full_name: `${p.first_name} ${p.second_name}`.trim(),
        team_id: p.team,
        position: p.element_type, // 1 GKP, 2 DEF, 3 MID, 4 FWD
        now_cost: p.now_cost, // In tenths (e.g. 75 = £7.5M)
        status: p.status,
        news: p.news || null,
        chance_of_playing: p.chance_of_playing_next_round ?? null,
        total_points: p.total_points,
        form: parseFloat(p.form || '0'),
        synced_at: new Date().toISOString(),
      }));
      const { error: playerErr } = await supabase.from('players').upsert(players);
      if (playerErr) throw playerErr;

      // 3. Sync Gameweeks
      const gameweeks = data.events.map((e: any) => ({
        id: e.id,
        name: e.name,
        deadline_time: e.deadline_time,
        is_current: Boolean(e.is_current),
        is_next: Boolean(e.is_next),
        finished: Boolean(e.finished),
        data_checked: Boolean(e.data_checked),
        avg_score: e.average_entry_score || 0,
      }));
      const { error: gwErr } = await supabase.from('gameweeks').upsert(gameweeks);
      if (gwErr) throw gwErr;

      const durationMs = Date.now() - startTime;
      await supabase.from('sync_log').insert({
        kind: 'bootstrap',
        status: 'ok',
        message: `Synced ${teams.length} teams, ${players.length} players, ${gameweeks.length} gameweeks.`,
        duration_ms: durationMs,
      });

      logger.info(
        { teams: teams.length, players: players.length, gameweeks: gameweeks.length, durationMs },
        'Bootstrap sync completed successfully'
      );

      return { teams: teams.length, players: players.length, gameweeks: gameweeks.length };
    } catch (err) {
      const durationMs = Date.now() - startTime;
      await supabase.from('sync_log').insert({
        kind: 'bootstrap',
        status: 'error',
        message: (err as Error).message,
        duration_ms: durationMs,
      });
      logger.error(err, 'Bootstrap sync failed');
      throw err;
    }
  }

  /**
   * Syncs match fixtures
   */
  static async syncFixtures(gw?: number): Promise<number> {
    const startTime = Date.now();
    try {
      const fixturesData = await FplClient.getFixtures(gw);
      const fixtures = fixturesData.map((f: any) => ({
        id: f.id,
        gw: f.event,
        kickoff_time: f.kickoff_time,
        team_h: f.team_h,
        team_a: f.team_a,
        started: Boolean(f.started),
        finished: Boolean(f.finished),
      }));

      const { error } = await supabase.from('fixtures').upsert(fixtures);
      if (error) throw error;

      const durationMs = Date.now() - startTime;
      await supabase.from('sync_log').insert({
        kind: 'fixtures',
        gw: gw || null,
        status: 'ok',
        message: `Synced ${fixtures.length} fixtures.`,
        duration_ms: durationMs,
      });

      logger.info({ count: fixtures.length, gw }, 'Fixtures sync completed');
      return fixtures.length;
    } catch (err) {
      const durationMs = Date.now() - startTime;
      await supabase.from('sync_log').insert({
        kind: 'fixtures',
        gw: gw || null,
        status: 'error',
        message: (err as Error).message,
        duration_ms: durationMs,
      });
      logger.error(err, 'Fixtures sync failed');
      throw err;
    }
  }

  /**
   * Syncs live gameweek stats and total_points for all players
   */
  static async syncLive(gw: number): Promise<number> {
    const startTime = Date.now();
    try {
      const data = await FplClient.getEventLive(gw);
      const elements = data.elements || [];

      const stats = elements.map((el: any) => {
        const s = el.stats;
        const minutes = s.minutes || 0;
        const yellow = s.yellow_cards || 0;
        const red = s.red_cards || 0;
        // Infer played: minutes > 0 OR received a card
        const played = minutes > 0 || yellow > 0 || red > 0;

        return {
          gw,
          player_id: el.id,
          minutes,
          total_points: s.total_points || 0,
          bonus: s.bonus || 0,
          goals: s.goals_scored || 0,
          assists: s.assists || 0,
          clean_sheets: s.clean_sheets || 0,
          saves: s.saves || 0,
          yellow_cards: yellow,
          red_cards: red,
          played,
          is_final: false, // Updated to true upon finalize
          synced_at: new Date().toISOString(),
        };
      });

      const { error } = await supabase.from('player_gw_stats').upsert(stats);
      if (error) throw error;

      const durationMs = Date.now() - startTime;
      await supabase.from('sync_log').insert({
        kind: 'live',
        gw,
        status: 'ok',
        message: `Synced live stats for ${stats.length} players in GW ${gw}.`,
        duration_ms: durationMs,
      });

      logger.info({ gw, playerStatsCount: stats.length }, 'Live stats sync completed');
      return stats.length;
    } catch (err) {
      const durationMs = Date.now() - startTime;
      await supabase.from('sync_log').insert({
        kind: 'live',
        gw,
        status: 'error',
        message: (err as Error).message,
        duration_ms: durationMs,
      });
      logger.error({ gw, err }, 'Live stats sync failed');
      throw err;
    }
  }
}
