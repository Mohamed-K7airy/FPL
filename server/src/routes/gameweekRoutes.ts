import { Router, Request, Response } from 'express';
import { supabase } from '../db/supabase.js';
import { logger } from '../utils/logger.js';

const router = Router();

/**
 * GET /api/gameweeks/status
 * Returns current, next, active points GW, and deadline info.
 */
router.get('/status', async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data: gameweeks, error } = await supabase
      .from('gameweeks')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      logger.error(error, 'Error fetching gameweeks in /status');
      res.status(500).json({ error: { code: 'DB_ERROR', message: 'Failed to fetch gameweek status.' } });
      return;
    }

    const allGws = gameweeks || [];
    const currentGw = allGws.find((g) => g.is_current) || allGws[0];
    const nextGw = allGws.find((g) => g.is_next) || allGws[1] || allGws[0];

    // Find the latest finished gameweek
    const finishedGws = allGws.filter((g) => g.finished).sort((a, b) => b.id - a.id);
    const latestFinishedGw = finishedGws.length > 0 ? finishedGws[0] : null;

    // Determine default GW for Points view:
    // If currentGw exists, points should default to currentGw (it is currently underway or active).
    // If not current, default to latest finished GW or GW 1.
    const activePointsGwId = currentGw ? currentGw.id : (latestFinishedGw ? latestFinishedGw.id : 1);

    // Determine upcoming GW for Squad / Transfers view:
    // If current GW deadline has passed, upcoming management is for nextGw. Otherwise currentGw.
    const now = Date.now();
    const currentDeadline = currentGw ? new Date(currentGw.deadline_time).getTime() : 0;
    const isCurrentDeadlinePassed = now >= currentDeadline;
    const upcomingGwId = isCurrentDeadlinePassed && nextGw ? nextGw.id : (currentGw ? currentGw.id : 1);

    res.status(200).json({
      currentGwId: currentGw?.id || 1,
      currentGw,
      nextGwId: nextGw?.id || 2,
      nextGw,
      latestFinishedGwId: latestFinishedGw?.id || null,
      activePointsGwId,
      upcomingGwId,
      isDeadlinePassed: isCurrentDeadlinePassed,
      totalGameweeks: allGws.length,
    });
  } catch (err) {
    logger.error(err, 'Unhandled error in GET /api/gameweeks/status');
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to fetch gameweek status.' } });
  }
});

/**
 * GET /api/gameweeks
 * Returns all 38 gameweeks
 */
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data: gameweeks, error } = await supabase
      .from('gameweeks')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      logger.error(error, 'Error fetching all gameweeks');
      res.status(500).json({ error: { code: 'DB_ERROR', message: 'Failed to fetch gameweeks.' } });
      return;
    }

    res.status(200).json({ gameweeks: gameweeks || [] });
  } catch (err) {
    logger.error(err, 'Unhandled error in GET /api/gameweeks');
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to fetch gameweeks.' } });
  }
});

export default router;
