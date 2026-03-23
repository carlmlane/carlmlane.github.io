'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavLinkProps = {
  readonly href: string;
  readonly children: React.ReactNode;
  readonly exact?: boolean;
};

const NavLink = ({ href, children, exact = false }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`font-mono text-sm transition-colors duration-200 ${
        isActive ? 'text-accent' : 'text-muted hover:text-foreground'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
};

export default NavLink;
