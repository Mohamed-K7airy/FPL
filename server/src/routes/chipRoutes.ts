import { Router, Response } from 'express';
import { z } from 'zod';
import { supabase } from '../db/supabase.js';
import { logger } from '../utils/logger.js';
import { authenticateToken, AuthenticatedRequest } from '../middlewares/authMiddleware.js';

const router = Router();

const ActivateChipSchema = z.object({
  chip: z.enum(['wildcard', 'freehit', 'bboost', '3xc']),
});

// POST /api/chips/activate
router.post('/activate', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const parseResult = ActivateChipSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: { code: 'INVALID_INPUT', details: parseResult.error.flatten() },
      });
      return;
    }

    const { chip } = parseResult.data;

    // Fetch current GW (default to 1 if unseeded)
    let gw = 1;
    const { data: currentGw } = await supabase
      .from('gameweeks')
      .select('*')
      .eq('is_current', true)
      .limit(1);

    if (currentGw && currentGw.length > 0) {
      const activeGw = currentGw[0];
      if (activeGw.deadline_time) {
        const deadline = new Date(activeGw.deadline_time).getTime();
        if (Date.now() >= deadline) {
          res.status(403).json({ error: { code: 'GAMEWEEK_LOCKED', message: 'Gameweek deadline has passed.' } });
          return;
        }
      }
      gw = activeGw.id;
    }

    const half = gw <= 19 ? 1 : 2;

    // Check if chip was already used in this season half
    const { data: existingChip } = await supabase
      .from('chips_used')
      .select('*')
      .eq('user_id', userId)
      .eq('chip', chip)
      .eq('half', half)
      .single();

    if (existingChip) {
      res.status(400).json({
        error: { code: 'CHIP_ALREADY_USED', message: 'تم استخدام هذه الخاصية من قبل في هذا النصف من الموسم.' },
      });
      return;
    }

    // Check if any other chip is active for this specific gameweek
    const { data: activeGwChip } = await supabase
      .from('chips_used')
      .select('*')
      .eq('user_id', userId)
      .eq('gw', gw)
      .single();

    if (activeGwChip) {
      res.status(400).json({
        error: { code: 'CHIP_CONFLICT', message: `لديك خاصية مفعلة بالفعل للجولة ${gw}. يمكن تفعيل خاصية واحدة فقط في كل جولة.` },
      });
      return;
    }

    // Activate Chip
    const { error: insertErr } = await supabase.from('chips_used').insert({
      user_id: userId,
      chip,
      gw,
      half,
    });

    if (insertErr) {
      logger.error(insertErr, 'Failed to record chip usage');
      res.status(500).json({ error: { code: 'DB_ERROR', message: 'Failed to activate chip.' } });
      return;
    }

    res.status(200).json({
      message: `Successfully activated ${chip} chip for Gameweek ${gw}.`,
      chip,
      gw,
    });
  } catch (err) {
    logger.error(err, 'Error in POST /api/chips/activate');
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to activate chip.' } });
  }
});

// POST /api/chips/deactivate
router.post('/deactivate', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const parseResult = ActivateChipSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: { code: 'INVALID_INPUT', details: parseResult.error.flatten() },
      });
      return;
    }

    const { chip } = parseResult.data;

    const { error: deleteErr } = await supabase
      .from('chips_used')
      .delete()
      .eq('user_id', userId)
      .eq('chip', chip);

    if (deleteErr) {
      logger.error(deleteErr, 'Failed to deactivate chip');
      res.status(500).json({ error: { code: 'DB_ERROR', message: 'فشل إلغاء تفعيل الخاصية.' } });
      return;
    }

    res.status(200).json({
      message: `تم إلغاء تفعيل خاصية ${chip} بنجاح.`,
      chip,
    });
  } catch (err) {
    logger.error(err, 'Error in POST /api/chips/deactivate');
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'حدث خطأ في السيرفر أثناء إلغاء التفعيل.' } });
  }
});

// GET /api/chips
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { data: usedChips } = await supabase
      .from('chips_used')
      .select('*')
      .eq('user_id', userId);

    res.status(200).json({ usedChips: usedChips || [] });
  } catch (err) {
    logger.error(err, 'Error in GET /api/chips');
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to fetch chips status.' } });
  }
});

export default router;
