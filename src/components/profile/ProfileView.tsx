'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/store-context';
import {
  Settings,
  Edit3,
  CheckCircle2,
  FileText,
  Zap,
  Scale,
  Video,
  Grid,
  Heart,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { LockedV2Badge } from '../common/LockedV2Badge';
import { EditProfileModal } from './EditProfileModal';
import { PostCard } from '../feed/PostCard';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    posts,
    debates,
    setSettingsOpen,
    setActiveOneShotPost,
    resetFTUE,
    showToast,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'posts' | 'oneshots' | 'debates' | 'grid'>('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Filter posts by current user handle
  const userPosts = posts.filter(
    (p) => p.user_handle === currentUser.user_handle
  );
  const userOneShots = userPosts.filter((p) => p.content_type === 'oneshot');

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 space-y-4 pb-24 animate-fade-in-up">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-navy-card border border-border-light dark:border-navy-border rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-saffron shadow-md">
              <Image
                src={currentUser.avatar_url}
                alt={currentUser.user_handle}
                fill
                className="object-cover"
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-bold text-navy dark:text-white">
                  {currentUser.full_name}
                </h1>
                {currentUser.verified && (
                  <span title="Verified Sovereign Citizen">
                    <CheckCircle2 className="w-4 h-4 text-viksit" />
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                @{currentUser.user_handle}
              </span>

              <div className="mt-1 flex items-center gap-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-saffron-light dark:bg-saffron/20 text-saffron font-bold">
                  {currentUser.is_professional ? 'Professional Citizen' : 'Private Citizen'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => resetFTUE()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-saffron/30 bg-saffron-light dark:bg-saffron/20 text-saffron text-xs font-bold hover:bg-saffron hover:text-white transition-all shadow-xs"
              title="Re-run Sovereign FTUE Onboarding Tour"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Replay FTUE</span>
            </button>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-2 rounded-xl border border-slate-200 dark:border-navy-border hover:border-saffron/40 text-navy dark:text-slate-200 transition-colors"
              title="Edit Profile"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-xl border border-slate-200 dark:border-navy-border hover:border-saffron/40 text-navy dark:text-slate-200 transition-colors"
              title="Open Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed mb-4">
          {currentUser.bio}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-6 pt-3 border-t border-slate-100 dark:border-navy-border/60 text-xs">
          <div>
            <span className="font-bold text-navy dark:text-white text-sm">
              {currentUser.followers_count || 1420}
            </span>
            <span className="text-slate-500 dark:text-slate-400 ml-1.5">{t('followers')}</span>
          </div>
          <div>
            <span className="font-bold text-navy dark:text-white text-sm">
              {currentUser.following_count || 380}
            </span>
            <span className="text-slate-500 dark:text-slate-400 ml-1.5">{t('following')}</span>
          </div>
          <div>
            <span className="font-bold text-navy dark:text-white text-sm">
              {userPosts.length}
            </span>
            <span className="text-slate-500 dark:text-slate-400 ml-1.5">{t('posts')}</span>
          </div>
        </div>
      </div>

      {/* Format Tabs Bar per PRD §6.7 */}
      <div className="flex items-center border-b border-border-light dark:border-navy-border gap-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 ${
            activeTab === 'posts'
              ? 'border-saffron text-saffron'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Posts ({userPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('oneshots')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 ${
            activeTab === 'oneshots'
              ? 'border-saffron text-saffron'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>OneShots ({userOneShots.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('grid')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 ${
            activeTab === 'grid'
              ? 'border-saffron text-saffron'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Media Grid</span>
        </button>

        {/* Locked Scrolls Tab per PRD §6.7 */}
        <div
          onClick={() =>
            showToast('Scrolls tab is part of Phase 2 roadmap and will appear in V2!', 'info')
          }
          className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-slate-400 opacity-60 cursor-pointer hover:opacity-80 shrink-0"
        >
          <Video className="w-4 h-4" />
          <span>Scrolls</span>
          <LockedV2Badge label="V2" size="sm" />
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {userPosts.length > 0 ? (
            userPosts.map((p) => <PostCard key={p.id} post={p} />)
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              You haven't posted yet. Tap the ➕ button to publish your first Bharat post!
            </div>
          )}
        </div>
      )}

      {activeTab === 'oneshots' && (
        <div className="space-y-4">
          {userOneShots.length > 0 ? (
            userOneShots.map((p) => <PostCard key={p.id} post={p} />)
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              No OneShot flash cards yet.
            </div>
          )}
        </div>
      )}

      {activeTab === 'grid' && (
        <div className="grid grid-cols-3 gap-2">
          {posts
            .filter((p) => p.media_url)
            .map((post) => (
              <div
                key={post.id}
                className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-navy-light cursor-pointer group"
              >
                <Image
                  src={post.media_url!}
                  alt="Media grid"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>{post.likes_count}</span>
                </div>
              </div>
            ))}
        </div>
      )}

      {isEditModalOpen && <EditProfileModal onClose={() => setIsEditModalOpen(false)} />}
    </div>
  );
};
