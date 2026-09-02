'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/store-context';
import { X, Check, Upload, Camera } from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
];

export const EditProfileModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { currentUser, updateCurrentUser, showToast, t } = useApp();

  const [fullName, setFullName] = useState(currentUser.full_name);
  const [userHandle, setUserHandle] = useState(currentUser.user_handle);
  const [bio, setBio] = useState(currentUser.bio);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar_url);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDeviceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setAvatarUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      full_name: fullName.trim(),
      user_handle: userHandle.trim().replace(/^@/, ''),
      bio: bio.trim(),
      avatar_url: avatarUrl.trim() || currentUser.avatar_url,
    });
    showToast('Profile updated successfully!', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-md p-4 animate-fade-in-up">
      <div className="bg-[#FDFBF7] dark:bg-navy border border-border-light dark:border-navy-light rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-navy dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-navy dark:text-white mb-4">
          {t('editProfile')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Section */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-navy-card border border-slate-200 dark:border-navy-border space-y-2.5">
            <label className="block text-xs font-semibold text-navy dark:text-slate-200">
              Profile Avatar
            </label>

            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-saffron shadow-sm shrink-0">
                <Image
                  src={avatarUrl}
                  alt="Avatar preview"
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleDeviceUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-saffron text-white text-xs font-bold hover:bg-saffron-hover shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload from Device</span>
                </button>
              </div>
            </div>

            {/* Presets */}
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Preset avatars:</span>
              <div className="flex gap-1.5">
                {AVATAR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(preset)}
                    className={`relative w-7 h-7 rounded-full overflow-hidden border transition-all ${
                      avatarUrl === preset ? 'ring-2 ring-saffron border-saffron' : 'border-slate-300 opacity-70'
                    }`}
                  >
                    <Image src={preset} alt="preset" fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-navy dark:text-slate-200 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-navy-border bg-white dark:bg-navy-card text-xs focus:ring-2 focus:ring-saffron"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy dark:text-slate-200 mb-1">
                Handle (@username)
              </label>
              <input
                type="text"
                value={userHandle}
                onChange={(e) => setUserHandle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-navy-border bg-white dark:bg-navy-card text-xs font-mono focus:ring-2 focus:ring-saffron"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy dark:text-slate-200 mb-1">
              Bio & Mission Statement
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-navy-border bg-white dark:bg-navy-card text-xs focus:ring-2 focus:ring-saffron"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-navy-border text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-saffron text-white text-xs font-bold hover:bg-saffron-hover shadow-md"
            >
              {t('saveChanges')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
