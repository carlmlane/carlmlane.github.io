import type { ReactNode } from 'react';
import FadeIn from './fade-in';

type SectionProps = {
  label?: string;
  children: ReactNode;
  className?: string;
};

const Section = ({ label, children, className = '' }: SectionProps) => (
  <section className={`space-y-6 ${className}`}>
    {label && (
      <div className="flex items-center gap-3">
        <h2 className="font-mono text-xs tracking-widest text-accent uppercase">{label}</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
      </div>
    )}
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

export { AnimatedSection, Section };
