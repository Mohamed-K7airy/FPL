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

    // Fetch current GW
    const { data: currentGw } = await supabase
      .from('gameweeks')
      .select('*')
      .eq('is_current', true)
      .single();

    if (!currentGw) {
      res.status(400).json({ error: { code: 'NO_ACTIVE_GAMEWEEK', message: 'No active gameweek found.' } });
      return;
    }

    // Deadline check
    const deadline = new Date(currentGw.deadline_time).getTime();
    if (Date.now() >= deadline) {
      res.status(403).json({ error: { code: 'GAMEWEEK_LOCKED', message: 'Gameweek deadline has passed.' } });
      return;
    }

    const gw = currentGw.id;
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
        error: { code: 'CHIP_ALREADY_USED', message: `The ${chip} chip has already been used in this half of the season.` },
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
        error: { code: 'CHIP_CONFLICT', message: `You have already activated the ${activeGwChip.chip} chip for Gameweek ${gw}. Only one chip can be active per gameweek.` },
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
