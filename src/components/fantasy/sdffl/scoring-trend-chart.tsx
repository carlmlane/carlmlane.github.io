'use client';

import { num } from '@/lib/sdffl/format';
import type { Season } from '@/lib/sdffl/record-book';
import ChartTooltip, { useChartTooltip } from './chart-tooltip';
import styles from './record-book.module.css';

const W = 760;
const H = 250;
const M = { top: 18, right: 22, bottom: 44, left: 52 };

type ScoredSeason = Season & { readonly avg_score: number };

const hasScore = (season: Season): season is ScoredSeason => season.avg_score !== null;

const ScoringTrendChart = ({ seasons }: { readonly seasons: readonly Season[] }) => {
  const { tooltip, show, hide } = useChartTooltip();

  const rows = seasons.filter(hasScore);
  const values = rows.map((row) => row.avg_score);
  const lo = Math.floor((Math.min(...values) - 6) / 5) * 5;
  const hi = Math.ceil((Math.max(...values) + 6) / 5) * 5;
  const x = (index: number) => M.left + (index / (rows.length - 1)) * (W - M.left - M.right);
  const y = (value: number) => H - M.bottom - ((value - lo) / (hi - lo)) * (H - M.top - M.bottom);
  const ticks = Array.from({ length: (hi - lo) / 5 + 1 }, (_, index) => lo + index * 5);
  const midY = (M.top + H - M.bottom) / 2;
  const last = rows[rows.length - 1];

  const tooltipRows = (row: ScoredSeason) =>
    [
      ['avg score', num(row.avg_score, 2)],
      ['champion', row.champion ?? '—'],
      ['teams', String(row.teams)],
      ['endpoint', row.source],
    ] as const;

  return (
    <>
      <svg
        className={styles.chart}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="League average score per team per week, by season"
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
        {rows.map((row, index) => (
          <text key={row.season} className={styles.tickLabel} x={x(index)} y={H - M.bottom + 15} textAnchor="middle">
            {row.season}
          </text>
        ))}
        <text className={styles.axisTitle} x={12} y={midY} textAnchor="middle" transform={`rotate(-90 12 ${midY})`}>
          points / team / week
        </text>
        <path
          className={styles.seriesLine}
          stroke="var(--rb-series-1)"
          d={rows.map((row, index) => `${index ? 'L' : 'M'}${x(index)},${y(row.avg_score)}`).join(' ')}
        />
        {rows.map((row, index) => (
          <g key={row.season}>
            <rect
              className={styles.hit}
              x={x(index) - 14}
              y={M.top}
              width={28}
              height={H - M.top - M.bottom}
              aria-label={`${row.season}: ${num(row.avg_score, 2)} points, champion ${row.champion ?? 'none yet'}`}
              onPointerMove={(event) => show(event, String(row.season), tooltipRows(row))}
              onPointerLeave={hide}
            />
            <circle className={styles.dot} cx={x(index)} cy={y(row.avg_score)} r={4} fill="var(--rb-series-1)" />
          </g>
        ))}
        <text
          className={styles.pointLabel}
          x={x(rows.length - 1)}
          y={y(last.avg_score) - 12}
          textAnchor="end"
          fill="var(--rb-series-1)"
        >
          {num(last.avg_score, 1)}
        </text>
      </svg>
      <ChartTooltip tooltip={tooltip} />
    </>
  );
};

export default ScoringTrendChart;
