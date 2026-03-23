import Link from 'next/link';
import NavLink from './nav-link';

const Header = () => (
  <header className="w-full border-b border-border">
    <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
      <Link href="/" className="group space-y-0.5">
        <span className="block bg-gradient-to-r from-foreground to-accent bg-clip-text text-lg font-bold tracking-tight text-transparent sm:text-xl">
          Carl M. Lane
        </span>
        <span className="block font-mono text-[10px] tracking-widest text-accent-warm uppercase sm:text-xs">
          VP of Engineering &amp; Product Development
        </span>
      </Link>
      <nav aria-label="Main navigation" className="flex items-center gap-6">
        <NavLink href="/" exact>
          Home
        </NavLink>
        <NavLink href="/blog">Blog</NavLink>
      </nav>
    </div>
  </header>
);

export default Header;
