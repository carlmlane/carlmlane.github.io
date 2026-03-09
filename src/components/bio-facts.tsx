import type { ReactNode } from 'react';
import { AnimatedSection } from './section';

const linkClass = 'text-accent underline underline-offset-2 hover:text-accent/80 transition-colors';

const facts: readonly { id: string; content: ReactNode }[] = [
  { id: 'bay-area', content: 'Born in the Bay Area, went to high school in San Diego' },
  { id: 'madrid', content: 'Lived in Madrid, Spain after high school' },
  { id: 'spaceflight', content: 'Before obsessing over software, dreamed about spaceflight and aviation' },
  { id: 'aerospace', content: 'Studied aerospace engineering at St. Louis University Parks College' },
  { id: 'coding', content: 'Using computers since 1990, writing code since 1998' },
  {
    id: 'wix',
    content: (
      <>
        Spent over a decade at{' '}
        <a href="https://www.wix.com" target="_blank" rel="noopener noreferrer" className={linkClass}>
          Wix.com
        </a>
      </>
    ),
  },
  {
    id: 'marqii',
    content: (
      <>
        VP of Engineering and Product Development at{' '}
        <a href="https://www.marqii.com" target="_blank" rel="noopener noreferrer" className={linkClass}>
          Marqii
        </a>
      </>
    ),
  },
];

const BioFacts = () => (
  <AnimatedSection label="// at a glance">
    <div className="space-y-3">
      {facts.map(({ id, content }) => (
        <p key={id} className="text-muted">
          <span className="mr-2 text-accent/60">&mdash;</span>
          {content}
        </p>
      ))}
    </div>
  </AnimatedSection>
);

export default BioFacts;
