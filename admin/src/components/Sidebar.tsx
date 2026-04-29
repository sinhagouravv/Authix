'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { LayoutDashboard,  Users,  AppWindow,  Key,  FileText,  Shield,  LogIn,  BarChart3,  Settings,  History,  ChevronLeft,  ChevronRight, CreditCard, Mail, Star, Bell, UserSquare2, LogOut
} from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Analytics', icon: BarChart3, href: '/analytics' },
  { name: 'Payments', icon: CreditCard, href: '/payments' },
  { name: 'Vendors', icon: UserSquare2, href: '/vendors' },
  { name: 'Users', icon: Users, href: '/users' },
  { name: 'Clients (Apps)', icon: AppWindow, href: '/clients' },
  { name: 'API Keys', icon: Key, href: '/api-keys' },
  { name: 'Logs', icon: FileText, href: '/logs' },
  // { name: 'Login Requests', icon: LogIn, href: '/login-requests' },
  { name: 'Audit Logs', icon: History, href: '/audit-logs' },
  { name: 'Messages', icon: Mail, href: '/messages' },
  { name: 'Reviews', icon: Star, href: '/reviews' },
  { name: 'Notifications', icon: Bell, href: '/notifications' },
  // { name: 'Security', icon: Shield, href: '/security' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <aside className={`fixed left-0 top-0 h-screen ${isCollapsed ? 'w-22' : 'w-64'} bg-white border-r border-[#e6f0fa] flex flex-col z-50 shadow-sm transition-all duration-300`}>
      {/* Header Section */}
      <div className={`pt-6 px-[18px] border-b border-[#e6f0fa] flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} relative pb-6`}>
          <div className={`flex items-center gap-3 ${isCollapsed ? 'hidden' : 'flex'}`}>
              <Image src="/AuthixLogo.svg" alt="Authix Logo" width={64} height={64} className="-ml-3 w-16 h-16 object-contain " />
              <div className="-ml-4">
                  <h1 className="text-xl font-black tracking-tight text-semibold leading-none text-[#052558]">Authix</h1>
                  <p className="text-[#527FB0] font-bold text-[10px] tracking-widest uppercase mt-0.5">Admin Panel</p>
              </div>
          </div>
          
          {/* Logo icon only when collapsed */}
          {isCollapsed && (
              <Image
                  src="/AuthixLogo.svg"
                  alt="Authix Logo"
                  width={96}
                  height={40}
                  className="w-24 h-10 object-contain cursor-pointer hover:scale-105 transition-transform"
                  onClick={toggleSidebar}
              />
          )}

          {/* Toggle Button */}
          {!isCollapsed && (
              <button
                  onClick={toggleSidebar}
                  className="absolute -right-3 top-10 bg-white border border-[#e6f0fa] text-[#052558] rounded-full p-1.5 shadow-md hover:bg-[#f0f7ff] transition-all cursor-pointer z-50"
              >
                  <ChevronLeft size={14} />
              </button>
          )}
      </div>

      <nav className="flex-grow flex flex-col gap-2 overflow-y-auto custom-scrollbar p-4 mt-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : ''}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-white text-[#011023] shadow-md shadow-[#052558]/20' 
                  : 'text-slate-500 hover:text-[#052558] hover:bg-[#ffff]'
              } ${isCollapsed ? 'justify-center px-0 h-11 w-11 mx-auto' : ''}`}
            >
              <item.icon size={isCollapsed ? 20 : 18} className={isActive ? 'text-[#011023]' : 'text-[#527FB0]/90 group-hover:text-[#052558] transition-colors'} />
              {!isCollapsed && <span className="text-[13px] font-bold tracking-tight">{item.name}</span>}
              {isActive && !isCollapsed && (
                <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className={`p-3 flex flex-col gap-1 ${isCollapsed ? 'items-center' : ''}`}>
        <button className={`flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 ${isCollapsed ? 'justify-center w-12 h-12 p-0' : ''}`}>
          <LogOut size={isCollapsed ? 18 : 18} />
          {!isCollapsed && <span className="text-[13px] font-bold tracking-tight">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
