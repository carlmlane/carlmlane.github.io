import { cleanup, fireEvent, render, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import SortableTable, { type Column } from './sortable-table';

afterEach(cleanup);

type Row = { readonly name: string; readonly points: number; readonly rank: number | null };

const createMockRows = (): readonly Row[] => [
  { name: 'Beta', points: 10.25, rank: 2 },
  { name: 'Alpha', points: 30.5, rank: null },
  { name: 'Gamma', points: 20, rank: 1 },
];

const columns: readonly Column<Row>[] = [
  { key: 'name', label: 'Name', type: 'text', value: (row) => row.name },
  { key: 'points', label: 'Points', type: 'num', digits: 2, value: (row) => row.points },
  { key: 'rank', label: 'Rank', type: 'num', digits: 0, value: (row) => row.rank },
];

const renderTable = (props: Partial<Parameters<typeof SortableTable<Row>>[0]> = {}) =>
  render(<SortableTable columns={columns} rows={createMockRows()} rowKey={(row) => row.name} {...props} />);

const bodyRows = (container: HTMLElement) => [...container.querySelectorAll<HTMLTableRowElement>('tbody tr')];

const names = (container: HTMLElement) => bodyRows(container).map((row) => row.cells[0].textContent);

describe('SortableTable', () => {
  it('sorts by the first column descending when no sort is given', () => {
    const { container } = renderTable();
    expect(names(container)).toEqual(['Gamma', 'Beta', 'Alpha']);
  });

  it('honours an explicit initial sort key and direction', () => {
    const { container } = renderTable({ sortKey: 'points', sortDirection: 'asc' });
    expect(names(container)).toEqual(['Beta', 'Gamma', 'Alpha']);
  });

  it('falls back to the first column when the sort key names no column', () => {
    const { container } = renderTable({ sortKey: 'missing' });
    expect(names(container)).toEqual(['Gamma', 'Beta', 'Alpha']);
  });

  it('flips direction when the active column is clicked again', () => {
    const { container, getByRole } = renderTable({ sortKey: 'points' });
    expect(names(container)).toEqual(['Alpha', 'Gamma', 'Beta']);
    fireEvent.click(getByRole('button', { name: /Points/ }));
    expect(names(container)).toEqual(['Beta', 'Gamma', 'Alpha']);
  });

  it('starts numeric columns descending and text columns ascending', () => {
    const { container, getByRole } = renderTable({ sortKey: 'name' });
    fireEvent.click(getByRole('button', { name: /Points/ }));
    expect(names(container)).toEqual(['Alpha', 'Gamma', 'Beta']);
    fireEvent.click(getByRole('button', { name: /Name/ }));
    expect(names(container)).toEqual(['Alpha', 'Beta', 'Gamma']);
  });

  it('keeps missing values last in both directions', () => {
    const { container, getByRole } = renderTable({ sortKey: 'rank', sortDirection: 'asc' });
    expect(names(container)).toEqual(['Gamma', 'Beta', 'Alpha']);
    fireEvent.click(getByRole('button', { name: /Rank/ }));
    expect(names(container)).toEqual(['Beta', 'Gamma', 'Alpha']);
  });

  it('marks the sorted column with aria-sort and leaves the others none', () => {
    const { getAllByRole, getByRole } = renderTable({ sortKey: 'points', sortDirection: 'asc' });
    const sortStates = getAllByRole('columnheader').map((th) => th.getAttribute('aria-sort'));
    expect(sortStates).toEqual(['none', 'ascending', 'none']);
    fireEvent.click(getByRole('button', { name: /Points/ }));
    expect(getAllByRole('columnheader').map((th) => th.getAttribute('aria-sort'))).toEqual([
      'none',
      'descending',
      'none',
    ]);
  });

  it('formats numeric cells to the column precision and dashes the missing ones', () => {
    const { container } = renderTable({ sortKey: 'name', sortDirection: 'asc' });
    const rows = bodyRows(container);
    expect(within(rows[0]).getByText('30.50')).toBeInTheDocument();
    expect(within(rows[0]).getByText('—')).toBeInTheDocument();
    expect(within(rows[2]).getByText('20.00')).toBeInTheDocument();
  });

  it('defaults numeric precision to one decimal', () => {
    const { container } = render(
      <SortableTable
        columns={[{ key: 'points', label: 'Points', type: 'num', value: (row: Row) => row.points }]}
        rows={createMockRows()}
        rowKey={(row) => row.name}
      />,
    );
    expect(container.querySelector('tbody tr')?.textContent).toBe('30.5');
  });

  it('uses a custom renderer and row class when the column supplies them', () => {
    const { getByText, container } = render(
      <SortableTable
        columns={[
          {
            key: 'name',
            label: 'Name',
            type: 'text',
            value: (row: Row) => row.name,
            render: (row) => <b>{row.name.toUpperCase()}</b>,
            className: (row) => (row.points > 15 ? 'hot' : undefined),
          },
        ]}
        rows={createMockRows()}
        rowKey={(row) => row.name}
      />,
    );
    expect(getByText('ALPHA')).toBeInTheDocument();
    expect([...container.querySelectorAll('tbody td')].filter((td) => td.className.includes('hot'))).toHaveLength(2);
  });

  it('renders a caption when one is given and omits it otherwise', () => {
    const { container, rerender } = renderTable({ caption: 'Every franchise' });
    expect(container.querySelector('caption')?.textContent).toBe('Every franchise');
    rerender(<SortableTable columns={columns} rows={createMockRows()} rowKey={(row) => row.name} />);
    expect(container.querySelector('caption')).toBeNull();
  });

  it('renders an em dash for a missing text value', () => {
    const { getByText } = render(
      <SortableTable
        columns={[{ key: 'champion', label: 'Champion', type: 'text', value: () => null }]}
        rows={[{ name: 'Alpha', points: 1, rank: 1 }]}
        rowKey={(row) => row.name}
      />,
    );
    expect(getByText('—')).toBeInTheDocument();
  });
});
