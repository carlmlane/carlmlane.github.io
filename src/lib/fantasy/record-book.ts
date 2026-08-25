import { z } from 'zod';

// A league record book is a static export of a DuckDB warehouse built by `ffl-wiz`
// from the ESPN fantasy API: keyed tables loaded and summarised by a stack of SQL
// views. Each league commits its own JSON next to a module that calls
// `createRecordBookView`; the schemas below validate that JSON at build time so a bad
// regeneration fails the build rather than rendering blank cells.

const totalsSchema = z.object({
  seasons: z.number(),
  // Newer exports separate seasons in the warehouse from seasons already played.
  seasons_played: z.number().optional(),
  team_count: z.number().optional(),
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
  seasons_per_slot: z.number().optional(),
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

const positionalSchema = z.object({
  manager: z.string(),
  position: z.string(),
  starts: z.number(),
  points_per_start: z.number(),
  league_ppg: z.number(),
  edge: z.number(),
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
  // Only exports built after the positional views were added carry this.
  positional: z.array(positionalSchema).optional(),
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
export type PositionalRow = z.infer<typeof positionalSchema>;
export type TopTeamWeek = z.infer<typeof topTeamWeekSchema>;
export type TopPlayerWeek = z.infer<typeof topPlayerWeekSchema>;
export type HardLuckRow = z.infer<typeof hardLuckSchema>;
export type RecordBook = z.infer<typeof recordBookSchema>;

/**
 * The thresholds below all answer the same question — how many seasons before a rate
 * is worth quoting — and the answer depends on how long the league has run. A league
 * with six seasons cannot use the cutoffs of one with fourteen.
 */
export type RecordBookConfig = {
  /** Careers shorter than this swing wildly on a handful of weeks, so the luck views skip them. */
  readonly luckMinSeasons: number;
  /** The head-to-head matrix is unreadable past a dozen or so columns. */
  readonly matrixMinSeasons: number;
  /** Draft slots that only existed for an odd season or two are anecdotes, not rates. */
  readonly slotMinSeasons: number;
};

export const parseRecordBook = (data: unknown): RecordBook => recordBookSchema.parse(data);

/**
 * Every record book page is a client component (sortable tables, chart tooltips, a
 * season picker), so everything it renders crosses the server boundary as plain data.
 * Validation and every filter that does not depend on user interaction happen here, at
 * build time, which keeps zod and the raw export out of the browser bundle.
 */
export const createRecordBookView = (data: unknown, config: RecordBookConfig) => {
  const book = parseRecordBook(data);

  return {
    generatedAt: book.generatedAt,
    totals: book.totals[0],
    teamSeasons: book.standings.length,
    seasons: book.seasons,
    allTime: book.all_time,
    luckCareers: book.luck.filter((row) => row.seasons >= config.luckMinSeasons),
    standings: book.standings,
    playedSeasons: book.seasons
      .filter((season) => season.has_results)
      .map((season) => season.season)
      .sort((a, b) => b - a),
    podium: book.podium,
    headToHead: book.head_to_head,
    matrixManagers: book.all_time.filter((row) => row.seasons >= config.matrixMinSeasons).map((row) => row.manager),
    consistency: book.consistency,
    draftSlots: book.draft_slot,
    chartedDraftSlots: book.draft_slot.filter((row) => row.seasons >= config.slotMinSeasons),
    draftSlotBaseline: book.draft_slot_baseline[0],
    draftRounds: book.draft_rounds,
    steals: book.steals,
    stealsNoQb: book.steals_no_qb,
    busts: book.busts,
    draftSkill: book.draft_skill,
    bench: book.bench,
    pickups: book.pickups,
    activity: book.activity,
    positional: book.positional,
    topTeamWeeks: book.top_team_weeks,
    topPlayerWeeks: book.top_player_weeks,
    hardLuck: book.hard_luck,
  } as const;
};

export type RecordBookView = ReturnType<typeof createRecordBookView>;
