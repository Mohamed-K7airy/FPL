export type PositionId = 1 | 2 | 3 | 4; // 1: GKP, 2: DEF, 3: MID, 4: FWD
export type ChipType = 'wildcard' | 'freehit' | 'bboost' | '3xc';

export interface PickItem {
  playerId: number;
  slot: number; // 1..11 starters, 12..15 bench
  position: PositionId;
  isCaptain: boolean;
  isVice: boolean;
}

export interface PlayerStatItem {
  points: number;
  played: boolean;
  fixturesDone: boolean;
}

export interface ScoringOpts {
  transferCost: number;
  chip?: ChipType;
  isFinal: boolean;
}

export interface ScoredPick extends PickItem {
  multiplier: number;
  rawPoints: number;
  autoSubbed: boolean;
}

export interface GameweekScoreResult {
  rawPoints: number;
  netPoints: number;
  transferCostApplied: number;
  lineup: ScoredPick[];
  autoSubsPerformed: { outPlayerId: number; inPlayerId: number }[];
}

export class ScoringEngine {
  static scoreGameweek(
    picks: PickItem[],
    statsMap: Map<number, PlayerStatItem>,
    opts: ScoringOpts
  ): GameweekScoreResult {
    const isBenchBoost = opts.chip === 'bboost';
    const isTripleCaptain = opts.chip === '3xc';

    // Clone picks to mutate working lineup slots during auto-subs
    const workingPicks: ScoredPick[] = picks.map((p) => ({
      ...p,
      multiplier: p.slot <= 11 ? 1 : 0,
      rawPoints: 0,
      autoSubbed: false,
    }));

    const autoSubsPerformed: { outPlayerId: number; inPlayerId: number }[] = [];

    // Apply auto-substitutions only if isFinal === true and not Bench Boost
    if (opts.isFinal && !isBenchBoost) {
      // Find unplayed starters (slots 1..11)
      const starters = workingPicks.filter((p) => p.slot <= 11);
      const bench = workingPicks
        .filter((p) => p.slot > 11)
        .sort((a, b) => a.slot - b.slot);

      for (const starter of starters) {
        const starterStat = statsMap.get(starter.playerId);
        const starterPlayed = starterStat ? starterStat.played : false;

        if (!starterPlayed) {
          // Attempt substitution
          if (starter.position === 1) {
            // Goalkeeper substitution: must be bench goalkeeper
            const benchGk = bench.find((b) => b.position === 1 && !b.autoSubbed);
            if (benchGk) {
              const benchGkStat = statsMap.get(benchGk.playerId);
              if (benchGkStat && benchGkStat.played) {
                // Swap slots
                const tempSlot = starter.slot;
                starter.slot = benchGk.slot;
                starter.multiplier = 0;

                benchGk.slot = tempSlot;
                benchGk.multiplier = 1;
                benchGk.autoSubbed = true;

                autoSubsPerformed.push({ outPlayerId: starter.playerId, inPlayerId: benchGk.playerId });
              }
            }
          } else {
            // Outfield substitution: iterate through available bench players in order 12..15
            for (const benchPlayer of bench) {
              if (benchPlayer.position === 1 || benchPlayer.autoSubbed || benchPlayer.slot <= 11) continue;

              const benchStat = statsMap.get(benchPlayer.playerId);
              if (benchStat && benchStat.played) {
                // Check if replacing starter with benchPlayer maintains valid formation
                const testStarters = workingPicks.filter((p) => p.slot <= 11 && p.playerId !== starter.playerId);
                testStarters.push({ ...benchPlayer, slot: starter.slot });

                if (ScoringEngine.isValidFormation(testStarters)) {
                  // Perform substitution
                  const tempSlot = starter.slot;
                  starter.slot = benchPlayer.slot;
                  starter.multiplier = 0;

                  benchPlayer.slot = tempSlot;
                  benchPlayer.multiplier = 1;
                  benchPlayer.autoSubbed = true;

                  autoSubsPerformed.push({ outPlayerId: starter.playerId, inPlayerId: benchPlayer.playerId });
                  break; // Move to next unplayed starter
                }
              }
            }
          }
        }
      }
    }

    // Determine Captain & Vice-Captain multipliers
    const finalStarters = workingPicks.filter((p) => p.slot <= 11);
    const captainObj = workingPicks.find((p) => p.isCaptain);
    const viceCaptainObj = workingPicks.find((p) => p.isVice);

    const captainInStarters = captainObj ? finalStarters.some((p) => p.playerId === captainObj.playerId) : false;
    const viceInStarters = viceCaptainObj ? finalStarters.some((p) => p.playerId === viceCaptainObj.playerId) : false;

    const captainStat = captainObj ? statsMap.get(captainObj.playerId) : null;
    const viceStat = viceCaptainObj ? statsMap.get(viceCaptainObj.playerId) : null;

    const captainPlayed = captainInStarters && captainStat ? captainStat.played : false;
    const vicePlayed = viceInStarters && viceStat ? viceStat.played : false;

    const captainMultiplierValue = isTripleCaptain ? 3 : 2;

    // Apply default multipliers for starters and bench
    workingPicks.forEach((p) => {
      if (isBenchBoost) {
        p.multiplier = 1;
      } else {
        p.multiplier = p.slot <= 11 ? 1 : 0;
      }
    });

    if (captainPlayed && captainObj && captainObj.slot <= 11) {
      captainObj.multiplier = captainMultiplierValue;
    } else if (!captainPlayed && vicePlayed && viceCaptainObj && viceCaptainObj.slot <= 11) {
      viceCaptainObj.multiplier = captainMultiplierValue;
    }

    // Calculate total points
    let rawPoints = 0;
    workingPicks.forEach((p) => {
      const stat = statsMap.get(p.playerId);
      const playerSinglePoints = stat ? stat.points : 0;
      p.rawPoints = playerSinglePoints * p.multiplier;
      rawPoints += p.rawPoints;
    });

    // Apply transfer penalty deductions (0 if Wildcard or Free Hit)
    const isFreeTransfersChip = opts.chip === 'wildcard' || opts.chip === 'freehit';
    const transferCostApplied = isFreeTransfersChip ? 0 : opts.transferCost;
    const netPoints = rawPoints - transferCostApplied;

    return {
      rawPoints,
      netPoints,
      transferCostApplied,
      lineup: workingPicks,
      autoSubsPerformed,
    };
  }

  /**
   * Helper to verify if an 11-player lineup conforms to valid formation rules
   */
  static isValidFormation(starters: PickItem[]): boolean {
    if (starters.length !== 11) return false;
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    starters.forEach((p) => counts[p.position]++);

    return counts[1] === 1 && counts[2] >= 3 && counts[3] >= 2 && counts[4] >= 1;
  }
}
