import { describe, expect, it } from 'vitest';
import robots from './robots';

describe('robots', () => {
  it('allows all user agents', () => {
    const result = robots();
    expect(result.rules).toEqual({ userAgent: '*', allow: '/', disallow: ['/new-tab/'] });
  });

  it('includes sitemap URL', () => {
    const result = robots();
    expect(result.sitemap).toBe('https://carlmlane.com/sitemap.xml');
  });
});
