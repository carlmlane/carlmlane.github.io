'use client';

import type { ReactNode } from 'react';
import { int, num, pct, signed } from '@/lib/sdffl/format';
import type {
  ActivityRow,
  AllTimeRecord,
  BenchRow,
  BustRow,
  ConsistencyRow,
  DraftRoundRow,
  DraftSkillRow,
  DraftSlotRow,
  HardLuckRow,
  HeadToHeadRow,
  LuckRow,
  PickupRow,
  PodiumRow,
  RecordBookView,
  Season,
  StealRow,
  TopPlayerWeek,
  TopTeamWeek,
} from '@/lib/sdffl/record-book';
import DraftRoundsChart from './draft-rounds-chart';
import DraftSlotChart from './draft-slot-chart';
import HeadToHeadMatrix from './head-to-head-matrix';
import LuckLedgerChart from './luck-ledger-chart';
import LuckScatterChart from './luck-scatter-chart';
import PanelToggle from './panel-toggle';
import RailNav, { type RailItem } from './rail-nav';
import styles from './record-book.module.css';
import ScoringTrendChart from './scoring-trend-chart';
import SeasonStandings from './season-standings';
import SortableTable, { type Column } from './sortable-table';

const RAIL_ITEMS: readonly RailItem[] = [
  { id: 'record', label: 'Record book' },
  { id: 'podium', label: 'Every season' },
  { id: 'h2h', label: 'Head to head' },
  { id: 'luck', label: 'Skill and luck' },
  { id: 'draft', label: 'The draft' },
  { id: 'roster', label: 'Roster work' },
  { id: 'scoring', label: 'Scoring' },
  { id: 'records', label: 'Extremes' },
  { id: 'seasons', label: 'Season by season' },
];

const tone = (value: number) => (value > 0 ? styles.pos : value < 0 ? styles.neg : undefined);

const Stack = ({ name, sub }: { readonly name: string; readonly sub: string }) => (
  <span className={styles.stack}>
    <span>{name}</span>
    <span className={`${styles.muted} ${styles.sub}`}>{sub}</span>
  </span>
);

const WithValue = ({ name, value }: { readonly name: string; readonly value: string }) => (
  <span>
    <span>{name}</span>
    <span className={styles.muted}>{`  ${value}`}</span>
  </span>
);

/* ---------------------------------------------------------------- columns ---- */

const luckColumns: readonly Column<LuckRow>[] = [
  { key: 'manager', label: 'Manager', type: 'text', value: (r) => r.manager },
  { key: 'seasons', label: 'Sns', type: 'num', digits: 0, value: (r) => r.seasons },
  { key: 'games', label: 'G', type: 'num', digits: 0, value: (r) => r.games },
  { key: 'actual_wins', label: 'W', type: 'num', digits: 0, value: (r) => r.actual_wins },
  { key: 'expected_wins', label: 'Deserved W', type: 'num', value: (r) => r.expected_wins },
  { key: 'actual_pct', label: 'Actual', type: 'num', value: (r) => r.actual_pct, render: (r) => pct(r.actual_pct) },
  {
    key: 'deserved_pct',
    label: 'Deserved',
    type: 'num',
    value: (r) => r.deserved_pct,
    render: (r) => pct(r.deserved_pct),
  },
  {
    key: 'luck_wins',
    label: 'Luck',
    type: 'num',
    value: (r) => r.luck_wins,
    className: (r) => tone(r.luck_wins),
    render: (r) => signed(r.luck_wins),
  },
];

const luckLedgerColumns: readonly Column<LuckRow>[] = [
  { key: 'manager', label: 'Manager', type: 'text', value: (r) => r.manager },
  { key: 'seasons', label: 'Sns', type: 'num', digits: 0, value: (r) => r.seasons },
  {
    key: 'luck_wins',
    label: 'Luck (wins)',
    type: 'num',
    value: (r) => r.luck_wins,
    className: (r) => tone(r.luck_wins),
    render: (r) => signed(r.luck_wins),
  },
  {
    key: 'luck_per_season',
    label: 'Per season',
    type: 'num',
    digits: 2,
    value: (r) => r.luck_per_season,
    render: (r) => signed(r.luck_per_season, 2),
  },
  { key: 'actual_wins', label: 'Actual W', type: 'num', digits: 0, value: (r) => r.actual_wins },
  { key: 'expected_wins', label: 'Deserved W', type: 'num', value: (r) => r.expected_wins },
];

