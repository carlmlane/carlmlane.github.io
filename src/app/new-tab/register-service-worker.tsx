'use client';

import { useEffect } from 'react';

const RegisterServiceWorker = () => {
  useEffect(() => {
    document.body.id = 'vimium-new-tab-page';

    if (location.hostname !== 'localhost') {
      navigator.serviceWorker.register('./new-tab/service-worker.js').catch((error) => {
        console.error('Service worker registration failed with error', error);
      });
    }
  }, []);

  return null;
};

export default RegisterServiceWorker;
