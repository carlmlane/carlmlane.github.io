import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { recordBookView as fourYardPumaView } from '@/lib/4yp/record-book';
import { recordBookView as sdfflView } from '@/lib/sdffl/record-book';
import { fourYardPumaCopy } from './leagues/4yp';
import { sdfflCopy } from './leagues/sdffl';
import RecordBook from './record-book';

afterEach(cleanup);

const SECTION_IDS = ['record', 'podium', 'h2h', 'luck', 'draft', 'roster', 'scoring', 'records', 'seasons'];

const RAIL_LABELS = [
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

const renderSdffl = () => render(<RecordBook view={sdfflView} copy={sdfflCopy} />);
const renderFourYardPuma = () => render(<RecordBook view={fourYardPumaView} copy={fourYardPumaCopy} />);

// The layout is the same for every league; only the numbers and the prose change.
describe.each([
  ['SD FFL', renderSdffl, sdfflView],
  ['Four Yard Puma', renderFourYardPuma, fourYardPumaView],
] as const)('RecordBook shell (%s)', (leagueName, renderBook, view) => {
  it('leads with the league name, span and scale', () => {
    const { getByRole, getByText } = renderBook();
    expect(getByRole('heading', { level: 1 })).toHaveTextContent(`${leagueName} Record Book`);
    expect(
      getByText(
        `${view.totals.first_season}–${view.totals.last_season} · ${view.totals.franchises} managers · ${view.totals.seasons} seasons`,
      ),
    ).toBeInTheDocument();
  });

  it('renders every rail section as a linkable heading', () => {
    const { getByRole, container } = renderBook();
    for (const label of RAIL_LABELS) {
      const link = getByRole('link', { name: label });
      const id = link.getAttribute('href')?.slice(1);
      expect(container.querySelector(`section#${id}`)).not.toBeNull();
    }
  });

  it('orders the sections the way the rail lists them, with skill and luck after head to head', () => {
    const { container } = renderBook();
    const ids = [...container.querySelectorAll('main > section')].map((section) => section.id);
    expect(ids).toEqual(SECTION_IDS);
  });

  it('counts the matrix managers in its own copy rather than hard-coding the number', () => {
    const { getByText } = renderBook();
    expect(getByText(new RegExp(`Matrix shows the ${view.matrixManagers.length} franchises`))).toBeInTheDocument();
  });

  it('derives the draft-slot verdict from the data and refuses to call any slot better', () => {
    const { getByText } = renderBook();
    expect(getByText(/No slot is reliably better\./)).toBeInTheDocument();
  });

  it('closes with the generated stamp and no provenance blurb', () => {
    const { getByText, queryByText } = renderBook();
    expect(queryByText(/Extracted with/)).toBeNull();
    expect(getByText(`Generated ${view.generatedAt} · league ${leagueName}`)).toBeInTheDocument();
  });

  it('badges the title holders in the all-time record and dashes everyone else', () => {
    const { container } = renderBook();
    const rows = [...container.querySelectorAll<HTMLTableRowElement>('#record tbody tr')];
    const badged = rows.map((row) => row.cells[11].textContent);
    const expected = [...view.allTime].sort((a, b) => b.titles - a.titles);
    expect(badged).toEqual(expected.map((row) => (row.titles > 0 ? String(row.titles) : '—')));
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

describe('RecordBook league copy', () => {
  it('tiles the SD FFL headline totals', () => {
    const { getByText, queryByText } = renderSdffl();
    expect(getByText(/450,709 stat rows behind it/)).toBeInTheDocument();
    expect(getByText('2,562')).toBeInTheDocument();
    expect(getByText('33,135')).toBeInTheDocument();
    expect(queryByText('Record check')).toBeNull();
  });

  it('tiles the Four Yard Puma headline totals', () => {
    const { getByText } = renderFourYardPuma();
    expect(getByText(/370,175 stat rows behind it/)).toBeInTheDocument();
    expect(getByText('1,160')).toBeInTheDocument();
    expect(getByText('19,837')).toBeInTheDocument();
  });

  it('names the best draft slot each league actually had', () => {
    const { getByText: sdffl } = renderSdffl();
    expect(sdffl(/Historically slot 6/)).toBeInTheDocument();
    cleanup();
    const { getByText: fourYardPuma } = renderFourYardPuma();
    expect(fourYardPuma(/Slot 7/)).toBeInTheDocument();
  });

  it('warns that the Four Yard Puma hard-luck list mixes in two-week bracket totals', () => {
    const { getByText } = renderFourYardPuma();
    expect(getByText(/10 of these 15 lines are two-week totals/)).toBeInTheDocument();
  });
});

describe('RecordBook positional table', () => {
  it('renders it for the league whose export carries one', () => {
    const { container } = renderFourYardPuma();
    const headers = [...container.querySelectorAll('#scoring th')].map((cell) => cell.textContent);
    expect(headers.some((text) => text?.startsWith('Edge'))).toBe(true);
  });

  it('leaves it out for the league whose export does not', () => {
    expect(sdfflView.positional).toBeUndefined();
    const { container } = renderSdffl();
    const headers = [...container.querySelectorAll('#scoring th')].map((cell) => cell.textContent);
    expect(headers.some((text) => text?.startsWith('Edge'))).toBe(false);
  });
});
