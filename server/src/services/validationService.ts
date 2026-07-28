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
   * Validates a 15-player squad structure against all official FPL rules
   */
  static validateSquad(
    picks: SquadItemInput[],
    playerMap: Map<number, PlayerRecord>,
    bank: number = 1000
  ): ValidationResult {
    const errors: string[] = [];

    // 1. Total players count check
    if (picks.length !== 15) {
      errors.push(`Squad must contain exactly 15 players. Provided: ${picks.length}`);
    }

    // 2. Unique player check
    const playerIds = picks.map((p) => p.playerId);
    const uniquePlayerIds = new Set(playerIds);
    if (uniquePlayerIds.size !== playerIds.length) {
      errors.push('Duplicate players are not allowed in the squad.');
    }

    // 3. Unique slot check (1 to 15)
    const slots = picks.map((p) => p.slot);
    const uniqueSlots = new Set(slots);
    if (uniqueSlots.size !== slots.length || Math.min(...slots) < 1 || Math.max(...slots) > 15) {
      errors.push('Squad slots must be unique numbers from 1 to 15.');
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

    // 4. Position quotas (2 GKP, 5 DEF, 5 MID, 3 FWD)
    if (posCounts[1] !== 2) errors.push(`Squad must have exactly 2 Goalkeepers (GKP). Provided: ${posCounts[1]}`);
    if (posCounts[2] !== 5) errors.push(`Squad must have exactly 5 Defenders (DEF). Provided: ${posCounts[2]}`);
    if (posCounts[3] !== 5) errors.push(`Squad must have exactly 5 Midfielders (MID). Provided: ${posCounts[3]}`);
    if (posCounts[4] !== 3) errors.push(`Squad must have exactly 3 Forwards (FWD). Provided: ${posCounts[4]}`);

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

    // 7. Starting formation check (Slots 1..11)
    const starters = picks.filter((p) => p.slot >= 1 && p.slot <= 11);
    if (starters.length !== 11) {
      errors.push(`Starting XI must contain exactly 11 players. Provided: ${starters.length}`);
    } else {
      const starterPosCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };
      for (const starter of starters) {
        const player = playerMap.get(starter.playerId);
        if (player) {
          starterPosCounts[player.position]++;
        }
      }

      if (starterPosCounts[1] !== 1) {
        errors.push(`Starting XI must contain exactly 1 Goalkeeper. Provided: ${starterPosCounts[1]}`);
      }
      if (starterPosCounts[2] < 3) {
        errors.push(`Starting XI must contain at least 3 Defenders. Provided: ${starterPosCounts[2]}`);
      }
      if (starterPosCounts[3] < 2) {
        errors.push(`Starting XI must contain at least 2 Midfielders. Provided: ${starterPosCounts[3]}`);
      }
      if (starterPosCounts[4] < 1) {
        errors.push(`Starting XI must contain at least 1 Forward. Provided: ${starterPosCounts[4]}`);
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
      if (captains[0].slot > 11) {
        errors.push('Captain must be in the starting XI (slots 1-11).');
      }
      if (viceCaptains[0].slot > 11) {
        errors.push('Vice-Captain must be in the starting XI (slots 1-11).');
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
