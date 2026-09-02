import { Post } from './types';

export const DEFAULT_PRIORITY_MATRIX: Record<string, number> = {
  startups: 80,
  tech: 85,
  finance: 70,
  geopolitics: 75,
  culture: 65,
  mobility: 60,
};

export const POPULAR_PILLARS = [
  { id: 'startups', name: 'Startups & Bharat Inc', icon: 'Rocket', defaultWeight: 80 },
  { id: 'tech', name: 'AI & Sovereign Tech', icon: 'Cpu', defaultWeight: 85 },
  { id: 'finance', name: 'UPI & Indian Markets', icon: 'TrendingUp', defaultWeight: 70 },
  { id: 'geopolitics', name: 'Geo-Politics & Policy', icon: 'Globe', defaultWeight: 75 },
  { id: 'culture', name: 'Heritage & Culture', icon: 'Sparkles', defaultWeight: 65 },
  { id: 'mobility', name: 'EVs & Infrastructure', icon: 'Zap', defaultWeight: 60 },
];

/**
 * Normalizes a tag string by stripping leading '#' and converting to lowercase.
 */
export function normalizeTag(tag: string): string {
  return tag.replace(/^#/, '').trim().toLowerCase();
}

/**
 * Calculates the score of a post based on active Priority Matrix weights:
 * Score(P) = Σ w(tag_i)
 */
export function calculatePostScore(post: Post, matrix: Record<string, number>): number {
  if (!post.tags || post.tags.length === 0) return 0;
  
  let score = 0;
  for (const tag of post.tags) {
    const cleanTag = normalizeTag(tag);
    if (matrix[cleanTag] !== undefined) {
      score += matrix[cleanTag];
    }
  }
  return score;
}

/**
 * Ranks a list of posts according to the user's Priority Matrix weights.
 * Applies cold-start fallback to chronological/most-recent sorting when scores are equal or zero.
 */
export function rankFeedPosts(posts: Post[], matrix: Record<string, number>): Post[] {
  const scoredPosts = posts.map((p) => ({
    ...p,
    score: calculatePostScore(p, matrix),
  }));

  return scoredPosts.sort((a, b) => {
    // Primary sort by Priority Matrix score descending
    if ((b.score ?? 0) !== (a.score ?? 0)) {
      return (b.score ?? 0) - (a.score ?? 0);
    }
    // Fallback sort: Most recent first (chronological cold-start per PRD §7)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}
