import React from 'react';
import { ShieldCheck } from 'lucide-react';

export interface AuthixBadgeProps {
  theme?: 'dark' | 'light' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const AuthixBadge: React.FC<AuthixBadgeProps> = ({
  theme = 'dark',
  size = 'md',
  className = "",
}) => {
  const isSm = size === 'sm';

  const themeClasses = {
    dark: 'bg-slate-900 text-white border border-slate-800 shadow-md',
    light: 'bg-white text-slate-900 border border-slate-200 shadow-sm',
    outline: 'bg-transparent text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
  }[theme];

  return (
    <div
      className={`
        inline-flex items-center gap-2 rounded-full font-semibold transition-all select-none
        ${isSm ? 'px-3 py-1 text-[11px]' : 'px-4 py-1.5 text-xs'}
        ${themeClasses}
        ${className}
      `}
    >
      <ShieldCheck size={isSm ? 13 : 15} className="text-emerald-500" />
      <span>Protected by <strong className="font-bold tracking-wide">Authix 3FA</strong></span>
    </div>
  );
};
