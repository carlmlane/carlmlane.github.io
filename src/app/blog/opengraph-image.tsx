import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const alt = 'Blog — Carl M. Lane';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const OgImage = () =>
  new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px',
        backgroundColor: '#0a0a0a',
        color: '#ededed',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }}>Blog</div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 400,
            color: '#5b9ee1',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontFamily: 'monospace',
          }}
        >
          Carl M. Lane
        </div>
        <div style={{ fontSize: 24, color: '#999999', lineHeight: 1.5, maxWidth: '800px', marginTop: '16px' }}>
          Thoughts on engineering leadership, software development, and team building.
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '60px',
          right: '80px',
          fontSize: 20,
          color: '#5b9ee1',
          fontFamily: 'monospace',
        }}
      >
        carlmlane.com/blog
      </div>
    </div>,
    { ...size },
  );

export default OgImage;
