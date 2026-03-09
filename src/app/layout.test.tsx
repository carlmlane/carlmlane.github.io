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

  it('has keywords', () => {
    expect(metadata.keywords).toBeDefined();
    expect(Array.isArray(metadata.keywords)).toBe(true);
    expect((metadata.keywords as string[]).length).toBeGreaterThan(0);
  });

  it('has canonical URL', () => {
    expect(metadata.alternates?.canonical).toBe('https://carlmlane.com');
  });

  it('has author', () => {
    const authors = metadata.authors as Array<{ name: string; url: string }>;
    expect(authors).toBeDefined();
    expect(authors[0].name).toBe('Carl M. Lane');
    expect(authors[0].url).toBe('https://carlmlane.com');
  });

  it('has publisher', () => {
    expect(metadata.publisher).toBe('Carl M. Lane');
  });
});
