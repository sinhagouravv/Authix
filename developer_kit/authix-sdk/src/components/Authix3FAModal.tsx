import React, { useState } from 'react';
import { ShieldCheck, Smartphone, KeyRound, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import { useAuthix } from '../context/AuthixContext';

export interface Authix3FAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  description?: string;
}

export const Authix3FAModal: React.FC<Authix3FAModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = "3-Factor Authentication Required",
  description = "Complete the two additional security factors to verify your identity."
}) => {
  const { status, isLoading, error, submitTOTP, reset } = useAuthix();
  const [totpCode, setTotpCode] = useState("");

  if (!isOpen) return null;

  const handleTOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totpCode.length !== 6) return;
    const ok = await submitTOTP(totpCode);
    if (ok && status === 'VERIFIED') {
      onSuccess?.();
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 overflow-hidden text-slate-900 dark:text-white">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">{title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
          </div>
        </div>

        {/* Multi-factor Stepper */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-center text-xs font-semibold">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex flex-col items-center gap-1">
            <CheckCircle2 size={16} />
            <span>1. Password</span>
          </div>
          <div className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            status === 'WAITING_TOTP' || status === 'PENDING'
              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 font-bold'
              : status === 'WAITING_MOBILE_APPROVAL' || status === 'VERIFIED'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent'
          }`}>
            <KeyRound size={16} />
            <span>2. TOTP</span>
          </div>
          <div className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            status === 'WAITING_MOBILE_APPROVAL'
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-bold animate-pulse'
              : status === 'VERIFIED'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent'
          }`}>
            <Smartphone size={16} />
            <span>3. Device Push</span>
          </div>
        </div>

        {/* Step Content */}
        {status === 'VERIFIED' ? (
          <div className="text-center py-6">
            <div className="mx-auto w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-3">
              <CheckCircle2 size={36} />
            </div>
            <h4 className="font-bold text-lg text-emerald-600 dark:text-emerald-400">3FA Verification Complete!</h4>
            <p className="text-xs text-slate-500 mt-1">Your identity has been fully verified across all 3 factors.</p>
            <button
              onClick={() => {
                onSuccess?.();
                handleClose();
              }}
              className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition"
            >
              Continue to Application
            </button>
          </div>
        ) : status === 'WAITING_MOBILE_APPROVAL' ? (
          <div className="text-center py-6">
            <div className="mx-auto w-16 h-16 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <Smartphone size={32} />
            </div>
            <h4 className="font-bold text-base">Check Your Registered Phone</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
              A biometric confirmation push notification was dispatched to your Authix mobile app.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-xs font-semibold text-slate-400">
              <Loader2 size={14} className="animate-spin" />
              <span>Waiting for on-device biometric approval...</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleTOTPSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Enter 6-Digit Authenticator Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000 000"
                className="w-full text-center text-2xl font-mono tracking-[0.3em] font-bold py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-rose-500 text-xs bg-rose-500/10 p-3 rounded-xl">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={totpCode.length !== 6 || isLoading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Verify Code & Proceed to Factor 3</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
