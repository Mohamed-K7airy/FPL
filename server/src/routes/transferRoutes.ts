import { Router, Response } from 'express';
import { z } from 'zod';
import { supabase } from '../db/supabase.js';
import { logger } from '../utils/logger.js';
import { authenticateToken, AuthenticatedRequest } from '../middlewares/authMiddleware.js';
import { TransferService } from '../services/transferService.js';

const router = Router();

const SingleTransferSchema = z.object({
  playerOutId: z.number().int().positive(),
  playerInId: z.number().int().positive(),
});

const ProcessTransfersSchema = z.object({
  transfers: z.array(SingleTransferSchema).min(1),
});

// POST /api/transfers
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    // Check gameweek & deadline
    const { data: currentGw } = await supabase
      .from('gameweeks')
      .select('*')
      .eq('is_current', true)
      .single();

    const targetGw = currentGw ? currentGw.id : 1;

    if (currentGw) {
      const deadline = new Date(currentGw.deadline_time).getTime();
      if (Date.now() >= deadline) {
        res.status(403).json({
          error: { code: 'GAMEWEEK_LOCKED', message: 'Gameweek deadline has passed. Transfers are locked.' },
        });
        return;
      }
    }

    const parseResult = ProcessTransfersSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: { code: 'INVALID_INPUT', details: parseResult.error.flatten() },
      });
      return;
    }

    const { transfers } = parseResult.data;

    // Check if user activated a chip in this GW
    const { data: activeChipData } = await supabase
      .from('chips_used')
      .select('chip')
      .eq('user_id', userId)
      .eq('gw', targetGw)
      .single();

    const activeChip = activeChipData?.chip;

    const result = await TransferService.processTransfers(userId, targetGw, transfers, activeChip);

    res.status(200).json({
      message: 'Transfers executed successfully.',
      ...result,
    });
  } catch (err) {
    logger.error(err, 'Error in POST /api/transfers');
    res.status(400).json({
      error: { code: 'TRANSFER_FAILED', message: (err as Error).message },
    });
  }
});

// GET /api/transfers
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { data: history } = await supabase
      .from('transfers')
      .select('*, player_out:players!transfers_player_out_fkey(web_name), player_in:players!transfers_player_in_fkey(web_name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    res.status(200).json({ transfers: history || [] });
  } catch (err) {
    logger.error(err, 'Error in GET /api/transfers');
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to fetch transfer history.' } });
  }
});

export default router;
