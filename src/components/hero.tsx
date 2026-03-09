import SocialLinks from './social-links';

const Hero = () => (
  <section className="space-y-6">
    <div className="animate-fade-in space-y-3" style={{ animationDelay: '0ms' }}>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Carl M. Lane</h1>
      <p className="font-mono text-sm tracking-widest text-accent uppercase">VP of Engineering & Product Development</p>
    </div>
    <div className="animate-fade-in space-y-6" style={{ animationDelay: '200ms', opacity: 0 }}>
      <p className="max-w-lg text-lg leading-relaxed text-muted">
        I build high-performing engineering teams that ship fast and are always learning. Currently I'm scaling{' '}
        <a
          href="https://www.marqii.com"
          target="_blank"
          rel="noopener noreferrer"
          title="Marqii"
          className="text-foreground transition-colors duration-200 hover:text-accent"
        >
          Marqii
        </a>{' '}
        to infinity and beyond. My path from support rep to VP taught me that the best engineering leaders never lose
        touch with the people they build for. I build teams that prioritize learning velocity over perfection because
        the team that figures things out fastest is the team that wins.
      </p>
      <SocialLinks />
    </div>
  </section>
);

export default Hero;
