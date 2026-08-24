'use client';

import { num, pct } from '@/lib/sdffl/format';
import type { DraftSlotBaseline, DraftSlotRow } from '@/lib/sdffl/record-book';
import ChartTooltip, { useChartTooltip } from './chart-tooltip';
import styles from './record-book.module.css';

const W = 760;
const H = 340;
const M = { top: 20, right: 22, bottom: 74, left: 52 };

type Props = {
  readonly rows: readonly DraftSlotRow[];
  readonly baseline: DraftSlotBaseline;
};

const DraftSlotChart = ({ rows, baseline }: Props) => {
  const { tooltip, show, hide } = useChartTooltip();

  const maxY = Math.ceil(Math.max(...rows.map((row) => row.avg_wins)) + 1);
  const plotWidth = W - M.left - M.right;
  const band = plotWidth / rows.length;
  const y = (value: number) => H - M.bottom - (value / maxY) * (H - M.top - M.bottom);
  const ticks = Array.from({ length: Math.floor(maxY / 2) + 1 }, (_, index) => index * 2);
  const midY = (M.top + H - M.bottom) / 2;
  const bandLabels = [
    ['slot', H - M.bottom + 15],
    ['titles', H - M.bottom + 31],
    ['playoffs', H - M.bottom + 46],
  ] as const;

  const tooltipRows = (row: DraftSlotRow) =>
    [
      ['avg wins', num(row.avg_wins, 2)],
      ['avg losses', num(row.avg_losses, 2)],
      ['avg finish', num(row.avg_finish, 2)],
      ['titles', String(row.titles)],
      ['playoff rate', pct(row.playoff_rate)],
      ['seasons', String(row.seasons)],
    ] as const;

  return (
    <>
      <svg
        className={styles.chart}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Average regular season wins by round one draft slot"
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
        {rows.map((row, index) => {
          const cx = M.left + band * index + band / 2;
          // Leave a gap between adjacent bars rather than letting them fuse into a block.
          const barWidth = Math.min(band - 16, 26);
          return (
            <g key={row.slot}>
              <rect
                x={cx - barWidth / 2}
                y={y(row.avg_wins)}
                width={barWidth}
                height={H - M.bottom - y(row.avg_wins)}
                rx={4}
                fill="var(--rb-series-1)"
              />
              <text className={styles.tickLabel} x={cx} y={H - M.bottom + 15} textAnchor="middle">
                {row.slot}
              </text>
              {/* Titles ride as a second row of text, not a second y-scale. */}
              <text
                className={styles.tickLabel}
                x={cx}
                y={H - M.bottom + 31}
                textAnchor="middle"
                fill={row.titles > 0 ? 'var(--rb-series-1)' : 'var(--rb-ink-3)'}
              >
                {row.titles > 0 ? row.titles : '·'}
              </text>
              <text className={styles.tickLabel} x={cx} y={H - M.bottom + 46} textAnchor="middle">
                {pct(row.playoff_rate)}
              </text>
              <rect
                className={styles.hit}
                x={cx - band / 2}
                y={M.top}
                width={band}
                height={H - M.top - M.bottom}
                aria-label={`Slot ${row.slot}: ${num(row.avg_wins, 2)} average wins, ${row.titles} titles`}
                onPointerMove={(event) => show(event, `Draft slot ${row.slot}`, tooltipRows(row))}
                onPointerLeave={hide}
              />
            </g>
          );
        })}
        {/* League average, plus a ±1 standard error band so the eye can see that
            almost every slot sits inside the noise. */}
        <rect
          x={M.left}
          y={y(baseline.league_avg_wins + baseline.se_slot_mean)}
          width={plotWidth}
          height={Math.abs(
            y(baseline.league_avg_wins - baseline.se_slot_mean) - y(baseline.league_avg_wins + baseline.se_slot_mean),
          )}
          fill="var(--rb-ink-3)"
          opacity="0.13"
        />
        <line
          className={styles.refline}
          x1={M.left}
          x2={W - M.right}
          y1={y(baseline.league_avg_wins)}
          y2={y(baseline.league_avg_wins)}
        />
        {bandLabels.map(([label, labelY]) => (
          <text key={label} className={styles.axisTitle} x={M.left - 8} y={labelY + 3.5} textAnchor="end">
            {label}
          </text>
        ))}
        <text className={styles.axisTitle} x={12} y={midY} textAnchor="middle" transform={`rotate(-90 12 ${midY})`}>
          avg wins
        </text>
      </svg>
      <div className={styles.legend}>
        <span>
          <i style={{ background: 'var(--rb-axis)' }} />
          <span>league average {num(baseline.league_avg_wins, 2)} wins</span>
        </span>
        <span>
          <i style={{ background: 'var(--rb-ink-3)', opacity: 0.3, height: 8, borderRadius: 2 }} />
          <span>± 1 standard error ({num(baseline.se_slot_mean, 2)})</span>
        </span>
      </div>
      <ChartTooltip tooltip={tooltip} />
    </>
  );
};

export default DraftSlotChart;
