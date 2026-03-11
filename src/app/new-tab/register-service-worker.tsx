'use client';

import { useEffect } from 'react';
import { NEW_TAB_BODY_ID } from './new-tab-constants';

const RegisterServiceWorker = () => {
  useEffect(() => {
    document.body.id = NEW_TAB_BODY_ID;

    if (location.hostname !== 'localhost') {
      navigator.serviceWorker.register('./new-tab/service-worker.js').catch((error) => {
        console.error('Service worker registration failed with error', error);
      });
    }
  }, []);

  return null;
};

export default RegisterServiceWorker;
