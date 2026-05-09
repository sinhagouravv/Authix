'use client';

import React from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Send,
  User,
  Clock,
  CheckCheck
} from 'lucide-react';

const threads = [
  { id: 1, user: 'Robert Fox', lastMessage: 'The API integration is complete.', time: '2m ago', unread: true, status: 'online' },
  { id: 2, user: 'Jane Cooper', lastMessage: 'Can we schedule a call for tomorrow?', time: '1h ago', unread: false, status: 'offline' },
  { id: 3, user: 'Wade Warren', lastMessage: 'Please review the new security protocol.', time: '3h ago', unread: true, status: 'online' },
  { id: 4, user: 'Cody Fisher', lastMessage: 'The client reported a bug in the login flow.', time: 'Yesterday', unread: false, status: 'offline' },
  { id: 5, user: 'Esther Howard', lastMessage: 'Thanks for the quick response!', time: 'Yesterday', unread: false, status: 'online' },
];

export default function MessagesPage() {
  return (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Messages</h1>
          <p className="text-slate-500 mt-1">Direct communication with users and system administrators.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#052558] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#052558]/20">
          <Plus className="w-4 h-4" />
          New Message
        </button>
      </div>

      <div className="flex-grow glass-card flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-slate-100 flex flex-col bg-white/40">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search chats..." 
                className="w-full pl-10 pr-4 py-2 bg-white/80 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#052558]/10 outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex-grow overflow-y-auto custom-scrollbar">
            {threads.map((thread) => (
              <div key={thread.id} className="p-4 flex gap-3 hover:bg-[#f0f7ff]/50 cursor-pointer transition-colors relative group">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                    <User className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    thread.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'
                  }`} />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-slate-900 truncate">{thread.user}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{thread.time}</span>
                  </div>
                  <p className={`text-xs truncate ${thread.unread ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                    {thread.lastMessage}
                  </p>
                </div>
                {thread.unread && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#052558] rounded-full" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-grow flex flex-col bg-white/20 relative">
          {/* Active Chat Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f0f7ff] flex items-center justify-center border border-[#052558]/20">
                <User className="w-5 h-5 text-[#052558]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Robert Fox</h3>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  Online
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-all">
                <Filter className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-all">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages List (Mock) */}
          <div className="flex-grow p-6 overflow-y-auto space-y-6 custom-scrollbar bg-slate-50/30">
            <div className="flex justify-center">
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] text-slate-400 font-bold uppercase tracking-wider">Today</span>
            </div>
            
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center border border-slate-200">
                <User className="w-4 h-4 text-slate-400" />
              </div>
              <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
                <p className="text-sm text-slate-700 leading-relaxed">
                  Hey! Have you had a chance to look at the API integration for the new client portal? 
                  I've pushed the latest changes to the dev branch.
                </p>
                <span className="text-[10px] text-slate-400 mt-2 block">10:24 AM</span>
              </div>
            </div>

            <div className="flex flex-row-reverse gap-3 max-w-[80%] ml-auto">
              <div className="w-8 h-8 rounded-full bg-[#052558] flex-shrink-0 flex items-center justify-center shadow-lg shadow-[#052558]/20">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="bg-[#052558] p-4 rounded-2xl rounded-tr-none shadow-lg shadow-[#052558]/10">
                <p className="text-sm text-white leading-relaxed">
                  The API integration is complete. I just finished testing the authentication middleware. 
                  Everything seems to be working perfectly.
                </p>
                <div className="flex items-center justify-end gap-1 mt-2 text-[#e6f0fa]">
                  <span className="text-[10px]">10:26 AM</span>
                  <CheckCheck className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-100 bg-white/40">
            <div className="flex items-center gap-3">
              <div className="flex-grow relative">
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#052558]/10 outline-none shadow-sm transition-all"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-50 text-slate-400 rounded-lg">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button className="p-3 bg-[#052558] text-white rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[#052558]/20">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