const allTimeColumns: readonly Column<AllTimeRecord>[] = [
  { key: 'manager', label: 'Manager', type: 'text', value: (r) => r.manager },
  { key: 'seasons', label: 'Sns', type: 'num', digits: 0, value: (r) => r.seasons },
  { key: 'wins', label: 'W', type: 'num', digits: 0, value: (r) => r.wins },
  { key: 'losses', label: 'L', type: 'num', digits: 0, value: (r) => r.losses },
  { key: 'win_pct', label: 'Pct', type: 'num', value: (r) => r.win_pct, render: (r) => pct(r.win_pct) },
  { key: 'points_per_game', label: 'PPG', type: 'num', digits: 2, value: (r) => r.points_per_game },
  {
    key: 'margin_per_game',
    label: 'Margin',
    type: 'num',
    digits: 2,
    value: (r) => r.margin_per_game,
    className: (r) => tone(r.margin_per_game),
    render: (r) => signed(r.margin_per_game, 2),
  },
  { key: 'playoff_wins', label: 'Title W', type: 'num', digits: 0, value: (r) => r.playoff_wins },
  { key: 'playoff_losses', label: 'Title L', type: 'num', digits: 0, value: (r) => r.playoff_losses },
  {
    key: 'consolation_games',
    label: 'Consol G',
    type: 'num',
    digits: 0,
    value: (r) => r.consolation_games,
    className: () => styles.muted,
  },
  { key: 'playoff_appearances', label: 'Apps', type: 'num', digits: 0, value: (r) => r.playoff_appearances },
  {
    key: 'titles',
    label: 'Titles',
    type: 'num',
    digits: 0,
    value: (r) => r.titles,
    render: (r) =>
      r.titles > 0 ? (
        <span className={`${styles.pill} ${styles.pillTitle}`}>{r.titles}</span>
      ) : (
        <span className={styles.muted}>—</span>
      ),
  },
];

// Manager over team name rather than side by side: four columns of
// "Name  Long Team Name" overflows the card, and the pair reads fine stacked.
const podiumColumns: readonly Column<PodiumRow>[] = [
  { key: 'season', label: 'Season', type: 'num', digits: 0, value: (r) => r.season },
  {
    key: 'first_manager',
    label: 'Champion',
    type: 'text',
    value: (r) => r.first_manager,
    render: (r) => <Stack name={r.first_manager} sub={r.first_team} />,
  },
  {
    key: 'second_manager',
    label: 'Runner up',
    type: 'text',
    value: (r) => r.second_manager,
    render: (r) => <Stack name={r.second_manager} sub={r.second_team} />,
  },
  {
    key: 'third_manager',
    label: 'Third',
    type: 'text',
    value: (r) => r.third_manager,
    render: (r) => <Stack name={r.third_manager} sub={r.third_team} />,
  },
];

const superlativeColumns: readonly Column<PodiumRow>[] = [
  { key: 'season', label: 'Season', type: 'num', digits: 0, value: (r) => r.season },
  {
    key: 'best_record_manager',
    label: 'Best record',
    type: 'text',
    value: (r) => r.best_record_manager,
    render: (r) => <WithValue name={r.best_record_manager} value={r.best_record} />,
  },
  {
    key: 'worst_record_manager',
    label: 'Worst record',
    type: 'text',
    value: (r) => r.worst_record_manager,
    render: (r) => <WithValue name={r.worst_record_manager} value={r.worst_record} />,
  },
  {
    key: 'most_points_manager',
    label: 'Most points',
    type: 'text',
    value: (r) => r.most_points_manager,
    render: (r) => <WithValue name={r.most_points_manager} value={num(r.most_points, 1)} />,
  },
  {
    key: 'fewest_points_manager',
    label: 'Fewest points',
    type: 'text',
    value: (r) => r.fewest_points_manager,
    render: (r) => <WithValue name={r.fewest_points_manager} value={num(r.fewest_points, 1)} />,
  },
];

