import type { Metadata } from 'next';
import RedirectToAbout from './redirect-to-about';

// The about-me post moved to /about. This stub preserves the old URL for any
// inbound links: it canonicalizes to /about (consolidating ranking signals) and
// client-redirects visitors, since static export cannot issue a 301.
export const metadata: Metadata = {
  title: 'About Carl M. Lane',
  alternates: { canonical: 'https://carlmlane.com/about' },
};

const AboutMeRedirect = () => (
  <div className="mx-auto w-full max-w-3xl px-6 py-16">
    <RedirectToAbout />
    <p className="text-muted">
      This page has moved to{' '}
      <a href="/about" className="text-accent underline underline-offset-2 hover:text-accent-hover">
        /about
      </a>
      .
    </p>
  </div>
);

export default AboutMeRedirect;
