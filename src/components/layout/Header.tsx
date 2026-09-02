'use client';

import React from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/store-context';
import { Search, Bell, MessageSquare, ShieldAlert, Sparkles } from 'lucide-react';
import { LockedV2Badge } from '../common/LockedV2Badge';

export const Header: React.FC = () => {
  const {
    unreadNotificationsCount,
    setNotificationsOpen,
    setSearchOpen,
    isIncognitoMode,
    setIsIncognitoMode,
    currentLanguage,
    setSettingsOpen,
    showToast,
    setActiveFilterTag,
  } = useApp();

  const handleLogoClick = () => {
    setActiveFilterTag(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLockedMessagesClick = () => {
    showToast('Direct Messaging is coming in V2 (Phase 2 roadmap)', 'info');
  };

  return (
    <header className="sticky top-0 z-40 w-full h-[58px] bg-[#FDFBF7]/90 dark:bg-[#081D34]/90 backdrop-blur-xl border-b border-border-light dark:border-navy-light px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Logo (Tap to scroll to top) */}
      <div
        onClick={handleLogoClick}
        className="flex items-center gap-2 cursor-pointer select-none group"
      >
        <div className="relative w-36 sm:w-40 h-9 transition-transform group-hover:scale-[1.02]">
          <Image
            src="/logo.png"
            alt="Rashtralink Logo"
            fill
            priority
            className="object-contain"
          />
        </div>
        {isIncognitoMode && (
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            <ShieldAlert className="w-2.5 h-2.5 text-saffron" />
            <span>Incognito</span>
          </span>
        )}
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Icon */}
        <button
          onClick={() => setSearchOpen(true)}
          className="p-2 rounded-full text-navy dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-navy-light transition-colors relative"
          title="Search Bharat creators & hashtags"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Locked Messages V2 Icon per PRD §6.1 */}
        <div
          onClick={handleLockedMessagesClick}
          className="relative flex items-center p-2 rounded-full text-slate-400 dark:text-slate-500 hover:bg-slate-200/60 dark:hover:bg-navy-light transition-colors cursor-pointer group"
          title="Direct Messaging (Coming in V2)"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 px-1 py-0.2 rounded-full bg-slate-300 dark:bg-slate-700 text-[9px] font-bold text-slate-700 dark:text-slate-300 border border-slate-400/30">
            V2
          </span>
        </div>

        {/* Notifications Bell */}
        <button
          onClick={() => setNotificationsOpen(true)}
          className="p-2 rounded-full text-navy dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-navy-light transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-saffron rounded-full ring-2 ring-[#FDFBF7] dark:ring-navy animate-pulse" />
          )}
        </button>

        {/* Vernacular Language Shortcut */}
        <button
          onClick={() => setSettingsOpen(true)}
          className="px-2 py-1 rounded-lg border border-slate-200 dark:border-navy-border bg-white dark:bg-navy-card text-xs font-bold text-navy dark:text-slate-200 hover:border-saffron/40 transition-all uppercase"
          title="Switch Vernacular Language"
        >
          {currentLanguage}
        </button>
      </div>
    </header>
  );
};
