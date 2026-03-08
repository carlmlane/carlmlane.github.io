'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

const FadeIn = ({ children, delay = 0, className = '' }: FadeInProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default FadeIn;
