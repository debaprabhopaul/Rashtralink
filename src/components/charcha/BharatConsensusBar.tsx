'use client';

import React from 'react';
import { Scale, CheckCircle, AlertCircle, Sparkles, TrendingUp } from 'lucide-react';

interface BharatConsensusBarProps {
  agreeCount: number;
  disagreeCount: number;
}

export const BharatConsensusBar: React.FC<BharatConsensusBarProps> = ({
  agreeCount,
  disagreeCount,
}) => {
  const total = agreeCount + disagreeCount;
  const agreePercent = total > 0 ? Math.round((agreeCount / total) * 100) : 50;
  const disagreePercent = 100 - agreePercent;

  return (
    <div className="w-full p-4 sm:p-5 rounded-2xl sm:rounded-3xl glass-panel bg-gradient-to-r from-emerald-950/20 via-navy-light/40 to-orange-950/20 border border-slate-200 dark:border-navy-border shadow-lg relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-32 h-16 bg-emerald-500/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-32 h-16 bg-saffron/10 blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-saffron/20 text-saffron">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-black text-navy dark:text-white uppercase tracking-wider block">
              Bharat Voice Consensus
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              Live structured consensus engine
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-navy text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-border">
          <TrendingUp className="w-3 h-3 text-saffron" />
          <span>{total} arguments</span>
        </div>
      </div>

      {/* Visual Split Bar */}
      <div className="relative h-5 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 flex shadow-inner p-0.5 border border-black/5 dark:border-white/5">
        {/* Agree / In Favor Segment (Green / Viksit) */}
        <div
          className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-viksit rounded-l-full transition-all duration-700 ease-out flex items-center justify-start pl-2.5 shadow-sm"
          style={{ width: `${agreePercent}%` }}
        >
          {agreePercent >= 15 && (
            <span className="text-[10px] font-black text-white drop-shadow-sm font-mono">
              {agreePercent}%
            </span>
          )}
        </div>

        {/* Disagree / Counter Segment (Saffron / Orange) */}
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-saffron rounded-r-full transition-all duration-700 ease-out flex items-center justify-end pr-2.5 shadow-sm"
          style={{ width: `${disagreePercent}%` }}
        >
          {disagreePercent >= 15 && (
            <span className="text-[10px] font-black text-white drop-shadow-sm font-mono">
              {disagreePercent}%
            </span>
          )}
        </div>
      </div>

      {/* Labels below bar */}
      <div className="flex items-center justify-between mt-3 text-xs font-bold relative z-10">
        <div className="flex items-center gap-1.5 text-viksit px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>In Favor: {agreeCount} ({agreePercent}%)</span>
        </div>

        <div className="flex items-center gap-1.5 text-saffron px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-900/40">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Counter: {disagreeCount} ({disagreePercent}%)</span>
        </div>
      </div>
    </div>
  );
};