const slotColumns: readonly Column<DraftSlotRow>[] = [
  { key: 'slot', label: 'Slot', type: 'num', digits: 0, value: (r) => r.slot },
  { key: 'seasons', label: 'Seasons', type: 'num', digits: 0, value: (r) => r.seasons },
  { key: 'avg_wins', label: 'Avg W', type: 'num', digits: 2, value: (r) => r.avg_wins },
  { key: 'avg_losses', label: 'Avg L', type: 'num', digits: 2, value: (r) => r.avg_losses },
  { key: 'avg_finish', label: 'Avg finish', type: 'num', digits: 2, value: (r) => r.avg_finish },
  { key: 'titles', label: 'Titles', type: 'num', digits: 0, value: (r) => r.titles },
  { key: 'podiums', label: 'Top 3', type: 'num', digits: 0, value: (r) => r.podiums },
  {
    key: 'playoff_rate',
    label: 'Playoff rate',
    type: 'num',
    value: (r) => r.playoff_rate,
    render: (r) => pct(r.playoff_rate),
  },
  { key: 'avg_points', label: 'Avg points', type: 'num', value: (r) => r.avg_points },
];

const headToHeadColumns: readonly Column<HeadToHeadRow>[] = [
  { key: 'manager', label: 'Manager', type: 'text', value: (r) => r.manager },
  { key: 'opponent', label: 'Opponent', type: 'text', value: (r) => r.opponent },
  { key: 'games', label: 'G', type: 'num', digits: 0, value: (r) => r.games },
  { key: 'wins', label: 'W', type: 'num', digits: 0, value: (r) => r.wins },
  { key: 'losses', label: 'L', type: 'num', digits: 0, value: (r) => r.losses },
  { key: 'win_pct', label: 'Pct', type: 'num', value: (r) => r.win_pct, render: (r) => pct(r.win_pct) },
  {
    key: 'avg_margin',
    label: 'Avg margin',
    type: 'num',
    digits: 2,
    value: (r) => r.avg_margin,
    className: (r) => tone(r.avg_margin),
    render: (r) => signed(r.avg_margin, 2),
  },
];

const roundColumns: readonly Column<DraftRoundRow>[] = [
  { key: 'round', label: 'Round', type: 'num', digits: 0, value: (r) => r.round },
  { key: 'picks', label: 'Picks', type: 'num', digits: 0, value: (r) => r.picks },
  { key: 'avg_starter_points', label: 'Mean pts', type: 'num', value: (r) => r.avg_starter_points },
  { key: 'median_starter_points', label: 'Median pts', type: 'num', value: (r) => r.median_starter_points },
  { key: 'avg_starts', label: 'Avg starts', type: 'num', value: (r) => r.avg_starts },
];

type Pick = StealRow | BustRow;

const pickColumns = <Row extends Pick>(extra: readonly Column<Row>[]): readonly Column<Row>[] => [
  { key: 'manager', label: 'Manager', type: 'text', value: (r) => r.manager },
  { key: 'player_name', label: 'Player', type: 'text', value: (r) => r.player_name },
  { key: 'position', label: 'Pos', type: 'text', value: (r) => r.position },
  { key: 'season', label: 'Season', type: 'num', digits: 0, value: (r) => r.season },
  { key: 'round', label: 'Rd', type: 'num', digits: 0, value: (r) => r.round },
  ...extra,
  { key: 'starter_points', label: 'Pts', type: 'num', value: (r) => r.starter_points },
  {
    key: 'surplus',
    label: 'vs round',
    type: 'num',
    value: (r) => r.surplus,
    className: (r) => tone(r.surplus),
    render: (r) => signed(r.surplus),
  },
];

const stealColumns = pickColumns<StealRow>([]);
const bustColumns = pickColumns<BustRow>([
  { key: 'starts', label: 'Starts', type: 'num', digits: 0, value: (r) => r.starts },
]);

const draftSkillColumns: readonly Column<DraftSkillRow>[] = [
  { key: 'manager', label: 'Manager', type: 'text', value: (r) => r.manager },
  { key: 'drafts', label: 'Drafts', type: 'num', digits: 0, value: (r) => r.drafts },
  { key: 'picks', label: 'Picks', type: 'num', digits: 0, value: (r) => r.picks },
  {
    key: 'surplus_per_draft',
    label: 'Surplus / draft',
    type: 'num',
    value: (r) => r.surplus_per_draft,
    className: (r) => tone(r.surplus_per_draft),
    render: (r) => signed(r.surplus_per_draft),
  },
  {
    key: 'total_surplus',
    label: 'Total surplus',
    type: 'num',
    value: (r) => r.total_surplus,
    render: (r) => signed(r.total_surplus),
  },
  { key: 'avg_points_per_pick', label: 'Pts / pick', type: 'num', value: (r) => r.avg_points_per_pick },
  { key: 'hit_rate', label: 'Hit rate', type: 'num', value: (r) => r.hit_rate, render: (r) => pct(r.hit_rate) },
  {
    key: 'auto_picks',
    label: 'Auto',
    type: 'num',
    digits: 0,
    value: (r) => r.auto_picks,
    className: () => styles.muted,
  },
];

