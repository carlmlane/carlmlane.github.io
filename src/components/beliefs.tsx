import { AnimatedSection } from './section';

const beliefs = [
  'Small, high-IQ teams beat large, bureaucratic ones every time.',
  'Engineering is a business lever, not a cost center.',
  'Speed is the only sustainable competitive advantage.',
  'Sincere enthusiasm is contagious.',
] as const;

const Beliefs = () => (
  <AnimatedSection label="// philosophy">
    <blockquote className="border-l-2 border-accent pl-4 text-lg leading-relaxed text-foreground/90 italic">
      Build customer obsessed teams that own outcomes, not tickets. Hire for curiosity, invest in growth, and create the
      conditions where people are inspired to do their best work.
    </blockquote>
    <div className="space-y-3 pt-2">
      {beliefs.map((belief) => (
        <p key={belief} className="text-muted">
          <span className="mr-2 text-accent/60">&mdash;</span>
          {belief}
        </p>
      ))}
    </div>
  </AnimatedSection>
);

export default Beliefs;
