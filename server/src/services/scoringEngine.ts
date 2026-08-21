export type PositionId = 1 | 2 | 3 | 4; // 1: GKP, 2: DEF, 3: MID, 4: FWD
export type ChipType = 'wildcard' | 'freehit' | 'bboost' | '3xc';

export interface PickItem {
  playerId: number;
  slot: number; // 1..5 starters
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
    const isTripleCaptain = opts.chip === '3xc';

    // Clone picks to set working multipliers for all 5 starters
    const workingPicks: ScoredPick[] = picks.map((p) => ({
      ...p,
      multiplier: p.slot <= 5 ? 1 : 0,
      rawPoints: 0,
      autoSubbed: false,
    }));

    const autoSubsPerformed: { outPlayerId: number; inPlayerId: number }[] = [];

    // Determine Captain & Vice-Captain multipliers
    const finalStarters = workingPicks.filter((p) => p.slot <= 5);
    const captainObj = workingPicks.find((p) => p.isCaptain);
    const viceCaptainObj = workingPicks.find((p) => p.isVice);

    const captainInStarters = captainObj ? finalStarters.some((p) => p.playerId === captainObj.playerId) : false;
    const viceInStarters = viceCaptainObj ? finalStarters.some((p) => p.playerId === viceCaptainObj.playerId) : false;

    const captainStat = captainObj ? statsMap.get(captainObj.playerId) : null;
    const viceStat = viceCaptainObj ? statsMap.get(viceCaptainObj.playerId) : null;

    const captainPlayed = captainInStarters && captainStat ? captainStat.played : false;
    const vicePlayed = viceInStarters && viceStat ? viceStat.played : false;

    const captainMultiplierValue = isTripleCaptain ? 3 : 2;

    // Apply default multipliers for starters (1 for starters, 0 for bench)
    workingPicks.forEach((p) => {
      p.multiplier = p.slot <= 5 ? 1 : 0;
    });

    if (captainObj && captainObj.slot <= 5) {
      if (opts.isFinal) {
        if (!captainPlayed && vicePlayed && viceCaptainObj && viceCaptainObj.slot <= 5) {
          viceCaptainObj.multiplier = captainMultiplierValue;
        } else if (captainPlayed) {
          captainObj.multiplier = captainMultiplierValue;
        } else {
          captainObj.multiplier = captainMultiplierValue;
        }
      } else {
        captainObj.multiplier = captainMultiplierValue;
      }
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
   * Helper to verify if a 5-player lineup conforms to Mini FPL formation rules:
   * Exactly 1 GKP + 4 Outfielders (DEF, MID, FWD)
   */
  static isValidFormation(starters: PickItem[]): boolean {
    if (starters.length !== 5) return false;
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    starters.forEach((p) => counts[p.position]++);

    return counts[1] === 1 && (counts[2] + counts[3] + counts[4] === 4);
  }
}
