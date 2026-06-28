'use client';

import React, { useEffect } from 'react';
import { 
  Lock, Terminal
} from 'lucide-react';
import { useVault } from '@/context/VaultContext';
import { useRouter } from 'next/navigation';

export default function VaultPage() {
  const { isUnlocked: isLogsUnlocked, triggerVault } = useVault();
  const router = useRouter();
  const [currentTime, setCurrentTime] = React.useState<Date | null>(null);
  const [mounted, setMounted] = React.useState(false);

  // Redirect if already unlocked
  useEffect(() => {
    if (isLogsUnlocked) {
      router.push('/logs');
    }
  }, [isLogsUnlocked, router]);

  React.useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Don't render anything if unlocked (to avoid flicker before redirect)
  if (isLogsUnlocked) return null;

  return (
    <div className="space-y-5 pb-0.25 px-0.25">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* <h1 className="text-3xl font-semibold uppercase tracking-tight text-[#052558]">Logs Vault</h1> */}
        </div>
        <div className="text-[12.5px] uppercase text-gray-500 font-semibold self-end md:self-center mb-1 flex items-center gap-2 h-5">
          <Terminal size={14} className="text-blue-500" />
          {mounted && currentTime
            ? `Security Protocol Actived | ${currentTime.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()} | ${currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`
            : 'Initializing...'}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="glass-card overflow-hidden h-[55.75rem] border-l border-gray-200 relative">
          {/* Locked State View */}
          <div className="absolute inset-0 z-10 flex mt-[20%] flex-col items-center justify-center bg-slate-50/10 backdrop-blur-[2px]">
            <div className="w-24 h-24 bg-white shadow-2xl shadow-blue-500/10 rounded-3xl flex items-center justify-center mb-5 animate-pulse border border-slate-100">
              <Lock size={48} className="text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-[#052558] mb-5 uppercase tracking-wide">Logs Page Locked</h2>
            <p className="text-slate-400 text-center uppercase max-w-xl mb-8 text-[13.5px]">
              This page contains system and user logs. Access is restricted <br /> for security reasons. Please unlock the page to<br />  securely view and manage the logs.
            </p>

            <button 
              onClick={() => triggerVault()}
              className="px-7 py-2 bg-[#011023] text-white rounded-2xl font-bold text-[12px] uppercase tracking-widest shadow-lg shadow-[#052558]/20 transition-all flex items-center gap-2 group mb-12"
            >
              Unlock
            </button>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-xl opacity-20 pointer-events-none grayscale">
               {[1, 2, 3, 4].map((i) => (
                 <div key={i} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm h-40" />
               ))}
            </div>
          </div>
      </div>
    </div>
  );
}
