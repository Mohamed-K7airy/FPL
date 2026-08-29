import { Router, Response } from 'express';
import { supabase } from '../db/supabase.js';
import { logger } from '../utils/logger.js';
import { authenticateToken, AuthenticatedRequest } from '../middlewares/authMiddleware.js';
import { SyncService } from '../services/syncService.js';

const router = Router();

// GET /api/points/history
router.get('/history', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const { data: scores } = await supabase
      .from('gw_scores')
      .select('*, gameweeks(name, deadline_time)')
      .eq('user_id', userId)
      .order('gw', { ascending: true });

    res.status(200).json({ history: scores || [] });
  } catch (err) {
    logger.error(err, 'Error in GET /api/points/history');
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to fetch points history.' } });
  }
});

// Handler for points by gameweek or current
async function handleGetPoints(req: AuthenticatedRequest, res: Response, paramGw?: string): Promise<void> {
  try {
    const userId = req.user!.id;

    // 1. Resolve Gameweek number
    let gw: number;
    const { data: allGws } = await supabase
      .from('gameweeks')
      .select('*')
      .order('id', { ascending: true });

    const currentActiveGw = (allGws || []).find((g) => g.is_current) || allGws?.[0];
    const latestFinishedGw = (allGws || []).filter((g) => g.finished).sort((a, b) => b.id - a.id)?.[0];
    const defaultPointsGwId = currentActiveGw ? currentActiveGw.id : (latestFinishedGw ? latestFinishedGw.id : 1);

    if (!paramGw || paramGw === 'current' || paramGw === 'latest') {
      gw = defaultPointsGwId;
    } else {
      const parsed = parseInt(paramGw, 10);
      gw = isNaN(parsed) ? defaultPointsGwId : Math.max(1, Math.min(38, parsed));
    }

    const currentGwInfo = (allGws || []).find((g) => g.id === gw);

    // 2. On-demand auto-sync for live/finished gameweeks if stats are missing
    const { count: existingStatsCount } = await supabase
      .from('player_gw_stats')
      .select('*', { count: 'exact', head: true })
      .eq('gw', gw);

    if ((!existingStatsCount || existingStatsCount === 0) && gw <= (currentActiveGw?.id || 38)) {
      try {
        logger.info({ gw }, 'On-demand sync: No player stats found for gameweek in DB, syncing from FPL API');
        await SyncService.syncLive(gw);
      } catch (syncErr) {
        logger.warn({ gw, err: syncErr }, 'On-demand sync failed, falling back to cached DB records');
      }
    }

    // 3. Fetch user GW score summary
    const { data: scoreSummary } = await supabase
      .from('gw_scores')
      .select('*')
      .eq('user_id', userId)
      .eq('gw', gw)
      .maybeSingle();

    // 4. Fetch active chip for this user in this GW
    const { data: chipRecord } = await supabase
      .from('chips_used')
      .select('chip')
      .eq('user_id', userId)
      .eq('gw', gw)
      .maybeSingle();

    const activeChip = (scoreSummary?.chip || chipRecord?.chip || null) as string | null;
    const isTripleCaptain = activeChip === '3xc';

    // 5. Fetch user picks snapshot for this GW (or fallback to current squad for pre-season / unfinalized GW)
    let { data: picks } = await supabase
      .from('gw_picks')
      .select('*, players(*, fpl_teams(name, short_name))')
      .eq('user_id', userId)
      .eq('gw', gw)
      .order('slot', { ascending: true });

    if (!picks || picks.length === 0) {
      const { data: currentSquad } = await supabase
        .from('squad')
        .select('*, players(*, fpl_teams(name, short_name))')
        .eq('user_id', userId)
        .order('slot', { ascending: true });

      picks = (currentSquad || []).map((s: any) => ({
        ...s,
        gw,
        multiplier: s.slot <= 5 ? (s.is_captain ? (isTripleCaptain ? 3 : 2) : 1) : 0,
        auto_subbed: false,
      }));
    } else {
      // Ensure multiplier matches 3x if Triple Captain is active
      picks = picks.map((p: any) => ({
        ...p,
        multiplier: p.slot <= 5 ? (p.is_captain ? (isTripleCaptain ? 3 : 2) : (p.multiplier || 1)) : 0,
      }));
    }

    // 6. Fetch player live stats for this specific GW
    const playerIds = picks.map((p: any) => p.player_id);
    const { data: playerStats } = await supabase
      .from('player_gw_stats')
      .select('*')
      .eq('gw', gw)
      .in('player_id', playerIds);

    const statsMap = new Map<number, any>();
    (playerStats || []).forEach((s: any) => statsMap.set(s.player_id, s));

    const detailedPicks = picks.map((p: any) => {
      const stat = statsMap.get(p.player_id) || {};
      // Single GW points MUST come exclusively from player_gw_stats (never cumulative season total)
      const singlePoints = typeof stat.total_points === 'number' ? stat.total_points : 0;
      const multiplier = p.slot <= 5 ? (p.is_captain ? (isTripleCaptain ? 3 : 2) : 1) : 0;
      return {
        ...p,
        multiplier,
        stats: stat,
        singlePoints,
        calculatedPoints: singlePoints * multiplier,
      };
    });

    // 7. Compute live raw points (starters in slots 1..5)
    const liveRawPoints = detailedPicks
      .filter((p: any) => p.slot <= 5)
      .reduce((sum: number, p: any) => sum + (p.calculatedPoints || 0), 0);

    // 8. Fetch transfer costs for this GW (0 for pre-season / GW <= 1 or free chips)
    const isFreeTransfers = activeChip === 'wildcard' || activeChip === 'freehit' || gw <= 1;
    let effectiveTransferCost = 0;

    if (!isFreeTransfers) {
      const { data: transfers } = await supabase
        .from('transfers')
        .select('cost')
        .eq('user_id', userId)
        .eq('gw', gw);

      effectiveTransferCost = (transfers || []).reduce((acc: number, t: any) => acc + (t.cost || 0), 0);
    }
    const liveNetPoints = liveRawPoints - effectiveTransferCost;

    // 9. Fetch Average and Highest Points across all users for this GW
    const { data: allGwScores } = await supabase
      .from('gw_scores')
      .select('net_points')
      .eq('gw', gw);

    let avgScore = 0;
    let highestScore = 0;

    if (allGwScores && allGwScores.length > 0) {
      const scores = allGwScores.map((s: any) => s.net_points || 0);
      highestScore = Math.max(...scores);
      const total = scores.reduce((a: number, b: number) => a + b, 0);
      avgScore = Math.round(total / scores.length);
    } else if (currentGwInfo?.avg_score) {
      avgScore = currentGwInfo.avg_score;
    }

    const finalSummary = {
      raw_points: scoreSummary?.is_final ? scoreSummary.raw_points : liveRawPoints,
      transfer_cost: scoreSummary?.is_final ? scoreSummary.transfer_cost : effectiveTransferCost,
      net_points: scoreSummary?.is_final ? scoreSummary.net_points : liveNetPoints,
      total_points: scoreSummary?.is_final ? scoreSummary.total_points : liveNetPoints,
      chip: activeChip,
      is_final: scoreSummary?.is_final || false,
      averagePoints: avgScore,
      highestPoints: highestScore,
    };

    res.status(200).json({
      gw,
      gwName: currentGwInfo?.name || `Gameweek ${gw}`,
      isCurrent: Boolean(currentGwInfo?.is_current),
      isFinished: Boolean(currentGwInfo?.finished),
      activePointsGwId: defaultPointsGwId,
      summary: finalSummary,
      userScore: finalSummary.net_points,
      user_score: finalSummary.net_points,
      avgScore: finalSummary.averagePoints,
      avg_score: finalSummary.averagePoints,
      highestScore: finalSummary.highestPoints,
      highest_score: finalSummary.highestPoints,
      picks: detailedPicks,
    });
  } catch (err) {
    logger.error(err, 'Error in handleGetPoints');
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to fetch points breakdown.' } });
  }
}

// GET /api/points (default to current active gameweek)
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await handleGetPoints(req, res);
});

// GET /api/points/:gw
router.get('/:gw', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await handleGetPoints(req, res, String(req.params.gw));
});

export default router;
