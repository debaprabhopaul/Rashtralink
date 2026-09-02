'use client';

import React from 'react';
import { useApp } from '@/lib/store-context';
import { VERNACULAR_LANGUAGES } from '@/lib/i18n';
import { LanguageCode } from '@/lib/types';
import {
  X,
  UserCheck,
  Sliders,
  Languages,
  ShieldAlert,
  Palette,
  Info,
  Mail,
  ShieldCheck,
  Award,
  CircleDollarSign,
  LogOut,
  Sun,
  Moon,
  Sparkles,
  Check,
} from 'lucide-react';
import { LockedV2Badge } from '../common/LockedV2Badge';

export const SettingsDrawer: React.FC = () => {
  const {
    isSettingsOpen,
    setSettingsOpen,
    currentUser,
    updateCurrentUser,
    currentLanguage,
    setLanguage,
    priorityMatrix,
    updatePriorityMatrix,
    injectCustomLever,
    removeLever,
    resetPriorityMatrix,
    setMatrixHUDOpen,
    isIncognitoMode,
    setIsIncognitoMode,
    personalization,
    updatePersonalization,
    setLegalModalType,
    logout,
    resetFTUE,
    showToast,
    t,
  } = useApp();

  if (!isSettingsOpen) return null;

  const handleToggleAccountType = () => {
    const updated = !currentUser.is_professional;
    updateCurrentUser({ is_professional: updated });
    showToast(`Switched account to ${updated ? 'Professional Citizen' : 'Private Citizen'}`, 'success');
  };

  const handleToggleIncognito = () => {
    setIsIncognitoMode(!isIncognitoMode);
    showToast(
      !isIncognitoMode ? 'Incognito Citizen mode activated' : 'Standard Citizen mode restored',
      'info'
    );
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setSettingsOpen(false);
        }
      }}
      className="fixed inset-0 z-50 flex items-start justify-end bg-navy/60 backdrop-blur-sm p-3 sm:p-6 animate-fade-in-up"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FDFBF7] dark:bg-navy border border-border-light dark:border-navy-light rounded-3xl max-w-md w-full h-[92vh] shadow-2xl flex flex-col overflow-hidden relative animate-spring-pop"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border-light dark:border-navy-light flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-navy dark:text-white">
              {t('settings')}
            </h2>
          </div>
          <button
            onClick={() => setSettingsOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-navy dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Settings List (11 Sections per PRD §6.8) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
          {/* 1. Switch Account Type */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-navy-card border border-slate-200 dark:border-navy-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-4 h-4 text-saffron" />
              <div>
                <span className="font-bold text-navy dark:text-white block">
                  {t('accountType')}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {currentUser.is_professional ? t('professional') : t('privateCitizen')}
                </span>
              </div>
            </div>
            <button
              onClick={handleToggleAccountType}
              className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-navy text-xs font-semibold text-saffron border border-slate-200 dark:border-navy-border hover:border-saffron/40"
            >
              Switch
            </button>
          </div>

          {/* 2. Priority Matrix Lever Injection & Control Center */}
          <div className="p-4 rounded-2xl bg-white dark:bg-navy-card border border-slate-200 dark:border-navy-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 text-saffron" />
                <div>
                  <span className="font-bold text-navy dark:text-white block text-sm">
                    {t('priorityMatrix')} Levers
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Inject & tune algorithmic weights
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSettingsOpen(false);
                  setMatrixHUDOpen(true);
                }}
                className="text-xs text-saffron font-bold hover:underline"
              >
                Open HUD →
              </button>
            </div>

            {/* Quick Inject Lever Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Inject custom lever (e.g. #space, #ai)..."
                id="settings-custom-lever-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const val = (e.target as HTMLInputElement).value;
                    if (val.trim()) {
                      injectCustomLever(val.trim(), 85);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-navy-border bg-slate-50 dark:bg-navy text-xs text-navy dark:text-white focus:ring-2 focus:ring-saffron"
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById('settings-custom-lever-input') as HTMLInputElement;
                  if (input && input.value.trim()) {
                    injectCustomLever(input.value.trim(), 85);
                    input.value = '';
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-saffron text-white text-xs font-bold hover:bg-saffron-hover transition-colors shadow-xs"
              >
                + Inject
              </button>
            </div>

            {/* Active Levers Sliders */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {Object.entries(priorityMatrix).map(([tag, weight]) => (
                <div key={tag} className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy border border-slate-200 dark:border-navy-border">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-saffron font-mono">#{tag}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[11px] text-navy dark:text-slate-200">{weight}%</span>
                      {Object.keys(priorityMatrix).length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLever(tag)}
                          className="text-slate-400 hover:text-red-500 text-xs pl-1"
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
                      updatePriorityMatrix({
                        ...priorityMatrix,
                        [tag]: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full accent-saffron h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={resetPriorityMatrix}
              className="text-[11px] text-slate-500 hover:text-navy dark:hover:text-white font-medium"
            >
              ↺ Reset to default weights
            </button>
          </div>

          {/* 2.5 Replay FTUE Onboarding Tour */}
          <div
            onClick={() => {
              setSettingsOpen(false);
              resetFTUE();
            }}
            className="p-3.5 rounded-2xl bg-white dark:bg-navy-card border border-slate-200 dark:border-navy-border flex items-center justify-between cursor-pointer hover:border-saffron/40 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-saffron" />
              <div>
                <span className="font-bold text-navy dark:text-white block">
                  Replay Sovereign Onboarding (FTUE)
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Re-experience vernacular greetings & setup
                </span>
              </div>
            </div>
            <span className="text-xs text-saffron font-bold">Start Tour →</span>
          </div>

          {/* 3. Vernacular 7-Language Switcher */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-navy-card border border-slate-200 dark:border-navy-border space-y-2.5">
            <div className="flex items-center gap-2.5">
              <Languages className="w-4 h-4 text-saffron" />
              <span className="font-bold text-navy dark:text-white">
                Vernacular Language (7 Indian Languages)
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {VERNACULAR_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`p-2 rounded-xl text-left border text-xs font-semibold transition-all ${
                    currentLanguage === lang.code
                      ? 'border-saffron bg-saffron-light dark:bg-saffron/20 text-saffron'
                      : 'border-slate-200 dark:border-navy-border text-navy dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <span className="block font-bold">{lang.nativeName}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                    {lang.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Incognito Citizen Toggle */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-navy-card border border-slate-200 dark:border-navy-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-saffron" />
              <div>
                <span className="font-bold text-navy dark:text-white block">
                  {t('incognitoCitizen')}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {t('incognitoDesc')}
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isIncognitoMode}
              onChange={handleToggleIncognito}
              className="w-4 h-4 accent-saffron cursor-pointer"
            />
          </div>

          {/* 5. Personalization (Theme, Accent, Density, Font Size per PRD §6.9) */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-navy-card border border-slate-200 dark:border-navy-border space-y-3">
            <div className="flex items-center gap-2.5">
              <Palette className="w-4 h-4 text-saffron" />
              <span className="font-bold text-navy dark:text-white">
                {t('personalization')}
              </span>
            </div>

            {/* Theme Toggle (Light Warm Cream vs Dark Midnight Navy) */}
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1.5">
                {t('theme')}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updatePersonalization({ theme: 'light' })}
                  className={`flex items-center justify-center gap-2 p-2 rounded-xl border text-xs font-semibold ${
                    personalization.theme === 'light'
                      ? 'border-saffron bg-[#FDFBF7] text-navy font-bold ring-1 ring-saffron'
                      : 'border-slate-200 dark:border-navy-border text-slate-600'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t('lightTheme')}</span>
                </button>

                <button
                  onClick={() => updatePersonalization({ theme: 'dark' })}
                  className={`flex items-center justify-center gap-2 p-2 rounded-xl border text-xs font-semibold ${
                    personalization.theme === 'dark'
                      ? 'border-saffron bg-navy text-white font-bold ring-1 ring-saffron'
                      : 'border-slate-200 dark:border-navy-border text-slate-400'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t('darkTheme')}</span>
                </button>
              </div>
            </div>

            {/* Accent Variant (Saffron default vs Viksit Green alternate per PRD §6.9) */}
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1.5">
                {t('accentColor')}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updatePersonalization({ accent: 'saffron' })}
                  className={`flex items-center justify-center gap-2 p-2 rounded-xl border text-xs font-semibold ${
                    personalization.accent === 'saffron'
                      ? 'border-saffron bg-saffron-light dark:bg-saffron/20 text-saffron ring-1 ring-saffron'
                      : 'border-slate-200 dark:border-navy-border text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-saffron" />
                  <span>{t('saffronAccent')}</span>
                </button>

                <button
                  onClick={() => updatePersonalization({ accent: 'green' })}
                  className={`flex items-center justify-center gap-2 p-2 rounded-xl border text-xs font-semibold ${
                    personalization.accent === 'green'
                      ? 'border-viksit bg-emerald-50 dark:bg-emerald-950/30 text-viksit ring-1 ring-viksit'
                      : 'border-slate-200 dark:border-navy-border text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-viksit" />
                  <span>{t('greenAccent')}</span>
                </button>
              </div>
            </div>

            {/* Feed Density */}
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1.5">
                {t('feedDensity')}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updatePersonalization({ density: 'comfortable' })}
                  className={`p-2 rounded-xl border text-xs font-semibold text-center ${
                    personalization.density === 'comfortable'
                      ? 'border-saffron bg-saffron-light dark:bg-saffron/20 text-saffron'
                      : 'border-slate-200 dark:border-navy-border text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {t('comfortable')}
                </button>
                <button
                  onClick={() => updatePersonalization({ density: 'compact' })}
                  className={`p-2 rounded-xl border text-xs font-semibold text-center ${
                    personalization.density === 'compact'
                      ? 'border-saffron bg-saffron-light dark:bg-saffron/20 text-saffron'
                      : 'border-slate-200 dark:border-navy-border text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {t('compact')}
                </button>
              </div>
            </div>

            {/* Font Size */}
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1.5">
                {t('fontSize')}
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['small', 'medium', 'large'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => updatePersonalization({ fontSize: sz })}
                    className={`p-1.5 rounded-xl border text-xs font-semibold capitalize text-center ${
                      personalization.fontSize === sz
                        ? 'border-saffron bg-saffron-light dark:bg-saffron/20 text-saffron'
                        : 'border-slate-200 dark:border-navy-border text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {t(sz)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 6. About Rashtralink */}
          <div
            onClick={() => setLegalModalType('about')}
            className="p-3.5 rounded-2xl bg-white dark:bg-navy-card border border-slate-200 dark:border-navy-border flex items-center justify-between cursor-pointer hover:border-saffron/40"
          >
            <div className="flex items-center gap-2.5">
              <Info className="w-4 h-4 text-saffron" />
              <span className="font-bold text-navy dark:text-white">
                {t('aboutRashtralink')}
              </span>
            </div>
            <span className="text-xs text-slate-400">View →</span>
          </div>

          {/* 7. Contact Us & Grievance */}
          <div
            onClick={() => setLegalModalType('grievance')}
            className="p-3.5 rounded-2xl bg-white dark:bg-navy-card border border-slate-200 dark:border-navy-border flex items-center justify-between cursor-pointer hover:border-saffron/40"
          >
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-saffron" />
              <div>
                <span className="font-bold text-navy dark:text-white block">
                  {t('contactUs')} & Grievance Redressal
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  IT Rules 2021 Compliant Desk
                </span>
              </div>
            </div>
            <span className="text-xs text-slate-400">View →</span>
          </div>

          {/* 8. Privacy & Security Policy (DPDP Act) */}
          <div
            onClick={() => setLegalModalType('privacy')}
            className="p-3.5 rounded-2xl bg-white dark:bg-navy-card border border-slate-200 dark:border-navy-border flex items-center justify-between cursor-pointer hover:border-saffron/40"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-saffron" />
              <div>
                <span className="font-bold text-navy dark:text-white block">
                  {t('privacyPolicy')}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Digital Personal Data Protection Act, 2023
                </span>
              </div>
            </div>
            <span className="text-xs text-slate-400">View →</span>
          </div>

          {/* 9. 🔒 Badge Hub — Coming in V2 */}
          <div
            onClick={() =>
              showToast('Badge Hub & P2P Marketplace are scheduled for Phase 2 (V2)!', 'info')
            }
            className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-navy-card/40 border border-slate-200 dark:border-navy-border opacity-70 flex items-center justify-between cursor-pointer select-none hover:opacity-90"
          >
            <div className="flex items-center gap-2.5">
              <Award className="w-4 h-4 text-slate-400" />
              <div>
                <span className="font-bold text-slate-600 dark:text-slate-300 block">
                  {t('badgeHub')}
                </span>
                <span className="text-[11px] text-slate-400">
                  P2P Badge marketplace with rarity tiers
                </span>
              </div>
            </div>
            <LockedV2Badge label="V2" size="sm" />
          </div>

          {/* 10. 🔒 Creator Monetization Hub — Coming in V2 */}
          <div
            onClick={() =>
              showToast('Creator Monetization Hub & UPI payouts will ship in V2!', 'info')
            }
            className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-navy-card/40 border border-slate-200 dark:border-navy-border opacity-70 flex items-center justify-between cursor-pointer select-none hover:opacity-90"
          >
            <div className="flex items-center gap-2.5">
              <CircleDollarSign className="w-4 h-4 text-slate-400" />
              <div>
                <span className="font-bold text-slate-600 dark:text-slate-300 block">
                  {t('creatorMonetization')}
                </span>
                <span className="text-[11px] text-slate-400">
                  0% commission window & instant UPI withdrawal
                </span>
              </div>
            </div>
            <LockedV2Badge label="V2" size="sm" />
          </div>

          {/* 11. Log Out */}
          <button
            onClick={() => {
              logout();
              setSettingsOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 font-bold hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('logOut')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
