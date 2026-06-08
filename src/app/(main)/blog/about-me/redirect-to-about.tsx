'use client';

import { useEffect } from 'react';

const RedirectToAbout = () => {
  useEffect(() => {
    window.location.replace('/about');
  }, []);

  return null;
};

export default RedirectToAbout;
