import type { ReactNode } from 'react';

type FAQProps = {
  readonly children: ReactNode;
};

const FAQ = ({ children }: FAQProps) => (
  <section className="not-prose my-12 rounded-xl border border-border bg-surface p-6 sm:p-8">
    <div className="mb-6 flex items-center gap-3">
      <h2 className="font-mono text-xs tracking-widest text-accent uppercase">Frequently Asked Questions</h2>
      <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
    </div>
    <div className="divide-y divide-border [&>div]:py-5 first:[&>div]:pt-0 last:[&>div]:pb-0 [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-accent [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-foreground/85 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-accent/30 [&_a:hover]:decoration-accent [&_a]:transition-colors">
      {children}
    </div>
  </section>
);

export { FAQ };
