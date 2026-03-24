import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import FormattedDate from './formatted-date';

afterEach(cleanup);

describe('FormattedDate', () => {
  it('renders a time element with dateTime attribute', () => {
    const { container } = render(<FormattedDate dateStr="2026-03-22" />);
    const time = container.querySelector('time');
    expect(time).toBeInTheDocument();
    expect(time).toHaveAttribute('datetime', '2026-03-22');
  });

  it('applies className to the time element', () => {
    const { container } = render(<FormattedDate dateStr="2026-03-22" className="text-muted" />);
    const time = container.querySelector('time');
    expect(time).toHaveClass('text-muted');
  });

  it('renders date text content', () => {
    const { container } = render(<FormattedDate dateStr="2026-03-22" />);
    const time = container.querySelector('time');
    expect(time?.textContent).toBeTruthy();
    expect(time?.textContent).toContain('2026');
    expect(time?.textContent).toContain('22');
  });

  it('has suppressHydrationWarning', () => {
    const { container } = render(<FormattedDate dateStr="2026-03-22" />);
    const time = container.querySelector('time');
    expect(time).toBeInTheDocument();
  });
});
