import { cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import FadeIn from './fade-in';

afterEach(cleanup);

describe('FadeIn', () => {
  it('renders children', () => {
    const { getByText } = render(<FadeIn>Hello</FadeIn>);
    expect(getByText('Hello')).toBeInTheDocument();
  });

  it('starts with opacity-0 class', () => {
    const { getByText } = render(<FadeIn>Content</FadeIn>);
    const wrapper = getByText('Content').closest('div');
    expect(wrapper).toHaveClass('opacity-0');
    expect(wrapper?.className).not.toContain('animate-fade-in-up');
  });

  it('applies animate class when element intersects', async () => {
    const mockObserve = vi.fn();
    const mockUnobserve = vi.fn();
    const mockDisconnect = vi.fn();

    vi.stubGlobal(
      'IntersectionObserver',
      // biome-ignore lint/complexity/useArrowFunction: IntersectionObserver is called with `new` and requires a constructor
      vi.fn(function (callback: IntersectionObserverCallback) {
        setTimeout(() => callback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
        return { observe: mockObserve, unobserve: mockUnobserve, disconnect: mockDisconnect };
      }),
    );

    const { getByText } = render(<FadeIn>Animated</FadeIn>);
    const wrapper = getByText('Animated').closest('div');

    await waitFor(() => {
      expect(wrapper).toHaveClass('animate-fade-in-up');
      expect(wrapper?.className).not.toContain('opacity-0');
    });
  });

  it('applies custom delay as inline style', () => {
    const { getByText } = render(<FadeIn delay={300}>Delayed</FadeIn>);
    const wrapper = getByText('Delayed').closest('div');
    expect(wrapper).toHaveStyle({ animationDelay: '300ms' });
  });

  it('applies default delay of 0ms', () => {
    const { getByText } = render(<FadeIn>Default</FadeIn>);
    const wrapper = getByText('Default').closest('div');
    expect(wrapper).toHaveStyle({ animationDelay: '0ms' });
  });

  it('applies custom className', () => {
    const { getByText } = render(<FadeIn className="my-class">Styled</FadeIn>);
    const wrapper = getByText('Styled').closest('div');
    expect(wrapper).toHaveClass('my-class');
  });

  it('unobserves element after intersection', async () => {
    const mockUnobserve = vi.fn();

    vi.stubGlobal(
      'IntersectionObserver',
      // biome-ignore lint/complexity/useArrowFunction: IntersectionObserver is called with `new` and requires a constructor
      vi.fn(function (callback: IntersectionObserverCallback) {
        setTimeout(() => callback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
        return { observe: vi.fn(), unobserve: mockUnobserve, disconnect: vi.fn() };
      }),
    );

    render(<FadeIn>Observed</FadeIn>);

    await waitFor(() => {
      expect(mockUnobserve).toHaveBeenCalled();
    });
  });

  it('disconnects observer on unmount', () => {
    const mockDisconnect = vi.fn();

    vi.stubGlobal(
      'IntersectionObserver',
      // biome-ignore lint/complexity/useArrowFunction: IntersectionObserver is called with `new` and requires a constructor
      vi.fn(function () {
        return {
          observe: vi.fn(),
          unobserve: vi.fn(),
          disconnect: mockDisconnect,
        };
      }),
    );

    const { unmount } = render(<FadeIn>Cleanup</FadeIn>);
    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });
});
