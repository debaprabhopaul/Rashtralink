import { createClient } from '@supabase/supabase-js';
import { Post, Story, CharchaDebate, UserProfile } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bamoorofhpzlbfhtnplt.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhbW9vcm9maHB6bGJmaHRucGx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMjUwODUsImV4cCI6MjEwMzkwMTA4NX0.vrVI6_k1uQQb2tTAyMYarEtGbmJILr0cqr3FiFx6Voc';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Storage Helper: Upload Image/Video directly to Supabase Storage Bucket
export async function uploadMediaToStorage(file: File, bucket: 'media' | 'avatars'): Promise<string | null> {
  if (!supabase) return null;
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.warn('Supabase storage upload fallback:', uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data?.publicUrl || null;
  } catch (err) {
    console.error('Storage upload exception:', err);
    return null;
  }
}

// Database Helpers
export async function fetchPostsFromDb(): Promise<Post[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return null;
    return data as Post[];
  } catch (e) {
    return null;
  }
}

export async function insertPostToDb(post: Partial<Post>): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('posts').insert([post]);
    return !error;
  } catch (e) {
    return false;
  }
}

export async function fetchDebatesFromDb(postId: string): Promise<CharchaDebate[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('charcha_debates')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return null;
    return data as CharchaDebate[];
  } catch (e) {
    return null;
  }
}

export async function insertDebateToDb(debate: Partial<CharchaDebate>): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('charcha_debates').insert([debate]);
    return !error;
  } catch (e) {
    return false;
  }
}
