'use client';

import { num } from '@/lib/fantasy/format';
import type { DraftRoundRow } from '@/lib/fantasy/record-book';
import ChartTooltip, { useChartTooltip } from './chart-tooltip';
import styles from './record-book.module.css';

const W = 760;
const H = 330;
const M = { top: 18, right: 22, bottom: 46, left: 52 };

const SERIES = [
  { key: 'avg_starter_points', label: 'mean', color: 'var(--rb-series-1)' },
  { key: 'median_starter_points', label: 'median', color: 'var(--rb-series-2)' },
] as const;

const seriesValue = (row: DraftRoundRow, key: (typeof SERIES)[number]['key']) =>
  key === 'avg_starter_points' ? row.avg_starter_points : row.median_starter_points;

const DraftRoundsChart = ({ rows }: { readonly rows: readonly DraftRoundRow[] }) => {
  const { tooltip, show, hide } = useChartTooltip();

  const maxY = Math.max(...rows.map((row) => row.avg_starter_points)) * 1.1;
  const x = (round: number) => M.left + ((round - 1) / (rows.length - 1)) * (W - M.left - M.right);
  const y = (value: number) => H - M.bottom - (value / maxY) * (H - M.top - M.bottom);
  const ticks = Array.from({ length: Math.floor(maxY / 50) + 1 }, (_, index) => index * 50);
  const midY = (M.top + H - M.bottom) / 2;
  const last = rows[rows.length - 1];

  const tooltipRows = (row: DraftRoundRow) =>
    [
      ['mean', num(row.avg_starter_points)],
      ['median', num(row.median_starter_points)],
      ['avg starts', num(row.avg_starts)],
      ['picks', String(row.picks)],
    ] as const;

  return (
    <>
      <svg
        className={styles.chart}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Mean and median starter points returned by draft round"
      >
        {ticks.map((tick) => (
          <g key={tick}>
            <line className={styles.gridline} x1={M.left} x2={W - M.right} y1={y(tick)} y2={y(tick)} />
            <text className={styles.tickLabel} x={M.left - 8} y={y(tick) + 3.5} textAnchor="end">
              {tick}
            </text>
          </g>
        ))}
        <line className={styles.axisline} x1={M.left} x2={W - M.right} y1={H - M.bottom} y2={H - M.bottom} />
        {rows.map((row) => (
          <text key={row.round} className={styles.tickLabel} x={x(row.round)} y={H - M.bottom + 15} textAnchor="middle">
            {row.round}
          </text>
        ))}
        <text className={styles.axisTitle} x={(M.left + W - M.right) / 2} y={H - 8} textAnchor="middle">
          round
        </text>
        <text className={styles.axisTitle} x={12} y={midY} textAnchor="middle" transform={`rotate(-90 12 ${midY})`}>
          starter points
        </text>
        {SERIES.map((series) => (
          <g key={series.key}>
            <path
              className={styles.seriesLine}
              stroke={series.color}
              d={rows
                .map((row, index) => `${index ? 'L' : 'M'}${x(row.round)},${y(seriesValue(row, series.key))}`)
                .join(' ')}
            />
            {rows.map((row) => (
              <circle
                key={row.round}
                className={styles.dot}
                cx={x(row.round)}
                cy={y(seriesValue(row, series.key))}
                r={4}
                fill={series.color}
              />
            ))}
            <text
              className={styles.pointLabel}
              x={x(last.round) - 2}
              y={y(seriesValue(last, series.key)) - 10}
              textAnchor="end"
              fill={series.color}
            >
              {series.label}
            </text>
          </g>
        ))}
        {rows.map((row) => (
          <rect
            key={row.round}
            className={styles.hit}
            x={x(row.round) - 12}
            y={M.top}
            width={24}
            height={H - M.top - M.bottom}
            aria-label={`Round ${row.round}: mean ${num(row.avg_starter_points)}, median ${num(row.median_starter_points)}`}
            onPointerMove={(event) => show(event, `Round ${row.round}`, tooltipRows(row))}
            onPointerLeave={hide}
          />
        ))}
      </svg>
      <div className={styles.legend}>
        {SERIES.map((series) => (
          <span key={series.key}>
            <i style={{ background: series.color }} />
            <span>{series.label}</span>
          </span>
        ))}
      </div>
      <ChartTooltip tooltip={tooltip} />
    </>
  );
};

export default DraftRoundsChart;
