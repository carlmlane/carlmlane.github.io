import { describe, expect, it } from 'vitest';
import { emDash, int, num, pct, signed } from './format';

describe('num', () => {
  it('formats to one decimal by default', () => {
    expect(num(12.345)).toBe('12.3');
  });

  it('honours an explicit precision', () => {
    expect(num(12.345, 2)).toBe('12.35');
    expect(num(12.5, 0)).toBe('13');
  });

  it('renders an em dash for missing values', () => {
    expect(num(null)).toBe(emDash);
    expect(num(undefined)).toBe(emDash);
  });

  it('keeps a zero rather than treating it as missing', () => {
    expect(num(0)).toBe('0.0');
  });
});

describe('int', () => {
  it('groups thousands', () => {
    expect(int(450709)).toBe('450,709');
  });

  it('renders an em dash for missing values', () => {
    expect(int(null)).toBe(emDash);
    expect(int(undefined)).toBe(emDash);
  });
});

describe('pct', () => {
  it('strips the leading zero from a win rate', () => {
    expect(pct(0.769)).toBe('.769');
    expect(pct(0.5)).toBe('.500');
  });

  it('keeps the digit for a rate of one', () => {
    expect(pct(1)).toBe('1.000');
  });

  it('renders an em dash for missing values', () => {
    expect(pct(null)).toBe(emDash);
    expect(pct(undefined)).toBe(emDash);
  });
});

describe('signed', () => {
  it('prefixes a plus on positive values only', () => {
    expect(signed(2.5)).toBe('+2.5');
    expect(signed(-2.5)).toBe('-2.5');
    expect(signed(0)).toBe('0.0');
  });

  it('honours an explicit precision', () => {
    expect(signed(9.8, 2)).toBe('+9.80');
    expect(signed(-4, 0)).toBe('-4');
  });

  it('renders an em dash for missing values', () => {
    expect(signed(null)).toBe(emDash);
    expect(signed(undefined)).toBe(emDash);
  });
});
