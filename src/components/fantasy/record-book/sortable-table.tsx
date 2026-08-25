'use client';

import { type ReactNode, useState } from 'react';
import { num } from '@/lib/fantasy/format';
import styles from './record-book.module.css';

export type CellValue = string | number | null;

export type Column<Row> = {
  /** Stable identifier for the sort state; also the React key for the column. */
  readonly key: string;
  readonly label: string;
  readonly type: 'text' | 'num';
  /** Sort key extractor. Doubles as the default cell content. */
  readonly value: (row: Row) => CellValue;
  readonly digits?: number;
  readonly render?: (row: Row) => ReactNode;
  readonly className?: (row: Row) => string | undefined;
};

type SortState = { readonly key: string; readonly direction: 'asc' | 'desc' };

type Props<Row> = {
  readonly columns: readonly Column<Row>[];
  readonly rows: readonly Row[];
  readonly rowKey: (row: Row) => string;
  readonly caption?: ReactNode;
  readonly sortKey?: string;
  readonly sortDirection?: 'asc' | 'desc';
};

// Missing values sort last in both directions: a blank cell is not "the smallest",
// it is an absence, and floating it to the top of an ascending sort buries the data.
const compare = (a: CellValue, b: CellValue): number => {
  if (a === b) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return typeof a === 'string' ? a.localeCompare(String(b)) : Number(a) - Number(b);
};

const SortableTable = <Row,>({ columns, rows, rowKey, caption, sortKey, sortDirection }: Props<Row>) => {
  const [sort, setSort] = useState<SortState>({
    key: sortKey ?? columns[0].key,
    direction: sortDirection ?? 'desc',
  });

  const active = columns.find((column) => column.key === sort.key) ?? columns[0];
  const sorted = [...rows].sort((a, b) => {
    const result = compare(active.value(a), active.value(b));
    // Nulls keep their "last" position regardless of direction.
    if (active.value(a) === null || active.value(b) === null) return result;
    return sort.direction === 'asc' ? result : -result;
  });

  const toggle = (column: Column<Row>) =>
    setSort((current) =>
      current.key === column.key
        ? { key: column.key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key: column.key, direction: column.type === 'num' ? 'desc' : 'asc' },
    );

  return (
    <table className={styles.table}>
      {caption ? <caption className={styles.caption}>{caption}</caption> : null}
      <thead>
        <tr>
          {columns.map((column) => {
            const isActive = column.key === sort.key;
            return (
              <th
                key={column.key}
                scope="col"
                className={column.type === 'num' ? styles.num : undefined}
                aria-sort={isActive ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <button type="button" className={styles.sortButton} onClick={() => toggle(column)}>
                  {column.label}
                  <span className={styles.arrow} aria-hidden="true">
                    {isActive ? (sort.direction === 'asc' ? '▲' : '▼') : ''}
                  </span>
                </button>
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {sorted.map((row) => (
          <tr key={rowKey(row)}>
            {columns.map((column) => (
              <td
                key={column.key}
                className={[column.type === 'num' ? styles.num : styles.name, column.className?.(row)]
                  .filter(Boolean)
                  .join(' ')}
              >
                {column.render ? column.render(row) : defaultCell(column, row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const defaultCell = <Row,>(column: Column<Row>, row: Row): ReactNode => {
  const value = column.value(row);
  if (column.type === 'num') return num(typeof value === 'number' ? value : null, column.digits ?? 1);
  return value ?? '—';
};

export default SortableTable;
