'use client';

import React from 'react';
import { useApp } from '@/lib/store-context';
import { X, ShieldCheck, Scale, FileText, Info } from 'lucide-react';

export const LegalModal: React.FC = () => {
  const { legalModalType, setLegalModalType, t } = useApp();

  if (!legalModalType) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setLegalModalType(null);
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-md p-4 animate-fade-in-up"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FDFBF7] dark:bg-navy border border-border-light dark:border-navy-light rounded-3xl max-w-xl w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden relative p-6 animate-spring-pop"
      >
        <div className="flex items-center justify-between pb-4 border-b border-border-light dark:border-navy-light shrink-0">
          <div className="flex items-center gap-2.5">
            {legalModalType === 'privacy' && <ShieldCheck className="w-5 h-5 text-saffron" />}
            {legalModalType === 'grievance' && <Scale className="w-5 h-5 text-viksit" />}
            {legalModalType === 'terms' && <FileText className="w-5 h-5 text-blue-500" />}
            {legalModalType === 'about' && <Info className="w-5 h-5 text-amber-500" />}
            <h2 className="text-base sm:text-lg font-bold text-navy dark:text-white">
              {legalModalType === 'privacy' && 'Privacy & Security Policy (DPDP Act, 2023)'}
              {legalModalType === 'grievance' && 'Grievance Redressal (IT Rules, 2021)'}
              {legalModalType === 'terms' && 'Terms of Service & Incognito Rules'}
              {legalModalType === 'about' && 'About Rashtralink'}
            </h2>
          </div>
          <button
            onClick={() => setLegalModalType(null)}
            className="p-1.5 text-slate-400 hover:text-navy dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed pr-2">
          {legalModalType === 'privacy' && (
            <>
              <div className="p-3 rounded-xl bg-saffron-light/50 dark:bg-saffron/10 border border-saffron/20 font-medium text-xs">
                <strong>Sovereign Data Pledge:</strong> Rashtralink adheres strictly to the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>. Your data is stored securely and processed with algorithmic transparency.
              </div>

              <h4 className="font-bold text-navy dark:text-white text-sm">1. Data Collected</h4>
              <p>
                We collect your authentication credentials (Google OAuth or Phone OTP), profile details, vernacular preferences, and custom Priority Matrix weights.
              </p>

              <h4 className="font-bold text-navy dark:text-white text-sm">2. Incognito Citizen Mode Limits</h4>
              <p>
                When posting in Incognito Citizen mode, your public handle and profile are hidden from other users in the feed and Charcha Arena. However, for legal and security compliance against hate speech or cyber fraud, hashed metadata remains recorded in our encrypted database.
              </p>

              <h4 className="font-bold text-navy dark:text-white text-sm">3. Algorithmic Transparency</h4>
              <p>
                Unlike foreign social networks with opaque recommendation models, Rashtralink does not sell your behavioral data or manipulate feeds for outrage. Your feed strictly reflects your chosen mathematical Priority Matrix weights: <code>Score(P) = Σ w(tag_i)</code>.
              </p>
            </>
          )}

          {legalModalType === 'grievance' && (
            <>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-900 font-medium text-xs">
                <strong>IT Rules, 2021 Compliance:</strong> Named Grievance Officer and structured complaint timeline for Indian digital intermediaries.
              </div>

              <h4 className="font-bold text-navy dark:text-white text-sm">Designated Grievance Officer</h4>
              <p>
                <strong>Name:</strong> Officer for Bharat Citizen Grievances<br />
                <strong>Email:</strong> grievance@rashtralink.in<br />
                <strong>Address:</strong> Rashtralink Sovereign Tech Lab, Bengaluru, Karnataka 560001, India.
              </p>

              <h4 className="font-bold text-navy dark:text-white text-sm">Redressal Timelines</h4>
              <p>
                - Acknowledgment of complaint: Within 24 hours.<br />
                - Complete resolution & decision: Within 15 calendar days.<br />
                - Emergency takedown requests under Rule 3(1)(d): Within 36 hours of lawful notice.
              </p>
            </>
          )}

          {legalModalType === 'terms' && (
            <>
              <h4 className="font-bold text-navy dark:text-white text-sm">1. Community Debate Conduct</h4>
              <p>
                Charcha Arena is a platform for structured, intellectual discourse. Harassment, communal hate speech, and impersonation are strictly forbidden. Users are encouraged to provide verifiable research citations.
              </p>

              <h4 className="font-bold text-navy dark:text-white text-sm">2. Intellectual Property</h4>
              <p>
                You retain full ownership of all original posts, OneShots, and structured debate arguments published on Rashtralink.
              </p>
            </>
          )}

          {legalModalType === 'about' && (
            <>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-navy-light border border-amber-300 dark:border-navy-border font-medium text-xs">
                <strong>Rashtralink</strong> is an India-built sovereign social platform engineered to dismantle engagement-driven outrage loops.
              </div>

              <h4 className="font-bold text-navy dark:text-white text-sm">Our Pillars</h4>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><strong>Algorithmic Sovereignty:</strong> Priority Matrix puts you in direct control of feed levers.</li>
                <li><strong>Bharat Consensus:</strong> Charcha Arena provides live agreement metrics on national questions.</li>
                <li><strong>Vernacular Inclusion:</strong> 7 regional languages with 1-tap instant switching.</li>
                <li><strong>Citizen Privacy:</strong> Incognito mode for frictionless, anonymous discourse.</li>
              </ul>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-border-light dark:border-navy-light flex justify-end shrink-0">
          <button
            onClick={() => setLegalModalType(null)}
            className="px-5 py-2 rounded-xl bg-saffron text-white text-xs font-bold hover:bg-saffron-hover shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
