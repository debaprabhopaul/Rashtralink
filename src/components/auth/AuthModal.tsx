'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/store-context';
import { X, ShieldAlert, Check } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setAuthModalOpen,
    loginWithGoogle,
    loginWithPhone,
    loginAsIncognito,
    isLoggedIn,
    isIncognitoMode,
    logout,
    t,
  } = useApp();

  const [phone, setPhone] = useState('');
  const [showPhone, setShowPhone] = useState(false);

  if (!isAuthModalOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setAuthModalOpen(false);
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/70 backdrop-blur-md p-4 animate-fade-in-up"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FDFBF7] dark:bg-navy border border-border-light dark:border-navy-light rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-spring-pop"
      >
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-navy dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative w-40 h-12 mb-2">
            <Image
              src="/logo.png"
              alt="Rashtralink"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-lg font-bold text-navy dark:text-white">
            {isLoggedIn ? 'Citizen Account & Sovereignty' : 'Citizen Authentication'}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {isLoggedIn
              ? isIncognitoMode
                ? 'You are currently browsing in Incognito Citizen mode.'
                : 'Manage sovereign profile and privacy controls.'
              : 'Sign in to publish posts and vote in the Charcha Arena.'}
          </p>
        </div>

        <div className="space-y-3">
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => loginWithGoogle()}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-300 dark:border-navy-light bg-white dark:bg-navy-light text-navy dark:text-white font-medium hover:bg-slate-50 transition-all shadow-sm"
              >
                <span>{t('continueWithGoogle')}</span>
              </button>

              {!showPhone ? (
                <button
                  onClick={() => setShowPhone(true)}
                  className="w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-navy-light bg-white dark:bg-navy-light text-navy dark:text-white font-medium hover:bg-slate-50 transition-all"
                >
                  {t('continueWithPhone')}
                </button>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="+91 Mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-navy-light bg-white dark:bg-navy-light text-sm focus:outline-none focus:ring-2 focus:ring-saffron"
                  />
                  <button
                    onClick={() => loginWithPhone(phone || '+91 98765 43210')}
                    className="px-4 py-2.5 rounded-xl bg-saffron text-white font-semibold text-sm hover:bg-saffron-hover transition-colors"
                  >
                    Verify
                  </button>
                </div>
              )}

              <button
                onClick={() => loginAsIncognito()}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 dark:bg-navy-card text-navy dark:text-slate-200 border border-slate-200 dark:border-navy-border font-medium hover:border-saffron/40 transition-all"
              >
                <ShieldAlert className="w-4 h-4 text-saffron" />
                <span>{t('browseIncognito')}</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => loginAsIncognito()}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  isIncognitoMode
                    ? 'border-saffron bg-saffron-light/50 dark:bg-saffron/20'
                    : 'border-slate-200 dark:border-navy-border bg-white dark:bg-navy-card'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-saffron" />
                  <div className="text-left">
                    <span className="text-sm font-semibold text-navy dark:text-white block">
                      Incognito Citizen Mode
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Hide public handle on posts & votes
                    </span>
                  </div>
                </div>
                {isIncognitoMode && <Check className="w-4 h-4 text-saffron" />}
              </button>

              <button
                onClick={() => logout()}
                className="w-full py-2.5 rounded-xl text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                {t('logOut')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
