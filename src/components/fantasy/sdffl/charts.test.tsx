import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { DraftRoundRow, DraftSlotBaseline, DraftSlotRow, LuckRow, Season } from '@/lib/sdffl/record-book';
import DraftRoundsChart from './draft-rounds-chart';
import DraftSlotChart from './draft-slot-chart';
import LuckLedgerChart from './luck-ledger-chart';
import LuckScatterChart from './luck-scatter-chart';
import ScoringTrendChart from './scoring-trend-chart';

afterEach(cleanup);

const createMockLuck = (overrides: Partial<LuckRow> = {}): LuckRow => ({
  manager: 'Nick T.',
  seasons: 13,
  games: 174,
  actual_wins: 91,
  expected_wins: 95.7,
  luck_wins: -4.7,
  actual_pct: 0.523,
  deserved_pct: 0.55,
  luck_per_season: -0.36,
  ...overrides,
});

const luckRows: readonly LuckRow[] = [
  createMockLuck(),
  createMockLuck({
    manager: 'Justin R.',
    actual_pct: 0.497,
    deserved_pct: 0.436,
    luck_wins: 9.8,
    luck_per_season: 0.82,
  }),
  createMockLuck({ manager: 'A Manager With A Very Long Name', actual_pct: 0.46, deserved_pct: 0.47, luck_wins: -1.2 }),
];

const createMockSlot = (overrides: Partial<DraftSlotRow> = {}): DraftSlotRow => ({
  slot: 6,
  seasons: 13,
  avg_wins: 7.2,
  avg_losses: 5.8,
  avg_points: 1420.5,
  avg_finish: 5.1,
  titles: 4,
  playoff_seasons: 9,
  playoff_rate: 0.692,
  podiums: 6,
  ...overrides,
});

const baseline: DraftSlotBaseline = {
  league_avg_wins: 6.69,
  sd_team_wins: 2.12,
  se_slot_mean: 0.59,
  titles_expected_per_slot: 1.08,
};

const roundRows: readonly DraftRoundRow[] = [
  { round: 1, picks: 156, avg_starter_points: 195.8, median_starter_points: 198.2, avg_starts: 11.2 },
  { round: 2, picks: 156, avg_starter_points: 160.1, median_starter_points: 158.6, avg_starts: 10.1 },
  { round: 3, picks: 156, avg_starter_points: 120.4, median_starter_points: 95.3, avg_starts: 8.4 },
];

const createMockSeason = (overrides: Partial<Season> = {}): Season => ({
  season: 2024,
  source: 'mSettings',
  has_bench: true,
  has_projections: true,
  has_results: true,
  teams: 12,
  reg_periods: 13,
  champion: 'Jason B.',
  avg_score: 112.4,
  ...overrides,
});

describe('LuckScatterChart', () => {
  it('plots one labelled mark per manager against the parity line', () => {
    const { getByRole, getByText } = render(<LuckScatterChart rows={luckRows} />);
    expect(getByRole('img')).toHaveAttribute('aria-label', 'Actual win rate against deserved win rate, by manager');
    expect(getByText('Nick T.')).toBeInTheDocument();
    expect(getByText('won what they deserved')).toBeInTheDocument();
  });

  it('truncates a name too long for its lane', () => {
    const { getByText } = render(<LuckScatterChart rows={luckRows} />);
    expect(getByText('A Manager With…')).toBeInTheDocument();
  });

  it('legends both directions of luck', () => {
    const { getByText } = render(<LuckScatterChart rows={luckRows} />);
    expect(getByText('won more than deserved')).toBeInTheDocument();
    expect(getByText('won less than deserved')).toBeInTheDocument();
  });

  it('opens a tooltip from the hit ring and closes it again', () => {
    const { container, getByRole, queryByRole } = render(<LuckScatterChart rows={luckRows} />);
    const hit = container.querySelector('circle[aria-label]');
    if (!hit) throw new Error('expected a hit target');
    fireEvent.pointerMove(hit, { clientX: 20, clientY: 20 });
    expect(getByRole('status')).toHaveTextContent('deserved');
    fireEvent.pointerLeave(hit);
    expect(queryByRole('status')).toBeNull();
  });

  it('separates labels that would otherwise collide', () => {
    const stacked = [
      createMockLuck({ manager: 'One', actual_pct: 0.5, deserved_pct: 0.5 }),
      createMockLuck({ manager: 'Two', actual_pct: 0.5001, deserved_pct: 0.5 }),
      createMockLuck({ manager: 'Three', actual_pct: 0.5002, deserved_pct: 0.5 }),
    ];
    const { container } = render(<LuckScatterChart rows={stacked} />);
    const ys = [...container.querySelectorAll('text')]
      .filter((node) => ['One', 'Two', 'Three'].includes(node.textContent ?? ''))
      .map((node) => Number(node.getAttribute('y')));
    const gaps = ys.slice(1).map((y, index) => Math.abs(y - ys[index]));
    for (const gap of gaps) expect(gap).toBeGreaterThanOrEqual(12);
  });
});

