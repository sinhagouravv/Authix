'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Lock, Smartphone, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react';

function SetupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const clientId = searchParams.get('clientId');
  const redirectUri = searchParams.get('redirectUri');
  const state = searchParams.get('state');

  const [step, setStep] = useState(1); // 1: Sign up, 2: 3FA Setup, 3: Success
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Auto-redirect on success
  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        if (redirectUri) {
          window.location.href = `${redirectUri}${redirectUri.includes('?') ? '&' : '?'}state=${state}&status=success`;
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step, redirectUri, state]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate backend call
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setStep(2);
  };

  const handleVerify = async () => {
    setLoading(true);
    // Simulate TOTP verification
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setStep(3);
  };

  // if (!clientId || !redirectUri) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
  //       <div className="bg-white p-8 rounded-3xl shadow-xl border border-rose-100 text-center max-w-md">
  //         <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
  //           <Lock className="w-8 h-8" />
  //         </div>
  //         <h1 className="text-2xl font-bold text-slate-900 mb-4">Invalid Request</h1>
  //         <p className="text-slate-500">The 3FA setup request is missing required parameters. Please contact the application developer.</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-xl bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 border border-white p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20 mb-6">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Authix 3FA Setup</h1>
          <p className="text-slate-500">Secure your account for application <span className="text-indigo-600 font-semibold">{clientId}</span></p>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${step >= s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-100 text-slate-400'}`}>
                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              {s < 3 && <div className={`h-1 w-12 rounded-full transition-all duration-500 ${step > s ? 'bg-indigo-600' : 'bg-slate-100'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Steps */}
        <div className="min-h-[300px] flex flex-col justify-center">
          {step === 1 && (
            <form onSubmit={handleSignup} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="group w-full bg-indigo-600 text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    Continue to 3FA Setup
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-8 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="space-y-4">
                <div className="w-48 h-48 bg-slate-100 rounded-3xl mx-auto flex items-center justify-center border-2 border-dashed border-slate-200 relative group overflow-hidden">
                  {/* Mock QR Code */}
                  <div className="absolute inset-0 bg-white p-4">
                    <div className="w-full h-full bg-slate-900 rounded-lg flex flex-wrap p-1 opacity-80">
                       {Array.from({length: 64}).map((_, i) => (
                         <div key={i} className={`w-1/8 h-1/8 ${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`} style={{width: '12.5%', height: '12.5%'}} />
                       ))}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <Smartphone className="w-12 h-12 text-indigo-600" />
                  </div>
                </div>
                <p className="text-sm text-slate-500 px-6">Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.) to link your account.</p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <button
                  onClick={handleVerify}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Complete Setup'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-12 h-12 animate-in zoom-in duration-500 delay-200" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">Success!</h2>
                <p className="text-slate-500">Your 3FA has been successfully configured. We are redirecting you back to the application.</p>
              </div>
              <div className="flex items-center justify-center gap-3 py-4">
                <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                <span className="text-sm font-medium text-slate-400 uppercase tracking-widest">Redirecting...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SetupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    }>
      <SetupContent />
    </Suspense>
  );
}
