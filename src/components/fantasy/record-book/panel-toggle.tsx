'use client';

import { type ReactNode, useState } from 'react';
import styles from './record-book.module.css';

type Props = {
  readonly chartLabel: string;
  readonly tableLabel: string;
  readonly chart: ReactNode;
  readonly table: ReactNode;
  /** Heading and note that sit to the left of the toggle. */
  readonly head: ReactNode;
  readonly footer?: ReactNode;
};

// Both panels stay mounted and one is hidden with `display: none`, so switching back
// does not re-run the chart layout or lose a table's sort state.
const PanelToggle = ({ chartLabel, tableLabel, chart, table, head, footer }: Props) => {
  const [view, setView] = useState<'chart' | 'table'>('chart');

  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        <div>{head}</div>
        <div className={styles.toggle}>
          <button
            type="button"
            className={styles.toggleButton}
            aria-pressed={view === 'chart'}
            onClick={() => setView('chart')}
          >
            {chartLabel}
          </button>
          <button
            type="button"
            className={styles.toggleButton}
            aria-pressed={view === 'table'}
            onClick={() => setView('table')}
          >
            {tableLabel}
          </button>
        </div>
      </div>
      <div className={`${styles.scroller} ${view === 'chart' ? '' : styles.isHidden}`}>{chart}</div>
      <div className={`${styles.scroller} ${view === 'table' ? '' : styles.isHidden}`}>{table}</div>
      {footer ? <div className={styles.cardFooter}>{footer}</div> : null}
    </div>
  );
};

export default PanelToggle;
