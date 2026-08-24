import { z } from 'zod';
import data from './record-book-data.json';

// The SD FFL record book is a static export of a DuckDB warehouse built by `ffl-wiz`
// from the ESPN fantasy API: 18 keyed tables loaded and summarised by 34 SQL views.
// The JSON is committed alongside this module; the schemas below validate it at build
// time so a bad regeneration fails the build rather than rendering blank cells.

const totalsSchema = z.object({
  seasons: z.number(),
  games: z.number(),
  franchises: z.number(),
  stat_rows: z.number(),
  player_weeks: z.number(),
  draft_picks: z.number(),
  transactions: z.number(),
  record_mismatches: z.number(),
  first_season: z.number(),
  last_season: z.number(),
  league_name: z.string(),
});

const seasonSchema = z.object({
  season: z.number(),
  source: z.string(),
  has_bench: z.boolean(),
  has_projections: z.boolean(),
  has_results: z.boolean(),
  teams: z.number(),
  reg_periods: z.number(),
  champion: z.string().nullable(),
  avg_score: z.number().nullable(),
});

const allTimeSchema = z.object({
  manager: z.string(),
  seasons: z.number(),
  first_season: z.number(),
  last_season: z.number(),
  games: z.number(),
  wins: z.number(),
  losses: z.number(),
  ties: z.number(),
  win_pct: z.number(),
  points_for: z.number(),
  points_against: z.number(),
  points_per_game: z.number(),
  margin_per_game: z.number(),
  playoff_wins: z.number(),
  playoff_losses: z.number(),
  consolation_games: z.number(),
  playoff_appearances: z.number(),
  playoff_rate: z.number(),
  titles: z.number(),
});

const luckSchema = z.object({
  manager: z.string(),
  seasons: z.number(),
  games: z.number(),
  actual_wins: z.number(),
  expected_wins: z.number(),
  luck_wins: z.number(),
  actual_pct: z.number(),
  deserved_pct: z.number(),
  luck_per_season: z.number(),
});

const standingSchema = z.object({
  season: z.number(),
  manager: z.string(),
  wins: z.number(),
  losses: z.number(),
  points_for: z.number(),
  final_standing: z.number(),
  playoff_seed: z.number(),
  is_champion: z.boolean(),
  playoff_wins: z.number(),
  playoff_losses: z.number(),
  luck_wins: z.number(),
});

const podiumSchema = z.object({
  season: z.number(),
  first_manager: z.string(),
  first_team: z.string(),
  second_manager: z.string(),
  second_team: z.string(),
  third_manager: z.string(),
  third_team: z.string(),
  best_record_manager: z.string(),
  best_record_team: z.string(),
  best_record: z.string(),
  worst_record_manager: z.string(),
  worst_record_team: z.string(),
  worst_record: z.string(),
  most_points_manager: z.string(),
  most_points: z.number(),
  fewest_points_manager: z.string(),
  fewest_points: z.number(),
});

const headToHeadSchema = z.object({
  manager: z.string(),
  opponent: z.string(),
  games: z.number(),
  wins: z.number(),
  losses: z.number(),
  ties: z.number(),
  win_pct: z.number(),
  avg_margin: z.number(),
});

const consistencySchema = z.object({
  manager: z.string(),
  seasons: z.number(),
  weeks: z.number(),
  avg_score: z.number(),
  avg_stddev: z.number(),
  avg_cv: z.number(),
  best_week: z.number(),
  worst_week: z.number(),
});

const draftSlotSchema = z.object({
  slot: z.number(),
  seasons: z.number(),
  avg_wins: z.number(),
  avg_losses: z.number(),
  avg_points: z.number(),
  avg_finish: z.number(),
  titles: z.number(),
  playoff_seasons: z.number(),
  playoff_rate: z.number(),
  podiums: z.number(),
});

const draftSlotBaselineSchema = z.object({
  league_avg_wins: z.number(),
  sd_team_wins: z.number(),
  se_slot_mean: z.number(),
  titles_expected_per_slot: z.number(),
});

const draftRoundSchema = z.object({
  round: z.number(),
  picks: z.number(),
  avg_starter_points: z.number(),
  median_starter_points: z.number(),
  avg_starts: z.number(),
});

const stealSchema = z.object({
  season: z.number(),
  pick: z.number(),
  round: z.number(),
  manager: z.string(),
  player_name: z.string(),
  position: z.string(),
  starter_points: z.number(),
  round_baseline: z.number(),
  surplus: z.number(),
});

const bustSchema = z.object({
  season: z.number(),
  pick: z.number(),
  round: z.number(),
  manager: z.string(),
  player_name: z.string(),
  position: z.string(),
  starter_points: z.number(),
  starts: z.number(),
  surplus: z.number(),
});

const draftSkillSchema = z.object({
  manager: z.string(),
  drafts: z.number(),
  picks: z.number(),
  total_surplus: z.number(),
  surplus_per_draft: z.number(),
  avg_points_per_pick: z.number(),
  hit_rate: z.number(),
  auto_picks: z.number(),
});

const benchSchema = z.object({
  manager: z.string(),
  weeks: z.number(),
  avg_bench_points: z.number(),
  avg_swap_regret: z.number(),
  weeks_with_bad_start: z.number(),
});

const pickupSchema = z.object({
  manager: z.string(),
  players_added: z.number(),
  starts_from_pickups: z.number(),
  starter_points_added: z.number(),
  points_per_start: z.number(),
});

const activitySchema = z.object({
  manager: z.string(),
  seasons: z.number(),
  pickups: z.number(),
  pickups_per_season: z.number(),
  proposed: z.number(),
  accepted: z.number(),
  declined: z.number(),
});

