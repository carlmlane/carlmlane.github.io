import { AnimatedSection } from './section';

const linkClass = 'text-accent underline underline-offset-2 hover:text-accent/80 transition-colors';

const inspirations: readonly { id: string; name: string; url: string; reason: string }[] = [
  {
    id: 'curie',
    name: 'Marie Curie',
    url: 'https://en.wikipedia.org/wiki/Marie_Curie',
    reason:
      'Pioneered radioactivity research, first woman to win a Nobel Prize — and then won a second in a different field.',
  },
  {
    id: 'nimitz',
    name: 'Chester Nimitz',
    url: 'https://en.wikipedia.org/wiki/Chester_W._Nimitz',
    reason:
      'Led the Pacific Fleet through WWII with calm, strategic brilliance under enormous pressure. Pioneered underway replenishment, keeping fleets supplied without returning to port.',
  },
  {
    id: 'shepard',
    name: 'Alan Shepard',
    url: 'https://en.wikipedia.org/wiki/Alan_Shepard',
    reason: 'First American in space — grounded by illness, fought his way back, and walked on the Moon.',
  },
  {
    id: 'kranz',
    name: 'Gene Kranz',
    url: 'https://en.wikipedia.org/wiki/Gene_Kranz',
    reason: 'Mission control legend who defined what it means to be accountable. "Failure is not an option."',
  },
  {
    id: 'yeager',
    name: 'Chuck Yeager',
    url: 'https://en.wikipedia.org/wiki/Chuck_Yeager',
    reason: 'Broke the sound barrier with broken ribs. Pure fearlessness backed by skill.',
  },
  {
    id: 'hopper',
    name: 'Grace Hopper',
    url: 'https://en.wikipedia.org/wiki/Grace_Hopper',
    reason: 'Invented the first compiler and championed the idea that code should read like English.',
  },
  {
    id: 'hamilton',
    name: 'Margaret Hamilton',
    url: 'https://en.wikipedia.org/wiki/Margaret_Hamilton_(software_engineer)',
    reason: 'Wrote the Apollo guidance software and coined "software engineering" as a discipline.',
  },
  {
    id: 'torvalds',
    name: 'Linus Torvalds',
    url: 'https://en.wikipedia.org/wiki/Linus_Torvalds',
    reason: 'Created Linux and Git — two tools that fundamentally shaped how software is built.',
  },
  {
    id: 'wozniak',
    name: 'Steve Wozniak',
    url: 'https://en.wikipedia.org/wiki/Steve_Wozniak',
    reason: 'Built the Apple I and II essentially alone. Engineering for the pure joy of it.',
  },
  {
    id: 'zizek',
    name: 'Slavoj Žižek',
    url: 'https://en.wikipedia.org/wiki/Slavoj_%C5%BDi%C5%BEek',
    reason: 'Makes philosophy accessible and provocative — challenges you to question what you take for granted.',
  },
];

const Inspirations = () => (
  <AnimatedSection label="// inspirations">
    <div className="space-y-3">
      {inspirations.map(({ id, name, url, reason }) => (
        <p key={id} className="text-muted">
          <span className="mr-2 text-accent/60">&mdash;</span>
          <a href={url} target="_blank" rel="noopener noreferrer" title={name} className={linkClass}>
            {name}
          </a>
          {' — '}
          {reason}
        </p>
      ))}
    </div>
  </AnimatedSection>
);

export default Inspirations;
