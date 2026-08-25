import { int, num } from '@/lib/fantasy/format';
import { recordBookView } from '@/lib/sdffl/record-book';
import { Neg, Pos, type RecordBookCopy } from '../copy';

const { totals, draftSlotBaseline: baseline } = recordBookView;

const bestSlot = [...recordBookView.chartedDraftSlots].sort(
  (a, b) => b.titles - a.titles || a.avg_finish - b.avg_finish,
)[0];
const worstSlot = [...recordBookView.chartedDraftSlots].sort((a, b) => b.avg_finish - a.avg_finish)[0];

export const sdfflCopy: RecordBookCopy = {
  lede: (
    <>
      Fourteen seasons of a twelve-team league, pulled out of ESPN’s fantasy API and put in one place: every game, every
      lineup, every pick and every waiver claim. {int(totals.stat_rows)} stat rows behind it.
    </>
  ),

  allTimeNote: (
    <>
      Championship bracket kept separate from consolation. ESPN tags any bracket game as a playoff game, and this league
      has played <strong>more consolation games than championship ones</strong> — counting both together hands a losing
      team a winning playoff record. Click any column to sort.
    </>
  ),
  allTimeCaption: 'Every franchise, all 14 seasons. Title W/L is the championship bracket only.',

  podiumNote: (
    <>
      Playoff finish and regular-season dominance are different questions, and here they are close to unrelated:{' '}
      <strong>in 13 seasons the best regular-season record has never won the title</strong>, and neither has the
      league’s top scorer.
    </>
  ),

  headToHeadNote: (
    <>
      Win rate for the row against the column, regular season and playoffs together — a rivalry does not stop counting
      in December. Matrix shows the {recordBookView.matrixManagers.length} franchises with eight or more seasons; the
      table has every pairing.
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
      you kept running into the week’s high scorer. Over a 13–14 game season, ±2 is a lot.
    </>
  ),
  luckScopeNote: (
    <>
      Regular season only: a bracket week has four teams in it, not twelve, so all-play is not comparable there. On the
      chart below, points above the diagonal won more than they deserved.
    </>
  ),
  luckScatterNote: 'Regular season only, all 13 completed seasons.',
  luckScatterCaption: 'Four or more seasons. Regular season only.',

  draftNote: (
    <>
      Every draft here is a snake draft — no auction bids, no keepers in any of the 13. Value is measured from 2018 on,
      because earlier seasons return starters only, so a drafted player who sat would read as a bust worth zero.
    </>
  ),
  draftSlotNote:
    'Average regular-season wins by round-one pick position, all 13 completed seasons. The line is the league average.',
  draftSlotCaption:
    "Round-one pick position against how the season ended. Slots 13 and 14 come from 2014's fourteen-team season only.",
  draftSlotFooter: (
    <>
      <strong>Historically slot {bestSlot.slot}</strong> — {bestSlot.titles} titles and the best average finish, while
      slot {worstSlot.slot} has the worst average finish. But the shaded band is one standard error (
      {num(baseline.se_slot_mean, 2)} wins) and nearly every slot sits inside it: with about 13 seasons per slot, a
      spread this size is what chance produces. Expected titles per slot is {num(baseline.titles_expected_per_slot, 2)},
      so a slot with 4 is not yet evidence of anything. <strong>No slot is reliably better.</strong>
    </>
  ),
  stealsSkillCaption:
    'Quarterbacks excluded. A late QB who becomes a starter clears the baseline by 300+ points and buries every other position.',
  stealsAllCaption: 'All positions — and all ten of the biggest steals are quarterbacks.',
  bustsCaption: 'Biggest busts. Eight of the ten are running backs; nine went in the first two rounds.',

  rosterNote: (
    <>
      Bench numbers are 2018 onward only — the five seasons before that carry no bench at all, and averaging them in
      would show half a decade of flawless lineup setting.
    </>
  ),
  benchCaption:
    '2018 onward — earlier seasons carry no bench at all. Raw bench points overstate the mistake, since a bench player may not have been legally startable in any open slot; swap regret (best bench minus worst starter) is the honest core of it. Lower is better.',

  topTeamWeeksCaption: 'Highest team scores ever recorded.',
  hardLuckCaption: 'The biggest scores that still lost.',

  seasonsTitle: 'Fourteen years',
};
