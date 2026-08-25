import { createRecordBookView, parseRecordBook } from '@/lib/fantasy/record-book';
import data from './record-book-data.json';

// Four Yard Puma, exported from the `ffl-wiz` DuckDB warehouse the same way SD FFL is.
// A younger league: six completed seasons plus one in progress, and — unlike SD FFL —
// bench slots recorded from the very first year, so the lineup views cover everything.

export const recordBook = parseRecordBook(data);

export const recordBookView = createRecordBookView(data, {
  // Six seasons is the longest career here, so four is already most of a tenure.
  luckMinSeasons: 4,
  // Matches the cutoff the head-to-head export itself uses; ten managers fit the matrix.
  matrixMinSeasons: 4,
  // Slots 11 and 12 missed 2020's ten-team season but have five apiece — enough to plot.
  slotMinSeasons: 5,
});
