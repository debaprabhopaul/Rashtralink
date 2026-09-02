'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/store-context';
import { ContentType } from '@/lib/types';
import {
  X,
  FileText,
  BarChart3,
  Zap,
  Radio,
  Video,
  BookOpen,
  ShieldAlert,
  Tag,
  Plus,
  Send,
  Sparkles,
  Image as ImageIcon,
  Film,
  Upload,
  Trash2,
} from 'lucide-react';
import { LockedV2Badge } from '../common/LockedV2Badge';

export const CreateContentDrawer: React.FC = () => {
  const {
    isCreateDrawerOpen,
    setCreateDrawerOpen,
    addPost,
    addStory,
    isIncognitoMode,
    showToast,
    t,
  } = useApp();

  const [activeFormat, setActiveFormat] = useState<ContentType>('text');
  const [caption, setCaption] = useState('');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaKind, setMediaKind] = useState<'image' | 'video' | null>(null);
  const [isIncognito, setIsIncognito] = useState(isIncognitoMode);
  const [tags, setTags] = useState<string[]>(['#startups', '#tech']);
  const [tagInput, setTagInput] = useState('');

  // Community Poll state
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);

  // OneShot Flash state
  const [oneshotCategory, setOneshotCategory] = useState('Startups & Economy');
  const [oneshotTitle, setOneshotTitle] = useState('');
  const [oneshotSlide1, setOneshotSlide1] = useState('');
  const [oneshotSlide2, setOneshotSlide2] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isCreateDrawerOpen) return null;

  // Handle direct file upload from user device
  const handleDeviceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      showToast('Please upload a valid image or video file from your device', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setMediaPreview(result);
      setMediaKind(isVideo ? 'video' : 'image');
      showToast(`Selected ${isVideo ? 'video' : 'photo'} from your device!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleClearMedia = () => {
    setMediaPreview(null);
    setMediaKind(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = tagInput.trim().replace(/^#/, '');
    if (clean && !tags.includes(`#${clean}`)) {
      setTags((prev) => [...prev, `#${clean}`]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions((prev) => [...prev, '']);
    }
  };

  const handlePollOptionChange = (idx: number, val: string) => {
    const copy = [...pollOptions];
    copy[idx] = val;
    setPollOptions(copy);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeFormat === 'story') {
      addStory({
        text_content: caption.trim() || undefined,
        media_url: mediaKind === 'image' && mediaPreview ? mediaPreview : undefined,
        video_url: mediaKind === 'video' && mediaPreview ? mediaPreview : undefined,
      });
      setCreateDrawerOpen(false);
      return;
    }

    if (activeFormat === 'community') {
      if (!pollQuestion.trim() || pollOptions.filter((o) => o.trim()).length < 2) {
        showToast('Please provide a poll question and at least 2 options', 'warning');
        return;
      }
      addPost({
        caption: caption.trim() || pollQuestion.trim(),
        content_type: 'community',
        is_incognito: isIncognito,
        tags,
        poll_data: {
          question: pollQuestion.trim(),
          options: pollOptions.filter((o) => o.trim()),
        },
      });
      setCreateDrawerOpen(false);
      return;
    }

    if (activeFormat === 'oneshot') {
      if (!oneshotTitle.trim() || !oneshotSlide1.trim()) {
        showToast('Please fill out the OneShot title and key slides', 'warning');
        return;
      }
      addPost({
        caption: caption.trim() || oneshotTitle.trim(),
        content_type: 'oneshot',
        is_incognito: isIncognito,
        tags,
        oneshot_data: {
          title: oneshotTitle.trim(),
          category: oneshotCategory,
          summary: caption.trim() || oneshotTitle.trim(),
          duration_seconds: 15,
          video_url: mediaKind === 'video' && mediaPreview ? mediaPreview : undefined,
          cover_image: mediaKind === 'image' && mediaPreview ? mediaPreview : undefined,
          slides: [
            {
              id: 's1',
              title: '1. ' + oneshotTitle.trim(),
              content: oneshotSlide1.trim(),
              highlight: 'Key Insight',
              bg_gradient: 'from-amber-600 to-orange-700',
              media_url: mediaKind === 'image' && mediaPreview ? mediaPreview : undefined,
              video_url: mediaKind === 'video' && mediaPreview ? mediaPreview : undefined,
            },
            {
              id: 's2',
              title: '2. Actionable Takeaway',
              content: oneshotSlide2.trim() || 'Accelerated growth through sovereign Bharat adoption.',
              highlight: 'Action',
              bg_gradient: 'from-blue-700 to-indigo-900',
            },
          ],
        },
      });
      setCreateDrawerOpen(false);
      return;
    }

    // Standard Post
    if (!caption.trim() && !mediaPreview) {
      showToast('Please enter post text or upload a media file', 'warning');
      return;
    }

    addPost({
      caption: caption.trim(),
      content_type: mediaKind === 'video' ? 'image' : mediaPreview ? 'image' : 'text',
      media_url: mediaKind === 'image' && mediaPreview ? mediaPreview : undefined,
      video_url: mediaKind === 'video' && mediaPreview ? mediaPreview : undefined,
      is_incognito: isIncognito,
      tags,
    });
    setCreateDrawerOpen(false);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setCreateDrawerOpen(false);
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-md p-2 sm:p-4 animate-fade-in-up"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FDFBF7] dark:bg-navy border border-border-light dark:border-navy-light rounded-3xl max-w-xl w-full max-h-[92vh] shadow-2xl flex flex-col overflow-hidden relative animate-spring-pop"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border-light dark:border-navy-light flex items-center justify-between shrink-0 glass-panel">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-saffron" />
            <h2 className="text-base sm:text-lg font-bold text-navy dark:text-white">
              Create Sovereign Content
            </h2>
          </div>
          <button
            onClick={() => setCreateDrawerOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-navy dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Format Selector Grid */}
          <div>
            <label className="block text-xs font-bold text-navy dark:text-slate-200 mb-2">
              Select Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {/* Active 1: Standard Post */}
              <button
                type="button"
                onClick={() => setActiveFormat('text')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  activeFormat === 'text' || activeFormat === 'image'
                    ? 'border-saffron bg-saffron-light dark:bg-saffron/20 text-saffron font-bold ring-1 ring-saffron'
                    : 'glass-panel text-navy dark:text-slate-300 hover:border-saffron/40'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="text-[11px]">Post / Media</span>
              </button>

              {/* Active 2: Community Poll */}
              <button
                type="button"
                onClick={() => setActiveFormat('community')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  activeFormat === 'community'
                    ? 'border-saffron bg-saffron-light dark:bg-saffron/20 text-saffron font-bold ring-1 ring-saffron'
                    : 'glass-panel text-navy dark:text-slate-300 hover:border-saffron/40'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-[11px]">Community Poll</span>
              </button>

              {/* Active 3: OneShot 15s */}
              <button
                type="button"
                onClick={() => setActiveFormat('oneshot')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  activeFormat === 'oneshot'
                    ? 'border-saffron bg-saffron-light dark:bg-saffron/20 text-saffron font-bold ring-1 ring-saffron'
                    : 'glass-panel text-navy dark:text-slate-300 hover:border-saffron/40'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span className="text-[11px]">OneShot (15s)</span>
              </button>

              {/* Active 4: What's On Story */}
              <button
                type="button"
                onClick={() => setActiveFormat('story')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  activeFormat === 'story'
                    ? 'border-saffron bg-saffron-light dark:bg-saffron/20 text-saffron font-bold ring-1 ring-saffron'
                    : 'glass-panel text-navy dark:text-slate-300 hover:border-saffron/40'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span className="text-[11px]">What's On (24h)</span>
              </button>

              {/* Locked 1: Scrolls (Vertical Video) Coming in V2 */}
              <div
                onClick={() =>
                  showToast('Scrolls (Vertical Video) is part of Phase 2 roadmap and will ship in V2!', 'info')
                }
                className="p-2.5 rounded-xl border border-slate-200 dark:border-navy-border bg-slate-100/70 dark:bg-navy-card/40 opacity-60 cursor-pointer flex flex-col items-center justify-center gap-1 select-none hover:opacity-80"
              >
                <div className="flex items-center gap-1">
                  <Video className="w-4 h-4 text-slate-500" />
                  <LockedV2Badge label="V2" size="sm" />
                </div>
                <span className="text-[10px] text-slate-500 font-semibold">Scrolls</span>
              </div>

              {/* Locked 2: Long-Form / Podcast Coming in V2 */}
              <div
                onClick={() =>
                  showToast('Long-form podcasts are part of Phase 2 roadmap and will ship in V2!', 'info')
                }
                className="p-2.5 rounded-xl border border-slate-200 dark:border-navy-border bg-slate-100/70 dark:bg-navy-card/40 opacity-60 cursor-pointer flex flex-col items-center justify-center gap-1 select-none hover:opacity-80"
              >
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4 text-slate-500" />
                  <LockedV2Badge label="V2" size="sm" />
                </div>
                <span className="text-[10px] text-slate-500 font-semibold">Long Form</span>
              </div>
            </div>
          </div>

          {/* Direct Device Media Upload Zone (Photo & Video) */}
          {(activeFormat === 'text' || activeFormat === 'story' || activeFormat === 'oneshot') && (
            <div className="p-3.5 rounded-2xl glass-panel space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-navy dark:text-slate-200 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-saffron" />
                  <span>Upload Media Directly from Device</span>
                </label>
                {mediaPreview && (
                  <button
                    type="button"
                    onClick={handleClearMedia}
                    className="text-[11px] text-red-500 font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*,video/*"
                onChange={handleDeviceFileUpload}
                className="hidden"
              />

              {!mediaPreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 dark:border-navy-border hover:border-saffron/70 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-navy-light/30 group"
                >
                  <div className="flex justify-center gap-3 mb-2">
                    <div className="p-3 rounded-2xl bg-saffron-light dark:bg-saffron/20 text-saffron group-hover:scale-110 transition-transform">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 group-hover:scale-110 transition-transform">
                      <Film className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-xs font-bold text-navy dark:text-white">
                    Click to select Photo or Video from your device
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Supports MP4, WebM, PNG, JPG, GIF (No URL pasting required)
                  </p>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-slate-300 dark:border-navy-border max-h-56 bg-black flex items-center justify-center">
                  {mediaKind === 'video' ? (
                    <video
                      src={mediaPreview}
                      controls
                      className="max-h-56 w-full object-contain"
                    />
                  ) : (
                    <img
                      src={mediaPreview}
                      alt="Device upload preview"
                      className="max-h-56 w-full object-cover"
                    />
                  )}
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-white font-mono">
                    ✓ {mediaKind === 'video' ? 'Video Attached' : 'Photo Attached'}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Format-Specific Fields */}
          {activeFormat === 'community' ? (
            <div className="space-y-3 p-3.5 rounded-2xl bg-amber-50/60 dark:bg-navy-light/40 border border-amber-200/60 dark:border-navy-border">
              <label className="block text-xs font-bold text-navy dark:text-white">
                Poll Question
              </label>
              <input
                type="text"
                placeholder="Ask the Bharat community (e.g. UPI infrastructure funding)..."
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-navy-border bg-white dark:bg-navy text-xs focus:ring-2 focus:ring-saffron"
              />

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Poll Options (Min 2)
                </label>
                {pollOptions.map((opt, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) => handlePollOptionChange(i, e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-navy-border bg-white dark:bg-navy text-xs focus:ring-2 focus:ring-saffron"
                  />
                ))}
                {pollOptions.length < 4 && (
                  <button
                    type="button"
                    onClick={handleAddPollOption}
                    className="text-[11px] font-bold text-saffron hover:underline"
                  >
                    + Add Option
                  </button>
                )}
              </div>
            </div>
          ) : activeFormat === 'oneshot' ? (
            <div className="space-y-3 p-3.5 rounded-2xl bg-orange-50/60 dark:bg-navy-light/40 border border-orange-200/60 dark:border-navy-border">
              <input
                type="text"
                placeholder="OneShot Headline (e.g. Tier-2 Hardware Revolution)..."
                value={oneshotTitle}
                onChange={(e) => setOneshotTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-navy-border bg-white dark:bg-navy text-xs focus:ring-2 focus:ring-saffron"
              />

              <textarea
                rows={2}
                placeholder="Slide 1 insight (e.g. 40% lower burn multiple in Coimbatore & Indore)..."
                value={oneshotSlide1}
                onChange={(e) => setOneshotSlide1(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-navy-border bg-white dark:bg-navy text-xs focus:ring-2 focus:ring-saffron"
              />

              <textarea
                rows={2}
                placeholder="Slide 2 insight (e.g. Proximity to supply chains and sticky local talent)..."
                value={oneshotSlide2}
                onChange={(e) => setOneshotSlide2(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-navy-border bg-white dark:bg-navy text-xs focus:ring-2 focus:ring-saffron"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-navy dark:text-slate-200 mb-1.5">
                Post Content & Thesis
              </label>
              <textarea
                rows={4}
                placeholder={t('captionPlaceholder')}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-navy-border bg-white dark:bg-navy-card text-xs focus:outline-none focus:ring-2 focus:ring-saffron leading-relaxed"
              />
            </div>
          )}

          {/* Hashtag Matrix Tagging */}
          <div>
            <label className="block text-xs font-bold text-navy dark:text-slate-200 mb-1.5">
              Priority Matrix Hashtags
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-saffron-light dark:bg-saffron/20 text-saffron text-xs font-bold border border-saffron/30"
                >
                  <span>{t}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add tag (e.g. #startups, #geopolitics, #ai)..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(e);
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-navy-border bg-white dark:bg-navy-card text-xs focus:ring-2 focus:ring-saffron"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-navy-light text-navy dark:text-white text-xs font-bold hover:bg-slate-300 transition-colors"
              >
                + Add Lever
              </button>
            </div>
          </div>

          {/* Incognito Citizen Toggle */}
          <div className="p-3 rounded-xl glass-panel flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-saffron" />
              <div>
                <span className="text-xs font-bold text-navy dark:text-white block">
                  Publish as Incognito Citizen
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Hide your real identity while sharing sovereign insights
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isIncognito}
              onChange={(e) => setIsIncognito(e.target.checked)}
              className="w-4 h-4 accent-saffron cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-light dark:border-navy-light flex items-center justify-between shrink-0 glass-panel">
          <button
            type="button"
            onClick={() => setCreateDrawerOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-navy dark:hover:text-white"
          >
            {t('cancel')}
          </button>

          <button
            type="button"
            onClick={handlePublish}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-saffron text-white text-xs font-bold hover:bg-saffron-hover shadow-md shadow-saffron/30 active:scale-95 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t('publish')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
