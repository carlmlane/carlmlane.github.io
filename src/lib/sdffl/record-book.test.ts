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
});

describe('recordBookView', () => {
  it('flattens the single-row tables so the page does not index into them', () => {
    expect(recordBookView.totals.league_name).toBe('SD FFL');
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

  it('limits the head-to-head matrix to franchises of eight seasons or more', () => {
    const bySeasons = new Map(recordBook.all_time.map((row) => [row.manager, row.seasons]));
    expect(recordBookView.matrixManagers.length).toBeGreaterThan(0);
    expect(recordBookView.matrixManagers.every((name) => (bySeasons.get(name) ?? 0) >= 8)).toBe(true);
  });

  it('drops the draft slots that only 2014 ever had', () => {
    expect(recordBookView.chartedDraftSlots.every((row) => row.seasons >= 5)).toBe(true);
    expect(recordBookView.chartedDraftSlots.map((row) => row.slot)).not.toContain(13);
    expect(recordBookView.draftSlots.map((row) => row.slot)).toContain(13);
  });

  it('offers played seasons newest first, excluding the unplayed one', () => {
    const played = recordBookView.playedSeasons;
    expect(played[0]).toBeGreaterThan(played[played.length - 1]);
    expect([...played].sort((a, b) => b - a)).toEqual(played);
    const unplayed = recordBook.seasons.filter((season) => !season.has_results).map((s) => s.season);
    for (const season of unplayed) expect(played).not.toContain(season);
  });

  it('keeps every season a standings row references pickable', () => {
    for (const row of recordBookView.standings) {
      expect(recordBookView.playedSeasons).toContain(row.season);
    }
  });
});
