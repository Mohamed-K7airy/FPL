import { describe, it, expect } from 'vitest';
import { ScoringEngine, PickItem, PlayerStatItem } from '../src/services/scoringEngine.js';

describe('ScoringEngine - Mini FPL 5-Player Test Cases', () => {
  // Helper to create default 5-player lineup (1 GKP, 2 DEF, 1 MID, 1 FWD)
  function createStandardLineup(): PickItem[] {
    return [
      { playerId: 1, slot: 1, position: 1, isCaptain: false, isVice: false }, // GK
      { playerId: 2, slot: 2, position: 2, isCaptain: false, isVice: false }, // DEF
      { playerId: 3, slot: 3, position: 2, isCaptain: false, isVice: false }, // DEF
      { playerId: 4, slot: 4, position: 3, isCaptain: false, isVice: false }, // MID
      { playerId: 5, slot: 5, position: 4, isCaptain: true, isVice: false },  // FWD Captain
    ];
  }

  function createStatsMap(overrides: Record<number, Partial<PlayerStatItem>> = {}): Map<number, PlayerStatItem> {
    const map = new Map<number, PlayerStatItem>();
    for (let id = 1; id <= 5; id++) {
      map.set(id, {
        points: 5,
        played: true,
        fixturesDone: true,
        ...overrides[id],
      });
    }
    return map;
  }

  it('Case 1: 5 played, captain scored 12 -> +12 extra points from captain multiplier', () => {
    const picks = createStandardLineup();
    const statsMap = createStatsMap({ 5: { points: 12, played: true } });

    const result = ScoringEngine.scoreGameweek(picks, statsMap, { transferCost: 0, isFinal: true });
    // 4 players * 5 = 20 + captain 12 * 2 (24) = 44
    expect(result.rawPoints).toBe(44);
  });

  it('Case 2: Captain 0 minutes, Vice-Captain played -> Captain multiplier transfers to Vice-Captain', () => {
    const picks = createStandardLineup();
    picks[3].isVice = true; // Set slot 4 (player 4) as Vice
    const statsMap = createStatsMap({
      5: { points: 0, played: false }, // Captain unplayed
      4: { points: 8, played: true },  // Vice-Captain played
    });

    const result = ScoringEngine.scoreGameweek(picks, statsMap, { transferCost: 0, isFinal: true });
    const vice = result.lineup.find((p) => p.playerId === 4);
    expect(vice?.multiplier).toBe(2);
    expect(vice?.rawPoints).toBe(16);
  });

  it('Case 3: Triple Captain chip applied -> Captain receives 3x multiplier', () => {
    const picks = createStandardLineup();
    const statsMap = createStatsMap({ 5: { points: 10, played: true } });

    const result = ScoringEngine.scoreGameweek(picks, statsMap, { transferCost: 0, chip: '3xc', isFinal: true });
    const captain = result.lineup.find((p) => p.playerId === 5);
    expect(captain?.multiplier).toBe(3);
    expect(captain?.rawPoints).toBe(30);
  });

  it('Case 4: Valid Formation check for Mini FPL (1 GKP + 4 outfielders)', () => {
    const lineup = createStandardLineup();
    expect(ScoringEngine.isValidFormation(lineup)).toBe(true);

    // 1-3-0 formation (1 GKP, 3 DEF, 1 MID, 0 FWD) -> Valid
    const lineup130: PickItem[] = [
      { playerId: 1, slot: 1, position: 1, isCaptain: false, isVice: false },
      { playerId: 2, slot: 2, position: 2, isCaptain: false, isVice: false },
      { playerId: 3, slot: 3, position: 2, isCaptain: false, isVice: false },
      { playerId: 4, slot: 4, position: 2, isCaptain: false, isVice: false },
      { playerId: 5, slot: 5, position: 3, isCaptain: true, isVice: false },
    ];
    expect(ScoringEngine.isValidFormation(lineup130)).toBe(true);
  });

  it('Case 5: Extra transfers penalty -> Deduction applied to net points', () => {
    const picks = createStandardLineup();
    const statsMap = createStatsMap();

    const result = ScoringEngine.scoreGameweek(picks, statsMap, { transferCost: 8, isFinal: true });
    expect(result.transferCostApplied).toBe(8);
    expect(result.netPoints).toBe(result.rawPoints - 8);
  });
});
