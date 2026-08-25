'use client';

import { pct, signed } from '@/lib/fantasy/format';
import type { LuckRow } from '@/lib/fantasy/record-book';
import ChartTooltip, { useChartTooltip } from './chart-tooltip';
import styles from './record-book.module.css';

const W = 760;
const H = 470;
const M = { top: 16, right: 30, bottom: 46, left: 54 };
const LABEL_GAP = 12;

type Placement = { readonly row: LuckRow; readonly side: 1 | -1; readonly lx: number; readonly ly: number };

// Push overlapping labels down a lane until each clears the one above it. Runs per
// side so a left-hand label never shoves a right-hand one out of position.
const declutter = (lane: readonly Placement[]): readonly Placement[] => {
  const sorted = [...lane].sort((a, b) => a.ly - b.ly);
  return sorted.map((item, index) => ({
    ...item,
    ly: Math.max(...sorted.slice(0, index + 1).map((earlier, j) => earlier.ly + (index - j) * LABEL_GAP)),
  }));
};

const truncate = (name: string, limit: number) => (name.length > limit ? `${name.slice(0, limit - 1)}…` : name);

const LuckScatterChart = ({ rows }: { readonly rows: readonly LuckRow[] }) => {
  const { tooltip, show, hide } = useChartTooltip();

  const values = rows.flatMap((row) => [row.deserved_pct, row.actual_pct]);
  const lo = Math.min(...values) - 0.02;
  const hi = Math.max(...values) + 0.02;
  const x = (value: number) => M.left + ((value - lo) / (hi - lo)) * (W - M.left - M.right);
  const y = (value: number) => H - M.bottom - ((value - lo) / (hi - lo)) * (H - M.top - M.bottom);

  const firstTick = Math.ceil(lo * 20) / 20;
  const ticks = Array.from({ length: Math.floor((hi - firstTick) / 0.05) + 1 }, (_, index) =>
    Number((firstTick + index * 0.05).toFixed(2)),
  );

  // The cluster sits top-right, so a label always drawn to the right of its dot runs
  // into the next dot. Points past the midpoint get their label on the left instead.
  const midX = (M.left + W - M.right) / 2;
  const placements = rows.map((row): Placement => {
    const px = x(row.deserved_pct);
    const side = px <= midX ? 1 : -1;
    return { row, side, lx: px + side * 11, ly: y(row.actual_pct) + 3.5 };
  });
  const placed = [
    ...declutter(placements.filter((p) => p.side === 1)),
    ...declutter(placements.filter((p) => p.side === -1)),
  ];

  const parityAnchor = lo + (hi - lo) * 0.17;
  const midY = (M.top + H - M.bottom) / 2;

  const tooltipRows = (row: LuckRow) =>
    [
      ['actual', pct(row.actual_pct)],
      ['deserved', pct(row.deserved_pct)],
      ['wins', `${row.actual_wins} of ${row.games}`],
      ['luck', `${signed(row.luck_wins)} wins`],
      ['seasons', String(row.seasons)],
    ] as const;

  return (
    <>
      <svg
        className={styles.chart}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Actual win rate against deserved win rate, by manager"
      >
        {ticks.map((tick) => (
          <g key={tick}>
            <line className={styles.gridline} x1={M.left} x2={W - M.right} y1={y(tick)} y2={y(tick)} />
            <line className={styles.gridline} y1={M.top} y2={H - M.bottom} x1={x(tick)} x2={x(tick)} />
            <text className={styles.tickLabel} x={M.left - 8} y={y(tick) + 3.5} textAnchor="end">
              {pct(tick)}
            </text>
            <text className={styles.tickLabel} x={x(tick)} y={H - M.bottom + 15} textAnchor="middle">
              {pct(tick)}
            </text>
          </g>
        ))}
        <line className={styles.axisline} x1={M.left} x2={W - M.right} y1={H - M.bottom} y2={H - M.bottom} />
        <line className={styles.axisline} x1={M.left} x2={M.left} y1={M.top} y2={H - M.bottom} />
        {/* Parity line: actual == deserved. Annotated low on the line, where the plot
            is empty, rather than top-right where the cluster sits. */}
        <line className={styles.refline} x1={x(lo)} y1={y(lo)} x2={x(hi)} y2={y(hi)} opacity="0.9" />
        <text className={styles.pointLabel} x={x(parityAnchor) + 10} y={y(parityAnchor) - 8}>
          won what they deserved
        </text>
        <text className={styles.axisTitle} x={(M.left + W - M.right) / 2} y={H - 6} textAnchor="middle">
          deserved (all-play)
        </text>
        <text className={styles.axisTitle} x={12} y={midY} textAnchor="middle" transform={`rotate(-90 12 ${midY})`}>
          actual win rate
        </text>
        {placed.map(({ row, side, lx, ly }) => (
          <g key={row.manager}>
            <circle
              className={styles.hit}
              cx={x(row.deserved_pct)}
              cy={y(row.actual_pct)}
              r={14}
              aria-label={`${row.manager}: actual ${pct(row.actual_pct)}, deserved ${pct(row.deserved_pct)}`}
              onPointerMove={(event) => show(event, row.manager, tooltipRows(row))}
              onPointerLeave={hide}
            />
            <circle
              className={styles.dot}
              cx={x(row.deserved_pct)}
              cy={y(row.actual_pct)}
              r={5.5}
              fill={row.luck_wins >= 0 ? 'var(--rb-pos)' : 'var(--rb-neg)'}
            />
            <text className={styles.pointLabel} x={lx} y={ly} textAnchor={side === 1 ? 'start' : 'end'}>
              {truncate(row.manager, 15)}
            </text>
          </g>
        ))}
      </svg>
      <div className={styles.legend}>
        <span>
          <i style={{ background: 'var(--rb-pos)' }} />
          <span>won more than deserved</span>
        </span>
        <span>
          <i style={{ background: 'var(--rb-neg)' }} />
          <span>won less than deserved</span>
        </span>
      </div>
      <ChartTooltip tooltip={tooltip} />
    </>
  );
};

export default LuckScatterChart;
