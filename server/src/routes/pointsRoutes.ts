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
      .single();

    // Fetch user picks snapshot for this GW (or fallback to current squad for pre-season)
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
        multiplier: s.is_captain ? 2 : 1,
        auto_subbed: false,
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
      const singlePoints = stat.total_points || 0;
      return {
        ...p,
        stats: stat,
        singlePoints,
        calculatedPoints: singlePoints * p.multiplier,
      };
    });

    res.status(200).json({
      gw,
      summary: scoreSummary || {
        raw_points: 0,
        transfer_cost: 0,
        net_points: 0,
        total_points: 0,
        chip: null,
        is_final: false,
      },
      picks: detailedPicks,
    });
  } catch (err) {
    logger.error(err, 'Error in GET /api/points/:gw');
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to fetch points breakdown.' } });
  }
});

export default router;
