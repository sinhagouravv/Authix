'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useAlert } from '@/context/AlertContext';

interface VaultContextType {
  isOpen: boolean;
  isUnlocked: boolean;
  setIsUnlocked: (unlocked: boolean) => void;
  triggerVault: (options?: { 
    onSuccess?: () => void; 
    title?: string; 
    subtitle?: string;
    type?: string;
  }) => void;
  closeVault: () => void;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export function VaultProvider({ children }: { children: React.ReactNode }) {
  const { triggerAlert } = useAlert();
  const [isOpen, setIsOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [config, setConfig] = useState<{
    onSuccess?: () => void;
    title: string;
    subtitle: string;
    type: string;
  }>({
    title: 'Security Access',
    subtitle: 'Enter the 6-digit vault password',
    type: 'logs-vault'
  });

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const triggerVault = useCallback((options?: { 
    onSuccess?: () => void; 
    title?: string; 
    subtitle?: string;
    type?: string;
  }) => {
    setConfig({
      onSuccess: options?.onSuccess,
      title: options?.title || 'Security Access',
      subtitle: options?.subtitle || 'Enter the 6-digit vault password',
      type: options?.type || 'logs-vault'
    });
    setIsOpen(true);
  }, []);

  const closeVault = useCallback(() => {
    setIsOpen(false);
    setOtp(['', '', '', '', '', '']);
    setError(false);
    setIsVerifying(false);
  }, []);

  const handleOtpBoxChange = (value: string, index: number) => {
    if (!value) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    const char = value.replace(/\*/g, '').slice(-1);
    if (char && isNaN(Number(char))) return;
    
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);

    if (char && index < 5) {
      const nextInput = document.getElementById(`vault-otp-box-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpInput = otp.join('');
    if (otpInput.length !== 6) return;
    
    setIsVerifying(true);
    setError(false);

    try {
      const res = await fetch('/api/vault/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          otp: otpInput,
          vaultType: config.type 
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsUnlocked(true);
        if (config.onSuccess) config.onSuccess();
        triggerAlert('Vault Unlocked Successfully', 'success');
        closeVault();
      } else {
        throw new Error(data.error || 'Invalid password');
      }
    } catch (err: any) {
      setError(true);
      setOtp(['', '', '', '', '', '']);
      const firstInput = document.getElementById('vault-otp-box-0');
      firstInput?.focus();
      triggerAlert(err.message || 'Incorrect Password', 'error');
      setTimeout(() => setError(false), 2000);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpBoxKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const prevInput = document.getElementById(`vault-otp-box-${index - 1}`);
        prevInput?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      const prevInput = document.getElementById(`vault-otp-box-${index - 1}`);
      prevInput?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      const nextInput = document.getElementById(`vault-otp-box-${index + 1}`);
      nextInput?.focus();
    } else if (e.key === 'Enter') {
      handleVerifyOTP();
    }
  };

  return (
    <VaultContext.Provider value={{ 
      isOpen, 
      isUnlocked, 
      setIsUnlocked, 
      triggerVault,
      closeVault
    }}>
      {children}
      
      {/* Global Vault Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#011023]/10 backdrop-blur-sm" onClick={closeVault} />
          <div className="relative w-full max-w-xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-gray-100/50 flex items-center justify-between relative">
                  <div className="w-9"></div>
                  <div className="text-center absolute left-1/2 -translate-x-1/2 uppercase">
                      <h2 className="text-xl mt-3 font-bold text-[#011023] whitespace-nowrap">{config.title}</h2>
                      <p className="text-[13px] text-gray-500 font-bold mt-1 uppercase tracking-tight">{config.subtitle}</p>
                  </div>
                  <button onClick={closeVault} className="p-2 rounded-full transition-colors text-gray-400 hover:text-gray-700 relative z-10">
                      <X size={20} />
                  </button>
              </div>
              
              <div className="p-10 space-y-8 flex flex-col items-center">
                  <div className="text-center w-full">
                      <div className="flex justify-center gap-2 sm:gap-3 w-full mb-5 px-2">
                          {[0, 1, 2, 3, 4, 5].map((index) => (
                              <input
                                  key={index}
                                  id={`vault-otp-box-${index}`}
                                  type="text"
                                  maxLength={2}
                                  value={otp[index] ? '*' : ''}
                                  onChange={(e) => handleOtpBoxChange(e.target.value, index)}
                                  onKeyDown={(e) => handleOtpBoxKeyDown(e, index)}
                                  onFocus={(e) => (e.target as HTMLInputElement).select()}
                                  autoComplete="off"
                                  className={`w-10 h-12 text-center text-3xl text-[#011023] bg-white/50 border rounded-xl focus:ring-2 transition-all shadow-sm outline-none caret-transparent selection:bg-transparent selection:text-current pt-2.5 ${
                                      error 
                                      ? 'border-rose-500 ring-rose-500/10' 
                                      : 'border-white/60 focus:ring-blue-500/10 focus:border-blue-500/30'
                                  }`}
                                  autoFocus={index === 0}
                              />
                          ))}
                      </div>
                  </div>
              </div>

              <div className="p-2 grid grid-cols-2 gap-3 pb-8 px-11">
                  <button 
                      onClick={closeVault}
                      className="px-4 py-3 bg-white border border-gray-200 text-gray-400 rounded-2xl text-[12px] font-bold uppercase tracking-widest hover:bg-white hover:text-gray-600 transition-all shadow-sm active:scale-95"
                  >
                      CANCEL
                  </button>
                  <button 
                      onClick={handleVerifyOTP}
                      disabled={isVerifying || otp.join('').length !== 6}
                      className="px-4 py-3 bg-[#011023] text-white rounded-2xl text-[12px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                      {isVerifying ? (
                          <><Loader2 size={16} className="animate-spin" /> VERIFYING...</>
                      ) : (
                          "UNLOCK"
                      )}
                  </button>
              </div>
          </div>
        </div>
      )}
    </VaultContext.Provider>
  );
}

export function useVault() {
  const context = useContext(VaultContext);
  if (context === undefined) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
}
