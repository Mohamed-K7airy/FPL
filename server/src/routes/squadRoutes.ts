import { Router, Response } from 'express';
import { z } from 'zod';
import { supabase } from '../db/supabase.js';
import { logger } from '../utils/logger.js';
import { authenticateToken, AuthenticatedRequest } from '../middlewares/authMiddleware.js';
import { ValidationService, SquadItemInput, PlayerRecord } from '../services/validationService.js';

const router = Router();

const SquadItemSchema = z.object({
  playerId: z.number().int().positive(),
  slot: z.number().int().min(1).max(5),
  isCaptain: z.boolean(),
  isVice: z.boolean(),
});

const CreateSquadSchema = z.object({
  picks: z.array(SquadItemSchema).length(5),
});

const UpdateLineupSchema = z.object({
  picks: z.array(SquadItemSchema).length(5),
});

// Helper: Check deadline enforcement
async function checkGameweekDeadline(): Promise<{ locked: boolean; nextGw?: any }> {
  const { data: currentGw } = await supabase
    .from('gameweeks')
    .select('*')
    .eq('is_current', true)
    .single();

  if (!currentGw) {
    const { data: nextGw } = await supabase
      .from('gameweeks')
      .select('*')
      .eq('is_next', true)
      .single();
    return { locked: false, nextGw };
  }

  const deadline = new Date(currentGw.deadline_time).getTime();
  const now = Date.now();

  return {
    locked: now >= deadline,
    nextGw: currentGw,
  };
}

// GET /api/squad
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    let { data: squadItems, error } = await supabase
      .from('squad')
      .select('*, players(*, fpl_teams(name, short_name))')
      .eq('user_id', userId)
      .order('slot', { ascending: true });

    if (error) {
      logger.error(error, 'Error fetching squad');
      res.status(500).json({ error: { code: 'DB_ERROR', message: 'Failed to fetch squad.' } });
      return;
    }

    // Auto-migrate legacy squads (more than 5 players) down to 5 players
    if (squadItems && squadItems.length > 5) {
      logger.info({ userId, legacyCount: squadItems.length }, 'Migrating legacy squad to Mini FPL 5-player format');

      const gkp = squadItems.find((s) => s.players?.position === 1) || squadItems[0];
      const outfielders = squadItems.filter((s) => s.player_id !== gkp.player_id).slice(0, 4);

      const new5Picks = [
        { ...gkp, slot: 1, is_captain: true, is_vice: false },
        ...outfielders.map((s, idx) => ({
          ...s,
          slot: idx + 2,
          is_captain: false,
          is_vice: idx === 0,
        })),
      ];

      await supabase.from('squad').delete().eq('user_id', userId);
      await supabase.from('squad').insert(
        new5Picks.map((s) => ({
          user_id: userId,
          player_id: s.player_id,
          slot: s.slot,
          is_captain: s.is_captain,
          is_vice: s.is_vice,
          purchase_price: s.purchase_price,
        }))
      );

      const { data: migrated } = await supabase
        .from('squad')
        .select('*, players(*, fpl_teams(name, short_name))')
        .eq('user_id', userId)
        .order('slot', { ascending: true });

      squadItems = migrated || [];
    }

    const { data: user } = await supabase
      .from('users')
      .select('bank, free_transfers, squad_complete')
      .eq('id', userId)
      .single();

    let computedBank = user?.bank || 500;
    if (squadItems && squadItems.length === 5) {
      const squadCost = squadItems.reduce((acc, s) => acc + (s.players?.now_cost || 0), 0);
      computedBank = 500 - squadCost;
      if (user && user.bank !== computedBank) {
        await supabase.from('users').update({ bank: computedBank, squad_complete: true }).eq('id', userId);
      }
    }

    const { data: currentGw } = await supabase
      .from('gameweeks')
      .select('*')
      .eq('is_current', true)
      .maybeSingle();

    const { data: nextGw } = await supabase
      .from('gameweeks')
      .select('*')
      .eq('is_next', true)
      .maybeSingle();

    const now = Date.now();
    const currentDeadline = currentGw ? new Date(currentGw.deadline_time).getTime() : 0;
    const isDeadlinePassed = now >= currentDeadline;
    const upcomingGw = isDeadlinePassed && nextGw ? nextGw : (currentGw || nextGw);

    res.status(200).json({
      squad: squadItems || [],
      bank: computedBank,
      freeTransfers: user?.free_transfers || 1,
      squadComplete: Boolean(user?.squad_complete) && Boolean(squadItems && squadItems.length === 5),
      currentGw,
      nextGw,
      upcomingGw,
      isDeadlinePassed,
    });
  } catch (err) {
    logger.error(err, 'Error in GET /api/squad');
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to fetch squad.' } });
  }
});

