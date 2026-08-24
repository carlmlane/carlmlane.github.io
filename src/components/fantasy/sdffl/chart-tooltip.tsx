'use client';

import { useCallback, useEffect, useState } from 'react';
import styles from './record-book.module.css';

export type TooltipRow = readonly [label: string, value: string];

export type TooltipState = {
  readonly name: string;
  readonly rows: readonly TooltipRow[];
  readonly x: number;
  readonly y: number;
  readonly flipX: boolean;
  readonly flipY: boolean;
};

export type TooltipAnchor = { readonly clientX: number; readonly clientY: number };

// Estimated tooltip box, used to decide which side of the cursor it opens on.
// Flipping from the pointer position avoids a measure-then-reposition round trip,
// which would show the tooltip in the wrong place for a frame.
const TIP_WIDTH = 280;
const TIP_HEIGHT = 150;

export const useChartTooltip = () => {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const hide = useCallback(() => setTooltip(null), []);

  const show = useCallback((anchor: TooltipAnchor, name: string, rows: readonly TooltipRow[]) => {
    setTooltip({
      name,
      rows,
      x: anchor.clientX,
      y: anchor.clientY,
      flipX: anchor.clientX > window.innerWidth - TIP_WIDTH,
      flipY: anchor.clientY > window.innerHeight - TIP_HEIGHT,
    });
  }, []);

  // A tooltip pinned to viewport coordinates drifts away from its mark once the
  // page scrolls, so it is dismissed rather than followed.
  useEffect(() => {
    if (!tooltip) return;
    document.addEventListener('scroll', hide, { passive: true });
    return () => document.removeEventListener('scroll', hide);
  }, [tooltip, hide]);

  return { tooltip, show, hide };
};

const ChartTooltip = ({ tooltip }: { readonly tooltip: TooltipState | null }) => {
  if (!tooltip) return null;

  return (
    <div
      className={styles.tip}
      role="status"
      style={{
        left: tooltip.x + (tooltip.flipX ? -12 : 12),
        top: tooltip.y + (tooltip.flipY ? -12 : 12),
        transform: `translate(${tooltip.flipX ? '-100%' : '0'}, ${tooltip.flipY ? '-100%' : '0'})`,
      }}
    >
      <div className={styles.tipName}>{tooltip.name}</div>
      {tooltip.rows.map(([label, value]) => (
        <div key={label} className={styles.tipRow}>
          <span>{label}</span>
          <b>{value}</b>
        </div>
      ))}
    </div>
  );
};

export default ChartTooltip;
