import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { Standing } from '@/lib/fantasy/record-book';
import SeasonStandings from './season-standings';

afterEach(cleanup);

const createMockStanding = (overrides: Partial<Standing> = {}): Standing => ({
  season: 2025,
  manager: 'Nick T.',
  wins: 9,
  losses: 4,
  points_for: 1400.5,
  final_standing: 1,
  playoff_seed: 2,
  is_champion: true,
  playoff_wins: 2,
  playoff_losses: 0,
  luck_wins: 1.25,
  ...overrides,
});

const standings: readonly Standing[] = [
  createMockStanding(),
  createMockStanding({ manager: 'Carl L.', final_standing: 4, luck_wins: -0.75, is_champion: false }),
  createMockStanding({ season: 2024, manager: 'Jason B.', final_standing: 1 }),
];

describe('SeasonStandings', () => {
  it('shows the most recent season first', () => {
    const { getByRole, getByText, queryByText } = render(
      <SeasonStandings seasons={[2025, 2024]} standings={standings} />,
    );
    expect(getByRole('combobox')).toHaveValue('2025');
    expect(getByText('Nick T.')).toBeInTheDocument();
    expect(queryByText('Jason B.')).toBeNull();
  });

  it('swaps the rows when another season is picked', () => {
    const { getByRole, getByText, queryByText } = render(
      <SeasonStandings seasons={[2025, 2024]} standings={standings} />,
    );
    fireEvent.change(getByRole('combobox'), { target: { value: '2024' } });
    expect(getByText('Jason B.')).toBeInTheDocument();
    expect(queryByText('Nick T.')).toBeNull();
  });

  it('badges the champion and signs the luck column', () => {
    const { getByText } = render(<SeasonStandings seasons={[2025]} standings={standings} />);
    expect(getByText('1st')).toBeInTheDocument();
    expect(getByText('+1.25')).toBeInTheDocument();
    expect(getByText('-0.75')).toBeInTheDocument();
  });

  it('orders by finish, with the title winner on top', () => {
    const { container } = render(<SeasonStandings seasons={[2025]} standings={standings} />);
    const rows = [...container.querySelectorAll<HTMLTableRowElement>('tbody tr')];
    const finishes = rows.map((row) => row.cells[1].textContent);
    expect(finishes).toEqual(['Nick T.', 'Carl L.']);
  });

  it('labels the season select for screen readers', () => {
    const { getByLabelText } = render(<SeasonStandings seasons={[2025]} standings={standings} />);
    expect(getByLabelText('Season')).toBeInTheDocument();
  });
});
