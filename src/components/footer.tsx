import SocialLinks from './social-links';

const Footer = () => (
  <footer className="space-y-4 border-t border-border pt-8">
    <div className="flex items-center justify-between">
      <span className="font-mono text-xs text-muted/50">&copy; {new Date().getFullYear()} Carl M. Lane</span>
      <SocialLinks />
    </div>
  </footer>
);

export default Footer;
