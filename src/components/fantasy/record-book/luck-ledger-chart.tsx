'use client';

import { num, signed } from '@/lib/fantasy/format';
import type { LuckRow } from '@/lib/fantasy/record-book';
import ChartTooltip, { useChartTooltip } from './chart-tooltip';
import styles from './record-book.module.css';

const W = 760;
const ROW_HEIGHT = 24;
const M = { top: 26, right: 44, bottom: 30, left: 132 };
const GRIDLINES = [-8, -4, 0, 4, 8];

const LuckLedgerChart = ({ rows }: { readonly rows: readonly LuckRow[] }) => {
  const { tooltip, show, hide } = useChartTooltip();

  const ordered = [...rows].sort((a, b) => b.luck_wins - a.luck_wins);
  const H = M.top + ordered.length * ROW_HEIGHT + M.bottom;
  // Headroom so the longest bar's value label still lands inside the plot.
  const max = Math.max(...ordered.map((row) => Math.abs(row.luck_wins))) * 1.12;
  const half = (W - M.left - M.right) / 2;
  const zero = M.left + half;
  const width = (value: number) => (value / max) * half;

  const tooltipRows = (row: LuckRow) =>
    [
      ['luck', `${signed(row.luck_wins)} wins`],
      ['actual', `${row.actual_wins} of ${row.games}`],
      ['deserved', num(row.expected_wins, 1)],
      ['per season', signed(row.luck_per_season, 2)],
    ] as const;

  return (
    <>
      <svg
        className={styles.chart}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Wins above or below deserved, by manager"
      >
        {GRIDLINES.filter((tick) => Math.abs(tick) <= max).map((tick) => {
          const gx = zero + width(tick);
          return (
            <g key={tick}>
              <line
                className={tick === 0 ? styles.axisline : styles.gridline}
                x1={gx}
                x2={gx}
                y1={M.top - 8}
                y2={H - M.bottom}
              />
              <text className={styles.tickLabel} x={gx} y={M.top - 13} textAnchor="middle">
                {signed(tick, 0)}
              </text>
            </g>
          );
        })}
        <text className={styles.axisTitle} x={zero} y={H - 8} textAnchor="middle">
          wins above / below deserved
        </text>
        {ordered.map((row, index) => {
          const cy = M.top + index * ROW_HEIGHT + ROW_HEIGHT / 2;
          const barWidth = Math.abs(width(row.luck_wins));
          const positive = row.luck_wins >= 0;
          const bx = positive ? zero + 1 : zero - barWidth - 1;
          return (
            <g key={row.manager}>
              <rect
                x={bx}
                y={cy - 6.5}
                width={Math.max(barWidth, 1.5)}
                height={13}
                rx={3}
                fill={positive ? 'var(--rb-pos)' : 'var(--rb-neg)'}
              />
              <text className={styles.pointLabel} x={M.left - 10} y={cy + 3.5} textAnchor="end">
                {row.manager.length > 17 ? `${row.manager.slice(0, 16)}…` : row.manager}
              </text>
              <text
                className={styles.tickLabel}
                x={positive ? bx + barWidth + 6 : bx - 6}
                y={cy + 3.5}
                textAnchor={positive ? 'start' : 'end'}
              >
                {signed(row.luck_wins)}
              </text>
              <rect
                className={styles.hit}
                x={M.left}
                y={cy - ROW_HEIGHT / 2}
                width={W - M.left - M.right}
                height={ROW_HEIGHT}
                aria-label={`${row.manager}: ${signed(row.luck_wins)} wins versus deserved`}
                onPointerMove={(event) => show(event, row.manager, tooltipRows(row))}
                onPointerLeave={hide}
              />
            </g>
          );
        })}
      </svg>
      <ChartTooltip tooltip={tooltip} />
    </>
  );
};

export default LuckLedgerChart;
