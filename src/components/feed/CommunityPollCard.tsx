'use client';

import React from 'react';
import Image from 'next/image';
import { Post } from '@/lib/types';
import { useApp } from '@/lib/store-context';
import {
  BarChart3,
  CheckCircle2,
  Heart,
  MessageSquareQuote,
  Share2,
  ShieldAlert,
  Vote,
  SlidersHorizontal,
} from 'lucide-react';

export const CommunityPollCard: React.FC<{ post: Post }> = ({ post }) => {
  const {
    likePost,
    votePoll,
    setActiveCharchaPostId,
    setActiveFilterTag,
    activeFilterTag,
    showToast,
  } = useApp();

  const poll = post.poll_data;
  if (!poll) return null;

  const hasVoted = Boolean(poll.user_voted_option_id);
  const totalVotes = poll.total_votes || 1;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Poll link copied to clipboard!', 'success');
  };

  return (
    <article className="w-full bg-white dark:bg-navy-card border border-border-light dark:border-navy-border rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 dark:border-navy-border bg-slate-100 dark:bg-navy-light shrink-0">
            <Image
              src={post.user_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={post.user_handle}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-bold text-navy dark:text-white">
                {post.user_name || `@${post.user_handle}`}
              </span>
              {post.verified && <CheckCircle2 className="w-3.5 h-3.5 text-viksit" />}
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/40 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                <BarChart3 className="w-2.5 h-2.5" />
                <span>Bharat Poll</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span>@{post.user_handle}</span>
            </div>
          </div>
        </div>

        {post.score !== undefined && post.score > 0 && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-saffron-light dark:bg-saffron/15 text-saffron border border-saffron/20 text-[10px] font-bold">
            <SlidersHorizontal className="w-2.5 h-2.5" />
            <span>Score {post.score}</span>
          </div>
        )}
      </div>

      {/* Poll Caption / Question */}
      <p className="text-xs sm:text-sm text-navy dark:text-slate-100 font-medium mb-3">
        {post.caption}
      </p>

      {/* Poll Question Container */}
      <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#FDFBF7] dark:bg-navy/70 border border-slate-200 dark:border-navy-border mb-3 space-y-2.5">
        <h4 className="text-xs sm:text-sm font-bold text-navy dark:text-white">
          {poll.question}
        </h4>

        {/* Options List */}
        <div className="space-y-2">
          {poll.options.map((option) => {
            const isUserChoice = poll.user_voted_option_id === option.id;
            const percentage = Math.round((option.votes / totalVotes) * 100) || 0;

            return (
              <div
                key={option.id}
                onClick={() => votePoll(post.id, option.id)}
                className={`relative overflow-hidden rounded-xl border p-3 cursor-pointer select-none transition-all ${
                  isUserChoice
                    ? 'border-saffron bg-saffron-light/40 dark:bg-saffron/15 ring-1 ring-saffron'
                    : 'border-slate-200 dark:border-navy-border bg-white dark:bg-navy-card hover:border-saffron/40'
                }`}
              >
                {/* Dynamic % Fill Bar */}
                {hasVoted && (
                  <div
                    className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                      isUserChoice
                        ? 'bg-saffron/20 dark:bg-saffron/30'
                        : 'bg-slate-200/60 dark:bg-navy-light/60'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                )}

                <div className="relative z-10 flex items-center justify-between gap-2 text-xs">
                  <span
                    className={`font-semibold ${
                      isUserChoice ? 'text-saffron dark:text-saffron font-bold' : 'text-navy dark:text-slate-100'
                    }`}
                  >
                    {option.text}
                  </span>

                  {hasVoted && (
                    <span className="font-bold text-slate-700 dark:text-slate-300 font-mono text-xs">
                      {percentage}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
          <span>{poll.total_votes} total Bharat votes</span>
          {hasVoted && <span className="text-viksit font-semibold">✓ Your vote counted</span>}
        </div>
      </div>

      {/* Hashtag Pillars */}
      {post.tags && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map((tag) => {
            const cleanTag = tag.replace(/^#/, '');
            const isFiltering = activeFilterTag === cleanTag;
            return (
              <button
                key={tag}
                onClick={() => setActiveFilterTag(isFiltering ? null : cleanTag)}
                className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                  isFiltering
                    ? 'bg-saffron text-white'
                    : 'bg-slate-100 dark:bg-navy-light text-slate-600 dark:text-slate-300 hover:text-saffron'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-navy-border/60">
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => likePost(post.id)}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
              post.is_liked ? 'text-red-500' : 'text-slate-500 dark:text-slate-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${post.is_liked ? 'fill-red-500' : ''}`} />
            <span>{post.likes_count}</span>
          </button>

          <button
            onClick={() => setActiveCharchaPostId(post.id)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-light dark:bg-saffron/15 text-saffron hover:bg-saffron hover:text-white text-xs font-bold transition-all"
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>Charcha ({post.debates_count || 0})</span>
          </button>
        </div>

        <button
          onClick={handleShare}
          className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white transition-colors"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
};
