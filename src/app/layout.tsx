import { GoogleTagManager } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
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
  other: {
    'theme-color': '#0a0a0a',
  },
};

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
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com; font-src 'self';"
        />
      </head>
      <GoogleTagManager gtmId="GTM-M55D9MGW" />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
