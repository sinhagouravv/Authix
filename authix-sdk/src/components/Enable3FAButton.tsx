import React from 'react';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import { AuthixConfig } from '../types';
import { enable3FA } from '../core';

interface Enable3FAButtonProps {
  config: AuthixConfig;
  className?: string;
}

/**
 * A high-fidelity React component for the 'Enable 3FA' button.
 * Designed with a premium Authix aesthetic using Tailwind CSS.
 */
export const Enable3FAButton: React.FC<Enable3FAButtonProps> = ({ config, className = "" }) => {
  return (
    <button
      onClick={() => enable3FA(config)}
      className={`
        group relative flex items-center gap-3 px-8 py-4 
        bg-[#052558] text-white rounded-2xl font-bold text-[13px] 
        uppercase tracking-[0.15em] shadow-2xl shadow-blue-900/20 
        transition-all duration-300 hover:bg-[#0a3a8a] 
        hover:shadow-blue-900/40 active:scale-[0.98] 
        ${className}
      `}
    > 
      <span className="relative z-10">Enable 3FA</span>
    </button>
  );
};
