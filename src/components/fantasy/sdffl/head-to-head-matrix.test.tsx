import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { HeadToHeadRow } from '@/lib/sdffl/record-book';
import HeadToHeadMatrix from './head-to-head-matrix';

afterEach(cleanup);

const createMockPair = (overrides: Partial<HeadToHeadRow> = {}): HeadToHeadRow => ({
  manager: 'Nick T.',
  opponent: 'Joshua H.',
  games: 22,
  wins: 17,
  losses: 5,
  ties: 0,
  win_pct: 0.773,
  avg_margin: 18.61,
  ...overrides,
});

const managers = ['Nick T.', 'Joshua H.', 'Carl L.'];
const pairs: readonly HeadToHeadRow[] = [
  createMockPair(),
  createMockPair({
    manager: 'Joshua H.',
    opponent: 'Nick T.',
    wins: 5,
    losses: 17,
    win_pct: 0.227,
    avg_margin: -18.61,
  }),
];

describe('HeadToHeadMatrix', () => {
  it('renders a row and column header per manager', () => {
    const { getAllByRole } = render(<HeadToHeadMatrix managers={managers} pairs={pairs} />);
    const columnHeads = getAllByRole('columnheader');
    expect(columnHeads.map((th) => th.getAttribute('title'))).toEqual([null, ...managers]);
    expect(getAllByRole('rowheader')).toHaveLength(3);
  });

  it('shows the record for a pairing it has data for', () => {
    const { getByTitle } = render(<HeadToHeadMatrix managers={managers} pairs={pairs} />);
    expect(getByTitle('Nick T. vs Joshua H.: 17-5')).toHaveTextContent('17-5');
  });

  it('leaves the diagonal blank and dots the pairings that never met', () => {
    const { container } = render(<HeadToHeadMatrix managers={managers} pairs={pairs} />);
    const firstRowCells = [...(container.querySelectorAll('tbody tr')[0]?.querySelectorAll('td') ?? [])];
    expect(firstRowCells[0]).toBeEmptyDOMElement();
    expect(firstRowCells[2]).toHaveTextContent('·');
  });

  // happy-dom drops the `color-mix()` background, so the assertion is on the text colour
  // that pairs with it: a saturated cell needs dark type, a near-neutral one keeps the muted token.
  it('darkens the type on lopsided cells and leaves even ones muted', () => {
    const even = createMockPair({ manager: 'A', opponent: 'B', wins: 6, losses: 6, win_pct: 0.5, avg_margin: 0 });
    const { getByTitle } = render(
      <HeadToHeadMatrix managers={['A', 'B', 'Nick T.', 'Joshua H.']} pairs={[...pairs, even]} />,
    );
    expect(getByTitle('Nick T. vs Joshua H.: 17-5')).toHaveStyle({ color: '#0a0a0a' });
    expect(getByTitle('Joshua H. vs Nick T.: 5-17')).toHaveStyle({ color: '#0a0a0a' });
    expect(getByTitle('A vs B: 6-6').getAttribute('style')).toContain('var(--rb-ink-2)');
  });

  it('opens a tooltip with the full record on hover and closes it on leave', () => {
    const { getByTitle, queryByRole, getByRole } = render(<HeadToHeadMatrix managers={managers} pairs={pairs} />);
    const cell = getByTitle('Nick T. vs Joshua H.: 17-5');
    expect(queryByRole('status')).toBeNull();
    fireEvent.pointerMove(cell, { clientX: 10, clientY: 10 });
    expect(getByRole('status')).toHaveTextContent('.773');
    expect(getByRole('status')).toHaveTextContent('+18.61');
    fireEvent.pointerLeave(cell);
    expect(queryByRole('status')).toBeNull();
  });

  it('includes ties in the tooltip record only when there are any', () => {
    const { getByTitle, getByRole } = render(
      <HeadToHeadMatrix managers={['A', 'B']} pairs={[createMockPair({ manager: 'A', opponent: 'B', ties: 1 })]} />,
    );
    fireEvent.pointerMove(getByTitle('A vs B: 17-5'), { clientX: 5, clientY: 5 });
    expect(getByRole('status')).toHaveTextContent('17-5-1');
  });

  it('labels the colour ramp', () => {
    const { getByText } = render(<HeadToHeadMatrix managers={managers} pairs={pairs} />);
    expect(getByText('loses')).toBeInTheDocument();
    expect(getByText('wins')).toBeInTheDocument();
  });
});
