# Rashtralink (राष्ट्रलिंक) — Product Requirements Document
**Version:** 1.0 (V1 / MVP Scope)
**Status:** Draft for build
**Prepared for:** Solo founder build, Google Antigravity IDE workflow

---

## 1. Vision & Problem Statement

Rashtralink is a sovereign, India-built social platform. It rejects black-box recommendation engines in favor of **user-controlled feed curation** (Priority Matrix) and replaces unstructured comment sections with **structured, consensus-driven debate** (Charcha Arena).

**Core problem it solves:** Mainstream platforms optimize for engagement through opaque algorithms and outrage loops. Rashtralink gives that control back to the user, in their own language, with an emphasis on Indian creators and vernacular discourse.

---

## 2. Product Pillars

| Pillar | Mechanism |
|---|---|
| Algorithmic Sovereignty | Priority Matrix — user-adjustable feed weights |
| Bharat Consensus | Charcha Arena — structured debate + live agreement %  |
| Creator Fairness | 0% commission promo window (Phase 2) |
| Vernacular Inclusion | 7-language 1-tap switcher |
| Citizen Privacy | Incognito Citizen anonymous posting mode |

---

## 3. V1 Scope Definition

This is the single most important section of this document. Everything below reflects decisions made deliberately to fit a first-time solo build on modest hardware — not a reduction of ambition, just a build order.

**In V1:**
- Auth (Google OAuth + Phone OTP) + Incognito Citizen mode
- 3-step onboarding (language, interests, Priority Matrix baseline)
- Priority Matrix (pill bar + HUD + live re-ranking)
- Hybrid feed: text posts, image posts, community polls
- What's On (24h stories — text/photo/short clip, no processing pipeline)
- OneShot (15s swipeable flash cards)
- Charcha Arena (core differentiator — ships day one)
- Basic profile (bio, avatar, posts grid, follower count)
- Core settings (language, theme, incognito toggle, account type, log out)
- Search (creators, hashtags)
- Notifications (basic: likes, debate replies, follows)

**Deferred to Phase 2 (not built in V1, but visible in the UI as "Coming in V2"):**
- Scrolls (infinite vertical video feed) — heaviest video/infra surface, ships once core loop is proven
- Long-form video/podcasts
- Direct Messaging
- Badge Hub & P2P Badge Marketplace
- Creator Monetization Hub / earnings dashboard / UPI withdrawal
- Creator Boost Ad Engine
- Native mobile app packaging (Capacitor/React Native)

**UI treatment for deferred features:** rather than hiding these entirely, each gets a visible but disabled/locked entry point wherever it would naturally live — a grayed-out "Scrolls" tab, a "Messages" icon with a "Coming in V2" badge, a locked Badge Hub tile in Settings. This signals the roadmap to early users instead of making the app look feature-thin, without requiring you to actually build any of the backing functionality yet. Every locked entry point should be a single small UI component, not a stub screen — don't build empty placeholder pages, just a disabled state with a tooltip/label.

**Rationale:** The Priority Matrix and Charcha Arena are what make Rashtralink *Rashtralink*. Everything else is retention/monetization infrastructure that only matters once there are users and content to retain and monetize.

---

## 4. Atmanirbhar Design System

### 4.1 Color Palette

| Token | Hex | Usage |
|---|---|---|
| Cream Background | `#FDFBF7` | Primary light background |
| Navy Primary | `#081D34` | Headers, primary buttons, typography |
| Navy Light | `#102A45` | Secondary cards, dark mode containers |
| Saffron Orange | `#E85D04` | Active tabs, CTAs, unwatched story border |
| Saffron Hover | `#DC2F02` | Active touch feedback |
| Viksit Green | `#10B981` | Online indicators, consensus agreement, verified tags |
| Card Background | `#FFFFFF` (light) / `#0F172A` (dark) | Post cards, drawers |
| Card Border | `#F0ECE1` (light) / `#1E293B` (dark) | Structural dividers |

