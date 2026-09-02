export type LanguageCode = 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'mr' | 'gu';

export type ContentType = 'image' | 'text' | 'oneshot' | 'community' | 'story' | 'scroll_v2' | 'longform_v2';

export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentVariant = 'saffron' | 'green';
export type FeedDensity = 'comfortable' | 'compact';
export type FontSize = 'small' | 'medium' | 'large';

export interface PersonalizationSettings {
  theme: ThemeMode;
  accent: AccentVariant;
  density: FeedDensity;
  fontSize: FontSize;
}

export interface UserProfile {
  id: string;
  user_handle: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  preferred_language: LanguageCode;
  priority_matrix: Record<string, number>;
  is_professional: boolean;
  is_private: boolean;
  is_incognito?: boolean;
  followers_count?: number;
  following_count?: number;
  verified?: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollData {
  question: string;
  options: PollOption[];
  total_votes: number;
  user_voted_option_id?: string;
}

export interface OneShotSlide {
  id: string;
  title: string;
  content: string;
  highlight?: string;
  bg_gradient?: string;
  media_url?: string;
  video_url?: string;
  read_time_seconds?: number;
}

export interface OneShotData {
  title: string;
  summary: string;
  slides: OneShotSlide[];
  category: string;
  duration_seconds: number;
  video_url?: string;
  cover_image?: string;
}

export interface Post {
  id: string;
  created_at: string;
  user_id?: string;
  user_handle: string;
  user_name?: string;
  user_avatar?: string;
  content_type: ContentType;
  caption: string;
  media_url?: string;
  video_url?: string;
  is_incognito: boolean;
  likes_count: number;
  is_liked?: boolean;
  tags: string[];
  score?: number;
  poll_data?: PollData;
  oneshot_data?: OneShotData;
  debates_count?: number;
  verified?: boolean;
}

export interface CharchaDebate {
  id: string;
  created_at: string;
  post_id: string;
  user_handle: string;
  user_name?: string;
  user_avatar?: string;
  argument: string;
  vote_agree: boolean; // true = Agree / Support, false = Disagree / Counter
  is_incognito: boolean;
  citations?: string[];
  upvotes_count: number;
  is_upvoted?: boolean;
}

export interface Story {
  id: string;
  created_at: string;
  user_handle: string;
  user_name?: string;
  avatar_url: string;
  media_url?: string;
  video_url?: string;
  text_content?: string;
  bg_color?: string;
  is_watched: boolean;
  is_incognito?: boolean;
}

export interface NotificationItem {
  id: string;
  created_at: string;
  type: 'like' | 'debate' | 'follow' | 'system' | 'consensus';
  user_handle: string;
  user_avatar?: string;
  text: string;
  post_id?: string;
  is_read: boolean;
}

export interface VernacularGreeting {
  code: LanguageCode;
  name: string;
  nativeName: string;
  greeting: string;
  subtext: string;
}
