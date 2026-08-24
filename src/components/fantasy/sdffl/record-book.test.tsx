import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { recordBookView } from '@/lib/sdffl/record-book';
import SdfflRecordBook from './record-book';

afterEach(cleanup);

const renderBook = () => render(<SdfflRecordBook view={recordBookView} />);

describe('SdfflRecordBook', () => {
  it('leads with the league name, span and scale', () => {
    const { getByRole, getByText } = renderBook();
    expect(getByRole('heading', { level: 1 })).toHaveTextContent('SD FFL Record Book');
    expect(getByText('2013–2026 · 23 managers · 14 seasons')).toBeInTheDocument();
    expect(getByText(/450,709 stat rows behind it/)).toBeInTheDocument();
  });

  it('tiles the headline totals', () => {
    const { getByText, queryByText } = renderBook();
    expect(getByText('2,562')).toBeInTheDocument();
    expect(getByText('33,135')).toBeInTheDocument();
    expect(queryByText('Record check')).toBeNull();
  });

  it('renders every rail section as a linkable heading', () => {
    const { getByRole, container } = renderBook();
    const labels = [
      'Record book',
      'Every season',
      'Head to head',
      'Skill and luck',
      'The draft',
      'Roster work',
      'Scoring',
      'Extremes',
      'Season by season',
    ];
    for (const label of labels) {
      const link = getByRole('link', { name: label });
      const id = link.getAttribute('href')?.slice(1);
      expect(container.querySelector(`section#${id}`)).not.toBeNull();
    }
  });

  it('orders the sections the way the rail lists them, with skill and luck after head to head', () => {
    const { container } = renderBook();
    const ids = [...container.querySelectorAll('main > section')].map((section) => section.id);
    expect(ids).toEqual(['record', 'podium', 'h2h', 'luck', 'draft', 'roster', 'scoring', 'records', 'seasons']);
  });

  it('counts the matrix managers in its own copy rather than hard-coding the number', () => {
    const { getByText } = renderBook();
    expect(
      getByText(new RegExp(`Matrix shows the ${recordBookView.matrixManagers.length} franchises`)),
    ).toBeInTheDocument();
  });

  it('derives the draft-slot verdict from the data', () => {
    const { getByText } = renderBook();
    expect(getByText(/Historically slot 6/)).toBeInTheDocument();
    expect(getByText(/No slot is reliably better\./)).toBeInTheDocument();
  });

  it('closes with the generated stamp and no provenance blurb', () => {
    const { getByText, queryByText } = renderBook();
    expect(queryByText(/Extracted with/)).toBeNull();
    expect(getByText(`Generated ${recordBookView.generatedAt} · league SD FFL`)).toBeInTheDocument();
  });

  it('badges the title holders in the all-time record and dashes everyone else', () => {
    const { container } = renderBook();
    const rows = [...(container.querySelectorAll<HTMLTableRowElement>('#record tbody tr') ?? [])];
    const badged = rows.map((row) => row.cells[11].textContent);
    const expected = [...recordBookView.allTime].sort((a, b) => b.titles - a.titles);
    expect(badged).toEqual(expected.map((row) => (row.titles > 0 ? String(row.titles) : '—')));
    expect(badged[0]).toBe('4');
  });

  it('marks the unplayed season as in progress', () => {
    const { getByText } = renderBook();
    expect(getByText('in progress')).toBeInTheDocument();
  });

  it('lets a card swap between its chart and its table', () => {
    const { getAllByRole, container } = renderBook();
    const tableButtons = getAllByRole('button', { name: 'Table' });
    expect(container.querySelectorAll('svg[role="img"]').length).toBeGreaterThan(0);
    fireEvent.click(tableButtons[0]);
    expect(tableButtons[0]).toHaveAttribute('aria-pressed', 'true');
  });

  it('offers the steals table with and without quarterbacks', () => {
    const { getByRole } = renderBook();
    expect(getByRole('button', { name: 'Skill positions' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Including QBs' })).toBeInTheDocument();
  });
});
