import type { Metadata } from 'next';
import { NEW_TAB_COLOR_SCHEME, NEW_TAB_FAVICON, NEW_TAB_THEME, NEW_TAB_TITLE } from './new-tab-constants';

export const metadata: Metadata = {
  title: NEW_TAB_TITLE,
  icons: { icon: NEW_TAB_FAVICON },
  robots: { index: false, follow: false },
  other: { 'color-scheme': NEW_TAB_COLOR_SCHEME },
};

const NewTabLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <div style={NEW_TAB_THEME.light}>
    <style>{`
      @media (prefers-color-scheme: dark) {
        #new-tab-wrapper {
          background-color: ${NEW_TAB_THEME.dark.backgroundColor} !important;
          color: ${NEW_TAB_THEME.dark.color} !important;
        }
      }
    `}</style>
    <div id="new-tab-wrapper">{children}</div>
  </div>
);

export default NewTabLayout;
