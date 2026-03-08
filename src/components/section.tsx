import type { ReactNode } from 'react';
import FadeIn from './fade-in';

type SectionProps = {
  label?: string;
  children: ReactNode;
  className?: string;
};

const Section = ({ label, children, className = '' }: SectionProps) => (
  <section className={`space-y-6 ${className}`}>
    {label && <h2 className="font-mono text-xs tracking-widest text-accent uppercase">{label}</h2>}
    {children}
  </section>
);

const AnimatedSection = ({ label, children, className = '' }: SectionProps) => (
  <FadeIn>
    <Section label={label} className={className}>
      {children}
    </Section>
  </FadeIn>
);

export { Section, AnimatedSection };
