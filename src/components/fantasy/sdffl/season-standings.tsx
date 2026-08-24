'use client';

import { useId, useState } from 'react';
import { signed } from '@/lib/sdffl/format';
import type { Standing } from '@/lib/sdffl/record-book';
import styles from './record-book.module.css';
import SortableTable, { type Column } from './sortable-table';

type Props = {
  readonly seasons: readonly number[];
  readonly standings: readonly Standing[];
};

const columns: readonly Column<Standing>[] = [
  {
    key: 'final_standing',
    label: 'Finish',
    type: 'num',
    digits: 0,
    value: (row) => row.final_standing,
    render: (row) =>
      row.final_standing === 1 ? (
        <span className={`${styles.pill} ${styles.pillTitle}`}>1st</span>
      ) : (
        String(row.final_standing)
      ),
  },
  { key: 'manager', label: 'Manager', type: 'text', value: (row) => row.manager },
  { key: 'wins', label: 'W', type: 'num', digits: 0, value: (row) => row.wins },
  { key: 'losses', label: 'L', type: 'num', digits: 0, value: (row) => row.losses },
  { key: 'points_for', label: 'Points', type: 'num', value: (row) => row.points_for },
  { key: 'playoff_seed', label: 'Seed', type: 'num', digits: 0, value: (row) => row.playoff_seed },
  { key: 'playoff_wins', label: 'Title W', type: 'num', digits: 0, value: (row) => row.playoff_wins },
  {
    key: 'luck_wins',
    label: 'Luck',
    type: 'num',
    digits: 2,
    value: (row) => row.luck_wins,
    className: (row) => (row.luck_wins > 0 ? styles.pos : row.luck_wins < 0 ? styles.neg : undefined),
    render: (row) => signed(row.luck_wins, 2),
  },
];

const SeasonStandings = ({ seasons, standings }: Props) => {
  const [season, setSeason] = useState(seasons[0]);
  const selectId = useId();

  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        <div>
          <h3 className={styles.sectionTitle}>Final standings</h3>
        </div>
        <label className={styles.srOnly} htmlFor={selectId}>
          Season
        </label>
        <select
          id={selectId}
          className={styles.seasonPick}
          value={season}
          onChange={(event) => setSeason(Number(event.target.value))}
        >
          {seasons.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.scroller}>
        <SortableTable
          columns={columns}
          rows={standings.filter((row) => row.season === season)}
          rowKey={(row) => `${row.season}-${row.manager}`}
          sortKey="final_standing"
          sortDirection="asc"
        />
      </div>
    </div>
  );
};

export default SeasonStandings;
