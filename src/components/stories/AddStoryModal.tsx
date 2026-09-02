'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/lib/store-context';
import { X, Image as ImageIcon, Sparkles, Send, Upload, Film, Trash2 } from 'lucide-react';

export const AddStoryModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addStory, t } = useApp();
  const [textContent, setTextContent] = useState('');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaKind, setMediaKind] = useState<'image' | 'video' | null>(null);
  const [bgColor, setBgColor] = useState('#081D34');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const BG_PRESETS = ['#081D34', '#E85D04', '#10B981', '#102A45', '#4C1D95', '#B45309'];

  const handleDeviceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setMediaPreview(result);
      setMediaKind(isVideo ? 'video' : 'image');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textContent.trim() && !mediaPreview) return;

    addStory({
      text_content: textContent.trim() || undefined,
      media_url: mediaKind === 'image' && mediaPreview ? mediaPreview : undefined,
      video_url: mediaKind === 'video' && mediaPreview ? mediaPreview : undefined,
      bg_color: bgColor,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-md p-4 animate-fade-in-up">
      <div className="bg-[#FDFBF7] dark:bg-navy border border-border-light dark:border-navy-light rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-navy dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-navy dark:text-white mb-1">
          {t('addStory')}
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
          Share a 24-hour video, photo, or thought with the Bharat community.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy dark:text-slate-200 mb-1.5">
              Story Thought / Caption
            </label>
            <textarea
              rows={2}
              placeholder="What's happening right now?"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-navy-border bg-white dark:bg-navy-card text-xs focus:outline-none focus:ring-2 focus:ring-saffron"
            />
          </div>

          {/* Direct File Upload Dropzone */}
          <div>
            <label className="block text-xs font-semibold text-navy dark:text-slate-200 mb-1.5">
              Story Media (Upload Photo / Video from Device)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*,video/*"
              onChange={handleDeviceUpload}
              className="hidden"
            />

            {!mediaPreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-navy-border hover:border-saffron/70 rounded-2xl p-4 text-center cursor-pointer transition-all bg-slate-50 dark:bg-navy-card/40 flex items-center justify-center gap-2 text-xs font-bold text-navy dark:text-white"
              >
                <Upload className="w-4 h-4 text-saffron" />
                <span>Upload Photo or Video from Device</span>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-slate-300 dark:border-navy-border max-h-40 bg-black flex items-center justify-center">
                {mediaKind === 'video' ? (
                  <video src={mediaPreview} controls className="max-h-40 w-full object-contain" />
                ) : (
                  <img src={mediaPreview} alt="Story preview" className="max-h-40 w-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMediaPreview(null);
                    setMediaKind(null);
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Canvas Color if text story */}
          {!mediaPreview && (
            <div>
              <label className="block text-xs font-semibold text-navy dark:text-slate-200 mb-1.5">
                Story Canvas Color
              </label>
              <div className="flex gap-2">
                {BG_PRESETS.map((color) => (
                  <button
                    type="button"
                    key={color}
                    onClick={() => setBgColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      bgColor === color ? 'ring-2 ring-saffron ring-offset-2 scale-110' : ''
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!textContent.trim() && !mediaPreview}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-saffron text-white font-semibold text-xs hover:bg-saffron-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
            <span>Publish Story (24h)</span>
          </button>
        </form>
      </div>
    </div>
  );
};
