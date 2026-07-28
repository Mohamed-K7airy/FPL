import { describe, it, expect } from 'vitest';
import { ScoringEngine, PickItem, PlayerStatItem } from '../src/services/scoringEngine.js';

describe('ScoringEngine - Mandatory 12 Test Cases', () => {
  // Helper to create default 1-4-4-2 lineup
  function createStandardLineup(): PickItem[] {
    return [
      { playerId: 1, slot: 1, position: 1, isCaptain: false, isVice: false }, // GK
      { playerId: 2, slot: 2, position: 2, isCaptain: false, isVice: false }, // DEF
      { playerId: 3, slot: 3, position: 2, isCaptain: false, isVice: false }, // DEF
      { playerId: 4, slot: 4, position: 2, isCaptain: false, isVice: false }, // DEF
      { playerId: 5, slot: 5, position: 2, isCaptain: false, isVice: false }, // DEF
      { playerId: 6, slot: 6, position: 3, isCaptain: false, isVice: false }, // MID
      { playerId: 7, slot: 7, position: 3, isCaptain: false, isVice: false }, // MID
      { playerId: 8, slot: 8, position: 3, isCaptain: false, isVice: false }, // MID
      { playerId: 9, slot: 9, position: 3, isCaptain: false, isVice: false }, // MID
      { playerId: 10, slot: 10, position: 4, isCaptain: true, isVice: false }, // FWD Captain
      { playerId: 11, slot: 11, position: 4, isCaptain: false, isVice: true }, // FWD Vice
      // Bench
      { playerId: 12, slot: 12, position: 1, isCaptain: false, isVice: false }, // GK Bench
      { playerId: 13, slot: 13, position: 2, isCaptain: false, isVice: false }, // DEF Bench
      { playerId: 14, slot: 14, position: 3, isCaptain: false, isVice: false }, // MID Bench
      { playerId: 15, slot: 15, position: 4, isCaptain: false, isVice: false }, // FWD Bench
    ];
  }

  function createStatsMap(overrides: Record<number, Partial<PlayerStatItem>> = {}): Map<number, PlayerStatItem> {
    const map = new Map<number, PlayerStatItem>();
    for (let id = 1; id <= 15; id++) {
      map.set(id, {
        points: 5,
        played: true,
        fixturesDone: true,
        ...overrides[id],
      });
    }
    return map;
  }

  it('Case 1: 11 played, captain scored 12 -> +12 extra points from captain multiplier', () => {
    const picks = createStandardLineup();
    const statsMap = createStatsMap({ 10: { points: 12, played: true } });

    const result = ScoringEngine.scoreGameweek(picks, statsMap, { transferCost: 0, isFinal: true });
    // 10 players * 5 = 50 + captain 12 * 2 (24) = 74
    expect(result.rawPoints).toBe(74);
  });

  it('Case 2: Captain 0 minutes, Vice-Captain played -> Captain multiplier transfers to Vice-Captain', () => {
    const picks = createStandardLineup();
    const statsMap = createStatsMap({
      10: { points: 0, played: false }, // Captain unplayed
      11: { points: 8, played: true },  // Vice-Captain played
    });

    const result = ScoringEngine.scoreGameweek(picks, statsMap, { transferCost: 0, isFinal: true });
    const vice = result.lineup.find((p) => p.playerId === 11);
    expect(vice?.multiplier).toBe(2);
    expect(vice?.rawPoints).toBe(16);
  });

  it('Case 3: Captain & Vice-Captain both 0 minutes -> No captain multiplier applied (both subbed to bench get 0)', () => {
    const picks = createStandardLineup();
    const statsMap = createStatsMap({
      10: { points: 0, played: false },
      11: { points: 0, played: false },
    });

    const result = ScoringEngine.scoreGameweek(picks, statsMap, { transferCost: 0, isFinal: true });
    const captain = result.lineup.find((p) => p.playerId === 10);
    const vice = result.lineup.find((p) => p.playerId === 11);
    // Both captain and vice captain auto-subbed to bench get 0 multiplier
    expect(captain?.multiplier).toBe(0);
    expect(vice?.multiplier).toBe(0);
  });

  it('Case 4: Sole forward did not play, first bench is defender -> Defender skipped to preserve min 1 FWD', () => {
    const picks = createStandardLineup(); // Has 2 FWDs (slots 10 & 11)
    // Modify slot 11 to MID so starting formation is 1-4-5-1 (1 FWD)
    picks.find((p) => p.playerId === 11)!.position = 3;

    // Bench: slot 13 (id 13) is DEF, slot 15 (id 15) is FWD
    const statsMap = createStatsMap({
      10: { points: 0, played: false }, // Sole FWD unplayed
      13: { points: 6, played: true },  // Bench DEF
      15: { points: 4, played: true },  // Bench FWD
    });

    const result = ScoringEngine.scoreGameweek(picks, statsMap, { transferCost: 0, isFinal: true });
    const sub = result.autoSubsPerformed.find((s) => s.outPlayerId === 10);
    // Should skip DEF 13 and pick FWD 15 to maintain formation
    expect(sub?.inPlayerId).toBe(15);
  });

  it('Case 5: 3 defenders starting, 1 unplayed, bench is MID only -> No sub performed (formation needs >= 3 DEF)', () => {
    const picks = createStandardLineup();
    // Set starting DEF count to 3 (change slot 5 to MID)
    picks.find((p) => p.playerId === 5)!.position = 3;
    // Set all bench outfielders to MID
    picks.find((p) => p.playerId === 13)!.position = 3;
    picks.find((p) => p.playerId === 14)!.position = 3;
    picks.find((p) => p.playerId === 15)!.position = 3;

    const statsMap = createStatsMap({
      2: { points: 0, played: false }, // Starting DEF unplayed
      13: { points: 7, played: true }, // Bench MID
    });

    const result = ScoringEngine.scoreGameweek(picks, statsMap, { transferCost: 0, isFinal: true });
    const sub = result.autoSubsPerformed.find((s) => s.outPlayerId === 2);
    expect(sub).toBeUndefined(); // Cannot sub MID for DEF because it leaves 2 DEF
  });

  it('Case 6: Starter GK did not play, bench GK played -> Substituted', () => {
    const picks = createStandardLineup();
    const statsMap = createStatsMap({
      1: { points: 0, played: false },
      12: { points: 6, played: true },
    });

    const result = ScoringEngine.scoreGameweek(picks, statsMap, { transferCost: 0, isFinal: true });
    expect(result.autoSubsPerformed).toEqual([{ outPlayerId: 1, inPlayerId: 12 }]);
  });

  it('Case 7: Starter GK and bench GK both did not play -> 0 points for GK slot', () => {
    const picks = createStandardLineup();
    const statsMap = createStatsMap({
      1: { points: 0, played: false },
      12: { points: 0, played: false },
    });

    const result = ScoringEngine.scoreGameweek(picks, statsMap, { transferCost: 0, isFinal: true });
    const gk1 = result.lineup.find((p) => p.playerId === 1);
    const gk12 = result.lineup.find((p) => p.playerId === 12);
    expect(gk1?.rawPoints).toBe(0);
    expect(gk12?.rawPoints).toBe(0);
  });

  it('Case 8: 4 starters did not play -> Maximum 3 auto-subs performed', () => {
    const picks = createStandardLineup();
    const statsMap = createStatsMap({
      2: { points: 0, played: false },
      3: { points: 0, played: false },
      4: { points: 0, played: false },
      6: { points: 0, played: false },
    });

    const result = ScoringEngine.scoreGameweek(picks, statsMap, { transferCost: 0, isFinal: true });
    expect(result.autoSubsPerformed.length).toBeLessThanOrEqual(3);
  });

  it('Case 9: Double gameweek -> total_points sums both matches automatically', () => {
    const picks = createStandardLineup();
    // FPL API returns total_points aggregated for DGW
    const statsMap = createStatsMap({ 6: { points: 14, played: true } });

    const result = ScoringEngine.scoreGameweek(picks, statsMap, { transferCost: 0, isFinal: true });
    const mid = result.lineup.find((p) => p.playerId === 6);
    expect(mid?.rawPoints).toBe(14);
  });

  it('Case 10: Blank gameweek for a club -> 0 points, considered unplayed', () => {
    const picks = createStandardLineup();
    const statsMap = createStatsMap({ 8: { points: 0, played: false } });

    const result = ScoringEngine.scoreGameweek(picks, statsMap, { transferCost: 0, isFinal: true });
    const player = result.lineup.find((p) => p.playerId === 8);
    expect(player?.autoSubbed || player?.slot > 11).toBe(true);
  });

  it('Case 11: 3 extra transfers -> -12 point deduction applied', () => {
    const picks = createStandardLineup();
    const statsMap = createStatsMap();

    const result = ScoringEngine.scoreGameweek(picks, statsMap, { transferCost: 12, isFinal: true });
    expect(result.transferCostApplied).toBe(12);
    expect(result.netPoints).toBe(result.rawPoints - 12);
  });

  it('Case 12: Resync after bonus points added -> Points updated, not doubled', () => {
    const picks = createStandardLineup();
    const statsMap1 = createStatsMap({ 10: { points: 6, played: true } });
    const res1 = ScoringEngine.scoreGameweek(picks, statsMap1, { transferCost: 0, isFinal: false });

    // Bonus points added later by Opta
    const statsMap2 = createStatsMap({ 10: { points: 9, played: true } });
    const res2 = ScoringEngine.scoreGameweek(picks, statsMap2, { transferCost: 0, isFinal: true });

    expect(res2.rawPoints - res1.rawPoints).toBe(6); // Captain 9*2 - 6*2 = 6
  });
});