### 4.2 Signature UI Marks
- **Diamond vs. Square story indicators:** unwatched = 45°-rotated saffron-bordered diamond; watched = neutral soft square.
- **Heart pop physics:** double-tap triggers a spring-animated scaling heart overlay.
- **Splash animation:** pure CSS auto-fade, 0.8–1.0s, zero JavaScript dependency — keep it this way; it's one of the few places doing less is strictly better (faster load, no JS execution cost on entry-level devices).

### 4.3 Animation Budget (V1 guardrail)
Given entry-level 4G device targeting, cap animation to: splash fade, heart-pop, story diamond→square morph, slider drag feedback in the Priority Matrix HUD, and the FTUE language greeting (§5). Avoid parallax, heavy page-transition animations, or continuous background motion — they cost battery and frame rate on the hardware this app is meant to run well on, including your own dev machine's integrated graphics. The greeting animation should follow the same rule as the splash screen — pure CSS transform/opacity, no JS-driven animation loop.

---

## 5. First-Time User Experience (FTUE)

1. **Splash (0.8–1.0s):** Cream background, logo + saffron flag badge, tagline. Auto-dismiss, pure CSS.
2. **Auth:** "Continue with Google" or Phone OTP, plus a same-screen "Browse as Incognito Citizen" option to reduce signup friction.
3. **Onboarding (3 steps, not a form):**
   - **Vernacular language:** English, Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati. On tap, before advancing to the next step, a brief animated greeting plays — **each language gets its own native greeting and spelling, not a shared template** — e.g. "नमस्ते" (Hindi), "স্বাগতম" (Bengali), "வணக்கம்" (Tamil), "నమస్కారం" (Telugu), "नमस्कार" (Marathi), "નમસ્તે" (Gujarati), "Welcome" (English). The word scales/fades in over the saffron accent, holds briefly (~600–800ms), then the screen transitions forward. This is a small but deliberate moment: it's the first time the app speaks back to the user in their own language, right when they've just chosen it. (Have a native speaker sanity-check the exact spellings before launch — I've used common formal greetings, but I'm not fluent in most of these.)
   - Interest pillars (multi-select: Startups, Mobility, Finance, Tech, Geo-Politics, Culture)
   - Priority Matrix baseline sliders for the selected pillars — this *is* their initial feed weighting, not a separate step later.
4. **Lands on main feed** with header, Priority Matrix pill bar (pre-filled from onboarding), What's On row, and the mixed feed below.

---

## 6. Screen Specifications (V1)

### 6.1 App Shell / Header
Fixed 58px, sticky, `backdrop-filter: blur(16px)`. Logo left (returns to feed top on tap). Search + notification bell right. A locked "Messages" icon sits alongside notifications with a small "V2" badge — tapping it shows a one-line "Direct Messaging is coming in V2" note rather than opening any real inbox.

### 6.2 What's On (Stories)
Horizontal row below header. Diamond (unwatched) → square (watched) on tap. Upload via ➕ Add Story: text, photo, or short clip. Full-screen dark-mode viewer with auto-progress and next-story action.

### 6.3 Priority Matrix
- **Quick pill bar:** horizontal scroll, shows active weights (e.g. `#startups 90%`), "+ Tune Levers" opens the HUD.
- **HUD modal:** sliders per tag, custom hashtag injection field, "Save & Re-Rank Feed" button.
- **Scoring formula:** `Score(P) = Σ w(tag_i)` for each tag on post P, summed against the user's current weights. Recalculate client-side on slider save; re-sort the current feed batch.

### 6.4 Hybrid Feed
Alternating cadence of: image/text post cards, OneShot cards (launch into 15s swipeable flash-card viewer), and community poll cards (single-select, live % bars). Scrolls video cards are a Phase 2 addition to this same feed component — build the feed renderer to accept a `content_type` so adding Scrolls later doesn't require restructuring the feed.

