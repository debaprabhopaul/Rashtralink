'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserProfile,
  Post,
  Story,
  CharchaDebate,
  NotificationItem,
  PersonalizationSettings,
  LanguageCode,
  ContentType,
} from './types';
import {
  INITIAL_CURRENT_USER,
  DEFAULT_GUEST_USER,
  SEED_POSTS,
  SEED_STORIES,
  SEED_DEBATES,
  SEED_NOTIFICATIONS,
} from './seed-data';
import { DEFAULT_PRIORITY_MATRIX, rankFeedPosts, normalizeTag } from './matrix-engine';
import { getTranslation } from './i18n';
import { supabase } from './supabase';

interface ToastState {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning';
}

interface AppContextType {
  // User & Auth
  currentUser: UserProfile;
  updateCurrentUser: (updates: Partial<UserProfile>) => void;
  isLoggedIn: boolean;
  loginWithGoogle: () => void;
  loginWithPhone: (phone: string) => void;
  loginAsIncognito: () => void;
  logout: () => void;
  isIncognitoMode: boolean;
  setIsIncognitoMode: (val: boolean) => void;

  // Personalization & Language
  personalization: PersonalizationSettings;
  updatePersonalization: (settings: Partial<PersonalizationSettings>) => void;
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;

  // Priority Matrix & Feed
  priorityMatrix: Record<string, number>;
  updatePriorityMatrix: (matrix: Record<string, number>) => void;
  injectCustomLever: (tag: string, weight?: number) => void;
  removeLever: (tag: string) => void;
  resetPriorityMatrix: () => void;
  posts: Post[];
  rankedPosts: Post[];
  activeFilterTag: string | null;
  setActiveFilterTag: (tag: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Feed Actions
  likePost: (postId: string) => void;
  addPost: (newPost: {
    caption: string;
    content_type: ContentType;
    media_url?: string;
    video_url?: string;
    is_incognito: boolean;
    tags: string[];
    poll_data?: { question: string; options: string[] };
    oneshot_data?: any;
  }) => void;
  votePoll: (postId: string, optionId: string) => void;

  // Stories
  stories: Story[];
  addStory: (story: { text_content?: string; media_url?: string; video_url?: string; bg_color?: string }) => void;
  markStoryWatched: (storyId: string) => void;

  // Charcha Arena Debates
  debates: Record<string, CharchaDebate[]>;
  addDebate: (postId: string, argument: string, voteAgree: boolean, isIncognito: boolean, citations?: string[]) => void;
  upvoteDebate: (debateId: string, postId: string) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (notifId: string) => void;
  unreadNotificationsCount: number;

  // Modals & Navigation
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  isCreateDrawerOpen: boolean;
  setCreateDrawerOpen: (open: boolean) => void;
  isMatrixHUDOpen: boolean;
  setMatrixHUDOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  activeCharchaPostId: string | null;
  setActiveCharchaPostId: (postId: string | null) => void;
  activeStoryIndex: number | null;
  setActiveStoryIndex: (index: number | null) => void;
  activeOneShotPost: Post | null;
  setActiveOneShotPost: (post: Post | null) => void;
  legalModalType: 'privacy' | 'terms' | 'grievance' | 'about' | null;
  setLegalModalType: (type: 'privacy' | 'terms' | 'grievance' | 'about' | null) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;

  // FTUE State
  ftueCompleted: boolean;
  completeFTUE: (lang: LanguageCode, pillars: string[], customWeights: Record<string, number>) => void;
  resetFTUE: () => void;

  // Toast System
  toasts: ToastState[];
  showToast: (message: string, type?: 'info' | 'success' | 'warning') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // State initialization with localStorage persistence where available
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_CURRENT_USER);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isIncognitoMode, setIsIncognitoMode] = useState<boolean>(false);
  const [ftueCompleted, setFtueCompleted] = useState<boolean>(false); // Start with FTUE for first-time visitors

  const [personalization, setPersonalization] = useState<PersonalizationSettings>({
    theme: 'light',
    accent: 'saffron',
    density: 'comfortable',
    fontSize: 'medium',
  });

  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [priorityMatrix, setPriorityMatrix] = useState<Record<string, number>>(DEFAULT_PRIORITY_MATRIX);
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [stories, setStories] = useState<Story[]>(SEED_STORIES);
  const [debates, setDebates] = useState<Record<string, CharchaDebate[]>>(SEED_DEBATES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(SEED_NOTIFICATIONS);

  const [activeFilterTag, setActiveFilterTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // UI Drawer & Modal State
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isCreateDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [isMatrixHUDOpen, setMatrixHUDOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [activeCharchaPostId, setActiveCharchaPostId] = useState<string | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [activeOneShotPost, setActiveOneShotPost] = useState<Post | null>(null);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | 'grievance' | 'about' | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Hydrate stored settings if available
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('rl_theme') as PersonalizationSettings['theme'];
      const storedAccent = localStorage.getItem('rl_accent') as PersonalizationSettings['accent'];
      const storedDensity = localStorage.getItem('rl_density') as PersonalizationSettings['density'];
      const storedFont = localStorage.getItem('rl_fontSize') as PersonalizationSettings['fontSize'];
      const storedLang = localStorage.getItem('rl_lang') as LanguageCode;
      const storedFtue = localStorage.getItem('rl_ftue');
      const storedLoggedIn = localStorage.getItem('rl_logged_in');
      const storedUser = localStorage.getItem('rl_user');

      if (storedTheme || storedAccent || storedDensity || storedFont) {
        setPersonalization({
          theme: storedTheme || 'light',
          accent: storedAccent || 'saffron',
          density: storedDensity || 'comfortable',
          fontSize: storedFont || 'medium',
        });
      }

      if (storedLang) setCurrentLanguage(storedLang);
      if (storedLoggedIn === 'true') {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }

      if (storedFtue === 'true') {
        setFtueCompleted(true);
      } else {
        setFtueCompleted(false);
      }

      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (e) {}
      }
    } catch (e) {
      console.warn('LocalStorage not available in current environment', e);
    }

    // 🟢 Listen to Supabase Auth State (Handles Google OAuth redirect smoothly)
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setIsLoggedIn(true);
          const hasCompletedFtue = localStorage.getItem('rl_ftue') === 'true';
          setFtueCompleted(hasCompletedFtue);
          try {
            localStorage.setItem('rl_logged_in', 'true');
          } catch (e) {}

          const meta = session.user.user_metadata;
          const userHandle =
            meta?.user_name ||
            meta?.preferred_username ||
            session.user.email?.split('@')[0] ||
            'citizen_' + session.user.id.substring(0, 6);

          const syncedProfile: UserProfile = {
            id: session.user.id,
            user_handle: userHandle,
            full_name: meta?.full_name || meta?.name || 'Citizen of Bharat',
            avatar_url:
              meta?.avatar_url ||
              meta?.picture ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            bio: 'Citizen of Bharat 🇮🇳 | Rashtralink Sovereign Network',
            preferred_language: 'en',
            priority_matrix: DEFAULT_PRIORITY_MATRIX,
            is_professional: false,
            is_private: false,
            is_incognito: false,
            followers_count: 0,
            following_count: 0,
            verified: false,
          };
          setCurrentUser(syncedProfile);
          try {
            localStorage.setItem('rl_user', JSON.stringify(syncedProfile));
          } catch (e) {}
        }
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user) {
          setIsLoggedIn(true);
          const hasCompletedFtue = localStorage.getItem('rl_ftue') === 'true';
          setFtueCompleted(hasCompletedFtue);
          try {
            localStorage.setItem('rl_logged_in', 'true');
          } catch (e) {}

          const meta = session.user.user_metadata;
          const userHandle =
            meta?.user_name ||
            meta?.preferred_username ||
            session.user.email?.split('@')[0] ||
            'citizen_' + session.user.id.substring(0, 6);

          const syncedProfile: UserProfile = {
            id: session.user.id,
            user_handle: userHandle,
            full_name: meta?.full_name || meta?.name || 'Citizen of Bharat',
            avatar_url:
              meta?.avatar_url ||
              meta?.picture ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            bio: 'Citizen of Bharat 🇮🇳 | Rashtralink Sovereign Network',
            preferred_language: 'en',
            priority_matrix: DEFAULT_PRIORITY_MATRIX,
            is_professional: false,
            is_private: false,
            is_incognito: false,
            followers_count: 0,
            following_count: 0,
            verified: false,
          };
          setCurrentUser(syncedProfile);
          try {
            localStorage.setItem('rl_user', JSON.stringify(syncedProfile));
          } catch (e) {}
        } else if (event === 'SIGNED_OUT') {
          setIsLoggedIn(false);
          setFtueCompleted(false);
          setCurrentUser(DEFAULT_GUEST_USER);
          try {
            localStorage.removeItem('rl_logged_in');
            localStorage.removeItem('rl_ftue');
            localStorage.removeItem('rl_user');
          } catch (e) {}
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  // Update DOM classes based on theme and personalization
  useEffect(() => {
    const root = document.documentElement;
    // Theme
    if (personalization.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Accent
    if (personalization.accent === 'green') {
      root.classList.add('accent-green');
    } else {
      root.classList.remove('accent-green');
    }

    // Density
    root.classList.remove('density-compact', 'density-comfortable');
    root.classList.add(`density-${personalization.density}`);

    // Font Scale
    root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    root.classList.add(`font-size-${personalization.fontSize}`);
  }, [personalization]);

  const updatePersonalization = (settings: Partial<PersonalizationSettings>) => {
    setPersonalization((prev) => {
      const updated = { ...prev, ...settings };
      try {
        if (settings.theme) localStorage.setItem('rl_theme', settings.theme);
        if (settings.accent) localStorage.setItem('rl_accent', settings.accent);
        if (settings.density) localStorage.setItem('rl_density', settings.density);
        if (settings.fontSize) localStorage.setItem('rl_fontSize', settings.fontSize);
      } catch (e) {}
      return updated;
    });
  };

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    try {
      localStorage.setItem('rl_lang', lang);
    } catch (e) {}
  };

  const t = (key: string): string => {
    return getTranslation(currentLanguage, key);
  };

  const updateCurrentUser = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('rl_user', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const loginWithGoogle = async () => {
    if (supabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
          },
        });
        if (error) {
          console.warn('Google OAuth error:', error.message);
          setIsLoggedIn(true);
          setIsIncognitoMode(false);
          setAuthModalOpen(false);
          try {
            localStorage.setItem('rl_logged_in', 'true');
          } catch (e) {}
          showToast('Signed in with Google (Demo Session)', 'success');
        }
        return;
      } catch (e) {
        // Fallback
      }
    }
    setIsLoggedIn(true);
    setIsIncognitoMode(false);
    setAuthModalOpen(false);
    try {
      localStorage.setItem('rl_logged_in', 'true');
    } catch (e) {}
    showToast('Signed in with Google successfully!', 'success');
  };

  const loginWithPhone = (phone: string) => {
    setIsLoggedIn(true);
    setIsIncognitoMode(false);
    setAuthModalOpen(false);
    try {
      localStorage.setItem('rl_logged_in', 'true');
    } catch (e) {}
    showToast(`Signed in with ${phone}`, 'success');
  };

  const loginAsIncognito = () => {
    setIsLoggedIn(true);
    setIsIncognitoMode(true);
    setAuthModalOpen(false);
    try {
      localStorage.setItem('rl_logged_in', 'true');
    } catch (e) {}
    showToast('Browsing as Incognito Citizen', 'info');
  };

  const logout = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
    setIsLoggedIn(false);
    setIsIncognitoMode(false);
    setFtueCompleted(false);
    setCurrentUser(DEFAULT_GUEST_USER);
    setIsProfileOpen(false);
    setSettingsOpen(false);
    try {
      localStorage.removeItem('rl_logged_in');
      localStorage.removeItem('rl_ftue');
      localStorage.removeItem('rl_user');
    } catch (e) {}
    showToast('Logged out of Rashtralink', 'info');
  };

  const updatePriorityMatrix = (newMatrix: Record<string, number>) => {
    setPriorityMatrix(newMatrix);
    showToast('Priority Matrix weights updated! Re-ranking feed...', 'success');
  };

  const injectCustomLever = (tag: string, weight = 80) => {
    const clean = normalizeTag(tag);
    if (!clean) return;
    setPriorityMatrix((prev) => ({
      ...prev,
      [clean]: weight,
    }));
    showToast(`Injected #${clean} lever (${weight}%) into Priority Matrix!`, 'success');
  };

  const removeLever = (tag: string) => {
    const clean = normalizeTag(tag);
    setPriorityMatrix((prev) => {
      const copy = { ...prev };
      delete copy[clean];
      return copy;
    });
    showToast(`Removed #${clean} lever from Priority Matrix`, 'info');
  };

  const resetPriorityMatrix = () => {
    setPriorityMatrix(DEFAULT_PRIORITY_MATRIX);
    showToast('Reset Priority Matrix to baseline weights', 'info');
  };

  const completeFTUE = (lang: LanguageCode, pillars: string[], customWeights: Record<string, number>) => {
    setLanguage(lang);
    setPriorityMatrix(customWeights);
    setIsLoggedIn(true);
    setFtueCompleted(true);
    try {
      localStorage.setItem('rl_ftue', 'true');
      localStorage.setItem('rl_logged_in', 'true');
    } catch (e) {}
    showToast(`Welcome to Rashtralink! Feed curated for your priority levers.`, 'success');
  };

  const resetFTUE = () => {
    try {
      localStorage.removeItem('rl_ftue');
    } catch (e) {}
    setFtueCompleted(false);
    showToast('Re-launching FTUE Sovereign Onboarding tour...', 'info');
  };

  const likePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.is_liked;
          return {
            ...p,
            is_liked: isLiked,
            likes_count: isLiked ? p.likes_count + 1 : Math.max(0, p.likes_count - 1),
          };
        }
        return p;
      })
    );
  };

  const votePoll = (postId: string, optionId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId && p.poll_data) {
          const alreadyVoted = p.poll_data.user_voted_option_id;
          if (alreadyVoted === optionId) return p;

          const updatedOptions = p.poll_data.options.map((opt) => {
            if (opt.id === optionId) {
              return { ...opt, votes: opt.votes + 1 };
            }
            if (opt.id === alreadyVoted) {
              return { ...opt, votes: Math.max(0, opt.votes - 1) };
            }
            return opt;
          });

          const totalVotes = updatedOptions.reduce((sum, opt) => sum + opt.votes, 0);

          return {
            ...p,
            poll_data: {
              ...p.poll_data,
              options: updatedOptions,
              total_votes: totalVotes,
              user_voted_option_id: optionId,
            },
          };
        }
        return p;
      })
    );
    showToast('Your vote on Bharat Community Poll has been recorded!', 'success');
  };

  const addPost = (newPostData: {
    caption: string;
    content_type: ContentType;
    media_url?: string;
    video_url?: string;
    is_incognito: boolean;
    tags: string[];
    poll_data?: { question: string; options: string[] };
    oneshot_data?: any;
  }) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      created_at: new Date().toISOString(),
      user_handle: newPostData.is_incognito ? `citizen_${Math.floor(1000 + Math.random() * 9000)}` : currentUser.user_handle,
      user_name: newPostData.is_incognito ? 'Incognito Citizen' : currentUser.full_name,
      user_avatar: newPostData.is_incognito
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
        : currentUser.avatar_url,
      content_type: newPostData.content_type,
      caption: newPostData.caption,
      media_url: newPostData.media_url,
      video_url: newPostData.video_url,
      is_incognito: newPostData.is_incognito,
      likes_count: 0,
      is_liked: false,
      tags: newPostData.tags.map((t) => (t.startsWith('#') ? t : `#${t}`)),
      debates_count: 0,
      verified: !newPostData.is_incognito && currentUser.verified,
    };

    if (newPostData.content_type === 'community' && newPostData.poll_data) {
      newPost.poll_data = {
        question: newPostData.poll_data.question,
        total_votes: 0,
        options: newPostData.poll_data.options.map((opt, i) => ({
          id: `opt_${i + 1}`,
          text: opt,
          votes: 0,
        })),
      };
    }

    if (newPostData.content_type === 'oneshot' && newPostData.oneshot_data) {
      newPost.oneshot_data = newPostData.oneshot_data;
    }

    setPosts((prev) => [newPost, ...prev]);
    showToast('Post published successfully to Rashtralink!', 'success');
  };

  const addStory = (storyData: { text_content?: string; media_url?: string; video_url?: string; bg_color?: string }) => {
    const newStory: Story = {
      id: `story_${Date.now()}`,
      created_at: new Date().toISOString(),
      user_handle: isIncognitoMode ? 'incognito_citizen' : currentUser.user_handle,
      user_name: isIncognitoMode ? 'Incognito Citizen' : currentUser.full_name,
      avatar_url: isIncognitoMode
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
        : currentUser.avatar_url,
      media_url: storyData.media_url,
      video_url: storyData.video_url,
      text_content: storyData.text_content,
      bg_color: storyData.bg_color || '#081D34',
      is_watched: false,
      is_incognito: isIncognitoMode,
    };

    setStories((prev) => [newStory, ...prev]);
    showToast("What's On Story published (active 24h)!", 'success');
  };

  const markStoryWatched = (storyId: string) => {
    setStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, is_watched: true } : s))
    );
  };

  const addDebate = (
    postId: string,
    argument: string,
    voteAgree: boolean,
    isIncognito: boolean,
    citations?: string[]
  ) => {
    const newDebate: CharchaDebate = {
      id: `deb_${Date.now()}`,
      created_at: new Date().toISOString(),
      post_id: postId,
      user_handle: isIncognito ? `citizen_${Math.floor(1000 + Math.random() * 9000)}` : currentUser.user_handle,
      user_name: isIncognito ? 'Incognito Citizen' : currentUser.full_name,
      user_avatar: isIncognito
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
        : currentUser.avatar_url,
      argument,
      vote_agree: voteAgree,
      is_incognito: isIncognito,
      citations: citations?.filter((c) => c.trim().length > 0) || [],
      upvotes_count: 1,
      is_upvoted: true,
    };

    setDebates((prev) => ({
      ...prev,
      [postId]: [newDebate, ...(prev[postId] || [])],
    }));

    // Increment post debate count
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, debates_count: (p.debates_count || 0) + 1 } : p))
    );

    showToast(
      `Your ${voteAgree ? 'In-Favor' : 'Counter-Argument'} has been recorded on Bharat Voice Consensus!`,
      'success'
    );
  };

  const upvoteDebate = (debateId: string, postId: string) => {
    setDebates((prev) => {
      const list = prev[postId] || [];
      const updated = list.map((d) => {
        if (d.id === debateId) {
          const isUpvoted = !d.is_upvoted;
          return {
            ...d,
            is_upvoted: isUpvoted,
            upvotes_count: isUpvoted ? d.upvotes_count + 1 : Math.max(0, d.upvotes_count - 1),
          };
        }
        return d;
      });
      return { ...prev, [postId]: updated };
    });
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, is_read: true } : n))
    );
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.is_read).length;

  // Filter & Rank posts based on Priority Matrix & active search/filter tag
  let filteredPosts = posts;
  if (activeFilterTag) {
    const cleanFilter = normalizeTag(activeFilterTag);
    filteredPosts = filteredPosts.filter((p) =>
      p.tags.some((t) => normalizeTag(t) === cleanFilter)
    );
  }

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filteredPosts = filteredPosts.filter(
      (p) =>
        p.caption.toLowerCase().includes(query) ||
        p.user_handle.toLowerCase().includes(query) ||
        (p.user_name && p.user_name.toLowerCase().includes(query)) ||
        p.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  const rankedPosts = rankFeedPosts(filteredPosts, priorityMatrix);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        updateCurrentUser,
        isLoggedIn,
        loginWithGoogle,
        loginWithPhone,
        loginAsIncognito,
        logout,
        isIncognitoMode,
        setIsIncognitoMode,
        personalization,
        updatePersonalization,
        currentLanguage,
        setLanguage,
        t,
        priorityMatrix,
        updatePriorityMatrix,
        injectCustomLever,
        removeLever,
        resetPriorityMatrix,
        posts,
        rankedPosts,
        activeFilterTag,
        setActiveFilterTag,
        searchQuery,
        setSearchQuery,
        likePost,
        addPost,
        votePoll,
        stories,
        addStory,
        markStoryWatched,
        debates,
        addDebate,
        upvoteDebate,
        notifications,
        markNotificationRead,
        unreadNotificationsCount,
        isAuthModalOpen,
        setAuthModalOpen,
        isCreateDrawerOpen,
        setCreateDrawerOpen,
        isMatrixHUDOpen,
        setMatrixHUDOpen,
        isSettingsOpen,
        setSettingsOpen,
        isSearchOpen,
        setSearchOpen,
        isNotificationsOpen,
        setNotificationsOpen,
        activeCharchaPostId,
        setActiveCharchaPostId,
        activeStoryIndex,
        setActiveStoryIndex,
        activeOneShotPost,
        setActiveOneShotPost,
        legalModalType,
        setLegalModalType,
        isProfileOpen,
        setIsProfileOpen,
        ftueCompleted,
        completeFTUE,
        resetFTUE,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
