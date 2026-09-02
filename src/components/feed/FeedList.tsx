'use client';

import React from 'react';
import { useApp } from '@/lib/store-context';
import { PostCard } from './PostCard';
import { CommunityPollCard } from './CommunityPollCard';
import { OneShotCard } from './OneShotCard';
import { OneShotViewerModal } from './OneShotViewerModal';
import { Sparkles, SlidersHorizontal, Layers } from 'lucide-react';

export const FeedList: React.FC = () => {
  const {
    rankedPosts,
    activeFilterTag,
    setActiveFilterTag,
    activeOneShotPost,
    searchQuery,
    setSearchQuery,
    setMatrixHUDOpen,
    t,
  } = useApp();

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 space-y-4 pb-24">
      {/* Active search or tag banner */}
      {(activeFilterTag || searchQuery) && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-saffron-light dark:bg-saffron/15 border border-saffron/30 text-xs text-navy dark:text-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-bold text-saffron">Filtering by:</span>
            {activeFilterTag && <span className="font-bold">#{activeFilterTag}</span>}
            {searchQuery && <span>"{searchQuery}"</span>}
          </div>
          <button
            onClick={() => {
              setActiveFilterTag(null);
              setSearchQuery('');
            }}
            className="text-saffron font-bold hover:underline"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Feed Posts Cadence */}
      {rankedPosts.length > 0 ? (
        rankedPosts.map((post) => {
          if (post.content_type === 'community' && post.poll_data) {
            return <CommunityPollCard key={post.id} post={post} />;
          }
          if (post.content_type === 'oneshot' && post.oneshot_data) {
            return <OneShotCard key={post.id} post={post} />;
          }
          return <PostCard key={post.id} post={post} />;
        })
      ) : (
        <div className="text-center py-16 px-4 bg-white dark:bg-navy-card rounded-3xl border border-slate-200 dark:border-navy-border">
          <Layers className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-navy dark:text-white">
            No posts found matching this criteria
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your Priority Matrix levers or clearing search filters.
          </p>
          <button
            onClick={() => setMatrixHUDOpen(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-saffron text-white text-xs font-bold hover:bg-saffron-hover transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Open Priority Matrix HUD</span>
          </button>
        </div>
      )}

      {/* Fullscreen OneShot Viewer Modal */}
      {activeOneShotPost && <OneShotViewerModal />}
    </div>
  );
};
