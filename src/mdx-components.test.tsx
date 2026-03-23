import { describe, expect, it } from 'vitest';
import { useMDXComponents } from './mdx-components';

describe('useMDXComponents', () => {
  it('returns components including base components', () => {
    const base = { p: () => null };
    const result = useMDXComponents(base);
    expect(result.p).toBeDefined();
  });

  it('returns blog mdx components', () => {
    const result = useMDXComponents({});
    expect(Object.keys(result).length).toBeGreaterThan(0);
  });
});
