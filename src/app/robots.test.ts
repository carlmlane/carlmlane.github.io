import { describe, expect, it } from 'vitest';
import robots from './robots';

describe('robots', () => {
  it('allows all user agents', () => {
    const result = robots();
    expect(result.rules).toEqual({ userAgent: '*', allow: '/', disallow: ['/new-tab/', '/fantasy/'] });
  });

  it('keeps the private fantasy league pages out of crawlers', () => {
    expect(robots().rules).toMatchObject({ disallow: expect.arrayContaining(['/fantasy/']) });
  });

  it('includes sitemap URL', () => {
    const result = robots();
    expect(result.sitemap).toBe('https://carlmlane.com/sitemap.xml');
  });
});
