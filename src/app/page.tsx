'use client';

import React, { useEffect, useRef } from 'react';
import { Navbar } from '@/components/navbar';

const UNICORN_STUDIO_PROJECT_ID = '8zvmM9ZMVMtmZevY9Q0S';

declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized: boolean;
      init?: () => void;
    };
  }
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || window.UnicornStudio?.isInitialized) {
      return;
    }

    if (!window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false };
    }

    const script = document.createElement('script');
    script.src =
      'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.34/dist/unicornStudio.umd.js';
    script.onload = () => {
      if (!window.UnicornStudio?.isInitialized && window.UnicornStudio?.init) {
        window.UnicornStudio.init();
        window.UnicornStudio.isInitialized = true;
      }
    };
    (document.head || document.body).appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden relative">
      <Navbar />
      <div
        ref={containerRef}
        data-us-project={UNICORN_STUDIO_PROJECT_ID}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white text-center px-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] whitespace-nowrap">
          Your world.{' '}
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Visualized.
          </span>
        </h1>
      </div>
    </div>
  );
}
