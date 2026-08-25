import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RailNav from './rail-nav';

afterEach(cleanup);

const items = [
  { id: 'luck', label: 'Skill and luck' },
  { id: 'record', label: 'Record book' },
];

type ObserverCallback = (entries: readonly Pick<IntersectionObserverEntry, 'isIntersecting' | 'target'>[]) => void;

/** Replaces the global stub with one that captures the callback so a section can be "scrolled" into view. */
const captureObserver = () => {
  const captured = { fire: (() => {}) as ObserverCallback, observed: [] as Element[], disconnected: 0 };
  globalThis.IntersectionObserver = vi.fn(function (this: IntersectionObserver, callback: ObserverCallback) {
    captured.fire = callback;
    return {
      observe: (element: Element) => captured.observed.push(element),
      unobserve: vi.fn(),
      disconnect: () => {
        captured.disconnected += 1;
      },
    };
  }) as unknown as typeof IntersectionObserver;
  return captured;
};

describe('RailNav', () => {
  beforeEach(() => {
    document.body.innerHTML = '<section id="luck"></section><section id="record"></section>';
  });

  it('renders one labelled link per section', () => {
    const { getByRole } = render(<RailNav items={items} />);
    expect(getByRole('navigation')).toHaveAttribute('aria-label', 'Record book sections');
    expect(getByRole('link', { name: 'Skill and luck' })).toHaveAttribute('href', '#luck');
    expect(getByRole('link', { name: 'Record book' })).toHaveAttribute('href', '#record');
  });

  it('observes only the sections that exist on the page', () => {
    const observer = captureObserver();
    render(<RailNav items={[...items, { id: 'nope', label: 'Missing' }]} />);
    expect(observer.observed).toHaveLength(2);
  });

  it('marks the intersecting section as current', () => {
    const observer = captureObserver();
    const { getByRole } = render(<RailNav items={items} />);
    expect(getByRole('link', { name: 'Record book' })).not.toHaveAttribute('aria-current');

    const section = document.getElementById('record');
    if (section) act(() => observer.fire([{ isIntersecting: true, target: section }]));
    expect(getByRole('link', { name: 'Record book' })).toHaveAttribute('aria-current', 'true');
    expect(getByRole('link', { name: 'Skill and luck' })).not.toHaveAttribute('aria-current');
  });

  it('ignores sections that scrolled out of the spy band', () => {
    const observer = captureObserver();
    const { getByRole } = render(<RailNav items={items} />);
    const luck = document.getElementById('luck');
    if (luck) act(() => observer.fire([{ isIntersecting: false, target: luck }]));
    expect(getByRole('link', { name: 'Skill and luck' })).not.toHaveAttribute('aria-current');
  });

  it('disconnects the observer on unmount', () => {
    const observer = captureObserver();
    render(<RailNav items={items} />).unmount();
    expect(observer.disconnected).toBe(1);
  });
});
