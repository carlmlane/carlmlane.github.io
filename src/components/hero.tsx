import SocialLinks from './social-links';

const Hero = () => (
  <section className="animate-fade-in space-y-6">
    <p className="max-w-lg text-lg leading-relaxed text-muted">
      I build high-performing engineering teams that ship fast and are always learning. Currently I'm scaling{' '}
      <a
        href="https://www.marqii.com"
        target="_blank"
        rel="noopener noreferrer"
        title="Marqii"
        className="text-foreground transition-all duration-300 hover:text-accent hover:drop-shadow-[0_0_8px_var(--accent-glow)]"
      >
        Marqii
      </a>{' '}
      to infinity and beyond. My path from support rep to VP taught me that the best engineering leaders never lose
      touch with the people they build for. I build teams that prioritize learning velocity over perfection because the
      team that figures things out fastest is the team that wins.
    </p>
    <SocialLinks />
  </section>
);

export default Hero;
