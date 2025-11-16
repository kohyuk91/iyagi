'use client';

import React, { useEffect, useRef } from 'react';
import { Navbar } from '@/components/navbar';

const UNICORN_STUDIO_PROJECT_ID = '8zvmM9ZMVMtmZevY9Q0S';
const SCRIPT_URL =
  'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.34/dist/unicornStudio.umd.js';

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
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const initializeUnicornStudio = () => {
      if (window.UnicornStudio?.init) {
        window.UnicornStudio.init();
        window.UnicornStudio.isInitialized = true;
      }
    };

    if (window.UnicornStudio?.init) {
      initializeUnicornStudio();
      return;
    }

    if (scriptLoadedRef.current) {
      return;
    }

    const existingScript = document.querySelector(`script[src="${SCRIPT_URL}"]`);
    if (existingScript) {
      scriptLoadedRef.current = true;
      const checkInit = setInterval(() => {
        if (window.UnicornStudio?.init) {
          clearInterval(checkInit);
          initializeUnicornStudio();
        }
      }, 100);

      return () => clearInterval(checkInit);
    }

    scriptLoadedRef.current = true;
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      const checkInit = setInterval(() => {
        if (window.UnicornStudio?.init) {
          clearInterval(checkInit);
          initializeUnicornStudio();
        }
      }, 100);
    };
    (document.head || document.body).appendChild(script);
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
