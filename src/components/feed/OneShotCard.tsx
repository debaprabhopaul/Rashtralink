'use client';

import React from 'react';
import Image from 'next/image';
import { Post } from '@/lib/types';
import { useApp } from '@/lib/store-context';
import {
  Zap,
  CheckCircle2,
  Heart,
  MessageSquareQuote,
  Share2,
  Play,
  SlidersHorizontal,
  Flame,
} from 'lucide-react';

export const OneShotCard: React.FC<{ post: Post }> = ({ post }) => {
  const {
    likePost,
    setActiveCharchaPostId,
    setActiveOneShotPost,
    setActiveFilterTag,
    activeFilterTag,
    showToast,
  } = useApp();

  const oneshot = post.oneshot_data;
  if (!oneshot) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('OneShot link copied to clipboard!', 'success');
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
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-orange-100 dark:bg-orange-950/40 text-[10px] font-bold text-saffron">
                <Zap className="w-2.5 h-2.5 fill-saffron" />
                <span>OneShot (15s)</span>
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

      {/* OneShot Interactive Teaser Card */}
      <div
        onClick={() => setActiveOneShotPost(post)}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#081D34] to-[#102A45] p-5 text-white mb-3 cursor-pointer group shadow-md"
      >
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold">
          <Zap className="w-3 h-3 text-saffron fill-saffron" />
          <span>15s Flash</span>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider text-saffron block mb-1">
          {oneshot.category}
        </span>
        <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug mb-2 group-hover:text-saffron-light transition-colors">
          {oneshot.title}
        </h3>
        <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {oneshot.summary}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <span className="text-[11px] text-slate-400 font-medium">
            {oneshot.slides.length} swipeable flash insights
          </span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron text-white text-xs font-bold group-hover:scale-105 transition-transform shadow-sm">
            <Play className="w-3 h-3 fill-white" />
            <span>Launch OneShot</span>
          </div>
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
