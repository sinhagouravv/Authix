'use client';

import React, { useActionState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { loginVendor } from '../auth-actions';
import { Shield, Lock, UserCircle } from 'lucide-react';

export default function VendorLoginPage() {
  const [state, formAction, loading] = useActionState(loginVendor, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push('/dashboard');
    }
  }, [state, router]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/5 blur-[120px] rounded-full" />

      <div className="w-full max-w-[440px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-xl shadow-indigo-500/10 border border-slate-100 mb-2">
            <Image src="/AuthixLogo.svg" alt="Authix Logo" width={48} height={48} />
          </div>
          <h1 className="text-3xl font-black text-[#052558] tracking-tight uppercase">Vendor Panel</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Secure Access Control</p>
        </div>

        <div className="glass-card p-10 bg-white shadow-2xl border border-slate-100 relative z-10">
          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold uppercase tracking-wide flex items-center gap-2 animate-in shake duration-300">
                 <Shield size={16} />
                 {state.error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Vendor ID</label>
              <div className="relative group">
                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  name="vendorId"
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-300 font-bold text-[#052558]"
                  placeholder="VEND-XXXXX"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-300 font-bold text-[#052558]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#052558] text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 hover:bg-[#011023] hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In to Panel'}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em]">
          Powered by Authix 3-Factor Security
        </p>
      </div>
    </div>
  );
}
