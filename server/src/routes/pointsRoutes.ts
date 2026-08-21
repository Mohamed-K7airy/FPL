import { Router, Response } from 'express';
import { supabase } from '../db/supabase.js';
import { logger } from '../utils/logger.js';
import { authenticateToken, AuthenticatedRequest } from '../middlewares/authMiddleware.js';

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

// GET /api/points/:gw
router.get('/:gw', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const gw = parseInt(String(req.params.gw), 10);

    // Fetch user GW score summary
    const { data: scoreSummary } = await supabase
      .from('gw_scores')
      .select('*')
      .eq('user_id', userId)
      .eq('gw', gw)
      .maybeSingle();

    // Fetch active chip for this user in this GW
    const { data: chipRecord } = await supabase
      .from('chips_used')
      .select('chip')
      .eq('user_id', userId)
      .eq('gw', gw)
      .maybeSingle();

    const activeChip = (scoreSummary?.chip || chipRecord?.chip || null) as string | null;
    const isTripleCaptain = activeChip === '3xc';

    // Fetch user picks snapshot for this GW (or fallback to current squad for pre-season / unfinalized GW)
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

    // Fetch player live stats for this GW
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
      const singlePoints = stat.total_points !== undefined
        ? stat.total_points
        : (gw === 1 ? (p.players?.total_points || 0) : 0);
      const multiplier = p.slot <= 5 ? (p.is_captain ? (isTripleCaptain ? 3 : 2) : 1) : 0;
      return {
        ...p,
        multiplier,
        stats: stat,
        singlePoints,
        calculatedPoints: singlePoints * multiplier,
      };
    });

    // Compute live raw points (starters in slots 1..5)
    const liveRawPoints = detailedPicks
      .filter((p: any) => p.slot <= 5)
      .reduce((sum: number, p: any) => sum + (p.calculatedPoints || 0), 0);

    // Fetch transfer costs for this GW (0 for pre-season / GW <= 1 or free chips)
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

    // Fetch Average and Highest Points across all users for this GW
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
    } else {
      const { data: gwInfo } = await supabase
        .from('gameweeks')
        .select('avg_score')
        .eq('id', gw)
        .maybeSingle();

      if (gwInfo?.avg_score) {
        avgScore = gwInfo.avg_score;
      }
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
    logger.error(err, 'Error in GET /api/points/:gw');
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to fetch points breakdown.' } });
  }
});

export default router;
