'use client';

import { GoogleTagManager } from '@next/third-parties/google';
import { useEffect, useState } from 'react';

type DeferredGoogleTagManagerProps = {
  readonly gtmId: string;
};

// Loads GTM off the critical path — on the first user interaction or when the
// main thread goes idle (whichever comes first), with a timeout backstop.
// This keeps the ~280KiB GTM/GA payload from blocking initial render and LCP.
const DeferredGoogleTagManager = ({ gtmId }: DeferredGoogleTagManagerProps) => {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad) return;

    const trigger = () => setShouldLoad(true);
    const events = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const;
    events.forEach((event) => {
      window.addEventListener(event, trigger, { once: true, passive: true });
    });

    const supportsIdle = 'requestIdleCallback' in window;
    const idleId = supportsIdle ? window.requestIdleCallback(trigger, { timeout: 5000 }) : undefined;
    const timeoutId = supportsIdle ? undefined : window.setTimeout(trigger, 4000);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, trigger);
      });
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [shouldLoad]);

  return shouldLoad ? <GoogleTagManager gtmId={gtmId} /> : null;
};

export default DeferredGoogleTagManager;
