import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Footer from '@/components/footer';
import FormattedDate from '@/components/formatted-date';
import { AnimatedSection } from '@/components/section';

// A /now page (nownownow.com convention): what I'm focused on at the moment.
// Content is meant to be edited regularly — bump `lastUpdated` when you change it.
const lastUpdated = '2026-06-07';

const title = 'Now — Carl M. Lane';
const description =
  'What Carl M. Lane is focused on right now: current work at Marqii, what he is learning, and life outside work.';
const url = 'https://carlmlane.com/now';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
};

const sections: readonly { id: string; label: string; items: readonly ReactNode[] }[] = [
  {
    id: 'work',
    label: '// focused on',
    items: [
      'Scaling engineering and product at Marqii — shipping fast while keeping the team learning.',
      'Pushing AI deeper into our engineering workflow without losing the craft that makes good software good.',
      'Mentoring the next layer of engineering leaders so the org keeps compounding.',
    ],
  },
  {
    id: 'learning',
    label: '// learning',
    items: [
      'Where agentic AI tooling actually earns its keep in a real product engineering org.',
      'Sharpening my writing — turning hard-won team-building lessons into posts on this blog.',
    ],
  },
  {
    id: 'outside',
    label: '// outside work',
    items: [
      'Earning turns in the Sierra backcountry most winter weekends.',
      'Staying current on instrument flying and the risk-assessment habits it builds.',
    ],
  },
];

const Now = () => (
  <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
    <main className="space-y-16">
      <section className="animate-rise space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Now</h1>
        <p className="max-w-lg text-lg leading-relaxed text-muted">
          A snapshot of what has my attention right now — work, learning, and life away from the keyboard.
        </p>
        <p className="font-mono text-sm text-muted">
          Last updated <FormattedDate dateStr={lastUpdated} />
        </p>
      </section>
      {sections.map((section) => (
        <AnimatedSection key={section.id} label={section.label}>
          <ul className="space-y-3">
            {section.items.map((item, index) => (
              <li
                // biome-ignore lint/suspicious/noArrayIndexKey: static, never-reordered content
                key={index}
                className="flex gap-3 text-muted transition-all duration-200 hover:translate-x-1 hover:text-foreground/80"
              >
                <span className="mt-1 text-accent/60" aria-hidden="true">
                  &mdash;
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </AnimatedSection>
      ))}
      <Footer />
    </main>
  </div>
);

export default Now;
