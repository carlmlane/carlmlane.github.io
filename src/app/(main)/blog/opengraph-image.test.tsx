import { describe, expect, it, vi } from 'vitest';

vi.mock('next/og', () => ({
  ImageResponse: class MockImageResponse {
    constructor(
      public element: React.ReactNode,
      public options: Record<string, unknown>,
    ) {}
  },
}));

const { default: OgImage, dynamic, alt, size, contentType } = await import('./opengraph-image');

describe('opengraph-image exports', () => {
  it('exports dynamic as force-static', () => {
    expect(dynamic).toBe('force-static');
  });

  it('exports correct alt text', () => {
    expect(alt).toBe('Blog — Carl M. Lane');
  });

  it('exports correct size', () => {
    expect(size).toEqual({ width: 1200, height: 630 });
  });

  it('exports correct contentType', () => {
    expect(contentType).toBe('image/png');
  });
});

describe('OgImage', () => {
  it('returns an ImageResponse instance', () => {
    const result = OgImage();
    expect(result).toBeDefined();
    expect(result.constructor.name).toBe('MockImageResponse');
  });

  it('passes size to ImageResponse options', () => {
    const result = OgImage() as unknown as { options: Record<string, unknown> };
    expect(result.options).toMatchObject({ width: 1200, height: 630 });
  });
});
