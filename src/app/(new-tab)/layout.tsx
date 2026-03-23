import type { Metadata } from 'next';
import {
  NEW_TAB_BODY_ID,
  NEW_TAB_COLOR_SCHEME,
  NEW_TAB_FAVICON,
  NEW_TAB_THEME,
  NEW_TAB_TITLE,
} from './new-tab/new-tab-constants';

export const metadata: Metadata = {
  title: NEW_TAB_TITLE,
  icons: { icon: NEW_TAB_FAVICON },
  robots: { index: false, follow: false },
  other: { 'color-scheme': NEW_TAB_COLOR_SCHEME },
};

const NewTabRootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <html lang="en">
    <body id={NEW_TAB_BODY_ID} style={NEW_TAB_THEME.light}>
      <style>{`
        @media (prefers-color-scheme: dark) {
          body {
            background-color: ${NEW_TAB_THEME.dark.backgroundColor} !important;
            color: ${NEW_TAB_THEME.dark.color} !important;
          }
        }
      `}</style>
      {children}
    </body>
  </html>
);

export default NewTabRootLayout;
