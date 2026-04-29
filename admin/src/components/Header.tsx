'use client';

import React from 'react';
import { Search, Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';

export default function Header() {
  const { isCollapsed } = useSidebar();

  return (
    <header className={`fixed top-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-[#e6f0fa] z-40 transition-all duration-300 ${
      isCollapsed ? 'left-24' : 'left-64'
    }`}>
      <div className="max-w-[1500px] mx-auto h-full flex items-center justify-between">
        {/* Right Side: Search and Profile */}
        <div className="flex items-center gap-2 flex-grow justify-end">
          {/* Search Bar */}
            <div className="relative max-w-xs w-full hidden sm:block">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#052558]/10 focus:bg-white transition-all outline-none"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400">⌘</span>
              <span className="text-[10px] font-bold text-slate-400">K</span>
            </div>
          </div>

          {/* Profile Section */}
          <button className="flex items-center gap-3 p-1.5 rounded-2xl transition-all group">
            <div className="relative">
              <div className="w-9.5 h-9.5 rounded-xl bg-gradient-to-br from-[#052558] to-[#527FB0] flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-[#052558]/20">
                GS
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
