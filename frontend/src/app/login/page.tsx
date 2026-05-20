'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { loginVendor, registerVendor } from '@/app/auth-actions';

export default function LoginPage() {
  const router = useRouter();
  const { refreshSession } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData(e.currentTarget);
    const action = isLogin ? loginVendor : registerVendor;
    
    try {
      const result = await action(null, formData) as any;

      if (result?.success) {
        setMessage({ type: 'success', text: result.message || 'Success!' });
        if (isLogin) {
           await refreshSession();
           router.push('/');
        } else {
          // Success registration, maybe show the vendor ID
          if (result.vendorId) {
            setMessage({ type: 'success', text: `Registered! Your Vendor ID is ${result.vendorId}. Please log in.` });
          }

          setIsLogin(true); 
        }
      } else {
        setMessage({ type: 'error', text: result?.error || 'Something went wrong' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center relative bg-[#f8fafc]">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>

      <div className="w-full max-w-md glass-card p-10 space-y-8 bg-white/80 border-slate-200 shadow-2xl backdrop-blur-xl rounded-[2rem]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-slate-400">
            {isLogin ? 'Sign in to access your vendor portal' : 'Start your journey as a verified vendor'}
          </p>
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
            {message.text}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
              <input
                name="name"
                type="text"
                required={!isLogin}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all duration-300"
                placeholder="John Doe"
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all duration-300"
              placeholder="name@company.com"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all duration-300"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-indigo-600 px-4 py-4 text-center text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-slate-500 hover:text-indigo-600 transition-colors font-semibold"
          >
            {isLogin ? "New vendor? Create an account" : "Already registered? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}

