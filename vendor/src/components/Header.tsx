'use client';

import React from 'react';
import { Search, User } from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';

export default function Header() {
  const { isCollapsed } = useSidebar();

  return (
    <header className={`fixed top-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 z-40 transition-all duration-300 ${
      isCollapsed ? 'left-22' : 'left-64'
    }`}>
      <div className="max-w-[1500px] mx-auto h-full px-8 flex items-center justify-between">
        {/* Right Side: Search and Profile */}
        <div className="flex items-center gap-4 flex-grow justify-end">
          {/* Search Bar */}
          <div className="relative max-w-xs w-full hidden sm:block">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search apps or keys..." 
              className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition-all outline-none"
            />
          </div>

          {/* Profile Section */}
          <button className="flex items-center gap-3 p-1.5 rounded-2xl transition-all group">
            <div className="relative">
              <div className="w-9.5 h-9.5 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-indigo-500/20">
                VD
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
