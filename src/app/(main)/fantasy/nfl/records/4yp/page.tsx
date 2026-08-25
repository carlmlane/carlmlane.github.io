import type { Metadata } from 'next';
import { fourYardPumaCopy } from '@/components/fantasy/record-book/leagues/4yp';
import RecordBook from '@/components/fantasy/record-book/record-book';
import { recordBookView } from '@/lib/4yp/record-book';

// Private league page: real people's names, and nothing here belongs in search results.
// `robots` here overrides the site-wide index/follow set in the (main) layout, and
// `/fantasy/` is disallowed in robots.txt as well.
const title = 'Four Yard Puma Record Book';
const description =
  'Six completed seasons of a twelve-team fantasy football league, extracted from the ESPN fantasy API: records, luck, drafts and extremes.';

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  alternates: { canonical: null },
  openGraph: undefined,
  twitter: undefined,
};

const FourYardPumaRecordBookPage = () => <RecordBook view={recordBookView} copy={fourYardPumaCopy} />;

export default FourYardPumaRecordBookPage;
