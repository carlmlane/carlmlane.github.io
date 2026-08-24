import { act, cleanup, render, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import ChartTooltip, { useChartTooltip } from './chart-tooltip';

afterEach(cleanup);

const rows = [
  ['record', '17-5'],
  ['win rate', '.773'],
] as const;

describe('useChartTooltip', () => {
  it('starts closed', () => {
    const { result } = renderHook(() => useChartTooltip());
    expect(result.current.tooltip).toBeNull();
  });

  it('opens below and right of the pointer when there is room', () => {
    const { result } = renderHook(() => useChartTooltip());
    act(() => result.current.show({ clientX: 40, clientY: 40 }, 'Nick T.', rows));
    expect(result.current.tooltip).toMatchObject({ name: 'Nick T.', x: 40, y: 40, flipX: false, flipY: false });
  });

  it('flips away from the viewport edges', () => {
    const { result } = renderHook(() => useChartTooltip());
    act(() => result.current.show({ clientX: window.innerWidth - 10, clientY: window.innerHeight - 10 }, 'Edge', rows));
    expect(result.current.tooltip).toMatchObject({ flipX: true, flipY: true });
  });

  it('closes on hide', () => {
    const { result } = renderHook(() => useChartTooltip());
    act(() => result.current.show({ clientX: 10, clientY: 10 }, 'Nick T.', rows));
    act(() => result.current.hide());
    expect(result.current.tooltip).toBeNull();
  });

  it('dismisses itself when the page scrolls out from under it', () => {
    const { result } = renderHook(() => useChartTooltip());
    act(() => result.current.show({ clientX: 10, clientY: 10 }, 'Nick T.', rows));
    act(() => document.dispatchEvent(new Event('scroll')));
    expect(result.current.tooltip).toBeNull();
  });
});

describe('ChartTooltip', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<ChartTooltip tooltip={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the name and every row', () => {
    const { getByText, getByRole } = render(
      <ChartTooltip tooltip={{ name: 'Nick T.', rows, x: 10, y: 20, flipX: false, flipY: false }} />,
    );
    expect(getByRole('status')).toBeInTheDocument();
    expect(getByText('Nick T.')).toBeInTheDocument();
    expect(getByText('record')).toBeInTheDocument();
    expect(getByText('17-5')).toBeInTheDocument();
  });

  it('offsets and translates according to the flip flags', () => {
    const { getByRole, rerender } = render(
      <ChartTooltip tooltip={{ name: 'A', rows, x: 100, y: 200, flipX: false, flipY: false }} />,
    );
    expect(getByRole('status')).toHaveStyle({ left: '112px', top: '212px', transform: 'translate(0, 0)' });
    rerender(<ChartTooltip tooltip={{ name: 'A', rows, x: 100, y: 200, flipX: true, flipY: true }} />);
    expect(getByRole('status')).toHaveStyle({ left: '88px', top: '188px', transform: 'translate(-100%, -100%)' });
  });
});
