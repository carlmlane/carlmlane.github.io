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
    card: 'summary',
    title: 'Carl M. Lane — VP of Engineering',
    description: 'Engineering leader building high-performing teams.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-M55D9MGW" />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
