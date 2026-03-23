'use client';

import { useEffect } from 'react';

const RegisterServiceWorker = () => {
  useEffect(() => {
    if (location.hostname !== 'localhost') {
      navigator.serviceWorker.register('./service-worker.js').catch((error) => {
        console.error('Service worker registration failed with error', error);
      });
    }
  }, []);

  return null;
};

export default RegisterServiceWorker;
