'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/store-context';
import { X, ChevronLeft, ChevronRight, Heart, Send, Sparkles, Volume2, VolumeX } from 'lucide-react';

export const StoryViewerModal: React.FC = () => {
  const {
    stories,
    activeStoryIndex,
    setActiveStoryIndex,
    markStoryWatched,
    showToast,
  } = useApp();

  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

  useEffect(() => {
    if (!currentStory) return;
    markStoryWatched(currentStory.id);
    setProgress(0);

    const interval = setInterval(() => {
      if (!isPaused) {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + 2;
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [activeStoryIndex, isPaused]);

  if (!currentStory || activeStoryIndex === null) return null;

  const handleNext = () => {
    if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
    } else {
      setActiveStoryIndex(null);
    }
  };

  const handlePrev = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    showToast(`Replied to @${currentStory.user_handle}'s story`, 'success');
    setReplyText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-0 sm:p-4 select-none animate-fade-in-up">
      <div
        className="relative w-full h-full sm:h-[90vh] sm:max-w-md bg-navy rounded-none sm:rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Background Video / Image / Color */}
        {currentStory.video_url ? (
          <div className="absolute inset-0 z-0">
            <video
              ref={videoRef}
              src={currentStory.video_url}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80" />
          </div>
        ) : currentStory.media_url ? (
          <div className="absolute inset-0 z-0">
            <Image
              src={currentStory.media_url}
              alt="Story media"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
          </div>
        ) : (
          <div
            className="absolute inset-0 z-0 bg-gradient-to-br from-[#081D34] to-[#102A45] flex items-center justify-center p-8"
            style={{ backgroundColor: currentStory.bg_color }}
          >
            <p className="text-xl sm:text-2xl font-bold text-white text-center leading-relaxed">
              {currentStory.text_content}
            </p>
          </div>
        )}

        {/* Top Progress Bar & Header */}
        <div className="relative z-10 p-4 space-y-3">
          {/* Progress Indicators */}
          <div className="flex gap-1.5 w-full">
            {stories.map((s, idx) => (
              <div
                key={s.id}
                className="h-1.5 flex-1 bg-white/25 rounded-full overflow-hidden backdrop-blur-sm"
              >
                <div
                  className="h-full bg-saffron transition-all duration-100 ease-linear shadow-sm"
                  style={{
                    width:
                      idx === activeStoryIndex
                        ? `${progress}%`
                        : idx < activeStoryIndex
                        ? '100%'
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Author Info & Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-white/50 shadow-md">
                <Image
                  src={currentStory.avatar_url}
                  alt={currentStory.user_handle}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  @{currentStory.user_handle}
                </span>
                <span className="text-[10px] text-slate-300">
                  {currentStory.user_name || 'Bharat Creator'} • Active 24h
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {currentStory.video_url && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              )}

              <button
                onClick={() => setActiveStoryIndex(null)}
                className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Text Caption Overlay */}
        {(currentStory.media_url || currentStory.video_url) && currentStory.text_content && (
          <div className="relative z-10 px-6 py-4">
            <div className="p-3.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs sm:text-sm font-medium leading-relaxed shadow-lg">
              {currentStory.text_content}
            </div>
          </div>
        )}

        {/* Tap areas for Prev / Next navigation */}
        <div className="absolute inset-0 z-0 flex">
          <div onClick={handlePrev} className="w-1/3 h-full cursor-pointer" />
          <div onClick={handleNext} className="w-2/3 h-full cursor-pointer" />
        </div>

        {/* Bottom Reply Bar */}
        <div className="relative z-10 p-4 bg-gradient-to-t from-black/90 to-transparent">
          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Reply to @${currentStory.user_handle}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white placeholder-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-saffron"
            />
            <button
              type="button"
              onClick={() => showToast('❤️ Reaction sent!', 'success')}
              className="p-2.5 rounded-full bg-white/15 text-white hover:text-saffron transition-colors"
            >
              <Heart className="w-5 h-5" />
            </button>
            <button
              type="submit"
              className="p-2.5 rounded-full bg-saffron text-white hover:bg-saffron-hover transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
