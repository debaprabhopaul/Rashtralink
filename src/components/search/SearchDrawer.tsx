'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/store-context';
import { Search, X, TrendingUp, Sparkles, Hash, ArrowUpRight } from 'lucide-react';

export const SearchDrawer: React.FC = () => {
  const {
    isSearchOpen,
    setSearchOpen,
    searchQuery,
    setSearchQuery,
    setActiveFilterTag,
    posts,
    t,
  } = useApp();

  const [inputVal, setInputVal] = useState(searchQuery);

  if (!isSearchOpen) return null;

  const TRENDING_TOPICS = [
    { tag: 'startups', volume: '14.2k arguments', title: 'Tier-2 Hardware Accelerators' },
    { tag: 'tech', volume: '28.9k arguments', title: 'Sovereign Indic AI Models' },
    { tag: 'finance', volume: '42.1k arguments', title: 'UPI Interoperability & ONDC' },
    { tag: 'geopolitics', volume: '19.5k arguments', title: 'Semiconductor Fab Subsidies' },
    { tag: 'culture', volume: '11.8k arguments', title: 'Indigenous Architecture' },
    { tag: 'mobility', volume: '9.4k arguments', title: 'EV Battery Swapping Policy' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputVal);
    setSearchOpen(false);
  };

  const handleSelectTrending = (tag: string) => {
    setActiveFilterTag(tag);
    setSearchOpen(false);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setSearchOpen(false);
        }
      }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-navy/80 backdrop-blur-md p-4 pt-12 sm:pt-20 animate-fade-in-up"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FDFBF7] dark:bg-navy border border-border-light dark:border-navy-light rounded-3xl max-w-lg w-full max-h-[80vh] shadow-2xl flex flex-col overflow-hidden relative p-5 animate-spring-pop"
      >
        {/* Top Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center mb-4">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            autoFocus
            className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-300 dark:border-navy-border bg-white dark:bg-navy-card text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-saffron"
          />
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            className="absolute right-3 p-1 text-slate-400 hover:text-navy dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        {/* Trending Bharat Streams */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-saffron uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Trending Bharat Streams</span>
          </div>

          <div className="space-y-2">
            {TRENDING_TOPICS.map((item) => (
              <div
                key={item.tag}
                onClick={() => handleSelectTrending(item.tag)}
                className="p-3 rounded-xl bg-white dark:bg-navy-card border border-slate-200 dark:border-navy-border hover:border-saffron/40 flex items-center justify-between cursor-pointer group transition-all"
              >
                <div>
                  <span className="text-xs font-bold text-navy dark:text-white group-hover:text-saffron transition-colors block">
                    #{item.tag}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {item.title} • {item.volume}
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-saffron transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