const benchColumns: readonly Column<BenchRow>[] = [
  { key: 'manager', label: 'Manager', type: 'text', value: (r) => r.manager },
  { key: 'weeks', label: 'Weeks', type: 'num', digits: 0, value: (r) => r.weeks },
  { key: 'avg_swap_regret', label: 'Swap regret', type: 'num', digits: 2, value: (r) => r.avg_swap_regret },
  { key: 'avg_bench_points', label: 'Bench pts / wk', type: 'num', digits: 2, value: (r) => r.avg_bench_points },
  {
    key: 'weeks_with_bad_start',
    label: 'Bad-start weeks',
    type: 'num',
    digits: 0,
    value: (r) => r.weeks_with_bad_start,
  },
];

const pickupColumns: readonly Column<PickupRow>[] = [
  { key: 'manager', label: 'Manager', type: 'text', value: (r) => r.manager },
  { key: 'players_added', label: 'Added', type: 'num', digits: 0, value: (r) => r.players_added },
  { key: 'starts_from_pickups', label: 'Starts', type: 'num', digits: 0, value: (r) => r.starts_from_pickups },
  { key: 'starter_points_added', label: 'Points', type: 'num', digits: 0, value: (r) => r.starter_points_added },
  { key: 'points_per_start', label: 'Pts / start', type: 'num', digits: 2, value: (r) => r.points_per_start },
];

const activityColumns: readonly Column<ActivityRow>[] = [
  { key: 'manager', label: 'Manager', type: 'text', value: (r) => r.manager },
  { key: 'pickups_per_season', label: 'Pickups / sn', type: 'num', value: (r) => r.pickups_per_season },
  { key: 'proposed', label: 'Proposed', type: 'num', digits: 0, value: (r) => r.proposed },
  { key: 'accepted', label: 'Accepted', type: 'num', digits: 0, value: (r) => r.accepted },
  { key: 'declined', label: 'Declined', type: 'num', digits: 0, value: (r) => r.declined },
];

const consistencyColumns: readonly Column<ConsistencyRow>[] = [
  { key: 'manager', label: 'Manager', type: 'text', value: (r) => r.manager },
  { key: 'seasons', label: 'Sns', type: 'num', digits: 0, value: (r) => r.seasons },
  { key: 'avg_score', label: 'Avg', type: 'num', digits: 2, value: (r) => r.avg_score },
  { key: 'avg_stddev', label: 'Std dev', type: 'num', digits: 2, value: (r) => r.avg_stddev },
  { key: 'avg_cv', label: 'CV', type: 'num', digits: 3, value: (r) => r.avg_cv },
  { key: 'best_week', label: 'Best', type: 'num', digits: 2, value: (r) => r.best_week },
  { key: 'worst_week', label: 'Worst', type: 'num', digits: 2, value: (r) => r.worst_week },
];

const trendColumns: readonly Column<Season>[] = [
  { key: 'season', label: 'Season', type: 'num', digits: 0, value: (r) => r.season },
  { key: 'avg_score', label: 'Avg score', type: 'num', digits: 2, value: (r) => r.avg_score },
  { key: 'teams', label: 'Teams', type: 'num', digits: 0, value: (r) => r.teams },
  { key: 'champion', label: 'Champion', type: 'text', value: (r) => r.champion },
];

const seasonColumns: readonly Column<Season>[] = [
  { key: 'season', label: 'Season', type: 'num', digits: 0, value: (r) => r.season },
  {
    key: 'champion',
    label: 'Champion',
    type: 'text',
    value: (r) => r.champion,
    render: (r) => r.champion ?? <span className={styles.muted}>in progress</span>,
  },
  { key: 'teams', label: 'Teams', type: 'num', digits: 0, value: (r) => r.teams },
  { key: 'reg_periods', label: 'Reg weeks', type: 'num', digits: 0, value: (r) => r.reg_periods },
  { key: 'avg_score', label: 'Avg score', type: 'num', digits: 2, value: (r) => r.avg_score },
  {
    key: 'source',
    label: 'Endpoint',
    type: 'text',
    value: (r) => r.source,
    render: (r) => <span className={styles.pill}>{r.source}</span>,
  },
];