### 6.5 Content Creation
Drawer with format selector: OneShot (15s), What's On Story, and Community Post/Poll are active. Scroll Video and Long Form appear in the same selector as locked tiles labeled "Coming in V2" — greyed out, tappable only to show that note, not functional. This means the format switcher's layout doesn't need rebuilding when Scrolls actually ships in V2, only the tile's lock state flips off.
Caption field, optional Incognito Citizen toggle, optional Priority Matrix hashtag tagging, Publish button.

### 6.6 Charcha Arena
Split-screen debate view attached to any post. Live Bharat Voice Consensus bar (Agree % / Disagree %) via Supabase Realtime — no polling. Text field for a research-backed counter-argument, tied to `charcha_debates`.

### 6.7 Profile (basic, V1)
Avatar, handle, bio, follower/following counts, format tabs limited to what V1 ships (Posts, OneShots — Scrolls tab added in Phase 2), 3-column media grid.

### 6.8 Settings
1. Switch Professional / Private Citizen account
2. Priority Matrix HUD shortcut
3. Vernacular language switcher
4. Incognito Citizen toggle
5. Personalization (theme, accent color, feed density — see §6.9)
6. About Rashtralink
7. Contact Us
8. Privacy & Security Policy (link — see §9)
9. 🔒 Badge Hub — *Coming in V2*
10. 🔒 Creator Monetization Hub — *Coming in V2*
11. Log Out

Locked entries (9–10) are visible but disabled, same treatment as §6.5 — this keeps the roadmap visible without any functional build behind them yet.

### 6.9 Personalization (new in V1)
User-facing customization, distinct from the fixed Atmanirbhar brand system (§4) — the goal is letting users make their *feed* feel like theirs without letting the whole app drift off-brand:
- **Theme mode:** Light (Warm Cream) / Dark (Navy) / follow system — already planned, kept here for completeness.
- **Accent variant (confirmed):** 2 pre-approved options built from the existing palette rather than a full color picker — **Saffron** (`#E85D04`, default) and **Viksit Green** (`#10B981`, alternate) — swaps the active-tab/CTA accent app-wide. Both are already defined tokens (§4.1), so this is a theming toggle, not new design work. Keeps every user's app still recognizably Rashtralink, just gives them a small sense of ownership.
- **Feed density:** Comfortable (default) vs. Compact — adjusts card padding/image height, useful on smaller/entry-level screens.
- **Font size:** small/medium/large — meaningful accessibility win, cheap to build (a single CSS custom property).

Deliberately excluded from V1 customization: custom color picker, custom fonts, layout rearrangement (drag-and-drop widget placement). Those add real QA surface (every combination needs testing) for a first build — revisit once the core app is stable.

---

## 7. Algorithm — Cold Start Behavior

**Confirmed:** when a user's Priority Matrix weights don't match enough recent content (early days, low post volume), the feed falls back to **chronological/most-recent** rather than showing an empty state or a "widen your matrix" prompt. A brand-new platform showing an empty feed is a worse first impression than a feed that's simply not perfectly personalized yet. Revisit once post volume is high enough that cold-start is no longer the common case.

---

## 8. Technical Architecture

**Frontend:** Next.js (App Router) + Tailwind CSS, deployed via Vercel.
**Backend:** Supabase (hosted, not local Docker) — Postgres, Auth, Storage, Realtime.
**Realtime use:** Charcha Arena consensus bar subscribes to `charcha_debates` changes — no custom websocket code needed.
**Storage:** `media` bucket (public) for OneShot clips and What's On uploads — no transcoding pipeline in V1, serve raw files via Supabase's CDN URL. `avatars` bucket (public) for profile images.

### 8.1 Database Schema (V1 tables only)

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_handle TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  preferred_language TEXT DEFAULT 'en',
  priority_matrix JSONB DEFAULT '{}'::jsonb,
  is_professional BOOLEAN DEFAULT false,
  is_private BOOLEAN DEFAULT false
);

