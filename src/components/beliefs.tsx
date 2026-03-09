import { AnimatedSection } from './section';

const beliefs: readonly { id: string; content: string }[] = [
  { id: 'small-teams', content: 'Small, high-IQ teams beat large, bureaucratic ones every time.' },
  { id: 'engineering-lever', content: 'Engineering is a business lever, not a cost center.' },
  { id: 'speed', content: 'Speed is the only sustainable competitive advantage.' },
  { id: 'enthusiasm', content: 'Sincere enthusiasm is contagious.' },
];

const Beliefs = () => (
  <AnimatedSection label="// philosophy">
    <blockquote className="border-l-2 border-accent-warm rounded-r-lg bg-surface-elevated/50 py-4 pl-4 pr-6 text-lg leading-relaxed text-foreground/90 italic">
      Build customer obsessed teams that own outcomes, not tickets. Hire for curiosity, invest in growth, and create the
      conditions where people are inspired to do their best work.
    </blockquote>
    <div className="space-y-3 pt-2">
      {beliefs.map(({ id, content }) => (
        <p key={id} className="text-muted">
          <span className="mr-2 text-accent/60">&mdash;</span>
          {content}
        </p>
      ))}
    </div>
  </AnimatedSection>
);

export default Beliefs;
