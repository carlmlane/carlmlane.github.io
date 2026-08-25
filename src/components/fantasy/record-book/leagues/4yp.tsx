import { recordBookView } from '@/lib/4yp/record-book';
import { int, num } from '@/lib/fantasy/format';
import { Neg, Pos, type RecordBookCopy } from '../copy';

const { totals, draftSlotBaseline: baseline, chartedDraftSlots } = recordBookView;

const playedSeasons = recordBookView.playedSeasons.length;

// Championship-bracket games against consolation ones. ESPN calls both "playoffs",
// and in this league the losing half of the bracket is by far the busier one.
const consolationGames = recordBookView.allTime.reduce((total, row) => total + row.consolation_games, 0);
const titleGames = recordBookView.allTime.reduce((total, row) => total + row.playoff_wins + row.playoff_losses, 0);

// Seasons where the best regular-season record also took the title.
const wireToWire = recordBookView.podium.filter((row) => row.best_record_manager === row.first_manager);

const bySlot = (compare: (a: (typeof chartedDraftSlots)[number], b: (typeof chartedDraftSlots)[number]) => number) =>
  [...chartedDraftSlots].sort(compare)[0];

const mostTitledSlot = bySlot((a, b) => b.titles - a.titles || a.avg_finish - b.avg_finish);
const bestFinishSlot = bySlot((a, b) => a.avg_finish - b.avg_finish);
const worstFinishSlot = bySlot((a, b) => b.avg_finish - a.avg_finish);

// How many slots land inside the chart's shaded ±1 standard error band.
const insideBand = chartedDraftSlots.filter(
  (row) => Math.abs(row.avg_wins - baseline.league_avg_wins) <= baseline.se_slot_mean,
).length;

const quarterbackSteals = recordBookView.steals.filter((row) => row.position === 'QB').length;
const straightQbs = recordBookView.steals.findIndex((row) => row.position !== 'QB');
const runningBackBusts = recordBookView.busts.filter((row) => row.position === 'RB').length;
const deepestBustRound = Math.max(...recordBookView.busts.map((row) => row.round));

// 2020's bracket rounds each ran two scoring periods, so those "weeks" are two-week
// totals. The top-team-week view drops them; the hard-luck view does not.
const twoWeekHardLuck = recordBookView.hardLuck.filter((row) => row.season === 2020 && row.week >= 14).length;

// Managers who left points on the bench in literally every week they played, and the
// best anyone has done at avoiding it.
const neverOptimal = recordBookView.bench.filter((row) => row.weeks_with_bad_start === row.weeks);
const cleanest = [...recordBookView.bench].sort(
  (a, b) => b.weeks - b.weeks_with_bad_start - (a.weeks - a.weeks_with_bad_start),
)[0];
const cleanestWeeks = cleanest.weeks - cleanest.weeks_with_bad_start;

