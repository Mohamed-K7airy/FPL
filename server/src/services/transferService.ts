import { supabase } from '../db/supabase.js';
import { ValidationService, PlayerRecord } from './validationService.js';
import { logger } from '../utils/logger.js';

export interface SingleTransferInput {
  playerOutId: number;
  playerInId: number;
}

export interface ProcessTransfersResult {
  success: boolean;
  transferCost: number;
  remainingBank: number;
  freeTransfersRemaining: number;
}

export class TransferService {
  /**
   * Processes player transfers for a user
   */
  static async processTransfers(
    userId: number,
    gw: number,
    transfers: SingleTransferInput[],
    activeChip?: string
  ): Promise<ProcessTransfersResult> {
    if (transfers.length === 0) {
      throw new Error('No transfers provided.');
    }

    // 1. Fetch user profile
    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('bank, free_transfers')
      .eq('id', userId)
      .single();

    if (userErr || !user) throw new Error('User not found.');

    // 2. Fetch user current squad
    const { data: squadItems, error: squadErr } = await supabase
      .from('squad')
      .select('*')
      .eq('user_id', userId);

    if (squadErr || !squadItems || squadItems.length !== 5) {
      throw new Error('Current squad not found or incomplete.');
    }

    // Create working squad copy
    const workingSquad = [...squadItems];

    // Collect all player IDs to fetch stats
    const outs = transfers.map((t) => t.playerOutId);
    const ins = transfers.map((t) => t.playerInId);

    const allPlayerIds = Array.from(new Set([...workingSquad.map((s) => s.player_id), ...outs, ...ins]));

    const { data: playersData } = await supabase
      .from('players')
      .select('id, position, team_id, now_cost')
      .in('id', allPlayerIds);

    const playerMap = new Map<number, PlayerRecord>();
    (playersData || []).forEach((p: any) => {
      playerMap.set(p.id, {
        id: p.id,
        position: p.position as 1 | 2 | 3 | 4,
        team_id: p.team_id,
        now_cost: p.now_cost,
      });
    });

    // Compute current squad cost to accurately evaluate available bank (£50.0m total budget)
    let currentSquadCost = 0;
    workingSquad.forEach((s) => {
      const p = playerMap.get(s.player_id);
      if (p) currentSquadCost += p.now_cost;
    });

    let currentBank = 500 - currentSquadCost;

    // Process each transfer in working squad
    for (const transfer of transfers) {
      const index = workingSquad.findIndex((s) => s.player_id === transfer.playerOutId);
      if (index === -1) {
        throw new Error(`Player OUT ID ${transfer.playerOutId} is not in your current squad.`);
      }

      const outPlayer = playerMap.get(transfer.playerOutId);
      const inPlayer = playerMap.get(transfer.playerInId);

      if (!outPlayer || !inPlayer) {
        throw new Error('Invalid player IDs in transfer request.');
      }

      if (outPlayer.position === 1 && inPlayer.position !== 1) {
        throw new Error('Goalkeeper can only be replaced by another Goalkeeper.');
      }
      if (outPlayer.position !== 1 && inPlayer.position === 1) {
        throw new Error('Outfield player cannot be replaced by a Goalkeeper.');
      }

      // Calculate sell price
      const sellPrice = ValidationService.calculateSellingPrice(
        workingSquad[index].purchase_price,
        outPlayer.now_cost
      );

      // Financial balance update: Bank + sellPrice - nowCost of incoming player
      currentBank = currentBank + sellPrice - inPlayer.now_cost;

      // Update squad item slot with incoming player
      workingSquad[index] = {
        ...workingSquad[index],
        player_id: inPlayer.id,
        purchase_price: inPlayer.now_cost,
      };
    }

    // Budget check
    if (currentBank < 0) {
      throw new Error(`Insufficient budget. Remaining bank would be £${(currentBank / 10).toFixed(1)}M.`);
    }

    // Validate overall working squad against rules (max 3 per team, positions, etc.)
    const validationPicks = workingSquad.map((s) => ({
      playerId: s.player_id,
      slot: s.slot,
      isCaptain: Boolean(s.is_captain),
      isVice: Boolean(s.is_vice),
    }));

    const validation = ValidationService.validateSquad(validationPicks, playerMap, 10000); // Pass high budget since bank checked
    if (!validation.valid) {
      throw new Error(`Transfer validation failed: ${validation.errors.join(' ')}`);
    }

    // Calculate transfer cost & free transfers remaining (0 for pre-season / GW <= 1 or wildcard/freehit)
    const isFreeChip = activeChip === 'wildcard' || activeChip === 'freehit' || gw <= 1;
    let transferCost = 0;
    let freeTransfersRemaining = user.free_transfers;

    if (isFreeChip) {
      transferCost = 0;
      freeTransfersRemaining = user.free_transfers;
    } else {
      const freeAvailable = user.free_transfers;
      const totalTransfersCount = transfers.length;

      if (totalTransfersCount <= freeAvailable) {
        freeTransfersRemaining = freeAvailable - totalTransfersCount;
        transferCost = 0;
      } else {
        const extraTransfers = totalTransfersCount - freeAvailable;
        freeTransfersRemaining = 0;
        transferCost = extraTransfers * 4; // 4 points penalty per extra transfer
      }
    }

    // Apply DB updates inside transaction logic
    // 1. Clear old squad & insert updated working squad
    await supabase.from('squad').delete().eq('user_id', userId);

    const newSquadRows = workingSquad.map((s) => ({
      user_id: userId,
      player_id: s.player_id,
      slot: s.slot,
      is_captain: s.is_captain,
      is_vice: s.is_vice,
      purchase_price: s.purchase_price,
    }));
    await supabase.from('squad').insert(newSquadRows);

    // 2. Update user bank and free_transfers
    await supabase
      .from('users')
      .update({ bank: currentBank, free_transfers: freeTransfersRemaining })
      .eq('id', userId);

    // 3. Record transfers in transfers table
    const transferLogs = transfers.map((t) => ({
      user_id: userId,
      gw,
      player_out: t.playerOutId,
      player_in: t.playerInId,
      cost: transferCost > 0 ? Math.ceil(transferCost / transfers.length) : 0,
    }));
    await supabase.from('transfers').insert(transferLogs);

    logger.info(
      { userId, gw, transferCount: transfers.length, transferCost, currentBank },
      'Transfers processed successfully'
    );

    return {
      success: true,
      transferCost,
      remainingBank: currentBank,
      freeTransfersRemaining,
    };
  }
}
