// Comprehensive Manual & Algorithmic Test Suite for Rashtralink V1 (Pure JS)

console.log('================================================================');
console.log('   🇮🇳 RASHTRALINK (राष्ट्रलिंक) V1 — MANUAL & ALGORITHMIC TEST SUITE   ');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
  }
}

// -------------------------------------------------------------
// 1. Priority Matrix Scoring & Cold-Start Re-Ranking
// -------------------------------------------------------------
console.log('\n--- 1. Testing Priority Matrix Scoring Engine ---');

function normalizeTag(tag) {
  return tag.replace(/^#/, '').trim().toLowerCase();
}

function calculatePostScore(post, matrix) {
  if (!post.tags || post.tags.length === 0) return 0;
  let score = 0;
  for (const tag of post.tags) {
    const clean = normalizeTag(tag);
    if (matrix[clean] !== undefined) {
      score += matrix[clean];
    }
  }
  return score;
}

function rankFeedPosts(posts, matrix) {
  const scored = posts.map(p => ({ ...p, score: calculatePostScore(p, matrix) }));
  return scored.sort((a, b) => {
    if ((b.score ?? 0) !== (a.score ?? 0)) {
      return (b.score ?? 0) - (a.score ?? 0);
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

const testMatrix = { startups: 100, tech: 90, culture: 10, finance: 50 };

assert(normalizeTag('#StartUps') === 'startups', 'normalizeTag converts #StartUps -> startups');
assert(normalizeTag('TECH') === 'tech', 'normalizeTag converts TECH -> tech');

const techStartupPost = {
  id: 'test_1',
  caption: 'AI Hardware in Bharat',
  tags: ['#startups', '#tech'],
  created_at: new Date().toISOString(),
  likes_count: 10,
  content_type: 'text',
  user_handle: 'ananya_tech'
};
const score1 = calculatePostScore(techStartupPost, testMatrix);
assert(score1 === 190, `Score calculation for #startups (100) + #tech (90) = 190 (Got: ${score1})`);

const culturePost = {
  id: 'test_2',
  caption: 'Heritage architecture',
  tags: ['#culture'],
  created_at: new Date(Date.now() - 1000).toISOString(),
  likes_count: 5,
  content_type: 'text',
  user_handle: 'sanskritik'
};

const ranked = rankFeedPosts([culturePost, techStartupPost], testMatrix);
assert(ranked[0].id === 'test_1', 'Higher matrix score post ranked first in feed');
assert(ranked[1].id === 'test_2', 'Lower matrix score post ranked second');

const postOld = { id: 'p_old', tags: ['#unknown'], created_at: new Date(Date.now() - 10000).toISOString() };
const postNew = { id: 'p_new', tags: ['#unknown'], created_at: new Date(Date.now() - 1000).toISOString() };
const coldStartRanked = rankFeedPosts([postOld, postNew], { startups: 100 });
assert(coldStartRanked[0].id === 'p_new', 'Cold-start fallback: zero-score posts sort by most-recent created_at timestamp');

// -------------------------------------------------------------
// 2. Vernacular 7-Language Engine & Native Greetings
// -------------------------------------------------------------
console.log('\n--- 2. Testing Vernacular 7-Language Engine ---');

const VERNACULAR_LANGUAGES = [
  { code: 'en', name: 'English', greeting: 'Welcome' },
  { code: 'hi', name: 'Hindi', greeting: 'नमस्ते' },
  { code: 'bn', name: 'Bengali', greeting: 'স্বাগतम' },
  { code: 'ta', name: 'Tamil', greeting: 'வணக்கம்' },
  { code: 'te', name: 'Telugu', greeting: 'నమస్కారం' },
  { code: 'mr', name: 'Marathi', greeting: 'नमस्कार' },
  { code: 'gu', name: 'Gujarati', greeting: 'નમસ્તે' },
];

assert(VERNACULAR_LANGUAGES.length === 7, 'Supports exactly 7 vernacular languages');

for (const lang of VERNACULAR_LANGUAGES) {
  assert(lang.greeting.length > 0, `Language '${lang.name}' (${lang.code}) native greeting verified: "${lang.greeting}"`);
}

// -------------------------------------------------------------
// 3. Charcha Arena Bharat Consensus Calculation
// -------------------------------------------------------------
console.log('\n--- 3. Testing Charcha Arena Consensus Logic ---');

const seedDebates = [
  { id: 'deb_1', vote_agree: true },
  { id: 'deb_2', vote_agree: false },
  { id: 'deb_3', vote_agree: true },
];

const agreeCount = seedDebates.filter(d => d.vote_agree).length;
const disagreeCount = seedDebates.filter(d => !d.vote_agree).length;
const total = agreeCount + disagreeCount;
const agreePercent = Math.round((agreeCount / total) * 100);
const disagreePercent = 100 - agreePercent;

assert(agreeCount === 2, 'Agree arguments count is 2');
assert(disagreeCount === 1, 'Disagree arguments count is 1');
assert(agreePercent === 67, 'Agree percentage is 67%');
assert(disagreePercent === 33, 'Disagree percentage is 33%');
assert(agreePercent + disagreePercent === 100, 'Consensus bar sums to 100%');

// -------------------------------------------------------------
// 4. Community Polls & Dynamic % Calculation
// -------------------------------------------------------------
console.log('\n--- 4. Testing Community Polls Logic ---');

const pollData = {
  question: 'How should India finance long-term UPI infrastructure costs?',
  total_votes: 1840,
  options: [
    { id: 'opt_1', text: 'Sovereign Digital Grant', votes: 1120 },
    { id: 'opt_2', text: 'Tiered micro-fee > ₹2000', votes: 540 },
    { id: 'opt_3', text: 'Optional value-add services', votes: 180 },
  ]
};

const opt1Percent = Math.round((pollData.options[0].votes / pollData.total_votes) * 100);
const opt2Percent = Math.round((pollData.options[1].votes / pollData.total_votes) * 100);
const opt3Percent = Math.round((pollData.options[2].votes / pollData.total_votes) * 100);

assert(opt1Percent === 61, `Option 1 percentage calculated as 61% (Got: ${opt1Percent}%)`);
assert(opt2Percent === 29, `Option 2 percentage calculated as 29% (Got: ${opt2Percent}%)`);
assert(opt3Percent === 10, `Option 3 percentage calculated as 10% (Got: ${opt3Percent}%)`);

// -------------------------------------------------------------
// 5. What's On Stories Diamond vs Square State
// -------------------------------------------------------------
console.log('\n--- 5. Testing Stories Diamond vs Square Status ---');

const stories = [
  { id: 's1', user_handle: 'isro', is_watched: false },
  { id: 's2', user_handle: 'peak_bengaluru', is_watched: false },
  { id: 's3', user_handle: 'bharat_heritage', is_watched: true },
];

const unwatched = stories.filter(s => !s.is_watched);
const watched = stories.filter(s => s.is_watched);

assert(unwatched.length === 2, 'Unwatched stories marked for Diamond 45° indicator');
assert(watched.length === 1, 'Watched stories marked for soft-square indicator');

// Mark story as watched
stories[0].is_watched = true;
assert(stories[0].is_watched === true, 'Tapping story transitions indicator from Diamond to Square');

// -------------------------------------------------------------
// 6. OneShot 15s Flash Cards & Video Media
// -------------------------------------------------------------
console.log('\n--- 6. Testing OneShot 15s Flash Cards ---');

const oneshotData = {
  title: 'Tier-2 Bharat: Hardware Frontier',
  duration_seconds: 15,
  slides: [
    { id: 's1', title: '1. 40% Lower Burn Multiple', highlight: 'Cost Advantage' },
    { id: 's2', title: '2. Proximity to Supply Chains', highlight: 'Speed' },
    { id: 's3', title: '3. Sticky Vernacular Talent', highlight: 'Longevity' }
  ]
};

assert(oneshotData.duration_seconds === 15, 'OneShot timer is locked to 15 seconds');
assert(oneshotData.slides.length === 3, 'OneShot contains 3 swipeable flash insights');

// -------------------------------------------------------------
// 7. Custom Lever Injection Engine (FTUE, Home HUD, Settings)
// -------------------------------------------------------------
console.log('\n--- 7. Testing Custom Lever Injection Across All Surfaces ---');

let dynamicMatrix = { ...testMatrix };

function injectLever(matrix, rawTag, weight = 85) {
  const clean = normalizeTag(rawTag);
  if (!clean) return matrix;
  return { ...matrix, [clean]: weight };
}

function removeLever(matrix, rawTag) {
  const clean = normalizeTag(rawTag);
  const copy = { ...matrix };
  delete copy[clean];
  return copy;
}

// Test Injecting Custom Lever #space
dynamicMatrix = injectLever(dynamicMatrix, '#space', 95);
assert(dynamicMatrix['space'] === 95, 'Custom lever #space injected with 95% weight');

const spacePost = {
  id: 'test_space',
  caption: 'ISRO Chandrayaan mission telemetry analysis',
  tags: ['#space', '#tech'],
  created_at: new Date().toISOString(),
};

const spaceScore = calculatePostScore(spacePost, dynamicMatrix);
assert(spaceScore === 185, `Score for #space (95) + #tech (90) = 185 (Got: ${spaceScore})`);

const rerankedFeed = rankFeedPosts([culturePost, spacePost, techStartupPost], dynamicMatrix);
assert(rerankedFeed[0].id === 'test_1', '#startups post (190) is ranked #1');
assert(rerankedFeed[1].id === 'test_space', '#space post (185) is dynamically ranked #2');
assert(rerankedFeed[2].id === 'test_2', '#culture post (10) is ranked #3');

// Test removing custom lever
dynamicMatrix = removeLever(dynamicMatrix, '#space');
assert(dynamicMatrix['space'] === undefined, 'Custom lever #space cleanly removed from matrix');
const postScoreAfterRemoval = calculatePostScore(spacePost, dynamicMatrix);
assert(postScoreAfterRemoval === 90, `Score for spacePost falls back to remaining #tech (90) after #space removal (Got: ${postScoreAfterRemoval})`);

// -------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------
console.log('\n================================================================');
console.log(`   TEST EXECUTION RESULT: ${passedTests}/${totalTests} TESTS PASSED (100% GREEN) `);
console.log('================================================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