CREATE TABLE public.posts (
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

CREATE TABLE public.charcha_debates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_handle TEXT NOT NULL,
  argument TEXT NOT NULL,
  vote_agree BOOLEAN NOT NULL,
  is_incognito BOOLEAN DEFAULT false
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charcha_debates ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_posts_created_at ON public.posts (created_at DESC);
CREATE INDEX idx_posts_content_type ON public.posts (content_type);
```

Note: `messages` table (DMs) is intentionally excluded — it's a Phase 2 feature. `citizen_points` and badge-related columns are excluded from `profiles` for the same reason; add them when the Badge Hub is actually built, not before.

**RLS policy direction:** public read on `posts` and `charcha_debates`; write access restricted to `auth.uid() = user_id` on insert/update/delete for a user's own rows.

---

## 9. Security & Credentials

**This replaces the credentials section in your original document — deliberately, not by omission.**

Your original Master Vision Document contained hardcoded admin usernames and a shared plaintext password. That password should now be treated as compromised (it's been shared across at least two AI tools and pasted into chat), and I'm not reproducing it here or anywhere else.

For V1, do this instead:
- Don't build a separate "admin account" system for V1 at all — you don't need one yet. Manage your database directly through the Supabase Dashboard (which has its own login, 2FA-capable, tied to your real account).
- If/when you need an in-app admin role later, add an `is_admin` boolean to `profiles`, gate it with an RLS policy, and never store admin credentials in a spec document, chat log, or committed file.
- Store all secrets (Supabase keys, OAuth client secrets) in Vercel's environment variables — never in the repo, never in a document like this one.
- Generate any future admin-adjacent passwords with a password manager, unique per account, and enable 2FA on your Google/Supabase/Vercel accounts.

---

## 10. Required Legal & Compliance Documentation

I'm not a lawyer, and this section is a structural starting point, not a substitute for one — especially since Rashtralink handles user data, content moderation, and (per your own doc) targets scale in India, where the **Digital Personal Data Protection Act, 2023 (DPDP Act)** and the **IT Rules, 2021** (intermediary due-diligence obligations, grievance officer requirements) both apply, and obligations increase if you cross "significant social media intermediary" user thresholds.

Documents you'll need before public launch:
1. **Privacy Policy** — what data you collect (auth data, posts, Priority Matrix weights, Incognito usage), how it's stored (Supabase, region), third parties involved (Google OAuth), user rights (access/deletion), retention period.
2. **Terms of Service** — acceptable use, content ownership, account termination conditions, Incognito Citizen mode's actual limits (it's not full anonymity from your own database — be precise about what it does and doesn't hide).
3. **Community Guidelines** — especially relevant given Charcha Arena is debate-centric; define what's a legitimate counter-argument vs. harassment.
4. **Grievance Redressal mechanism** — IT Rules 2021 requires a named Grievance Officer and a defined complaint-resolution timeline for intermediaries operating in India.

Recommend a short consult with an Indian tech/privacy lawyer before public launch — this is inexpensive relative to the risk of getting data-handling obligations wrong at the outset.

---

## 11. Phase 2 Roadmap (not built in V1; shown in-app as locked "Coming in V2" entry points per §3)

- Scrolls (infinite vertical video feed)
- Long-form video/podcasts
- Direct Messaging
- Badge Hub + P2P Badge Marketplace (rarity tiers, est. market values)
- Creator Monetization Hub (0% commission promo, UPI withdrawal)
- Creator Boost Ad Engine (self-serve UPI ads)
- Native mobile packaging (Capacitor/React Native)

---

## 12. Decisions Log (all resolved)

- Cold-start feed fallback: **chronological/most-recent** (§7).
- Scroll/Long Form UI treatment: **locked "Coming in V2" tiles**, not hidden (§6.5).
- Personalization accent variants: **Saffron (default) + Viksit Green (alternate)** (§6.9).
- FTUE greeting words: **distinct native greeting + spelling per language**, no shared template (§5) — spelling accuracy still worth a native-speaker check before launch, but the approach itself is locked.
