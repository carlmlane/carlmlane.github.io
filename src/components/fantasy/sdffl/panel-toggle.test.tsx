import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import PanelToggle from './panel-toggle';

afterEach(cleanup);

const renderToggle = (footer?: React.ReactNode) =>
  render(
    <PanelToggle
      chartLabel="Chart"
      tableLabel="Table"
      head={<h3>Win rate</h3>}
      chart={<p>chart panel</p>}
      table={<p>table panel</p>}
      footer={footer}
    />,
  );

describe('PanelToggle', () => {
  it('starts on the chart with the chart button pressed', () => {
    const { getByRole } = renderToggle();
    expect(getByRole('button', { name: 'Chart' })).toHaveAttribute('aria-pressed', 'true');
    expect(getByRole('button', { name: 'Table' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('swaps which panel is hidden without unmounting either', () => {
    const { getByRole, getByText } = renderToggle();
    const chartPanel = getByText('chart panel').parentElement;
    const tablePanel = getByText('table panel').parentElement;
    const hiddenClassOf = (el: HTMLElement | null) => el?.className.split(' ').filter(Boolean).length ?? 0;

    expect(hiddenClassOf(tablePanel)).toBeGreaterThan(hiddenClassOf(chartPanel));
    fireEvent.click(getByRole('button', { name: 'Table' }));
    expect(getByRole('button', { name: 'Table' })).toHaveAttribute('aria-pressed', 'true');
    expect(getByText('chart panel')).toBeInTheDocument();
    expect(getByText('table panel')).toBeInTheDocument();
  });

  it('returns to the chart when the chart button is clicked back', () => {
    const { getByRole } = renderToggle();
    fireEvent.click(getByRole('button', { name: 'Table' }));
    fireEvent.click(getByRole('button', { name: 'Chart' }));
    expect(getByRole('button', { name: 'Chart' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders the card head and an optional footer', () => {
    const { getByText, queryByText, rerender } = renderToggle(<p>verdict</p>);
    expect(getByText('Win rate')).toBeInTheDocument();
    expect(getByText('verdict')).toBeInTheDocument();
    rerender(<PanelToggle chartLabel="Chart" tableLabel="Table" head={<h3>Win rate</h3>} chart={null} table={null} />);
    expect(queryByText('verdict')).toBeNull();
  });
});
