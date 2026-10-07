import React from 'react';
import { ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { AuthixConfig } from '../types';
import { enable3FA } from '../core';

export interface Enable3FAButtonProps {
  config: AuthixConfig;
  variant?: 'solid' | 'outline' | 'glow' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showIcon?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Premium Drop-in Button Component for users to enroll or enable Authix 3FA.
 */
export const Enable3FAButton: React.FC<Enable3FAButtonProps> = ({ 
  config, 
  variant = 'solid',
  size = 'md',
  label = 'Enable 3FA',
  showIcon = true,
  className = "",
  onClick
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    } else {
      enable3FA(config);
    }
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs gap-2 rounded-xl',
    md: 'px-7 py-3.5 text-sm gap-2.5 rounded-2xl',
    lg: 'px-10 py-5 text-base gap-3 rounded-2xl'
  }[size];

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 20
  }[size];

  const variantClasses = {
    solid: `
      bg-[#052558] text-white shadow-xl shadow-blue-950/20 
      hover:bg-[#0a3a8a] hover:shadow-blue-900/30 hover:-translate-y-0.5 active:scale-[0.98]
    `,
    outline: `
      bg-white/10 text-slate-900 border border-slate-300 dark:text-white dark:border-slate-700 
      hover:bg-slate-100 dark:hover:bg-slate-800 hover:-translate-y-0.5 active:scale-[0.98]
    `,
    glow: `
      bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white
      shadow-[0_0_25px_rgba(59,130,246,0.4)] hover:shadow-[0_0_35px_rgba(59,130,246,0.6)]
      hover:-translate-y-0.5 active:scale-[0.98]
    `,
    minimal: `
      bg-transparent text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30
    `
  }[variant];

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        group relative inline-flex items-center justify-center font-bold 
        tracking-wider uppercase transition-all duration-300 select-none cursor-pointer
        ${sizeClasses}
        ${variantClasses}
        ${className}
      `}
    >
      {showIcon && (
        <ShieldCheck 
          size={iconSizes} 
          className="transition-transform duration-300 group-hover:scale-110 text-blue-400 group-hover:text-blue-300" 
        />
      )}
      <span>{label}</span>
      <ArrowRight 
        size={iconSizes} 
        className="opacity-60 transition-transform duration-300 group-hover:translate-x-1 group-hover:opacity-100" 
      />
    </button>
  );
};