// POST /api/squad (Initial squad creation or overwrite)
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const parseResult = CreateSquadSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: { code: 'INVALID_INPUT', details: parseResult.error.flatten() },
      });
      return;
    }

    const { picks } = parseResult.data;

    // Check if user already built squad
    const { data: existingSquad } = await supabase
      .from('squad')
      .select('player_id')
      .eq('user_id', userId);

    if (existingSquad && existingSquad.length > 0) {
      // Clear previous squad to allow initial creation/reset
      await supabase.from('squad').delete().eq('user_id', userId);
    }

    // Fetch player records
    const playerIds = picks.map((p) => p.playerId);
    const { data: playersData } = await supabase
      .from('players')
      .select('id, position, team_id, now_cost')
      .in('id', playerIds);

    const playerMap = new Map<number, PlayerRecord>();
    (playersData || []).forEach((p: any) => {
      playerMap.set(p.id, {
        id: p.id,
        position: p.position as 1 | 2 | 3 | 4,
        team_id: p.team_id,
        now_cost: p.now_cost,
      });
    });

    const validation = ValidationService.validateSquad(picks, playerMap, 500);
    if (!validation.valid) {
      res.status(400).json({
        error: { code: 'VALIDATION_FAILED', message: validation.errors.join(' | '), messages: validation.errors },
      });
      return;
    }

    // Calculate total cost
    let totalCost = 0;
    picks.forEach((p) => {
      totalCost += playerMap.get(p.playerId)!.now_cost;
    });

    const remainingBank = 500 - totalCost;

    // Insert squad records
    const squadRows = picks.map((p) => ({
      user_id: userId,
      player_id: p.playerId,
      slot: p.slot,
      is_captain: p.isCaptain,
      is_vice: p.isVice,
      purchase_price: playerMap.get(p.playerId)!.now_cost,
    }));

    const { error: insertErr } = await supabase.from('squad').insert(squadRows);
    if (insertErr) {
      logger.error(insertErr, 'Error inserting squad');
      res.status(500).json({ error: { code: 'DB_ERROR', message: 'Failed to create squad.' } });
      return;
    }

    // Update user bank and squad_complete status
    await supabase
      .from('users')
      .update({ bank: remainingBank, squad_complete: true })
      .eq('id', userId);

    res.status(201).json({
      message: 'Initial squad created successfully.',
      bank: remainingBank,
    });
  } catch (err) {
    logger.error(err, 'Error in POST /api/squad');
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to create squad.' } });
  }
});

// PUT /api/squad/lineup (Update starters, captain, vice-captain, and bench order)
router.put('/lineup', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    // Deadline check
    const deadlineStatus = await checkGameweekDeadline();
    if (deadlineStatus.locked) {
      res.status(403).json({
        error: { code: 'GAMEWEEK_LOCKED', message: 'Gameweek deadline has passed. Lineup changes are locked.' },
      });
      return;
    }

    const parseResult = UpdateLineupSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: { code: 'INVALID_INPUT', details: parseResult.error.flatten() },
      });
      return;
    }

    const { picks } = parseResult.data;

    // Fetch existing user squad player details
    const { data: existingSquad } = await supabase
      .from('squad')
      .select('player_id, purchase_price')
      .eq('user_id', userId);

    if (!existingSquad || existingSquad.length !== 5) {
      res.status(400).json({
        error: { code: 'NO_SQUAD', message: 'Complete initial squad creation first.' },
      });
      return;
    }

    const existingPlayerIds = new Set(existingSquad.map((s: any) => s.player_id));
    const inputPlayerIds = new Set(picks.map((p) => p.playerId));

    // Ensure user is only reordering their existing 5 players (no transfers allowed via lineup API)
    for (const id of inputPlayerIds) {
      if (!existingPlayerIds.has(id)) {
        res.status(400).json({
          error: { code: 'INVALID_LINEUP', message: `Player ID ${id} is not in your current squad. Use transfers API for squad changes.` },
        });
        return;
      }
    }

    // Fetch position & team details for validation
    const { data: playersData } = await supabase
      .from('players')
      .select('id, position, team_id, now_cost')
      .in('id', Array.from(inputPlayerIds));

    const playerMap = new Map<number, PlayerRecord>();
    (playersData || []).forEach((p: any) => {
      playerMap.set(p.id, {
        id: p.id,
        position: p.position as 1 | 2 | 3 | 4,
        team_id: p.team_id,
        now_cost: p.now_cost,
      });
    });

    const validation = ValidationService.validateSquad(picks, playerMap, 1000);
    if (!validation.valid) {
      res.status(400).json({
        error: { code: 'VALIDATION_FAILED', messages: validation.errors },
      });
      return;
    }

    // Update squad lineup in Supabase
    for (const pick of picks) {
      await supabase
        .from('squad')
        .update({
          slot: pick.slot,
          is_captain: pick.isCaptain,
          is_vice: pick.isVice,
        })
        .eq('user_id', userId)
        .eq('player_id', pick.playerId);
    }

    res.status(200).json({ message: 'Lineup updated successfully.' });
  } catch (err) {
    logger.error(err, 'Error in PUT /api/squad/lineup');
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to update lineup.' } });
  }
});

export default router;
