'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function AdminContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Header />
        <main className={`flex-grow ${isCollapsed ? 'ml-24' : 'ml-64'} p-8 pt-24 min-h-screen relative overflow-x-hidden transition-all duration-300 bg-slate-50`}>
          {/* Subtle decorative elements for the light theme */}
          <div className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 -z-10 w-1/2 h-1/2 bg-[#527FB0]/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-[1500px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f8fafc] text-[#0f172a] min-h-screen`}>
        <SidebarProvider>
          <AdminContent>
            {children}
          </AdminContent>
        </SidebarProvider>
      </body>
    </html>
  );
}
