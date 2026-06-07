import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import DeferredGoogleTagManager from '@/components/deferred-google-tag-manager';
import Header from '@/components/header';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Carl M. Lane — VP of Engineering',
  description:
    'Engineering leader building high-performing teams. VP of Engineering & Product Development at Marqii. Based in San Francisco.',
  keywords: [
    'Carl Lane',
    'VP of Engineering',
    'engineering leader',
    'product development',
    'San Francisco',
    'Marqii',
    'software engineering',
    'TypeScript',
    'team building',
  ],
  authors: [{ name: 'Carl M. Lane', url: 'https://carlmlane.com' }],
  publisher: 'Carl M. Lane',
  metadataBase: new URL('https://carlmlane.com'),
  alternates: {
    canonical: 'https://carlmlane.com',
    types: {
      'application/rss+xml': 'https://carlmlane.com/feed.xml',
    },
  },
  openGraph: {
    title: 'Carl M. Lane — VP of Engineering',
    description:
      'Engineering leader building high-performing teams. VP of Engineering & Product Development at Marqii.',
    url: 'https://carlmlane.com',
    siteName: 'Carl M. Lane',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Carl M. Lane — VP of Engineering',
    description: 'Engineering leader building high-performing teams.',
  },
  robots: {
    index: true,
    follow: true,
  },
  referrer: 'strict-origin-when-cross-origin',
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
};

const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://*.posthog.com https://i.carlmlane.com https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com",
  "connect-src 'self' https://www.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://*.posthog.com https://i.carlmlane.com https://cloudflareinsights.com https://static.cloudflareinsights.com",
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'upgrade-insecure-requests',
];

const contentSecurityPolicy = cspDirectives.join('; ');

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <meta httpEquiv="Content-Security-Policy" content={contentSecurityPolicy} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <DeferredGoogleTagManager gtmId="GTM-M55D9MGW" />
        <Header />
        {children}
      </body>
    </html>
  );
}