describe('LuckLedgerChart', () => {
  it('orders bars from luckiest to unluckiest', () => {
    const { container } = render(<LuckLedgerChart rows={luckRows} />);
    const managers = luckRows.map((row) => row.manager.slice(0, 16));
    const drawn = [...container.querySelectorAll('text')]
      .map((node) => node.textContent ?? '')
      .filter((text) => managers.some((name) => text.startsWith(name)));
    expect(drawn[0]).toBe('Justin R.');
    expect(drawn[drawn.length - 1]).toBe('Nick T.');
  });

  it('signs each bar value', () => {
    const { getByText } = render(<LuckLedgerChart rows={luckRows} />);
    expect(getByText('+9.8')).toBeInTheDocument();
    expect(getByText('-4.7')).toBeInTheDocument();
  });

  it('shows a per-season rate in the tooltip', () => {
    const { container, getByRole } = render(<LuckLedgerChart rows={luckRows} />);
    const hit = container.querySelector('rect[aria-label]');
    if (!hit) throw new Error('expected a hit target');
    fireEvent.pointerMove(hit, { clientX: 5, clientY: 5 });
    expect(getByRole('status')).toHaveTextContent('per season');
  });

  it('drops gridlines that fall outside the data range', () => {
    const { queryByText } = render(<LuckLedgerChart rows={[createMockLuck({ luck_wins: 1 })]} />);
    expect(queryByText('+8')).toBeNull();
    expect(queryByText('0')).toBeInTheDocument();
  });
});

describe('DraftSlotChart', () => {
  const slots = [createMockSlot({ slot: 1, titles: 0, avg_wins: 5.6 }), createMockSlot()];

  it('labels the slot, its titles and its playoff rate under each bar', () => {
    const { getAllByText } = render(<DraftSlotChart rows={slots} baseline={baseline} />);
    // "4" is also a y-axis tick, so the assertion is that the titles label exists at all.
    expect(getAllByText('4').length).toBeGreaterThan(1);
    expect(getAllByText('.692')).toHaveLength(2);
    // The title-less slot gets a mid dot rather than a zero.
    expect(getAllByText('·').length).toBeGreaterThan(0);
  });

  it('legends the league average and the standard error band', () => {
    const { getByText } = render(<DraftSlotChart rows={slots} baseline={baseline} />);
    expect(getByText('league average 6.69 wins')).toBeInTheDocument();
    expect(getByText('± 1 standard error (0.59)')).toBeInTheDocument();
  });

  it('names the three label rows on the axis', () => {
    const { getByText } = render(<DraftSlotChart rows={slots} baseline={baseline} />);
    for (const label of ['slot', 'titles', 'playoffs', 'avg wins']) {
      expect(getByText(label)).toBeInTheDocument();
    }
  });

  it('reports average finish in the tooltip', () => {
    const { container, getByRole } = render(<DraftSlotChart rows={slots} baseline={baseline} />);
    const hit = container.querySelector('rect[aria-label]');
    if (!hit) throw new Error('expected a hit target');
    fireEvent.pointerMove(hit, { clientX: 5, clientY: 5 });
    expect(getByRole('status')).toHaveTextContent('avg finish');
  });
});

describe('DraftRoundsChart', () => {
  it('draws a mean and a median series', () => {
    const { container, getAllByText } = render(<DraftRoundsChart rows={roundRows} />);
    expect(container.querySelectorAll('path')).toHaveLength(2);
    expect(getAllByText('mean').length).toBeGreaterThan(0);
    expect(getAllByText('median').length).toBeGreaterThan(0);
  });

  it('puts both series in the tooltip so the lottery rounds are visible', () => {
    const { container, getByRole } = render(<DraftRoundsChart rows={roundRows} />);
    const hit = container.querySelector('rect[aria-label]');
    if (!hit) throw new Error('expected a hit target');
    fireEvent.pointerMove(hit, { clientX: 5, clientY: 5 });
    expect(getByRole('status')).toHaveTextContent('195.8');
    expect(getByRole('status')).toHaveTextContent('198.2');
  });
});

describe('ScoringTrendChart', () => {
  const seasons = [
    createMockSeason({ season: 2023, avg_score: 108.2 }),
    createMockSeason(),
    createMockSeason({ season: 2026, avg_score: null, champion: null, has_results: false }),
  ];

  it('skips the season that has not been played', () => {
    const { queryByText, getByText } = render(<ScoringTrendChart seasons={seasons} />);
    expect(getByText('2024')).toBeInTheDocument();
    expect(queryByText('2026')).toBeNull();
  });

  it('annotates the latest value on the line', () => {
    const { getByText } = render(<ScoringTrendChart seasons={seasons} />);
    expect(getByText('112.4')).toBeInTheDocument();
  });

  it('names the champion in the tooltip, or dashes it when there is none yet', () => {
    const { container, getByRole } = render(<ScoringTrendChart seasons={seasons} />);
    const hits = container.querySelectorAll('rect[aria-label]');
    fireEvent.pointerMove(hits[1], { clientX: 5, clientY: 5 });
    expect(getByRole('status')).toHaveTextContent('Jason B.');
  });

  it('dashes a missing champion in the tooltip', () => {
    const { container, getByRole } = render(
      <ScoringTrendChart
        seasons={[createMockSeason({ champion: null }), createMockSeason({ season: 2025, avg_score: 115 })]}
      />,
    );
    const hit = container.querySelector('rect[aria-label]');
    if (!hit) throw new Error('expected a hit target');
    fireEvent.pointerMove(hit, { clientX: 5, clientY: 5 });
    expect(getByRole('status')).toHaveTextContent('—');
  });
});
