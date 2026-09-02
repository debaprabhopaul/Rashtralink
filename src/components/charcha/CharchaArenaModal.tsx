'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/store-context';
import { BharatConsensusBar } from './BharatConsensusBar';
import {
  X,
  Scale,
  ThumbsUp,
  ShieldAlert,
  Send,
  Link2,
  ExternalLink,
  CheckCircle2,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const CharchaArenaModal: React.FC = () => {
  const {
    activeCharchaPostId,
    setActiveCharchaPostId,
    posts,
    debates,
    addDebate,
    upvoteDebate,
    currentUser,
    isIncognitoMode,
    t,
  } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'agree' | 'disagree'>('all');
  const [argumentText, setArgumentText] = useState('');
  const [voteChoice, setVoteChoice] = useState<boolean>(true); // true = Agree / In Favor, false = Counter
  const [isIncognitoPost, setIsIncognitoPost] = useState<boolean>(isIncognitoMode);
  const [citationInput, setCitationInput] = useState('');
  const [showCitationInput, setShowCitationInput] = useState(false);

  const activePost = posts.find((p) => p.id === activeCharchaPostId);
  const postDebates = (activeCharchaPostId && debates[activeCharchaPostId]) || [];

  if (!activeCharchaPostId || !activePost) return null;

  const agreeCount = postDebates.filter((d) => d.vote_agree).length;
  const disagreeCount = postDebates.filter((d) => !d.vote_agree).length;

  const filteredDebates = postDebates.filter((d) => {
    if (filterType === 'agree') return d.vote_agree;
    if (filterType === 'disagree') return !d.vote_agree;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!argumentText.trim()) return;

    addDebate(
      activePost.id,
      argumentText.trim(),
      voteChoice,
      isIncognitoPost,
      citationInput.trim() ? [citationInput.trim()] : []
    );

    setArgumentText('');
    setCitationInput('');
    setShowCitationInput(false);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setActiveCharchaPostId(null);
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-md p-2 sm:p-4 animate-fade-in-up"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FDFBF7] dark:bg-navy border border-border-light dark:border-navy-light rounded-2xl sm:rounded-3xl max-w-2xl w-full h-[92vh] shadow-2xl flex flex-col overflow-hidden relative animate-spring-pop"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border-light dark:border-navy-light flex items-center justify-between shrink-0 bg-white/70 dark:bg-navy-card/70 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-saffron-light dark:bg-saffron/20 text-saffron">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-navy dark:text-white">
                  Charcha Arena (चर्चा अखाड़ा)
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-saffron text-white text-[10px] font-bold">
                  Core Differentiator
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Structured, evidence-backed discourse replacing toxic comment loops.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveCharchaPostId(null)}
            className="p-2 rounded-full text-slate-400 hover:text-navy dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content: Original Post Summary + Consensus Bar + Arguments */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Post Context Summary Card */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-navy-card border border-slate-200 dark:border-navy-border shadow-xs">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="relative w-7 h-7 rounded-full overflow-hidden border border-slate-200">
                <Image
                  src={activePost.user_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={activePost.user_handle}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs font-bold text-navy dark:text-white">
                @{activePost.user_handle}
              </span>
              <span className="text-[10px] text-slate-400">Debate Topic</span>
            </div>
            <p className="text-xs sm:text-sm text-navy dark:text-slate-100 font-medium line-clamp-3 leading-relaxed">
              {activePost.caption}
            </p>
          </div>

          {/* Live Bharat Voice Consensus Bar */}
          <BharatConsensusBar agreeCount={agreeCount} disagreeCount={disagreeCount} />

          {/* Filter Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-border/80 pb-2">
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  filterType === 'all'
                    ? 'bg-navy dark:bg-white text-white dark:text-navy'
                    : 'bg-slate-100 dark:bg-navy-card text-slate-600 dark:text-slate-300'
                }`}
              >
                All Arguments ({postDebates.length})
              </button>

              <button
                onClick={() => setFilterType('agree')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  filterType === 'agree'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>In Favor ({agreeCount})</span>
              </button>

              <button
                onClick={() => setFilterType('disagree')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  filterType === 'disagree'
                    ? 'bg-saffron text-white'
                    : 'bg-saffron-light dark:bg-saffron/15 text-saffron'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Counter-Points ({disagreeCount})</span>
              </button>
            </div>
          </div>

          {/* Arguments List */}
          <div className="space-y-3">
            {filteredDebates.length > 0 ? (
              filteredDebates.map((debate) => (
                <div
                  key={debate.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    debate.vote_agree
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/15 border-emerald-200 dark:border-emerald-900/40'
                      : 'bg-orange-50/40 dark:bg-orange-950/15 border-orange-200 dark:border-orange-900/40'
                  }`}
                >
                  {/* Author & Vote Stance Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="relative w-6 h-6 rounded-full overflow-hidden border border-slate-200 bg-slate-200">
                        <Image
                          src={debate.user_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                          alt={debate.user_handle}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-xs font-bold text-navy dark:text-white">
                        {debate.user_name || `@${debate.user_handle}`}
                      </span>
                      {debate.is_incognito && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                          <ShieldAlert className="w-2.5 h-2.5 text-saffron" />
                          <span>Incognito</span>
                        </span>
                      )}
                    </div>

                    {/* Stance Indicator */}
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        debate.vote_agree
                          ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                          : 'bg-orange-200 dark:bg-orange-900 text-orange-900 dark:text-orange-200'
                      }`}
                    >
                      {debate.vote_agree ? '✓ In Favor' : '⚡ Counter-Argument'}
                    </span>
                  </div>

                  {/* Argument Content */}
                  <p className="text-xs sm:text-sm text-navy dark:text-slate-100 font-normal leading-relaxed mb-3">
                    {debate.argument}
                  </p>

                  {/* Research Citations */}
                  {debate.citations && debate.citations.length > 0 && (
                    <div className="mb-3 space-y-1">
                      {debate.citations.map((cite, i) => (
                        <a
                          key={i}
                          href={cite}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-blue-600 dark:text-blue-400 hover:underline max-w-full truncate bg-white/60 dark:bg-navy-card/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900"
                        >
                          <Link2 className="w-3 h-3 shrink-0" />
                          <span className="truncate">{cite}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Upvote & Endorsement Button */}
                  <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5 text-xs">
                    <button
                      onClick={() => upvoteDebate(debate.id, activePost.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                        debate.is_upvoted
                          ? 'bg-saffron text-white'
                          : 'bg-white/80 dark:bg-navy-card text-slate-600 dark:text-slate-300 hover:text-saffron'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${debate.is_upvoted ? 'fill-white' : ''}`} />
                      <span>{debate.upvotes_count} Endorsements</span>
                    </button>

                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(debate.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-xs">
                No arguments in this category yet. Be the first to provide a structured perspective!
              </div>
            )}
          </div>
        </div>

        {/* Bottom Argument Composer Box */}
        <div className="p-4 border-t border-border-light dark:border-navy-light bg-white dark:bg-navy-card shrink-0">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Stance Selector & Incognito Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* Vote Choice */}
              <div className="flex rounded-xl bg-slate-100 dark:bg-navy p-1 border border-slate-200 dark:border-navy-border">
                <button
                  type="button"
                  onClick={() => setVoteChoice(true)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    voteChoice
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>In Favor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVoteChoice(false)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    !voteChoice
                      ? 'bg-saffron text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Counter-Argument</span>
                </button>
              </div>

              {/* Incognito Toggle */}
              <button
                type="button"
                onClick={() => setIsIncognitoPost(!isIncognitoPost)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                  isIncognitoPost
                    ? 'border-saffron bg-saffron-light dark:bg-saffron/20 text-saffron'
                    : 'border-slate-200 dark:border-navy-border bg-slate-50 dark:bg-navy text-slate-600 dark:text-slate-300'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{isIncognitoPost ? 'Incognito Mode Active' : 'Post Anonymously'}</span>
              </button>
            </div>

            {/* Argument Textarea */}
            <div className="relative">
              <textarea
                rows={3}
                placeholder={
                  voteChoice
                    ? 'State your supporting arguments and real-world observations...'
                    : 'Present your structured counter-argument or contrasting data...'
                }
                value={argumentText}
                onChange={(e) => setArgumentText(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-navy-border bg-white dark:bg-navy text-xs text-navy dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-saffron"
              />
            </div>

            {/* Citations Input Toggle & Field */}
            {showCitationInput ? (
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Citation link (e.g. https://pib.gov.in, research paper)..."
                  value={citationInput}
                  onChange={(e) => setCitationInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-navy-border bg-white dark:bg-navy text-xs focus:outline-none focus:ring-2 focus:ring-saffron"
                />
                <button
                  type="button"
                  onClick={() => setShowCitationInput(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowCitationInput(true)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-saffron hover:underline"
              >
                <Link2 className="w-3 h-3" />
                <span>+ Add Research Citation / Source Link</span>
              </button>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!argumentText.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-saffron text-white font-bold text-xs hover:bg-saffron-hover disabled:opacity-50 transition-all shadow-md active:scale-[0.99]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Record Argument & Update Consensus</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
