import type { Metadata } from 'next';
import SdfflRecordBook from '@/components/fantasy/sdffl/record-book';
import { recordBookView } from '@/lib/sdffl/record-book';

// Private league page: real people's names, and nothing here belongs in search results.
// `robots` here overrides the site-wide index/follow set in the (main) layout, and
// `/fantasy/` is disallowed in robots.txt as well.
const title = 'SD FFL Record Book';
const description =
  'Fourteen seasons of a twelve-team fantasy football league, extracted from the ESPN fantasy API: records, luck, drafts and extremes.';

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  alternates: { canonical: null },
  openGraph: undefined,
  twitter: undefined,
};

const SdfflRecordBookPage = () => <SdfflRecordBook view={recordBookView} />;

export default SdfflRecordBookPage;
