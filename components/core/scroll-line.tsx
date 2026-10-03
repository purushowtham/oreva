'use client';

import React, { useEffect, useState } from 'react';

export interface ScrollLineProps {
  startSectionId?: string;
  endSectionId?: string;
}

export const ScrollLineTracker: React.FC<ScrollLineProps> = () => {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const currentScroll = window.scrollY;
      const progress = Math.min(Math.max(currentScroll / totalHeight, 0), 1);
      setScrollPercent(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Gradient color transition calculation based on scroll percent
  // Brown: #4A3828, Bronze: #9A723E, Beige: #DED1BC, Ivory: #F6F1E7
  return (
    <div
      className="scrollLineContainer"
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: '5vw',
        width: '5px',
        zIndex: 5,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <div
        className="scrollLineTrack"
        style={{
          width: '100%',
          height: '100%',
          background: 'rgba(154, 114, 62, 0.15)',
          borderRadius: '3px',
          position: 'relative',
        }}
      >
        <div
          className="scrollLineProgress"
          style={{
            width: '100%',
            height: `${Math.min(scrollPercent * 120, 100)}%`,
            background: 'linear-gradient(180deg, #4A3828 0%, #9A723E 40%, #DED1BC 80%, #4A3828 100%)',
            backgroundSize: '100% 400%',
            backgroundPosition: `0% ${scrollPercent * 100}%`,
            borderRadius: '3px',
            boxShadow: '0 0 12px rgba(154, 114, 62, 0.4)',
            transition: 'height 0.1s ease-out, background-position 0.2s ease-out',
          }}
        />
      </div>
    </div>
  );
};
