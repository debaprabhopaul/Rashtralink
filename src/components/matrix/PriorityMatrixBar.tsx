'use client';

import React from 'react';
import { useApp } from '@/lib/store-context';
import { SlidersHorizontal, Plus, X, Sparkles } from 'lucide-react';
import { PriorityMatrixHUD } from './PriorityMatrixHUD';

export const PriorityMatrixBar: React.FC = () => {
  const {
    priorityMatrix,
    isMatrixHUDOpen,
    setMatrixHUDOpen,
    activeFilterTag,
    setActiveFilterTag,
    t,
  } = useApp();

  const entries = Object.entries(priorityMatrix).filter(([_, weight]) => weight > 0);

  return (
    <div className="w-full bg-transparent border-b border-border-light/60 dark:border-navy-light/60 px-4 py-2.5 backdrop-blur-md transition-colors">
      <div className="max-w-2xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {/* "+ Tune Levers" HUD Trigger Button */}
        <button
          onClick={() => setMatrixHUDOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-saffron text-white text-xs font-bold hover:bg-saffron-hover shadow-md shadow-saffron/20 shrink-0 active:scale-95 transition-all hover:scale-105"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{t('tuneLevers')}</span>
        </button>

        {/* "+ Inject Custom Lever" Quick Action */}
        <button
          onClick={() => setMatrixHUDOpen(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full glass-pill border border-saffron/40 text-saffron text-xs font-bold hover:bg-saffron hover:text-white shrink-0 active:scale-95 transition-all"
          title="Inject a custom topic lever"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Inject Lever</span>
        </button>

        {/* Clear filter button if a tag is clicked */}
        {activeFilterTag && (
          <button
            onClick={() => setActiveFilterTag(null)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-xs font-semibold shrink-0 border border-red-300 dark:border-red-900 active:scale-95 transition-transform"
          >
            <span>#{activeFilterTag}</span>
            <X className="w-3 h-3" />
          </button>
        )}

        {/* Active Matrix Weight Pills */}
        {entries.map(([tag, weight]) => {
          const isSelected = activeFilterTag === tag;
          return (
            <button
              key={tag}
              onClick={() => setActiveFilterTag(isSelected ? null : tag)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 border transition-all duration-200 active:scale-95 hover:-translate-y-0.5 ${
                isSelected
                  ? 'border-saffron bg-saffron text-white ring-2 ring-saffron/40 shadow-sm'
                  : 'glass-pill text-navy dark:text-slate-200 hover:border-saffron/50 hover:text-saffron shadow-xs'
              }`}
              title={`Click to filter feed by #${tag} or Tune Levers`}
            >
              <span className={isSelected ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}>#</span>
              <span>{tag}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold font-mono ${
                isSelected ? 'bg-white/25 text-white' : 'bg-saffron/10 text-saffron'
              }`}>
                {weight}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