const teamWeekColumns: readonly Column<TopTeamWeek>[] = [
  { key: 'manager', label: 'Manager', type: 'text', value: (r) => r.manager },
  { key: 'season', label: 'Season', type: 'num', digits: 0, value: (r) => r.season },
  { key: 'week', label: 'Wk', type: 'num', digits: 0, value: (r) => r.week },
  { key: 'score', label: 'Score', type: 'num', digits: 2, value: (r) => r.score },
  { key: 'opponent', label: 'Opponent', type: 'text', value: (r) => r.opponent },
  { key: 'opponent_score', label: 'Opp', type: 'num', digits: 2, value: (r) => r.opponent_score },
];

const playerWeekColumns: readonly Column<TopPlayerWeek>[] = [
  { key: 'player', label: 'Player', type: 'text', value: (r) => r.player },
  { key: 'position', label: 'Pos', type: 'text', value: (r) => r.position },
  { key: 'season', label: 'Season', type: 'num', digits: 0, value: (r) => r.season },
  { key: 'week', label: 'Wk', type: 'num', digits: 0, value: (r) => r.week },
  { key: 'points', label: 'Pts', type: 'num', value: (r) => r.points },
  { key: 'manager', label: 'Started by', type: 'text', value: (r) => r.manager },
];

const hardLuckColumns: readonly Column<HardLuckRow>[] = [
  { key: 'manager', label: 'Manager', type: 'text', value: (r) => r.manager },
  { key: 'season', label: 'Season', type: 'num', digits: 0, value: (r) => r.season },
  { key: 'week', label: 'Wk', type: 'num', digits: 0, value: (r) => r.week },
  { key: 'score', label: 'Scored', type: 'num', digits: 2, value: (r) => r.score },
  { key: 'opponent', label: 'Beaten by', type: 'text', value: (r) => r.opponent },
  { key: 'opponent_score', label: 'Opp', type: 'num', digits: 2, value: (r) => r.opponent_score },
  {
    key: 'margin',
    label: 'Margin',
    type: 'num',
    digits: 2,
    value: (r) => r.margin,
    className: () => styles.neg,
    render: (r) => signed(r.margin, 2),
  },
];

/* ------------------------------------------------------------------ page ---- */

const SectionHead = ({
  kicker,
  title,
  children,
}: {
  readonly kicker: string;
  readonly title: string;
  readonly children?: ReactNode;
}) => (
  <div className={styles.sectionHead}>
    <h2 className={styles.sectionKicker}>{kicker}</h2>
    <h3 className={styles.sectionTitle}>{title}</h3>
    {children}
  </div>
);

const CardHead = ({ title, note }: { readonly title: string; readonly note?: ReactNode }) => (
  <>
    <h3 className={styles.sectionTitle}>{title}</h3>
    {note ? <p className={styles.note}>{note}</p> : null}
  </>
);

const TableCard = ({ children }: { readonly children: ReactNode }) => (
  <div className={styles.card}>
    <div className={styles.scroller}>{children}</div>
  </div>
);

