// Formatters shared by every league record book. They mirror the numeric conventions
// of the source dashboard: an em dash for missing values, fixed decimals rather than
// locale rounding, and baseball-style win rates with the leading zero stripped.

const EM_DASH = '—';

// Pinned to en-US so the server render and the browser hydrate to the same string.
const groupedInteger = new Intl.NumberFormat('en-US');

export const num = (value: number | null | undefined, digits = 1): string =>
  value === null || value === undefined ? EM_DASH : value.toFixed(digits);

export const int = (value: number | null | undefined): string =>
  value === null || value === undefined ? EM_DASH : groupedInteger.format(value);

export const pct = (value: number | null | undefined): string =>
  value === null || value === undefined ? EM_DASH : value.toFixed(3).replace(/^0/, '');

export const signed = (value: number | null | undefined, digits = 1): string =>
  value === null || value === undefined ? EM_DASH : `${value > 0 ? '+' : ''}${value.toFixed(digits)}`;

export const emDash = EM_DASH;
