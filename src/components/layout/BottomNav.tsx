'use client';

import React from 'react';
import { useApp } from '@/lib/store-context';
import { Home, Compass, PlusCircle, Scale, User, Settings } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const {
    setCreateDrawerOpen,
    isProfileOpen,
    setIsProfileOpen,
    setSearchOpen,
    setActiveCharchaPostId,
    posts,
    setSettingsOpen,
    t,
  } = useApp();

  const handleOpenCharcha = () => {
    // Open Charcha Arena for the most active debate post or post_1
    const debatePost = posts.find((p) => (p.debates_count ?? 0) > 0) || posts[0];
    if (debatePost) {
      setActiveCharchaPostId(debatePost.id);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#FDFBF7]/95 dark:bg-[#081D34]/95 backdrop-blur-lg border-t border-border-light dark:border-navy-light px-4 flex items-center justify-around max-w-lg mx-auto md:max-w-2xl md:rounded-t-2xl md:shadow-lg transition-colors">
      {/* Feed Tab */}
      <button
        onClick={() => {
          setIsProfileOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center gap-1 transition-colors ${
          !isProfileOpen ? 'text-saffron font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[11px]">{t('feed')}</span>
      </button>

      {/* Explore / Search Tab */}
      <button
        onClick={() => setSearchOpen(true)}
        className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white transition-colors"
      >
        <Compass className="w-5 h-5" />
        <span className="text-[11px]">{t('explore')}</span>
      </button>

      {/* ➕ Create Post Button (Center Highlight) */}
      <button
        onClick={() => setCreateDrawerOpen(true)}
        className="flex items-center justify-center -translate-y-3 w-12 h-12 rounded-full bg-gradient-to-tr from-saffron to-amber-500 text-white shadow-lg shadow-saffron/30 hover:scale-105 active:scale-95 transition-all"
        title="Create Post, OneShot, Story or Poll"
      >
        <PlusCircle className="w-7 h-7" />
      </button>

      {/* Charcha Arena Tab */}
      <button
        onClick={handleOpenCharcha}
        className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white transition-colors"
      >
        <Scale className="w-5 h-5" />
        <span className="text-[11px]">{t('arena')}</span>
      </button>

      {/* Profile Tab */}
      <button
        onClick={() => setIsProfileOpen(true)}
        className={`flex flex-col items-center gap-1 transition-colors ${
          isProfileOpen ? 'text-saffron font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[11px]">{t('profile')}</span>
      </button>
    </nav>
  );
};
