import { createRecordBookView, parseRecordBook } from '@/lib/fantasy/record-book';
import data from './record-book-data.json';

// Fourteen seasons of SD FFL, exported from the `ffl-wiz` DuckDB warehouse: 18 keyed
// tables loaded and summarised by 34 SQL views. The JSON is committed alongside this
// module and validated at build time.

export const recordBook = parseRecordBook(data);

export const recordBookView = createRecordBookView(data, {
  // Fewer than four seasons and an all-play rate is noise.
  luckMinSeasons: 4,
  // The matrix would be unreadable at 23 columns; the long-tenured franchises are the
  // ones with enough meetings for a win rate to be worth reading.
  matrixMinSeasons: 8,
  // Slots 13 and 14 exist only because 2014 ran fourteen teams. One season is an
  // anecdote, not a rate, so the slot chart covers the slots every season had.
  slotMinSeasons: 5,
});
