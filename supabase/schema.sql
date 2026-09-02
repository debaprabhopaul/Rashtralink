-- Rashtralink (राष्ट्रलिंक) V1 PostgreSQL Schema
-- Compliant with PRD Section 8.1

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_handle TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  preferred_language TEXT DEFAULT 'en',
  priority_matrix JSONB DEFAULT '{"startups": 80, "tech": 85, "finance": 70, "geopolitics": 75, "culture": 65, "mobility": 60}'::jsonb,
  is_professional BOOLEAN DEFAULT false,
  is_private BOOLEAN DEFAULT false
);

-- 2. Posts Table
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  user_handle TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('image', 'text', 'oneshot', 'community', 'story')),
  caption TEXT,
  media_url TEXT,
  is_incognito BOOLEAN DEFAULT false,
  likes_count INT DEFAULT 0,
  tags TEXT[] DEFAULT '{}'::text[]
);

-- 3. Charcha Debates Table
CREATE TABLE IF NOT EXISTS public.charcha_debates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_handle TEXT NOT NULL,
  argument TEXT NOT NULL,
  vote_agree BOOLEAN NOT NULL,
  is_incognito BOOLEAN DEFAULT false
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charcha_debates ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_content_type ON public.posts (content_type);
CREATE INDEX IF NOT EXISTS idx_charcha_post_id ON public.charcha_debates (post_id);

-- RLS Policies
-- Public read access
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public posts are viewable by everyone" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Public charcha debates are viewable by everyone" ON public.charcha_debates FOR SELECT USING (true);

-- Insert/Update restricted to authenticated owner
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Authenticated users can insert posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id OR is_incognito = true);
CREATE POLICY "Authenticated users can update their own posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can delete their own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert debates" ON public.charcha_debates FOR INSERT WITH CHECK (true);
