import { describe, expect, it } from 'vitest';
import { recordBook, recordBookView } from './record-book';

describe('recordBook', () => {
  it('validates the committed export against the schemas', () => {
    expect(recordBook.totals).toHaveLength(1);
    expect(recordBook.all_time.length).toBeGreaterThan(0);
    expect(recordBook.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('reports a clean record check, which is the evidence the extraction is faithful', () => {
    expect(recordBook.totals[0].record_mismatches).toBe(0);
  });

  it('carries the positional view that the older SD FFL export predates', () => {
    expect(recordBook.positional?.length).toBeGreaterThan(0);
  });
});

describe('recordBookView', () => {
  it('flattens the single-row tables so the page does not index into them', () => {
    expect(recordBookView.totals.league_name).toBe('Four Yard Puma');
    expect(recordBookView.draftSlotBaseline.se_slot_mean).toBeGreaterThan(0);
  });

  it('counts team-seasons from the standings rows', () => {
    expect(recordBookView.teamSeasons).toBe(recordBook.standings.length);
  });

  it('limits the luck views to careers of four seasons or more', () => {
    expect(recordBookView.luckCareers.length).toBeGreaterThan(0);
    expect(recordBookView.luckCareers.every((row) => row.seasons >= 4)).toBe(true);
    expect(recordBookView.luckCareers.length).toBeLessThan(recordBook.luck.length);
  });

  it('matches the matrix to the four-season cutoff the head-to-head export already used', () => {
    const bySeasons = new Map(recordBook.all_time.map((row) => [row.manager, row.seasons]));
    expect(recordBookView.matrixManagers.every((name) => (bySeasons.get(name) ?? 0) >= 4)).toBe(true);
    const exported = new Set(recordBook.head_to_head.map((row) => row.manager));
    expect([...recordBookView.matrixManagers].sort()).toEqual([...exported].sort());
  });

  it('charts every draft slot, since even the two added in 2021 have five seasons', () => {
    expect(recordBookView.chartedDraftSlots.every((row) => row.seasons >= 5)).toBe(true);
    expect(recordBookView.chartedDraftSlots).toHaveLength(recordBookView.draftSlots.length);
  });

  it('offers played seasons newest first, excluding the one still running', () => {
    const played = recordBookView.playedSeasons;
    expect(played[0]).toBeGreaterThan(played[played.length - 1]);
    expect([...played].sort((a, b) => b - a)).toEqual(played);
    const unplayed = recordBook.seasons.filter((season) => !season.has_results).map((s) => s.season);
    expect(unplayed).toContain(2026);
    for (const season of unplayed) expect(played).not.toContain(season);
  });

  it('keeps every season a standings row references pickable', () => {
    for (const row of recordBookView.standings) {
      expect(recordBookView.playedSeasons).toContain(row.season);
    }
  });
});
