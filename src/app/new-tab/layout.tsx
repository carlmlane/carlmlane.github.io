import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Tab',
  icons: { icon: 'data:,' },
  other: { 'color-scheme': 'light dark' },
};

const NewTabLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <div
    style={{
      backgroundColor: 'white',
      color: 'black',
    }}
  >
    <style>{`
      @media (prefers-color-scheme: dark) {
        #new-tab-wrapper {
          background-color: black !important;
          color: white !important;
        }
      }
    `}</style>
    <div id="new-tab-wrapper">{children}</div>
  </div>
);

export default NewTabLayout;
