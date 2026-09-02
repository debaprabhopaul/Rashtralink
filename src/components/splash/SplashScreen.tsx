'use client';

import React from 'react';
import Image from 'next/image';

export const SplashScreen: React.FC = () => {
  return (
    <div
      className="pure-css-splash fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FDFBF7] dark:bg-[#081D34] select-none pointer-events-none"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center text-center px-6 max-w-md animate-fade-in-up">
        {/* Rashtralink Logo */}
        <div className="relative w-64 h-20 mb-3">
          <Image
            src="/logo.png"
            alt="Rashtralink Logo"
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* Flag Badge & Tagline */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-light dark:bg-navy-light border border-saffron/20 text-saffron font-medium text-xs tracking-wide shadow-sm mb-4">
          <span className="inline-block w-2 h-2 rounded-full bg-saffron animate-pulse" />
          <span>Rashtralink • Sovereign Social Infrastructure</span>
        </div>

        <p className="text-sm font-medium text-[#081D34]/80 dark:text-slate-300 tracking-wide">
          Algorithmic Sovereignty • Bharat Consensus
        </p>

        {/* Pure CSS minimalist loader indicator */}
        <div className="w-24 h-1 mt-6 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-saffron via-amber-500 to-viksit animate-[pulse_1s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
};
