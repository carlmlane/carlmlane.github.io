import type { ReactNode } from 'react';
import { AnimatedSection } from './section';

const linkClass =
  'text-accent underline underline-offset-2 hover:text-accent-hover hover:drop-shadow-[0_0_6px_var(--accent-glow)] transition-all duration-300';

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
        <a href="https://www.wix.com" target="_blank" rel="noopener noreferrer" title="Wix.com" className={linkClass}>
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
        <a href="https://www.marqii.com" target="_blank" rel="noopener noreferrer" title="Marqii" className={linkClass}>
          Marqii
        </a>
      </>
    ),
  },
];

const BioFacts = () => (
  <AnimatedSection label="// at a glance">
    <div className="relative">
      {facts.map(({ id, content }, index) => (
        <div
          key={id}
          className={`relative pl-6 pb-4 ${index < facts.length - 1 ? 'border-l border-accent/20' : ''} ml-1`}
        >
          <span className="absolute -left-1 top-1.5 h-2 w-2 rounded-full bg-accent/60" />
          <p className="text-muted transition-all duration-200 hover:translate-x-1 hover:text-foreground/80">
            {content}
          </p>
        </div>
      ))}
    </div>
  </AnimatedSection>
);

export default BioFacts;
