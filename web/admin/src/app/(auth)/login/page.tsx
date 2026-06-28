'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, User, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { loginAction } from './actions';


export default function AdminLoginPage() {
  const router = useRouter();
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await loginAction(adminId, password);
      
      if (result.success) {
        router.push('/dashboard');
      } else {
        throw new Error(result.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-slate-50 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-white/40 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md px-6 py-12">
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 p-10 space-y-8 relative">
          
          {/* Logo & Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 inline-block">
                <Image src="/AuthixLogo.svg" alt="Authix Logo" width={32} height={32} className="w-8 h-8" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-1">AUTHIX SYSTEM</p>
              <h1 className="text-2xl font-black text-[#052558] uppercase tracking-tight">Admin Portal</h1>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-xs font-medium animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email / Admin ID</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#052558] transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  placeholder="Enter credentials"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-300 font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#052558] transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-300 font-medium"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Forgot password?
              </button>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#052558] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20 hover:bg-[#072d6b] hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Login'}
            </button>
          </form>

          <div className="pt-4 text-center">
             <p className="text-[10px] text-slate-300 font-medium">Secure access point. Authorized personnel only.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
