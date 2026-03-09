import { describe, expect, it } from 'vitest';
import sitemap from './sitemap';

describe('sitemap', () => {
  it('returns an array with the home page entry', () => {
    const result = sitemap();
    expect(result).toHaveLength(1);
    expect(result[0].url).toBe('https://carlmlane.com');
  });

  it('has monthly change frequency and priority 1', () => {
    const result = sitemap();
    expect(result[0].changeFrequency).toBe('monthly');
    expect(result[0].priority).toBe(1);
  });

  it('has a lastModified date', () => {
    const result = sitemap();
    expect(result[0].lastModified).toBeInstanceOf(Date);
  });
});
