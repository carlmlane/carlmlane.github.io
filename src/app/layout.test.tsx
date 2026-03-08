import { describe, expect, it } from 'vitest';
import { metadata } from './layout';

describe('metadata', () => {
  it('has correct title', () => {
    expect(metadata.title).toBe('Carl M. Lane — VP of Engineering');
  });

  it('has correct description', () => {
    expect(metadata.description).toContain('Engineering leader');
  });

  it('has openGraph configuration', () => {
    expect(metadata.openGraph).toBeDefined();
  });

  it('has twitter card configuration', () => {
    expect(metadata.twitter).toBeDefined();
  });

  it('allows indexing and following', () => {
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });
});
