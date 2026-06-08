import SocialLinks from './social-links';

const footerLinks: readonly { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Now', href: '/now' },
  { label: 'Uses', href: '/uses' },
];

const Footer = () => (
  <footer className="space-y-4 border-t border-border pt-8">
    <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-muted">
      {footerLinks.map((link) => (
        <a key={link.href} href={link.href} className="transition-colors hover:text-accent">
          {link.label}
        </a>
      ))}
    </nav>
    <div className="flex items-center justify-between">
      <span className="font-mono text-xs text-muted/50">&copy; {new Date().getFullYear()} Carl M. Lane</span>
      <SocialLinks />
    </div>
  </footer>
);

export default Footer;
