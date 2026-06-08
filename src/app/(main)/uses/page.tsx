import type { Metadata } from 'next';
import Footer from '@/components/footer';
import { AnimatedSection } from '@/components/section';

// A /uses page (uses.tech convention): the gear and software I work with.
const title = 'Uses — Carl M. Lane';
const description =
  'The hardware, editor, and software Carl M. Lane uses day to day to build software and lead engineering teams.';
const url = 'https://carlmlane.com/uses';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
};

type UseItem = {
  readonly name: string;
  readonly note: string;
  readonly href?: string;
};

const groups: readonly { id: string; label: string; items: readonly UseItem[] }[] = [
  {
    id: 'hardware',
    label: '// hardware',
    items: [
      { name: 'MacBook Pro (Apple Silicon)', note: 'Primary machine.', href: 'https://www.apple.com/macbook-pro/' },
      {
        name: 'Proxmox VE',
        note: 'Local homelab — VMs and containers.',
        href: 'https://www.proxmox.com/en/proxmox-virtual-environment',
      },
      { name: 'ErgoDox EZ', note: 'Split ergonomic mechanical keyboard.', href: 'https://ergodox-ez.com' },
      { name: 'ZSA Voyager', note: 'Low-profile split keyboard.', href: 'https://www.zsa.io/voyager' },
      { name: 'Logitech G305', note: 'Lightweight wireless mouse.', href: 'https://www.logitechg.com' },
      { name: 'Ubiquiti UniFi', note: 'Runs the home network.', href: 'https://www.ui.com' },
    ],
  },
  {
    id: 'editor',
    label: '// editor & terminal',
    items: [
      { name: 'VS Code', note: 'Daily driver — expert.', href: 'https://code.visualstudio.com' },
      { name: 'Neovim', note: 'Intermediate; in-terminal editing.', href: 'https://neovim.io' },
      { name: 'Zed', note: 'Intermediate — contributing plugins.', href: 'https://zed.dev' },
      { name: 'Claude Code', note: 'Agentic coding in the terminal.', href: 'https://claude.com/claude-code' },
    ],
  },
  {
    id: 'building',
    label: '// building software',
    items: [
      { name: 'TypeScript', note: 'Strict, functional, no loose any.', href: 'https://www.typescriptlang.org' },
      { name: 'Scala', note: 'Typed functional programming on the JVM.', href: 'https://www.scala-lang.org' },
      { name: 'Rust', note: 'Performance-critical and systems work.', href: 'https://www.rust-lang.org' },
      { name: 'Next.js', note: 'App Router, static export for this site.', href: 'https://nextjs.org' },
      { name: 'Express, Fastify & Hono', note: 'HTTP servers from legacy to edge.', href: 'https://hono.dev' },
      { name: 'Zod', note: 'Runtime validation and type inference.', href: 'https://zod.dev' },
      { name: 'PostgreSQL', note: 'Primary datastore.', href: 'https://www.postgresql.org' },
      { name: 'WebRTC', note: 'Real-time audio, video, and data.', href: 'https://webrtc.org' },
      { name: 'Kubernetes', note: 'Container orchestration in production.', href: 'https://kubernetes.io' },
      { name: 'Tailwind CSS', note: 'v4 via PostCSS for styling.', href: 'https://tailwindcss.com' },
      { name: 'Biome', note: 'Lint + format in one fast tool.', href: 'https://biomejs.dev' },
      { name: 'Vitest', note: 'Unit testing.', href: 'https://vitest.dev' },
      { name: 'Playwright', note: 'End-to-end testing.', href: 'https://playwright.dev' },
      { name: 'Lefthook', note: 'Fast Git pre-commit hooks.', href: 'https://lefthook.dev' },
      { name: 'pnpm', note: 'Package manager of choice.', href: 'https://pnpm.io' },
      { name: 'New Relic', note: 'Observability and APM.', href: 'https://newrelic.com' },
    ],
  },
];

const Uses = () => (
  <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
    <main className="space-y-16">
      <section className="animate-rise space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Uses</h1>
        <p className="max-w-lg text-lg leading-relaxed text-muted">
          The hardware and software I reach for to build software and lead engineering teams.
        </p>
      </section>
      {groups.map((group) => (
        <AnimatedSection key={group.id} label={group.label}>
          <ul className="space-y-4">
            {group.items.map((item) => (
              <li key={item.name} className="flex flex-col gap-0.5">
                <span className="font-medium text-foreground">
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-accent"
                    >
                      {item.name}
                    </a>
                  ) : (
                    item.name
                  )}
                </span>
                <span className="text-sm text-muted">{item.note}</span>
              </li>
            ))}
          </ul>
        </AnimatedSection>
      ))}
      <Footer />
    </main>
  </div>
);

export default Uses;
