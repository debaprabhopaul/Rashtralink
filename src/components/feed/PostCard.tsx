'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Post } from '@/lib/types';
import { useApp } from '@/lib/store-context';
import {
  Heart,
  MessageSquareQuote,
  Share2,
  ShieldAlert,
  CheckCircle2,
  Tag,
  SlidersHorizontal,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from 'lucide-react';

export const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const {
    likePost,
    setActiveCharchaPostId,
    setActiveFilterTag,
    activeFilterTag,
    showToast,
    t,
  } = useApp();

  const [showHeartPop, setShowHeartPop] = useState(false);
  const [lastTapTime, setLastTapTime] = useState(0);

  // Video state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Handle double-tap heart pop physics per PRD §4.2
  const handleMediaTouchOrClick = () => {
    const now = Date.now();
    if (now - lastTapTime < 300) {
      if (!post.is_liked) {
        likePost(post.id);
      }
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 850);
    }
    setLastTapTime(now);
  };

  const toggleVideoPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleVideoMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Rashtralink Post by @${post.user_handle}`,
        text: post.caption,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Post link copied to clipboard!', 'success');
    }
  };

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const postDate = new Date(post.created_at);
  const formattedDate = isNaN(postDate.getTime())
    ? 'Recently'
    : `${MONTHS[postDate.getUTCMonth()]} ${postDate.getUTCDate()}`;

  return (
    <article className="w-full glass-panel hover-lift rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm transition-all duration-300 animate-spring-pop">
      {/* Header: Author Info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 dark:border-navy-border bg-slate-100 dark:bg-navy-light shrink-0 shadow-xs">
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
              {post.verified && (
                <span title="Verified Bharat Citizen">
                  <CheckCircle2 className="w-3.5 h-3.5 text-viksit" />
                </span>
              )}
              {post.is_incognito && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                  <ShieldAlert className="w-2.5 h-2.5 text-saffron" />
                  <span>Incognito</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span>@{post.user_handle}</span>
              <span>•</span>
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Priority Matrix Score Badge (Transparency) */}
        {post.score !== undefined && post.score > 0 && (
          <div
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-saffron-light dark:bg-saffron/15 text-saffron border border-saffron/25 text-[10px] font-bold shadow-xs"
            title={`Priority Matrix Score: ${post.score} based on your active lever weights`}
          >
            <SlidersHorizontal className="w-2.5 h-2.5" />
            <span>Score {post.score}</span>
          </div>
        )}
      </div>

      {/* Caption Content */}
      <p className="text-xs sm:text-sm text-navy dark:text-slate-100 font-normal leading-relaxed mb-3 whitespace-pre-line">
        {post.caption}
      </p>

      {/* Video Media Player */}
      {post.video_url && (
        <div
          onClick={handleMediaTouchOrClick}
          className="relative w-full h-64 sm:h-80 rounded-xl sm:rounded-2xl overflow-hidden mb-3 bg-black cursor-pointer select-none group shadow-md"
        >
          <video
            ref={videoRef}
            src={post.video_url}
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Video Control Bar Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={toggleVideoMute}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-md transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={toggleVideoPlay}
                className="p-3.5 rounded-full bg-saffron text-white hover:scale-110 shadow-lg shadow-saffron/40 transition-transform"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white pl-0.5" />}
              </button>
            </div>

            <div className="text-[10px] text-white/80 font-mono">
              Bharat Sovereign Video
            </div>
          </div>

          {/* Heart Pop Overlay */}
          {showHeartPop && (
            <div className="heart-pop-active absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
              <Heart className="w-24 h-24 text-red-500 fill-red-500 drop-shadow-2xl" />
            </div>
          )}
        </div>
      )}

      {/* Image Media with Double-Tap Heart Physics */}
      {!post.video_url && post.media_url && (
        <div
          onClick={handleMediaTouchOrClick}
          className="relative w-full h-56 sm:h-72 rounded-xl sm:rounded-2xl overflow-hidden mb-3 bg-slate-100 dark:bg-navy-light cursor-pointer select-none group shadow-sm"
        >
          <Image
            src={post.media_url}
            alt="Post media"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />

          {/* Heart Pop Overlay */}
          {showHeartPop && (
            <div className="heart-pop-active absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
              <Heart className="w-24 h-24 text-red-500 fill-red-500 drop-shadow-2xl" />
            </div>
          )}
        </div>
      )}

      {/* Hashtag Pillars */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map((tag) => {
            const cleanTag = tag.replace(/^#/, '');
            const isFiltering = activeFilterTag === cleanTag;
            return (
              <button
                key={tag}
                onClick={() => setActiveFilterTag(isFiltering ? null : cleanTag)}
                className={`text-[11px] px-2.5 py-0.5 rounded-lg font-medium transition-all ${
                  isFiltering
                    ? 'bg-saffron text-white shadow-xs'
                    : 'glass-pill text-slate-600 dark:text-slate-300 hover:text-saffron hover:border-saffron/40'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-navy-border/60">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Like Button */}
          <button
            onClick={() => likePost(post.id)}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-all active:scale-90 ${
              post.is_liked ? 'text-red-500' : 'text-slate-500 dark:text-slate-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 transition-transform ${post.is_liked ? 'fill-red-500 scale-110' : ''}`} />
            <span>{post.likes_count}</span>
          </button>

          {/* Charcha Arena Trigger (Bharat Consensus) */}
          <button
            onClick={() => setActiveCharchaPostId(post.id)}
            className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-saffron-light dark:bg-saffron/15 text-saffron hover:bg-saffron hover:text-white text-xs font-bold transition-all shadow-xs hover:shadow-md"
            title="Open Structured Debate Arena"
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>Charcha ({post.debates_count || 0})</span>
          </button>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white transition-colors"
          title="Share Post"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
};
