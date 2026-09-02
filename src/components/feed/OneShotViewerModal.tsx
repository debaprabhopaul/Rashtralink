'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/store-context';
import { X, ChevronLeft, ChevronRight, Zap, Heart, Share2, Sparkles, Volume2, VolumeX } from 'lucide-react';

export const OneShotViewerModal: React.FC = () => {
  const {
    activeOneShotPost,
    setActiveOneShotPost,
    likePost,
    setActiveCharchaPostId,
    showToast,
  } = useApp();

  const [slideIndex, setSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const oneshot = activeOneShotPost?.oneshot_data;
  const slides = oneshot?.slides || [];

  useEffect(() => {
    if (!activeOneShotPost || slides.length === 0) return;
    setProgress(0);

    const interval = setInterval(() => {
      if (!isPaused) {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + (100 / (15 * 10)); // 15 seconds total budget
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [slideIndex, activeOneShotPost, isPaused]);

  if (!activeOneShotPost || !oneshot) return null;

  const currentSlide = slides[slideIndex] || slides[0];

  const handleNext = () => {
    if (slideIndex < slides.length - 1) {
      setSlideIndex(slideIndex + 1);
      setProgress(0);
    } else {
      setActiveOneShotPost(null);
      setSlideIndex(0);
    }
  };

  const handlePrev = () => {
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-0 sm:p-4 select-none animate-fade-in-up">
      <div
        className="relative w-full h-full sm:h-[90vh] sm:max-w-md bg-navy rounded-none sm:rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl p-6"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Background Video / Image / Gradient Layer */}
        {currentSlide.video_url ? (
          <div className="absolute inset-0 z-0">
            <video
              ref={videoRef}
              src={currentSlide.video_url}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/70" />
          </div>
        ) : currentSlide.media_url ? (
          <div className="absolute inset-0 z-0">
            <Image
              src={currentSlide.media_url}
              alt="OneShot slide media"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/70" />
          </div>
        ) : (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${
              currentSlide.bg_gradient || 'from-navy via-navy-light to-black'
            } opacity-95 transition-all duration-500`}
          />
        )}

        {/* Top Header & Progress */}
        <div className="relative z-10 space-y-3">
          {/* Progress Bars */}
          <div className="flex gap-1.5 w-full">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className="h-1.5 flex-1 bg-white/25 rounded-full overflow-hidden backdrop-blur-sm"
              >
                <div
                  className="h-full bg-gradient-to-r from-saffron to-amber-400 transition-all duration-100 ease-linear shadow-sm"
                  style={{
                    width:
                      idx === slideIndex
                        ? `${progress}%`
                        : idx < slideIndex
                        ? '100%'
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-saffron uppercase tracking-wider border border-white/10">
                {oneshot.category}
              </span>
              <span className="text-xs text-slate-300 font-mono">
                {slideIndex + 1} / {slides.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {currentSlide.video_url && (
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
                onClick={() => setActiveOneShotPost(null)}
                className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Slide Content Card */}
        <div className="relative z-10 my-auto text-center px-4 py-6 bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl">
          {currentSlide.highlight && (
            <div className="inline-block px-3 py-1 rounded-full bg-saffron text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-saffron/30 mb-4 animate-bounce">
              {currentSlide.highlight}
            </div>
          )}

          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3 drop-shadow-md">
            {currentSlide.title}
          </h2>

          <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed max-w-sm mx-auto">
            {currentSlide.content}
          </p>
        </div>

        {/* Tap areas for Prev / Next navigation */}
        <div className="absolute inset-0 z-0 flex">
          <div onClick={handlePrev} className="w-1/3 h-full cursor-pointer" />
          <div onClick={handleNext} className="w-2/3 h-full cursor-pointer" />
        </div>

        {/* Bottom Actions */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => likePost(activeOneShotPost.id)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 text-white hover:text-red-500 text-xs font-bold transition-all active:scale-95"
            >
              <Heart
                className={`w-4 h-4 ${activeOneShotPost.is_liked ? 'fill-red-500 text-red-500' : ''}`}
              />
              <span>{activeOneShotPost.likes_count}</span>
            </button>

            <button
              onClick={() => {
                setActiveOneShotPost(null);
                setActiveCharchaPostId(activeOneShotPost.id);
              }}
              className="px-4 py-1.5 rounded-full bg-saffron text-white text-xs font-bold hover:bg-saffron-hover transition-transform active:scale-95 shadow-md shadow-saffron/30"
            >
              Discuss in Charcha
            </button>
          </div>

          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              showToast('OneShot link copied!', 'success');
            }}
            className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