const topTeamWeekSchema = z.object({
  season: z.number(),
  week: z.number(),
  manager: z.string(),
  team_name: z.string(),
  score: z.number(),
  opponent: z.string(),
  opponent_score: z.number(),
  result: z.string(),
  isPlayoff: z.boolean(),
});

const topPlayerWeekSchema = z.object({
  season: z.number(),
  week: z.number(),
  player: z.string(),
  position: z.string(),
  proTeam: z.string(),
  manager: z.string(),
  points: z.number(),
  started: z.boolean(),
});

const hardLuckSchema = z.object({
  season: z.number(),
  week: z.number(),
  manager: z.string(),
  score: z.number(),
  opponent: z.string(),
  opponent_score: z.number(),
  margin: z.number(),
});

const recordBookSchema = z.object({
  totals: z.array(totalsSchema).nonempty(),
  seasons: z.array(seasonSchema),
  all_time: z.array(allTimeSchema),
  luck: z.array(luckSchema),
  standings: z.array(standingSchema),
  podium: z.array(podiumSchema),
  head_to_head: z.array(headToHeadSchema),
  consistency: z.array(consistencySchema),
  draft_slot: z.array(draftSlotSchema),
  draft_slot_baseline: z.array(draftSlotBaselineSchema).nonempty(),
  draft_rounds: z.array(draftRoundSchema),
  steals: z.array(stealSchema),
  steals_no_qb: z.array(stealSchema),
  busts: z.array(bustSchema),
  draft_skill: z.array(draftSkillSchema),
  bench: z.array(benchSchema),
  pickups: z.array(pickupSchema),
  activity: z.array(activitySchema),
  top_team_weeks: z.array(topTeamWeekSchema),
  top_player_weeks: z.array(topPlayerWeekSchema),
  hard_luck: z.array(hardLuckSchema),
  generatedAt: z.string(),
});

export type Totals = z.infer<typeof totalsSchema>;
export type Season = z.infer<typeof seasonSchema>;
export type AllTimeRecord = z.infer<typeof allTimeSchema>;
export type LuckRow = z.infer<typeof luckSchema>;
export type Standing = z.infer<typeof standingSchema>;
export type PodiumRow = z.infer<typeof podiumSchema>;
export type HeadToHeadRow = z.infer<typeof headToHeadSchema>;
export type ConsistencyRow = z.infer<typeof consistencySchema>;
export type DraftSlotRow = z.infer<typeof draftSlotSchema>;
export type DraftSlotBaseline = z.infer<typeof draftSlotBaselineSchema>;
export type DraftRoundRow = z.infer<typeof draftRoundSchema>;
export type StealRow = z.infer<typeof stealSchema>;
export type BustRow = z.infer<typeof bustSchema>;
export type DraftSkillRow = z.infer<typeof draftSkillSchema>;
export type BenchRow = z.infer<typeof benchSchema>;
export type PickupRow = z.infer<typeof pickupSchema>;
export type ActivityRow = z.infer<typeof activitySchema>;
export type TopTeamWeek = z.infer<typeof topTeamWeekSchema>;
export type TopPlayerWeek = z.infer<typeof topPlayerWeekSchema>;
export type HardLuckRow = z.infer<typeof hardLuckSchema>;
export type RecordBook = z.infer<typeof recordBookSchema>;

export const recordBook: RecordBook = recordBookSchema.parse(data);

// Managers with fewer than four seasons swing wildly on a handful of weeks, so the
// luck views quote only the careers long enough for an all-play rate to mean anything.
const LUCK_MIN_SEASONS = 4;

// The head-to-head matrix would be unreadable at 23 columns; the long-tenured
// franchises are the ones with enough meetings for a win rate to be worth reading.
const MATRIX_MIN_SEASONS = 8;

// Slots 13 and 14 exist only because 2014 ran fourteen teams. One season is an
// anecdote, not a rate, so the slot chart covers the slots every season had.
const SLOT_MIN_SEASONS = 5;

/**
 * The page is a client component (sortable tables, chart tooltips, a season picker),
 * so everything it renders crosses the server boundary as plain data. Validation and
 * every filter that does not depend on user interaction happen here, at build time,
 * which keeps zod and the raw export out of the browser bundle.
 */
export const recordBookView = {
  generatedAt: recordBook.generatedAt,
  totals: recordBook.totals[0],
  teamSeasons: recordBook.standings.length,
  seasons: recordBook.seasons,
  allTime: recordBook.all_time,
  luckCareers: recordBook.luck.filter((row) => row.seasons >= LUCK_MIN_SEASONS),
  standings: recordBook.standings,
  playedSeasons: recordBook.seasons
    .filter((season) => season.has_results)
    .map((season) => season.season)
    .sort((a, b) => b - a),
  podium: recordBook.podium,
  headToHead: recordBook.head_to_head,
  matrixManagers: recordBook.all_time.filter((row) => row.seasons >= MATRIX_MIN_SEASONS).map((row) => row.manager),
  consistency: recordBook.consistency,
  draftSlots: recordBook.draft_slot,
  chartedDraftSlots: recordBook.draft_slot.filter((row) => row.seasons >= SLOT_MIN_SEASONS),
  draftSlotBaseline: recordBook.draft_slot_baseline[0],
  draftRounds: recordBook.draft_rounds,
  steals: recordBook.steals,
  stealsNoQb: recordBook.steals_no_qb,
  busts: recordBook.busts,
  draftSkill: recordBook.draft_skill,
  bench: recordBook.bench,
  pickups: recordBook.pickups,
  activity: recordBook.activity,
  topTeamWeeks: recordBook.top_team_weeks,
  topPlayerWeeks: recordBook.top_player_weeks,
  hardLuck: recordBook.hard_luck,
} as const;

export type RecordBookView = typeof recordBookView;