const SdfflRecordBook = ({ view }: { readonly view: RecordBookView }) => {
  const { totals, draftSlotBaseline: baseline } = view;

  const bestSlot = [...view.chartedDraftSlots].sort((a, b) => b.titles - a.titles || a.avg_finish - b.avg_finish)[0];
  const worstSlot = [...view.chartedDraftSlots].sort((a, b) => b.avg_finish - a.avg_finish)[0];

  return (
    <div className={styles.shell}>
      <RailNav items={RAIL_ITEMS} />

      <main>
        <header className={styles.masthead}>
          <p className={styles.eyebrow}>
            {totals.first_season}–{totals.last_season} · {totals.franchises} managers · {totals.seasons} seasons
          </p>
          <h1 className={styles.title}>{totals.league_name} Record Book</h1>
          <p className={styles.lede}>
            Fourteen seasons of a twelve-team league, pulled out of ESPN’s fantasy API and put in one place: every game,
            every lineup, every pick and every waiver claim. {int(totals.stat_rows)} stat rows behind it.
          </p>
          <div className={styles.tiles}>
            {(
              [
                ['Seasons', int(totals.seasons)],
                ['Games', int(totals.games)],
                ['Player weeks', int(totals.player_weeks)],
                ['Draft picks', int(totals.draft_picks)],
                ['Roster moves', int(totals.transactions)],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className={styles.tile}>
                <div className={styles.tileValue}>{value}</div>
                <div className={styles.tileLabel}>{label}</div>
              </div>
            ))}
          </div>
        </header>

        <section id="record" className={styles.section}>
          <SectionHead kicker="The record book" title="All time, every franchise">
            <p className={styles.note}>
              Championship bracket kept separate from consolation. ESPN tags any bracket game as a playoff game, and
              this league has played <strong>more consolation games than championship ones</strong> — counting both
              together hands a losing team a winning playoff record. Click any column to sort.
            </p>
          </SectionHead>
          <TableCard>
            <SortableTable
              columns={allTimeColumns}
              rows={view.allTime}
              rowKey={(r) => r.manager}
              sortKey="titles"
              caption="Every franchise, all 14 seasons. Title W/L is the championship bracket only."
            />
          </TableCard>
        </section>

        <section id="podium" className={styles.section}>
          <SectionHead kicker="Every season" title="The podium, and who actually dominated">
            <p className={styles.note}>
              Playoff finish and regular-season dominance are different questions, and here they are close to unrelated:{' '}
              <strong>in 13 seasons the best regular-season record has never won the title</strong>, and neither has the
              league’s top scorer.
            </p>
          </SectionHead>
          <TableCard>
            <SortableTable
              columns={podiumColumns}
              rows={view.podium}
              rowKey={(r) => String(r.season)}
              sortKey="season"
              caption="Final standing 1, 2 and 3, with the team name each manager was using that year."
            />
          </TableCard>
          <TableCard>
            <SortableTable
              columns={superlativeColumns}
              rows={view.podium}
              rowKey={(r) => String(r.season)}
              sortKey="season"
              caption="Regular season only. Best and worst record break ties on points."
            />
          </TableCard>
        </section>

        <section id="h2h" className={styles.section}>
          <SectionHead kicker="Head to head" title="Who owns whom">
            <p className={styles.note}>
              Win rate for the row against the column, regular season and playoffs together — a rivalry does not stop
              counting in December. Matrix shows the {view.matrixManagers.length} franchises with eight or more seasons;
              the table has every pairing.
            </p>
          </SectionHead>
          <PanelToggle
            chartLabel="Matrix"
            tableLabel="Table"
            head={<CardHead title="Win rate by matchup" />}
            chart={<HeadToHeadMatrix managers={view.matrixManagers} pairs={view.headToHead} />}
            table={
              <SortableTable
                columns={headToHeadColumns}
                rows={view.headToHead}
                rowKey={(r) => `${r.manager}||${r.opponent}`}
                sortKey="games"
                caption="Every pairing between franchises with four or more seasons."
              />
            }
          />
        </section>

        <section id="luck" className={styles.section}>
          <SectionHead kicker="Skill and luck" title="Scoring well is not the same as winning">
            <p className={styles.note}>
              Head-to-head fantasy hands out wins by who you happened to draw. Two numbers separate how well you scored
              from how well you were scheduled.
            </p>
            <dl className={styles.defs}>
              <div>
                <dt>Deserved wins</dt>
                <dd>
                  The wins your scoring earned, ignoring the schedule. Every week your score is compared against{' '}
                  <em>every other team’s</em> score that same week — a win for each team you outscored, half for a tie.
                  That all-play win rate, multiplied by games played, is your deserved wins. Outscore nine of eleven
                  opponents in a week and you banked 0.82 of a win, whether or not the one you actually played was among
                  them.
                </dd>
              </div>
              <div>
                <dt>Luck</dt>
                <dd>
                  Actual wins minus deserved wins. <strong className={styles.pos}>Positive</strong> means the schedule
                  handed you wins your scoring did not earn — you kept drawing whoever was cold that week.{' '}
                  <strong className={styles.neg}>Negative</strong> means you scored well and lost anyway, because you
                  kept running into the week’s high scorer. Over a 13–14 game season, ±2 is a lot.
                </dd>
              </div>
            </dl>
            <p className={styles.note}>
              Regular season only: a bracket week has four teams in it, not twelve, so all-play is not comparable there.
              On the chart below, points above the diagonal won more than they deserved.
            </p>
          </SectionHead>

          <PanelToggle
            chartLabel="Chart"
            tableLabel="Table"
            head={
              <CardHead
                title="Actual win rate against deserved"
                note="Regular season only, all 13 completed seasons."
              />
            }
            chart={<LuckScatterChart rows={view.luckCareers} />}
            table={
              <SortableTable
                columns={luckColumns}
                rows={view.luckCareers}
                rowKey={(r) => r.manager}
                sortKey="luck_wins"
                caption="Four or more seasons. Regular season only."
              />
            }
          />

          <PanelToggle
            chartLabel="Chart"
            tableLabel="Table"
            head={<CardHead title="The luck ledger" note="Wins above or below what the scoring deserved, all time." />}
            chart={<LuckLedgerChart rows={view.luckCareers} />}
            table={
              <SortableTable
                columns={luckLedgerColumns}
                rows={view.luckCareers}
                rowKey={(r) => r.manager}
                sortKey="luck_wins"
              />
            }
          />
        </section>

        <section id="draft" className={styles.section}>
          <SectionHead kicker="The draft" title="What a pick is worth">
            <p className={styles.note}>
              Every draft here is a snake draft — no auction bids, no keepers in any of the 13. Value is measured from
              2018 on, because earlier seasons return starters only, so a drafted player who sat would read as a bust
              worth zero.
            </p>
          </SectionHead>

          <PanelToggle
            chartLabel="Chart"
            tableLabel="Table"
            head={
              <CardHead
                title="Does the draft slot decide the season?"
                note="Average regular-season wins by round-one pick position, all 13 completed seasons. The line is the league average."
              />
            }
            chart={<DraftSlotChart rows={view.chartedDraftSlots} baseline={baseline} />}
            table={
              <SortableTable
                columns={slotColumns}
                rows={view.draftSlots}
                rowKey={(r) => String(r.slot)}
                sortKey="slot"
                sortDirection="asc"
                caption="Round-one pick position against how the season ended. Slots 13 and 14 come from 2014's fourteen-team season only."
              />
            }
            footer={
              <p className={styles.note}>
                <strong>Historically slot {bestSlot.slot}</strong> — {bestSlot.titles} titles and the best average
                finish, while slot {worstSlot.slot} has the worst average finish. But the shaded band is one standard
                error ({num(baseline.se_slot_mean, 2)} wins) and nearly every slot sits inside it: with about 13 seasons
                per slot, a spread this size is what chance produces. Expected titles per slot is{' '}
                {num(baseline.titles_expected_per_slot, 2)}, so a slot with 4 is not yet evidence of anything.{' '}
                <strong>No slot is reliably better.</strong>
              </p>
            }
          />

          <PanelToggle
            chartLabel="Chart"
            tableLabel="Table"
            head={
              <CardHead
                title="Starter points returned, by round"
                note="Mean against median. Where they diverge, the round is a lottery."
              />
            }
            chart={<DraftRoundsChart rows={view.draftRounds} />}
            table={
              <SortableTable
                columns={roundColumns}
                rows={view.draftRounds}
                rowKey={(r) => String(r.round)}
                sortKey="round"
                sortDirection="asc"
              />
            }
          />

          <PanelToggle
            chartLabel="Skill positions"
            tableLabel="Including QBs"
            head={<CardHead title="Biggest steals" note="Value over the round's baseline." />}
            chart={
              <SortableTable
                columns={stealColumns}
                rows={view.stealsNoQb}
                rowKey={(r) => `${r.season}-${r.pick}`}
                sortKey="surplus"
                caption="Quarterbacks excluded. A late QB who becomes a starter clears the baseline by 300+ points and buries every other position."
              />
            }
            table={
              <SortableTable
                columns={stealColumns}
                rows={view.steals}
                rowKey={(r) => `${r.season}-${r.pick}`}
                sortKey="surplus"
                caption="All positions — and all ten of the biggest steals are quarterbacks."
              />
            }
          />

          <TableCard>
            <SortableTable
              columns={bustColumns}
              rows={view.busts}
              rowKey={(r) => `${r.season}-${r.pick}`}
              sortKey="surplus"
              sortDirection="asc"
              caption="Biggest busts. Eight of the ten are running backs; nine went in the first two rounds."
            />
          </TableCard>

          <TableCard>
            <SortableTable
              columns={draftSkillColumns}
              rows={view.draftSkill}
              rowKey={(r) => r.manager}
              sortKey="surplus_per_draft"
              caption="Points count only while the player stays on the drafting roster, so a manager who churns hard scores badly here by construction — they drop a slow starter, someone else banks the points, and the pick reads as a bust. Draft quality and roster churn, tangled together."
            />
          </TableCard>
        </section>

        <section id="roster" className={styles.section}>
          <SectionHead kicker="Roster work" title="Lineups, waivers and trades">
            <p className={styles.note}>
              Bench numbers are 2018 onward only — the five seasons before that carry no bench at all, and averaging
              them in would show half a decade of flawless lineup setting.
            </p>
          </SectionHead>
          <TableCard>
            <SortableTable
              columns={benchColumns}
              rows={view.bench}
              rowKey={(r) => r.manager}
              sortKey="avg_swap_regret"
              sortDirection="asc"
              caption="2018 onward — earlier seasons carry no bench at all. Raw bench points overstate the mistake, since a bench player may not have been legally startable in any open slot; swap regret (best bench minus worst starter) is the honest core of it. Lower is better."
            />
          </TableCard>
          <div className={styles.pair}>
            <TableCard>
              <SortableTable
                columns={pickupColumns}
                rows={view.pickups}
                rowKey={(r) => r.manager}
                sortKey="starter_points_added"
                caption="Waiver and free-agent value, counted only from the week of the add onward."
              />
            </TableCard>
            <TableCard>
              <SortableTable
                columns={activityColumns}
                rows={view.activity}
                rowKey={(r) => r.manager}
                sortKey="accepted"
                caption="Proposed and accepted are opposite sides of a deal — never a ratio."
              />
            </TableCard>
          </div>
        </section>

        <section id="scoring" className={styles.section}>
          <SectionHead kicker="Scoring" title="How much, and how steadily">
            <p className={styles.note}>
              In a format where you only have to beat one opponent, consistency is worth real wins: a boom-and-bust team
              wins fewer games than its average suggests. Coefficient of variation is the spread relative to the mean —
              lower is steadier.
            </p>
          </SectionHead>
          <TableCard>
            <SortableTable
              columns={consistencyColumns}
              rows={view.consistency}
              rowKey={(r) => r.manager}
              sortKey="avg_cv"
              sortDirection="asc"
              caption="Coefficient of variation — spread relative to the mean. Lower is steadier."
            />
          </TableCard>
          <PanelToggle
            chartLabel="Chart"
            tableLabel="Table"
            head={<CardHead title="League average score by season" note="Regular season, points per team per week." />}
            chart={<ScoringTrendChart seasons={view.seasons} />}
            table={
              <SortableTable
                columns={trendColumns}
                rows={view.seasons}
                rowKey={(r) => String(r.season)}
                sortKey="season"
                sortDirection="asc"
              />
            }
          />
        </section>

        <section id="records" className={styles.section}>
          <SectionHead kicker="Extremes" title="Best weeks, and the ones that got away" />
          <div className={styles.pair}>
            <TableCard>
              <SortableTable
                columns={teamWeekColumns}
                rows={view.topTeamWeeks}
                rowKey={(r) => `${r.season}-${r.week}-${r.manager}`}
                sortKey="score"
                caption="Highest team scores ever recorded."
              />
            </TableCard>
            <TableCard>
              <SortableTable
                columns={playerWeekColumns}
                rows={view.topPlayerWeeks}
                rowKey={(r) => `${r.season}-${r.week}-${r.player}`}
                sortKey="points"
                caption="Highest single player weeks."
              />
            </TableCard>
          </div>
          <TableCard>
            <SortableTable
              columns={hardLuckColumns}
              rows={view.hardLuck}
              rowKey={(r) => `${r.season}-${r.week}-${r.manager}`}
              sortKey="score"
              caption="The biggest scores that still lost."
            />
          </TableCard>
        </section>

        <section id="seasons" className={styles.section}>
          <SectionHead kicker="Season by season" title="Fourteen years">
            <p className={styles.note}>Pick a season for its final standings.</p>
          </SectionHead>
          <TableCard>
            <SortableTable
              columns={seasonColumns}
              rows={view.seasons}
              rowKey={(r) => String(r.season)}
              sortKey="season"
              caption="Champion is ESPN's final standing of 1."
            />
          </TableCard>
          <SeasonStandings seasons={view.playedSeasons} standings={view.standings} />
        </section>

        <div className={styles.colophon}>
          <p className={styles.muted}>
            Generated {view.generatedAt} · league {totals.league_name}
          </p>
        </div>
      </main>
    </div>
  );
};

export default SdfflRecordBook;
