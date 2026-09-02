'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/store-context';
import { VERNACULAR_LANGUAGES } from '@/lib/i18n';
import { LanguageCode } from '@/lib/types';
import { POPULAR_PILLARS } from '@/lib/matrix-engine';
import {
  Rocket,
  Cpu,
  TrendingUp,
  Globe,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldAlert,
  Sliders,
  Check,
  CheckCircle2,
  Sparkle,
  Upload,
  User,
  AtSign,
  FileText,
  Camera,
  ChevronRight,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const ICON_MAP: Record<string, React.ReactNode> = {
  Rocket: <Rocket className="w-5 h-5 text-saffron" />,
  Cpu: <Cpu className="w-5 h-5 text-blue-400" />,
  TrendingUp: <TrendingUp className="w-5 h-5 text-emerald-400" />,
  Globe: <Globe className="w-5 h-5 text-indigo-400" />,
  Sparkles: <Sparkles className="w-5 h-5 text-amber-400" />,
  Zap: <Zap className="w-5 h-5 text-purple-400" />,
};

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
];

export const FTUEOnboarding: React.FC = () => {
  const {
    completeFTUE,
    ftueCompleted,
    isLoggedIn,
    loginWithGoogle,
    loginWithPhone,
    loginAsIncognito,
    updateCurrentUser,
    currentUser,
    t,
  } = useApp();

  // Steps: 0 = Auth, 1 = Language, 2 = Pillars, 3 = Matrix, 4 = Profile, 5 = Ready
  const [step, setStep] = useState<number>(0);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');
  const [greetingPlaying, setGreetingPlaying] = useState<{ greeting: string; nativeName: string } | null>(null);
  const [selectedPillars, setSelectedPillars] = useState<string[]>(['startups', 'tech', 'finance', 'geopolitics']);
  const [pillarWeights, setPillarWeights] = useState<Record<string, number>>({
    startups: 85,
    tech: 90,
    finance: 75,
    geopolitics: 70,
    culture: 65,
    mobility: 60,
  });

  // Profile setup fields (prefilled from Google or sovereign defaults)
  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [userHandle, setUserHandle] = useState(currentUser?.user_handle || '');
  const [userBio, setUserBio] = useState(currentUser?.bio || 'Exploring sovereign digital public infrastructure & Bharat innovations 🇮🇳');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar_url || AVATAR_PRESETS[0]);
  const [avatarFilePreview, setAvatarFilePreview] = useState<string | null>(null);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [customTagInput, setCustomTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // When user signs in with Google, sync profile and advance to Question 1
  useEffect(() => {
    if (isLoggedIn && step === 0 && !ftueCompleted) {
      setStep(1);
      if (currentUser?.full_name && currentUser.full_name !== 'Citizen of Bharat') {
        setFullName(currentUser.full_name);
      }
      if (currentUser?.user_handle && currentUser.user_handle !== 'citizen_bharat') {
        setUserHandle(currentUser.user_handle);
      }
      if (currentUser?.avatar_url) {
        setAvatarUrl(currentUser.avatar_url);
      }
    }
  }, [isLoggedIn, step, ftueCompleted, currentUser]);

  const handleInjectCustomPillar = (rawTag: string) => {
    const clean = rawTag.replace(/^#/, '').trim().toLowerCase();
    if (!clean) return;
    setPillarWeights((prev) => ({
      ...prev,
      [clean]: prev[clean] ?? 85,
    }));
    if (!selectedPillars.includes(clean)) {
      setSelectedPillars((prev) => [...prev, clean]);
    }
    setCustomTagInput('');
  };

  const handleRemovePillarWeight = (tag: string) => {
    setPillarWeights((prev) => {
      const copy = { ...prev };
      delete copy[tag];
      return copy;
    });
    setSelectedPillars((prev) => prev.filter((p) => p !== tag));
  };

  // Hide only once FTUE is completed!
  if (ftueCompleted) return null;

  // Handle local image upload from user device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setAvatarFilePreview(dataUrl);
      setAvatarUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectLanguage = (lang: LanguageCode) => {
    const langObj = VERNACULAR_LANGUAGES.find((l) => l.code === lang);
    if (!langObj) return;

    setSelectedLanguage(lang);
    setGreetingPlaying({ greeting: langObj.greeting, nativeName: langObj.nativeName });

    setTimeout(() => {
      setGreetingPlaying(null);
      setStep(2);
    }, 850);
  };

  const togglePillar = (pillarId: string) => {
    if (selectedPillars.includes(pillarId)) {
      if (selectedPillars.length > 1) {
        setSelectedPillars((prev) => prev.filter((p) => p !== pillarId));
      }
    } else {
      setSelectedPillars((prev) => [...prev, pillarId]);
    }
  };

  const handleFinishFTUE = () => {
    // Save profile updates
    updateCurrentUser({
      full_name: fullName.trim() || 'Citizen of Bharat',
      user_handle: userHandle.trim().replace(/^@/, '') || 'citizen_sovereign',
      bio: userBio.trim(),
      avatar_url: avatarUrl,
    });

    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#E85D04', '#10B981', '#FFB703', '#3B82F6', '#FFFFFF'],
      });
    } catch (e) {}

    completeFTUE(selectedLanguage, selectedPillars, pillarWeights);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020B16]/95 backdrop-blur-xl text-white p-4 overflow-y-auto select-none">
      {/* Dynamic Ambient Background Lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-saffron/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Main Card Container with High-Contrast Dark Slate Surface */}
      <div className="bg-[#0A1D34] border border-slate-700/80 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden my-auto animate-fade-in-up text-white">
        {/* Vernacular Greeting Overlay */}
        {greetingPlaying && (
          <div className="absolute inset-0 z-50 bg-[#081D34] flex flex-col items-center justify-center text-center p-6 greeting-animation-active">
            <span className="text-xs font-semibold uppercase tracking-widest text-saffron mb-2">
              {greetingPlaying.nativeName}
            </span>
            <h1 className="text-5xl sm:text-6xl font-black text-white drop-shadow-lg tracking-tight">
              {greetingPlaying.greeting}
            </h1>
            <div className="mt-4 flex items-center gap-2 text-slate-300 text-sm">
              <Sparkle className="w-4 h-4 text-saffron animate-spin" />
              <span>Configuring sovereign feed...</span>
            </div>
          </div>
        )}

        {/* Top Header & Progress */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative w-44 h-12 mb-2">
            <Image
              src="/logo.png"
              alt="Rashtralink Logo"
              fill
              className="object-contain"
            />
          </div>

          {step > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    step === s
                      ? 'w-8 bg-saffron shadow-sm shadow-saffron/50'
                      : step > s
                      ? 'w-5 bg-emerald-400'
                      : 'w-4 bg-slate-700'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* STEP 0: Sovereign Welcome & Manifesto Auth Portal */}
        {step === 0 && (
          <div className="space-y-5 animate-spring-pop">
            {/* Top Brand Statement */}
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron/20 border border-saffron/40 text-saffron text-[11px] font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                Present Better Than The Future.
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                An AI based Social networking platform for Indians by Indians
              </h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Algorithmic Sovereignty • Bharat Voice Consensus • Vernacular First
              </p>
            </div>

            {/* Sovereign Manifesto Cards with Dark High-Contrast Backgrounds */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              <div className="p-3.5 rounded-2xl bg-[#061528] border border-slate-700/80 hover:border-saffron/50 transition-colors">
                <span className="text-xs font-bold text-saffron block mb-1">
                  Engineering the digital backbone of a Viksit Bharat.
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  High-performance deterministic feeds governed by Indian citizens, not black-box offshore ad monopolies.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#061528] border border-slate-700/80 hover:border-emerald-400/50 transition-colors">
                <span className="text-xs font-bold text-emerald-400 block mb-1">
                  Atmanirbhar Architecture
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  We are not renting digital infrastructure; we are building it. Sovereign data, indigenous algorithms, global dominance.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#061528] border border-slate-700/80 hover:border-amber-400/50 transition-colors">
                <span className="text-xs font-bold text-amber-400 block mb-1">
                  &ldquo;For India, By Indians&rdquo;
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  A technological renaissance orchestrated by the youth of the nation. Built to export Indian excellence to the planet.
                </p>
              </div>
            </div>

            {/* Scroll to Initialize Indicator */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-300 font-medium py-1">
              <Layers className="w-3.5 h-3.5 text-saffron animate-bounce" />
              <span>Scroll to Initialize • Sovereign Access</span>
            </div>

            {/* Authentication Buttons */}
            <div className="space-y-2.5 pt-1">
              {/* Google OAuth */}
              <button
                type="button"
                onClick={() => {
                  loginWithGoogle();
                }}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-white text-[#081D34] font-bold text-xs sm:text-sm hover:bg-slate-100 transition-all shadow-md active:scale-[0.98]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Phone OTP */}
              {!showPhoneInput ? (
                <button
                  type="button"
                  onClick={() => setShowPhoneInput(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#0D2540] text-white border border-slate-700 font-semibold text-xs sm:text-sm hover:border-saffron/50 transition-all active:scale-[0.98]"
                >
                  <span>Continue with Phone OTP</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="+91 Mobile number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-600 bg-[#061528] text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-saffron"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      loginWithPhone(phoneNumber || '+91 98765 43210');
                      setStep(1);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-saffron text-white font-bold text-xs sm:text-sm hover:bg-saffron-hover transition-colors shadow-sm"
                  >
                    Verify
                  </button>
                </div>
              )}

              {/* Browse as Incognito Citizen */}
              <button
                type="button"
                onClick={() => {
                  loginAsIncognito();
                  setStep(1);
                }}
                className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-[#0D2540] text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm hover:border-saffron/50 hover:bg-[#123153] transition-all active:scale-[0.98]"
              >
                <ShieldAlert className="w-4 h-4 text-saffron" />
                <span>Browse as Incognito Citizen</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: Vernacular Language (7 Indian Languages) */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-saffron">
                Question 1 of 4 • Vernacular First
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Choose your preferred language
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Tap your language to preview the sovereign native greeting.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {VERNACULAR_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all duration-200 ${
                    selectedLanguage === lang.code
                      ? 'border-saffron bg-saffron/20 ring-2 ring-saffron/40'
                      : 'border-slate-700 bg-[#061528] hover:border-saffron/50 hover:bg-[#091D35]'
                  }`}
                >
                  <span className="text-base font-bold text-white">
                    {lang.nativeName}
                  </span>
                  <span className="text-xs text-slate-300 mt-0.5">
                    {lang.name}
                  </span>
                  <span className="text-[11px] font-medium text-saffron mt-1 italic">
                    &ldquo;{lang.greeting}&rdquo;
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Interest Pillars */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-saffron">
                Question 2 of 4 • National Pillars
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Select your Bharat interest pillars
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Pick the thematic streams you wish to follow.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-5">
              {POPULAR_PILLARS.map((pillar) => {
                const isSelected = selectedPillars.includes(pillar.id);
                return (
                  <button
                    key={pillar.id}
                    type="button"
                    onClick={() => togglePillar(pillar.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-saffron bg-saffron/25 shadow-sm'
                        : 'border-slate-700 bg-[#061528] hover:border-slate-500'
                    }`}
                  >
                    <div className="p-1.5 rounded-xl bg-[#0A1D34] shadow-xs shrink-0">
                      {ICON_MAP[pillar.icon]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-white block truncate">
                        {pillar.name}
                      </span>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-saffron shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-saffron text-white font-bold text-xs sm:text-sm hover:bg-saffron-hover transition-all shadow-lg shadow-saffron/30 active:scale-[0.99]"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 3: Priority Matrix Baseline Sliders + Custom Lever Injection */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-saffron">
                Question 3 of 4 • Algorithmic Control
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Configure & Inject Priority Levers
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Tune baseline weights or inject custom sovereign topics.
              </p>
            </div>

            {/* Custom Lever Injector Bar */}
            <div className="p-3 rounded-2xl bg-[#061528] border border-saffron/40 mb-3 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Inject custom topic (e.g. #space, #defence, #ai)..."
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleInjectCustomPillar(customTagInput);
                    }
                  }}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-600 bg-[#0A1D34] text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-saffron"
                />
                <button
                  type="button"
                  onClick={() => handleInjectCustomPillar(customTagInput)}
                  className="px-3 py-1.5 rounded-xl bg-saffron text-white text-xs font-bold hover:bg-saffron-hover transition-colors shrink-0 shadow-sm"
                >
                  + Inject
                </button>
              </div>

              {/* Quick suggestions */}
              <div className="flex flex-wrap gap-1 items-center">
                <span className="text-[10px] text-slate-400">Suggestions:</span>
                {['#space', '#defence', '#semiconductors', '#agritech', '#ai', '#macro'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleInjectCustomPillar(tag)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-[#0A1D34] text-slate-300 border border-slate-700 hover:border-saffron hover:text-saffron transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Levers List */}
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1 mb-4">
              {Object.entries(pillarWeights).map(([tag, weight]) => (
                <div
                  key={tag}
                  className="p-2.5 rounded-2xl bg-[#061528] border border-slate-700 hover:border-saffron/40 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-white mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-saffron font-bold">#</span>
                      <span className="capitalize">{tag}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-saffron/20 text-saffron font-mono font-bold text-[11px]">
                        {weight}%
                      </span>
                      {Object.keys(pillarWeights).length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePillarWeight(tag)}
                          className="text-slate-400 hover:text-red-400 transition-colors text-xs"
                          title="Remove lever"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={weight}
                    onChange={(e) =>
                      setPillarWeights((prev) => ({
                        ...prev,
                        [tag]: parseInt(e.target.value, 10),
                      }))
                    }
                    className="w-full accent-saffron h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setStep(4)}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-saffron text-white font-bold text-xs sm:text-sm hover:bg-saffron-hover transition-all shadow-lg shadow-saffron/30 active:scale-[0.99]"
            >
              <span>Next: Customize Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 4: Citizen Profile (3 Specific Questions Requested by User) */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="text-center mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-saffron">
                Question 4 of 4 • Profile Setup
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Customize your sovereign identity
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Set up your profile name, handle, bio, and avatar.
              </p>
            </div>

            {/* Sub-Question 3: Profile Picture (Device Media Upload + Presets) */}
            <div className="p-3.5 rounded-2xl bg-[#061528] border border-slate-700 space-y-2.5">
              <label className="block text-xs font-bold text-white">
                1. Profile Picture (Upload from Device or Choose Preset)
              </label>

              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-saffron shrink-0 shadow-md">
                  <Image
                    src={avatarUrl}
                    alt="Profile Avatar Preview"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-saffron text-white text-xs font-bold hover:bg-saffron-hover transition-colors shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Device</span>
                  </button>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Select PNG, JPG from your phone/computer
                  </span>
                </div>
              </div>

              {/* Avatar Presets */}
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">
                  Or pick a sovereign preset:
                </span>
                <div className="flex gap-2">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(preset)}
                      className={`relative w-7 h-7 rounded-full overflow-hidden border transition-all ${
                        avatarUrl === preset
                          ? 'border-saffron ring-2 ring-saffron scale-110'
                          : 'border-slate-600 hover:border-slate-400 opacity-80'
                      }`}
                    >
                      <Image
                        src={preset}
                        alt="Avatar preset"
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sub-Question 1: Name & Username */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  2. Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full p-2.5 rounded-xl border border-slate-600 bg-[#061528] text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-saffron"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  Username (@handle)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-xs text-saffron font-bold">@</span>
                  <input
                    type="text"
                    value={userHandle}
                    onChange={(e) => setUserHandle(e.target.value.replace(/^@/, ''))}
                    placeholder="handle"
                    className="w-full pl-6 pr-2.5 py-2.5 rounded-xl border border-slate-600 bg-[#061528] text-xs text-white font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-saffron"
                  />
                </div>
              </div>
            </div>

            {/* Sub-Question 2: Bio */}
            <div>
              <label className="block text-xs font-bold text-white mb-1">
                3. Bio & Mission Statement
              </label>
              <textarea
                rows={2}
                value={userBio}
                onChange={(e) => setUserBio(e.target.value)}
                placeholder="What sovereign topics do you research or care about?"
                className="w-full p-2.5 rounded-xl border border-slate-600 bg-[#061528] text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-saffron leading-relaxed"
              />
            </div>

            <button
              type="button"
              onClick={handleFinishFTUE}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-saffron to-amber-500 text-white font-black text-sm hover:brightness-110 transition-all shadow-xl shadow-saffron/40 active:scale-[0.99] mt-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Complete Setup & Enter Rashtralink</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
