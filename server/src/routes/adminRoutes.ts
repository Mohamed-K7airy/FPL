import { Router, Response } from 'express';
import { supabase } from '../db/supabase.js';
import { logger } from '../utils/logger.js';
import { authenticateToken, requireAdmin, AuthenticatedRequest } from '../middlewares/authMiddleware.js';
import { SyncService } from '../services/syncService.js';
import { ScoringService } from '../services/scoringService.js';

const router = Router();

// Protect all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

// POST /api/admin/sync/bootstrap
router.post('/sync/bootstrap', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const result = await SyncService.syncBootstrap();
    res.status(200).json({ message: 'Bootstrap sync triggered successfully.', result });
  } catch (err) {
    logger.error(err, 'Admin sync bootstrap failed');
    res.status(500).json({ error: { code: 'SYNC_FAILED', message: (err as Error).message } });
  }
});

// POST /api/admin/sync/live/:gw
router.post('/sync/live/:gw', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const gw = parseInt(String(req.params.gw), 10);
    const count = await SyncService.syncLive(gw);
    await ScoringService.calculateScores(gw, false);
    res.status(200).json({ message: `Live sync for GW ${gw} completed.`, playersSynced: count });
  } catch (err) {
    logger.error(err, 'Admin sync live failed');
    res.status(500).json({ error: { code: 'SYNC_FAILED', message: (err as Error).message } });
  }
});

// POST /api/admin/recalculate/:gw
router.post('/recalculate/:gw', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const gw = parseInt(String(req.params.gw), 10);
    const count = await ScoringService.calculateScores(gw, false);
    res.status(200).json({ message: `Recalculated scores for GW ${gw}.`, usersProcessed: count });
  } catch (err) {
    logger.error(err, 'Admin recalculate failed');
    res.status(500).json({ error: { code: 'CALC_FAILED', message: (err as Error).message } });
  }
});

// POST /api/admin/demo-simulate/:gw (Generate realistic demo points for pre-season testing)
router.post('/demo-simulate/:gw', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const gw = parseInt(String(req.params.gw), 10);

    const { data: players } = await supabase.from('players').select('id');
    if (!players || players.length === 0) {
      res.status(400).json({ error: { message: 'No players found in DB. Run Sync Bootstrap first.' } });
      return;
    }

    const mockStats = players.map((p: any) => {
      const mockPoints = Math.floor(Math.random() * 11) + 1; // 1 to 11 points
      return {
        gw,
        player_id: p.id,
        minutes: 90,
        total_points: mockPoints,
        played: true,
        is_final: true,
      };
    });

    await supabase.from('player_gw_stats').upsert(mockStats);

    await ScoringService.snapshotPicks(gw);
    const count = await ScoringService.calculateScores(gw, false);

    res.status(200).json({
      message: `تم تشغيل المحاكاة التجريبية للجولة ${gw} بنجاح! تم توليد نقاط تجريبية واحتساب الترتيب بين جميع التشكيلات المسجلة.`,
      usersProcessed: count,
    });
  } catch (err) {
    logger.error(err, 'Admin demo simulate failed');
    res.status(500).json({ error: { code: 'SIMULATE_FAILED', message: (err as Error).message } });
  }
});

// POST /api/admin/reset-demo (Clears all test scores and resets rankings to 0)
router.post('/reset-demo', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    await supabase.from('gw_scores').delete().gte('gw', 1);
    await supabase.from('gw_picks').delete().gte('gw', 1);
    await supabase.from('player_gw_stats').delete().gte('gw', 1);

    res.status(200).json({
      message: 'تم تصفير وحذف جميع نقاط واختبارات الديمو بنجاح! عادت جميع الترتيبات والنقاط إلى 0 نقطة ونشيفة تماماً.',
    });
  } catch (err) {
    logger.error(err, 'Admin reset demo failed');
    res.status(500).json({ error: { code: 'RESET_FAILED', message: (err as Error).message } });
  }
});

// POST /api/admin/finalize/:gw
router.post('/finalize/:gw', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const gw = parseInt(String(req.params.gw), 10);
    const count = await ScoringService.calculateScores(gw, true);
    await supabase.from('gameweeks').update({ finished: true, data_checked: true }).eq('id', gw);
    res.status(200).json({ message: `Gameweek ${gw} finalized successfully.`, usersProcessed: count });
  } catch (err) {
    logger.error(err, 'Admin finalize failed');
    res.status(500).json({ error: { code: 'FINALIZE_FAILED', message: (err as Error).message } });
  }
});

// GET /api/admin/sync-log
router.get('/sync-log', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { data: logs } = await supabase
      .from('sync_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    res.status(200).json({ logs: logs || [] });
  } catch (err) {
    logger.error(err, 'Admin get sync log failed');
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to fetch sync log.' } });
  }
});

export default router;
