import { describe, expect, it } from 'vitest';
import manifest from './manifest';

describe('manifest', () => {
  const result = manifest();

  it('has app name', () => {
    expect(result.name).toBe('Carl M. Lane');
  });

  it('has short name', () => {
    expect(result.short_name).toBe('CML');
  });

  it('has maskable icons', () => {
    expect(result.icons).toHaveLength(2);
    expect(result.icons?.every((icon) => icon.purpose === 'maskable')).toBe(true);
  });

  it('uses standalone display', () => {
    expect(result.display).toBe('standalone');
  });
});
