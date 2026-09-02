'use client';

import React from 'react';
import { Lock } from 'lucide-react';
import { useApp } from '@/lib/store-context';

interface LockedV2BadgeProps {
  label?: string;
  size?: 'sm' | 'md';
  featureName?: string;
  className?: string;
  onClick?: () => void;
}

export const LockedV2Badge: React.FC<LockedV2BadgeProps> = ({
  label = 'Coming in V2',
  size = 'sm',
  featureName = 'This feature',
  className = '',
  onClick,
}) => {
  const { showToast } = useApp();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    } else {
      showToast(`${featureName} is part of the Phase 2 roadmap and will ship in V2!`, 'info');
    }
  };

  return (
    <span
      onClick={handleClick}
      className={`inline-flex items-center gap-1 font-semibold rounded-full cursor-pointer select-none transition-all duration-200
        bg-slate-200/80 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700
        ${size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'}
        ${className}`}
      title="Roadmap item - Phase 2"
    >
      <Lock className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      <span>{label}</span>
    </span>
  );
};
