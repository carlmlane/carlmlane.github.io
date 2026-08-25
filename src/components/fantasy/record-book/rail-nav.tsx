'use client';

import { useEffect, useState } from 'react';
import styles from './record-book.module.css';

export type RailItem = { readonly id: string; readonly label: string };

// Only the top slice of the viewport counts as "current", so a tall section stays
// highlighted for as long as it fills the screen instead of flickering at its edges.
const SPY_ROOT_MARGIN = '-15% 0px -75% 0px';

const RailNav = ({ items }: { readonly items: readonly RailItem[] }) => {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: SPY_ROOT_MARGIN },
    );
    for (const item of items) {
      const section = document.getElementById(item.id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className={styles.rail}>
      <p className={styles.railTitle}>Contents</p>
      <nav className={styles.railNav} aria-label="Record book sections">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`${styles.railLink} ${active === item.id ? styles.railLinkActive : ''}`}
            aria-current={active === item.id ? 'true' : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default RailNav;
