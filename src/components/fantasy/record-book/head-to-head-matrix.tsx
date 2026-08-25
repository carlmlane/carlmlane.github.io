'use client';

import { pct, signed } from '@/lib/fantasy/format';
import type { HeadToHeadRow } from '@/lib/fantasy/record-book';
import ChartTooltip, { useChartTooltip } from './chart-tooltip';
import styles from './record-book.module.css';

type Props = {
  readonly managers: readonly string[];
  readonly pairs: readonly HeadToHeadRow[];
};

// A .500 record is the neutral middle; the ramp saturates at a .850/.150 split so the
// handful of lopsided rivalries do not wash every other cell out to grey.
const MAX_EDGE = 0.35;

const HeadToHeadMatrix = ({ managers, pairs }: Props) => {
  const { tooltip, show, hide } = useChartTooltip();
  const byPair = new Map(pairs.map((row) => [`${row.manager}||${row.opponent}`, row]));

  return (
    <>
      <table className={styles.matrix}>
        <thead>
          <tr>
            <th className={styles.rowHead}>
              <span className={styles.srOnly}>Manager</span>
            </th>
            {managers.map((manager) => (
              <th key={manager} title={manager} scope="col">
                {manager.slice(0, 4)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {managers.map((rowName) => (
            <tr key={rowName}>
              <th className={styles.rowHead} scope="row" title={rowName}>
                {rowName.length > 15 ? `${rowName.slice(0, 14)}…` : rowName}
              </th>
              {managers.map((columnName) => {
                if (rowName === columnName) return <td key={columnName} className={styles.self} />;
                const record = byPair.get(`${rowName}||${columnName}`);
                if (!record)
                  return (
                    <td key={columnName} className={styles.muted}>
                      ·
                    </td>
                  );
                const edge = record.win_pct - 0.5;
                const strength = Math.min(Math.abs(edge) / MAX_EDGE, 1);
                const base = edge >= 0 ? 'var(--rb-pos)' : 'var(--rb-neg)';
                return (
                  <td
                    key={columnName}
                    className={styles.matrixCell}
                    title={`${rowName} vs ${columnName}: ${record.wins}-${record.losses}`}
                    style={{
                      background: `color-mix(in oklab, ${base} ${(strength * 82).toFixed(0)}%, var(--rb-mid))`,
                      color: strength > 0.55 ? '#0a0a0a' : 'var(--rb-ink-2)',
                    }}
                    onPointerMove={(event) =>
                      show(event, `${rowName} vs ${columnName}`, [
                        ['record', `${record.wins}-${record.losses}${record.ties ? `-${record.ties}` : ''}`],
                        ['win rate', pct(record.win_pct)],
                        ['avg margin', signed(record.avg_margin, 2)],
                        ['meetings', String(record.games)],
                      ])
                    }
                    onPointerLeave={hide}
                  >
                    {record.wins}-{record.losses}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.scaleLegend}>
        <span>loses</span>
        <div className={styles.ramp} />
        <span>wins</span>
      </div>
      <ChartTooltip tooltip={tooltip} />
    </>
  );
};

export default HeadToHeadMatrix;
