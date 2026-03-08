import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// IntersectionObserver is called with `new`, so the mock must be a constructor (not an arrow function)
const mockIntersectionObserver = vi.fn(function (this: IntersectionObserver) {
  return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
});

globalThis.IntersectionObserver = mockIntersectionObserver as unknown as typeof IntersectionObserver;

vi.mock('next/font/google', () => ({
  Geist: () => ({
    variable: '--font-geist-sans',
    className: 'mock-geist-sans',
  }),
  Geist_Mono: () => ({
    variable: '--font-geist-mono',
    className: 'mock-geist-mono',
  }),
}));
