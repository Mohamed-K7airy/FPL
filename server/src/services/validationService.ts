export interface PlayerRecord {
  id: number;
  position: 1 | 2 | 3 | 4;
  team_id: number;
  now_cost: number; // in tenths
}

export interface SquadItemInput {
  playerId: number;
  slot: number; // 1..11 starters, 12..15 bench
  isCaptain: boolean;
  isVice: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export class ValidationService {
  /**
   * Validates a 5-player squad structure for Mini FPL
   * Rule: 1 GKP (slot 1) + 4 Outfielders (DEF/MID/FWD in slots 2..5)
   */
  static validateSquad(
    picks: SquadItemInput[],
    playerMap: Map<number, PlayerRecord>,
    bank: number = 500
  ): ValidationResult {
    const errors: string[] = [];

    // 1. Total players count check (5 players)
    if (picks.length !== 5) {
      errors.push(`Squad must contain exactly 5 players. Provided: ${picks.length}`);
    }

    // 2. Unique player check
    const playerIds = picks.map((p) => p.playerId);
    const uniquePlayerIds = new Set(playerIds);
    if (uniquePlayerIds.size !== playerIds.length) {
      errors.push('Duplicate players are not allowed in the squad.');
    }

    // 3. Unique slot check (1 to 5)
    const slots = picks.map((p) => p.slot);
    const uniqueSlots = new Set(slots);
    if (uniqueSlots.size !== slots.length || Math.min(...slots) < 1 || Math.max(...slots) > 5) {
      errors.push('Squad slots must be unique numbers from 1 to 5.');
    }

    // Accumulate positional counts, team counts, and total cost
    let totalCost = 0;
    const posCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    const teamCounts: Record<number, number> = {};

    for (const pick of picks) {
      const player = playerMap.get(pick.playerId);
      if (!player) {
        errors.push(`Player ID ${pick.playerId} not found.`);
        continue;
      }

      totalCost += player.now_cost;
      posCounts[player.position] = (posCounts[player.position] || 0) + 1;
      teamCounts[player.team_id] = (teamCounts[player.team_id] || 0) + 1;
    }

    // 4. Position quotas (1 GKP, 4 outfielders total across DEF, MID, FWD)
    if (posCounts[1] !== 1) {
      errors.push(`Squad must have exactly 1 Goalkeeper (GKP). Provided: ${posCounts[1]}`);
    }

    const totalOutfielders = posCounts[2] + posCounts[3] + posCounts[4];
    if (totalOutfielders !== 4) {
      errors.push(`Squad must have exactly 4 outfield players (DEF/MID/FWD). Provided: ${totalOutfielders}`);
    }

    // 5. Budget constraint (Total cost <= bank)
    if (totalCost > bank) {
      errors.push(`Total squad cost (£${(totalCost / 10).toFixed(1)}M) exceeds budget (£${(bank / 10).toFixed(1)}M).`);
    }

    // 6. Max 3 players per team constraint
    for (const [teamId, count] of Object.entries(teamCounts)) {
      if (count > 3) {
        errors.push(`Cannot select more than 3 players from team ID ${teamId}. Selected: ${count}`);
      }
    }

    // 7. Starting formation check (Slots 1..5)
    const starters = picks.filter((p) => p.slot >= 1 && p.slot <= 5);
    if (starters.length !== 5) {
      errors.push(`Starting lineup must contain exactly 5 players. Provided: ${starters.length}`);
    } else {
      const starterPosCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };
      for (const starter of starters) {
        const player = playerMap.get(starter.playerId);
        if (player) {
          starterPosCounts[player.position]++;
        }
      }

      if (starterPosCounts[1] !== 1) {
        errors.push(`Starting lineup must contain exactly 1 Goalkeeper. Provided: ${starterPosCounts[1]}`);
      }
    }

    // 8. Captain and Vice-Captain check
    const captains = picks.filter((p) => p.isCaptain);
    const viceCaptains = picks.filter((p) => p.isVice);

    if (captains.length !== 1) {
      errors.push('Exactly 1 Captain must be selected.');
    }
    if (viceCaptains.length !== 1) {
      errors.push('Exactly 1 Vice-Captain must be selected.');
    }

    if (captains.length === 1 && viceCaptains.length === 1) {
      if (captains[0].playerId === viceCaptains[0].playerId) {
        errors.push('Captain and Vice-Captain must be different players.');
      }
      if (captains[0].slot > 5) {
        errors.push('Captain must be in slots 1-5.');
      }
      if (viceCaptains[0].slot > 5) {
        errors.push('Vice-Captain must be in slots 1-5.');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Calculate sell price based on FPL price rise rules:
   * Selling price = Purchase price + floor((Current price - Purchase price) / 2)
   */
  static calculateSellingPrice(purchasePrice: number, nowCost: number): number {
    if (nowCost <= purchasePrice) {
      return nowCost;
    }
    const profit = nowCost - purchasePrice;
    const gain = Math.floor(profit / 2);
    return purchasePrice + gain;
  }
}