export const fourYardPumaCopy: RecordBookCopy = {
  lede: (
    <>
      Six completed seasons and a seventh under way, pulled out of ESPN’s fantasy API and put in one place: every game,
      every lineup, every pick and every waiver claim. {int(totals.stat_rows)} stat rows behind it. It started as a
      ten-team league in {totals.first_season} and has run twelve ever since.
    </>
  ),

  allTimeNote: (
    <>
      Championship bracket kept separate from consolation. ESPN tags any bracket game as a playoff game, and this league
      has played{' '}
      <strong>
        {consolationGames} consolation games against {titleGames} championship ones
      </strong>{' '}
      — counting both together hands a losing team a winning playoff record. Click any column to sort.
    </>
  ),
  allTimeCaption: `Every franchise, all ${playedSeasons} completed seasons. Title W/L is the championship bracket only.`,

  podiumNote: (
    <>
      Playoff finish and regular-season dominance are different questions, and here they have lined up exactly once:{' '}
      <strong>
        in {playedSeasons} seasons the best regular-season record has won the title one time
        {wireToWire.length === 1 ? `, ${wireToWire[0].first_manager} in ${wireToWire[0].season}` : ''}
      </strong>
      , the same season the league’s top scorer won it. The other five went to someone who finished behind.
    </>
  ),

  headToHeadNote: (
    <>
      Win rate for the row against the column, regular season and playoffs together — a rivalry does not stop counting
      in December. Matrix shows the {recordBookView.matrixManagers.length} franchises with four or more seasons; the
      table has every pairing between them.
    </>
  ),
  headToHeadCaption: 'Every pairing between franchises with four or more seasons.',

  deservedWinsDef: (
    <>
      The wins your scoring earned, ignoring the schedule. Every week your score is compared against{' '}
      <em>every other team’s</em> score that same week — a win for each team you outscored, half for a tie. That
      all-play win rate, multiplied by games played, is your deserved wins. Outscore nine of eleven opponents in a week
      and you banked 0.82 of a win, whether or not the one you actually played was among them.
    </>
  ),
  luckDef: (
    <>
      Actual wins minus deserved wins. <Pos>Positive</Pos> means the schedule handed you wins your scoring did not earn
      — you kept drawing whoever was cold that week. <Neg>Negative</Neg> means you scored well and lost anyway, because
      you kept running into the week’s high scorer. Over a 13–14 game season, ±2 is a lot, and the full spread here runs
      from +7 to −5 across six years.
    </>
  ),
  luckScopeNote: (
    <>
      Regular season only: a bracket week has four teams in it, not twelve, so all-play is not comparable there. On the
      chart below, points above the diagonal won more than they deserved.
    </>
  ),
  luckScatterNote: `Regular season only, all ${playedSeasons} completed seasons.`,
  luckScatterCaption: 'Four or more seasons. Regular season only.',

  draftNote: (
    <>
      Every draft here is a snake draft — no auction bids, no keepers in any of the {playedSeasons}. Bench slots are
      recorded from the very first season, so pick value covers all of them: a drafted player who never cracked a lineup
      counts as the zero he was, rather than vanishing from the record.
    </>
  ),
  draftSlotNote: `Average regular-season wins by round-one pick position, all ${playedSeasons} completed seasons. The line is the league average.`,
  draftSlotCaption:
    "Round-one pick position against how the season ended. Slots 11 and 12 did not exist in 2020's ten-team draft, so they carry five seasons rather than six.",
  draftSlotFooter: (
    <>
      <strong>Slot {bestFinishSlot.slot}</strong> has the best average finish ({num(bestFinishSlot.avg_finish, 2)}) and
      reached the bracket in {bestFinishSlot.playoff_seasons} of its {bestFinishSlot.seasons} seasons without ever
      winning it, while slot {mostTitledSlot.slot} owns the most titles ({mostTitledSlot.titles}) and slot{' '}
      {worstFinishSlot.slot} the worst average finish. Read none of that as an edge. The shaded band is one standard
      error ({num(baseline.se_slot_mean, 2)} wins), {insideBand} of the {chartedDraftSlots.length} slots sit inside it,
      and the {chartedDraftSlots.length - insideBand} that fall outside are about what a band that width misses by
      chance alone. With fewer than six seasons per slot and {num(baseline.titles_expected_per_slot, 2)} expected titles
      apiece, {mostTitledSlot.titles} is not evidence of anything. <strong>No slot is reliably better.</strong>
    </>
  ),
  stealsSkillCaption:
    'Quarterbacks excluded. A late QB who becomes a starter clears the baseline by 200+ points and buries every other position.',
  stealsAllCaption: `All positions — and ${quarterbackSteals} of the ${recordBookView.steals.length} biggest steals are quarterbacks, the top ${straightQbs} of them without a break.`,
  bustsCaption: `Biggest busts. ${runningBackBusts} of the ${recordBookView.busts.length} are running backs and the rest are receivers; every one went inside the first ${deepestBustRound} rounds.`,

  rosterNote: (
    <>
      Bench slots are on the record from {totals.first_season} onward, so these numbers cover every season the league
      has played. They are unflattering for everyone:{' '}
      <strong>
        {neverOptimal.length} of the {recordBookView.bench.length} managers here have never once started their best
        available lineup
      </strong>
      , and the closest anyone comes is {cleanest.manager}, clean in {cleanestWeeks} weeks out of {cleanest.weeks}.
    </>
  ),
  benchCaption:
    'Raw bench points overstate the mistake, since a bench player may not have been legally startable in any open slot; swap regret (best bench minus worst starter) is the honest core of it. Lower is better.',

  positionalNote:
    'Points per start at each position against what the league averaged there over the same span. Edge is the difference — who actually got more out of a roster spot, rather than who spent the most draft capital on it.',

  topTeamWeeksCaption:
    'Highest team scores ever recorded. Single scoring periods only, so 2020’s two-week bracket rounds are left out rather than dwarfing the list.',
  hardLuckCaption: `The biggest scores that still lost. Unlike the table above, this view does not filter to single scoring periods — 2020's bracket rounds each ran two weeks, so ${twoWeekHardLuck} of these ${recordBookView.hardLuck.length} lines are two-week totals, not single weeks.`,

  seasonsTitle: 'Six years, and a seventh running',
};
