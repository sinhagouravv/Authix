'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  LayoutDashboard, Users, AppWindow, Key, 
  BarChart3, Settings, ChevronLeft, ChevronRight,
  Bell, LogOut, PlusCircle
} from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Analytics', icon: BarChart3, href: '/analytics' },
  { name: 'My Apps', icon: AppWindow, href: '/apps' },
  { name: 'Users', icon: Users, href: '/users' },
  { name: 'Register App', icon: PlusCircle, href: '/register-app' },
  { name: 'API Keys', icon: Key, href: '/api-keys' },
  { name: 'Notifications', icon: Bell, href: '/notifications' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];


export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const handleSignOut = async () => {
    try {
      const { logoutVendor } = await import('@/app/auth-actions');
      await logoutVendor();
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Fallback redirect even if logging fails
      router.push('/login');
    }
  };

  const renderItem = (item: any) => {
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.name}
        href={item.href}
        className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
          isActive 
            ? 'bg-white text-[#011023] shadow-md shadow-[#052558]/20 border border-slate-100' 
            : 'text-slate-500 hover:text-[#052558] hover:bg-[#f8fafc]'
        } ${isCollapsed ? 'justify-center px-0 h-11 w-11 mx-auto' : ''}`}
      >
        <item.icon size={isCollapsed ? 20 : 18} className={isActive ? 'text-[#011023]' : 'text-slate-500 group-hover:text-[#052558] transition-colors'} />
        {!isCollapsed && <span className="text-xs uppercase font-bold tracking-tight">{item.name}</span>}
        {isActive && !isCollapsed && (
          <div className="absolute right-3 w-1.5 h-1.5 bg-[#052558] rounded-full" />
        )}
      </Link>
    );
  };

  return (
    <aside className={`fixed left-0 top-0 h-screen ${isCollapsed ? 'w-22' : 'w-64'} bg-white border-r border-[#e6f0fa] flex flex-col z-50 shadow-sm transition-all duration-300`}>
      {/* Header Section */}
      <div className={`pt-6 px-[18px] border-b border-[#e6f0fa] flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} relative pb-6`}>
          <div className={`flex items-center gap-3 ${isCollapsed ? 'hidden' : 'flex'}`}>
              <Image src="/AuthixLogo.svg" alt="Authix Logo" width={32} height={32} className="w-8 h-8 object-contain" />
              <div>
                  <h1 className="text-xl font-bold text-[#052558] tracking-tight uppercase">AUTHIX</h1>
              </div>
          </div>
          
          {isCollapsed && (
              <Image
                  src="/AuthixLogo.svg"
                  alt="Authix Logo"
                  width={32}
                  height={32}
                  className="w-10 h-8 object-contain cursor-pointer hover:scale-105 transition-transform"
                  onClick={toggleSidebar}
              />
          )}

          {!isCollapsed && (
              <button
                  onClick={toggleSidebar}
                  className="bg-white border border-[#e6f0fa] text-[#052558] rounded-full p-1.5 shadow-sm hover:bg-[#f0f7ff] transition-all cursor-pointer"
              >
                  <ChevronLeft size={14} />
              </button>
          )}
      </div>

      <nav className={`flex-grow flex flex-col gap-1.5 ${isCollapsed ? 'overflow-visible' : 'overflow-y-auto'} custom-scrollbar p-4`}> 
        {menuItems.map(renderItem)}
      </nav>

      <div className={`p-4 flex flex-col gap-1 ${isCollapsed ? 'items-center' : ''} border- border-[#e6f0fa]`}>
        <button 
          onClick={handleSignOut}
          className={`flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:text-rose-600 transition-all duration-200 w-full ${isCollapsed ? 'justify-center w-11 h-11 p-0' : ''}`}
        >
          <LogOut size={isCollapsed ? 18 : 18} />
          {!isCollapsed && <span className="text-xs uppercase font-bold tracking-tight">Sign Out</span>}
        </button>
      </div>

    </aside>
  );
}
