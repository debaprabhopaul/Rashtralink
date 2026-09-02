'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store-context';
import { normalizeTag } from '@/lib/matrix-engine';
import {
  X,
  Sliders,
  RotateCcw,
  Plus,
  Trash2,
  Cpu,
  CheckCircle2,
  Sparkles,
  Info,
  Zap,
  Tag,
  ArrowRight,
} from 'lucide-react';

const SUGGESTED_LEVERS = [
  '#ai',
  '#semiconductors',
  '#defence',
  '#space',
  '#agritech',
  '#macro',
  '#startups',
  '#mobility',
  '#energy',
  '#fintech',
];

export const PriorityMatrixHUD: React.FC = () => {
  const {
    priorityMatrix,
    updatePriorityMatrix,
    resetPriorityMatrix,
    isMatrixHUDOpen,
    setMatrixHUDOpen,
    injectCustomLever,
    t,
  } = useApp();

  const [matrixState, setMatrixState] = useState<Record<string, number>>({ ...priorityMatrix });
  const [newTag, setNewTag] = useState('');

  // Keep local HUD state synced with store matrix
  useEffect(() => {
    if (isMatrixHUDOpen) {
      setMatrixState({ ...priorityMatrix });
    }
  }, [isMatrixHUDOpen, priorityMatrix]);

  if (!isMatrixHUDOpen) return null;

  const handleSliderChange = (tag: string, value: number) => {
    setMatrixState((prev) => ({
      ...prev,
      [tag]: value,
    }));
  };

  const handleAddTag = (rawTag: string) => {
    const clean = normalizeTag(rawTag);
    if (!clean) return;

    setMatrixState((prev) => ({
      ...prev,
      [clean]: prev[clean] ?? 85,
    }));
    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    setMatrixState((prev) => {
      const copy = { ...prev };
      delete copy[tag];
      return copy;
    });
  };

  const handleSaveAndRerank = () => {
    updatePriorityMatrix(matrixState);
    setMatrixHUDOpen(false);
  };

  const handleReset = () => {
    resetPriorityMatrix();
    setMatrixHUDOpen(false);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setMatrixHUDOpen(false);
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-md p-4 animate-fade-in-up"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FDFBF7] dark:bg-[#0A1D34] border border-border-light dark:border-slate-700/80 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative max-h-[90vh] flex flex-col animate-spring-pop text-navy dark:text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-700/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-saffron-light dark:bg-saffron/20 text-saffron shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-navy dark:text-white">
                {t('priorityMatrix')} Control Center
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Direct Algorithmic Governance
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMatrixHUDOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-navy dark:hover:text-white transition-colors active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Algorithm Formula Banner */}
        <div className="my-3 p-3 rounded-2xl bg-blue-50/80 dark:bg-[#061528] border border-blue-200 dark:border-blue-900/40 text-navy dark:text-slate-200 text-xs shrink-0 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-navy dark:text-white">
              Deterministic Bharat Feed Scoring:
            </span>
            <code className="text-[11px] font-mono text-saffron bg-saffron/10 px-1.5 py-0.5 rounded-md mt-0.5 inline-block">
              Score(P) = Σ weight(tag_i)
            </code>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">
              Posts rank deterministically by summing your custom weights. Chronological tie-break.
            </p>
          </div>
        </div>

        {/* Custom Lever Injector */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#061528] border border-slate-200 dark:border-slate-700 mb-3 space-y-2 shrink-0">
          <span className="text-xs font-bold text-navy dark:text-white flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-saffron" />
            Inject Custom Hashtag Lever:
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. #space, #semiconductors, #ai..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag(newTag);
                }
              }}
              className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0A1D34] text-xs text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron"
            />
            <button
              type="button"
              onClick={() => handleAddTag(newTag)}
              className="px-3.5 py-1.5 rounded-xl bg-saffron text-white text-xs font-bold hover:bg-saffron-hover transition-all shadow-xs active:scale-95"
            >
              + Inject
            </button>
          </div>

          {/* Suggested quick chips */}
          <div className="flex flex-wrap gap-1 items-center pt-1">
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Suggestions:</span>
            {SUGGESTED_LEVERS.map((tag) => {
              const clean = normalizeTag(tag);
              const exists = matrixState[clean] !== undefined;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddTag(tag)}
                  disabled={exists}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition-all active:scale-95 ${
                    exists
                      ? 'border-saffron/30 bg-saffron/10 text-saffron opacity-60 cursor-default'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0A1D34] text-slate-600 dark:text-slate-300 hover:border-saffron hover:text-saffron'
                  }`}
                >
                  {tag} {exists ? '✓' : '+'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Sliders List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3 min-h-0">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
            Active Priority Levers ({Object.keys(matrixState).length}):
          </span>

          {Object.entries(matrixState).length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              No active levers. Inject a hashtag above!
            </div>
          ) : (
            Object.entries(matrixState).map(([tag, weight]) => (
              <div
                key={tag}
                className="p-3 rounded-2xl bg-white dark:bg-[#061528] border border-slate-200 dark:border-slate-700 hover:border-saffron/40 transition-colors shadow-xs"
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <div className="flex items-center gap-1.5 text-navy dark:text-white">
                    <span className="text-saffron font-bold">#</span>
                    <span className="capitalize">{tag}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-saffron/10 dark:bg-saffron/20 text-saffron font-mono text-[11px] font-bold">
                      {weight}%
                    </span>
                    {Object.keys(matrixState).length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-slate-400 hover:text-red-500 transition-colors text-xs p-1"
                        title="Remove lever"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 font-mono">0%</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={weight}
                    onChange={(e) => handleSliderChange(tag, parseInt(e.target.value, 10))}
                    className="flex-1 accent-saffron h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 font-mono">100%</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Actions Footer */}
        <div className="pt-4 mt-3 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-500 hover:text-navy dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMatrixHUDOpen(false)}
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAndRerank}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron text-white text-xs font-bold hover:bg-saffron-hover transition-all shadow-md shadow-saffron/20 active:scale-95"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Apply & Re-rank</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
