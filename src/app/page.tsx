'use client';

import React from 'react';
import { useApp } from '@/lib/store-context';
import { SplashScreen } from '@/components/splash/SplashScreen';
import { FTUEOnboarding } from '@/components/onboarding/FTUEOnboarding';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { InteractiveBackground } from '@/components/layout/InteractiveBackground';
import { WhatsOnStories } from '@/components/stories/WhatsOnStories';
import { PriorityMatrixBar } from '@/components/matrix/PriorityMatrixBar';
import { PriorityMatrixHUD } from '@/components/matrix/PriorityMatrixHUD';
import { FeedList } from '@/components/feed/FeedList';
import { ProfileView } from '@/components/profile/ProfileView';
import { CharchaArenaModal } from '@/components/charcha/CharchaArenaModal';
import { CreateContentDrawer } from '@/components/create/CreateContentDrawer';
import { SearchDrawer } from '@/components/search/SearchDrawer';
import { NotificationsDrawer } from '@/components/notifications/NotificationsDrawer';
import { SettingsDrawer } from '@/components/settings/SettingsDrawer';
import { AuthModal } from '@/components/auth/AuthModal';
import { LegalModal } from '@/components/legal/LegalModal';
import { ToastContainer } from '@/components/common/Toast';

export default function Home() {
  const { isProfileOpen } = useApp();

  return (
    <main className="min-h-screen flex flex-col bg-[#FDFBF7] dark:bg-[#081D34] text-[#081D34] dark:text-slate-100 transition-colors relative overflow-hidden">
      {/* 🌟 Interactive Living Ambient Background */}
      <InteractiveBackground />

      {/* 1. Pure CSS 0.8-1.0s Splash Auto-Fade */}
      <SplashScreen />

      {/* 2. FTUE Dedicated Standalone Onboarding */}
      <FTUEOnboarding />

      {/* 3. Sticky 58px Blur Header */}
      <Header />

      {/* 4. Main App Container */}
      <div className="flex-1 w-full max-w-2xl mx-auto flex flex-col relative z-10">
        {!isProfileOpen ? (
          <>
            {/* 4.1 What's On (Stories) Row */}
            <WhatsOnStories />

            {/* 4.2 Priority Matrix Quick Pill Bar */}
            <PriorityMatrixBar />

            {/* 4.3 Hybrid Feed (Posts, OneShots, Polls) */}
            <FeedList />
          </>
        ) : (
          /* Profile & Citizen Grid */
          <ProfileView />
        )}
      </div>

      {/* 5. Bottom Navigation Bar */}
      <BottomNav />

      {/* 6. Drawers, Arena & Modals */}
      <CharchaArenaModal />
      <PriorityMatrixHUD />
      <CreateContentDrawer />
      <SearchDrawer />
      <NotificationsDrawer />
      <SettingsDrawer />
      <AuthModal />
      <LegalModal />

      {/* 7. Toast Alerts */}
      <ToastContainer />
    </main>
  );
}
