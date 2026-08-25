import type { ReactNode } from 'react';
import styles from './record-book.module.css';

/**
 * Everything on a record book page that states a fact about one particular league —
 * how many seasons it has run, how many teams it fields, which quirks its export
 * carries. The mechanism copy (what a coefficient of variation is, why swap regret is
 * the honest number) is the same everywhere and stays in the component.
 *
 * Each league supplies one of these next to its route.
 */
export type RecordBookCopy = {
  /** Masthead paragraph under the title. */
  readonly lede: ReactNode;
  readonly allTimeNote: ReactNode;
  readonly allTimeCaption: ReactNode;
  readonly podiumNote: ReactNode;
  readonly headToHeadNote: ReactNode;
  readonly headToHeadCaption: ReactNode;
  /** Definition-list body for "deserved wins" — the all-play arithmetic in this league's team count. */
  readonly deservedWinsDef: ReactNode;
  /** Definition-list body for "luck" — including what counts as a big swing over this league's season length. */
  readonly luckDef: ReactNode;
  readonly luckScopeNote: ReactNode;
  readonly luckScatterNote: ReactNode;
  readonly luckScatterCaption: ReactNode;
  readonly draftNote: ReactNode;
  readonly draftSlotNote: ReactNode;
  readonly draftSlotCaption: ReactNode;
  /** Verdict under the draft slot chart, where the league's own spread meets its standard error. */
  readonly draftSlotFooter: ReactNode;
  readonly stealsSkillCaption: ReactNode;
  readonly stealsAllCaption: ReactNode;
  readonly bustsCaption: ReactNode;
  readonly rosterNote: ReactNode;
  readonly benchCaption: ReactNode;
  readonly topTeamWeeksCaption: ReactNode;
  readonly hardLuckCaption: ReactNode;
  /** Shown above the positional table; omit when the export carries no positional view. */
  readonly positionalNote?: ReactNode;
  /** Heading for the season-by-season section, e.g. "Fourteen years". */
  readonly seasonsTitle: string;
};

/** Emphasis in the league tone colours, so copy modules never reach for the stylesheet. */
export const Pos = ({ children }: { readonly children: ReactNode }) => (
  <strong className={styles.pos}>{children}</strong>
);

export const Neg = ({ children }: { readonly children: ReactNode }) => (
  <strong className={styles.neg}>{children}</strong>
);
