'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass-card px-8 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
          Authix
        </Link>
        
        <div className="hidden md:flex items-center space-x-10 uppercase">
          <Link href="#home" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Home</Link>
          <Link href="#about" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">About</Link>
          <Link href="#pricing" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Pricing</Link>
          <Link href="#reviews" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Reviews</Link>
          <Link href="#contact" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Contact</Link>
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <button 
              onClick={logout}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              Logout
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
              {user.email?.[0].toUpperCase() || 'U'}
            </div>
          </div>
        ) : (
          <Link href="/login" className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-lg shadow-indigo-500/25">
            Get Started
          </Link>
        )}
      </div>
    </nav>
  );
}
