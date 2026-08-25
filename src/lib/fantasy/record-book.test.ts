import { describe, expect, it } from 'vitest';
import fourYardPumaData from '@/lib/4yp/record-book-data.json';
import sdfflData from '@/lib/sdffl/record-book-data.json';
import { createRecordBookView, parseRecordBook } from './record-book';

const config = { luckMinSeasons: 4, matrixMinSeasons: 4, slotMinSeasons: 5 };

describe('parseRecordBook', () => {
  it('accepts both committed exports, old shape and new', () => {
    expect(() => parseRecordBook(sdfflData)).not.toThrow();
    expect(() => parseRecordBook(fourYardPumaData)).not.toThrow();
  });

  it('treats the fields only newer exports carry as optional', () => {
    expect(parseRecordBook(sdfflData).positional).toBeUndefined();
    expect(parseRecordBook(sdfflData).totals[0].seasons_played).toBeUndefined();
    expect(parseRecordBook(fourYardPumaData).totals[0].seasons_played).toBe(6);
  });

  it('rejects an export missing a required table rather than rendering blank cells', () => {
    const { all_time: _dropped, ...withoutAllTime } = parseRecordBook(fourYardPumaData);
    expect(() => parseRecordBook(withoutAllTime)).toThrow();
  });
});

describe('createRecordBookView', () => {
  it('applies each threshold to the table it guards', () => {
    const view = createRecordBookView(fourYardPumaData, config);
    expect(view.luckCareers.every((row) => row.seasons >= config.luckMinSeasons)).toBe(true);
    expect(view.chartedDraftSlots.every((row) => row.seasons >= config.slotMinSeasons)).toBe(true);
  });

  it('lets a league tighten the matrix without touching the underlying pairings', () => {
    const wide = createRecordBookView(sdfflData, { ...config, matrixMinSeasons: 4 });
    const narrow = createRecordBookView(sdfflData, { ...config, matrixMinSeasons: 8 });
    expect(narrow.matrixManagers.length).toBeLessThan(wide.matrixManagers.length);
    expect(narrow.headToHead).toEqual(wide.headToHead);
  });
});
