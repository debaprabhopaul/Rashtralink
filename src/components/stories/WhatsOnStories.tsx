'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/store-context';
import { Plus, Sparkles } from 'lucide-react';
import { StoryViewerModal } from './StoryViewerModal';
import { AddStoryModal } from './AddStoryModal';

export const WhatsOnStories: React.FC = () => {
  const {
    stories,
    activeStoryIndex,
    setActiveStoryIndex,
    currentUser,
    isIncognitoMode,
    t,
  } = useApp();

  const [isAddStoryModalOpen, setIsAddStoryModalOpen] = useState(false);

  return (
    <div className="w-full py-3 px-4 border-b border-border-light dark:border-navy-light bg-white/50 dark:bg-navy-card/40 transition-colors">
      <div className="max-w-2xl mx-auto flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
        {/* ➕ Add Story Item */}
        <div
          onClick={() => setIsAddStoryModalOpen(true)}
          className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 select-none group"
        >
          <div className="relative w-14 h-14 rounded-full border-2 border-dashed border-saffron/80 bg-saffron-light/50 dark:bg-saffron/10 flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="w-6 h-6 rounded-full bg-saffron text-white flex items-center justify-center shadow-sm">
              <Plus className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[11px] font-semibold text-navy dark:text-slate-200 truncate max-w-[64px]">
            {t('addStory')}
          </span>
        </div>

        {/* Stories List with Signature Diamond vs Square Mark */}
        {stories.map((story, index) => {
          const isWatched = story.is_watched;
          return (
            <div
              key={story.id}
              onClick={() => setActiveStoryIndex(index)}
              className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 select-none group"
            >
              {/* Diamond (unwatched) vs Square (watched) container per PRD §4.2 */}
              <div className="w-14 h-14 flex items-center justify-center">
                <div
                  className={`w-11 h-11 overflow-hidden transition-all duration-300 group-hover:scale-105 shadow-sm ${
                    isWatched
                      ? 'story-indicator-square bg-slate-200 dark:bg-slate-700'
                      : 'story-indicator-diamond bg-saffron-light'
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={story.avatar_url}
                      alt={story.user_handle}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Author handle */}
              <span
                className={`text-[11px] truncate max-w-[68px] ${
                  isWatched
                    ? 'text-slate-500 dark:text-slate-400 font-normal'
                    : 'text-navy dark:text-white font-bold'
                }`}
              >
                @{story.user_handle}
              </span>
            </div>
          );
        })}
      </div>

      {/* Story Viewers & Creation Modals */}
      {activeStoryIndex !== null && <StoryViewerModal />}
      {isAddStoryModalOpen && <AddStoryModal onClose={() => setIsAddStoryModalOpen(false)} />}
    </div>
  );
};
