'use client';

import React from 'react';
import { 
  Star, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ArrowUpRight,
  MessageSquare
} from 'lucide-react';

const reviews = [
  { id: 1, user: 'Alex Morgan', rating: 5, comment: 'Exceptional authentication flow. The 3FA implementation is the most secure we have used so far.', date: '2 hours ago', status: 'Approved', avatar: 'AM' },
  { id: 2, user: 'Sarah Wilson', rating: 4, comment: 'Integration was smooth, though the documentation for custom providers could be slightly more detailed.', date: '5 hours ago', status: 'Pending', avatar: 'SW' },
  { id: 3, user: 'Michael Chen', rating: 5, comment: 'The admin dashboard is a game changer. Managing clients has never been this easy.', date: 'Yesterday', status: 'Approved', avatar: 'MC' },
  { id: 4, user: 'Elena Rodriguez', rating: 2, comment: 'Encountered some latency issues during peak hours in the European region.', date: '2 days ago', status: 'Flagged', avatar: 'ER' },
  { id: 5, user: 'David Park', rating: 4, comment: 'Great support team. They helped us resolve a complex OIDC configuration in under an hour.', date: '3 days ago', status: 'Approved', avatar: 'DP' },
];

export default function ReviewsPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reviews</h1>
          <p className="text-slate-500 mt-1">Monitor and manage user feedback and system ratings.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white bg-[#f0f7ff] flex items-center justify-center text-[10px] font-bold text-[#052558]">
              +12
            </div>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-amber-400">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Average Rating</span>
            <div className="p-2 bg-amber-50 text-amber-500 rounded-lg">
              <Star className="w-5 h-5 fill-current" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-900">4.8</span>
            <span className="text-sm font-bold text-emerald-500 mb-1 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +0.2
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Based on 1,240 verified reviews</p>
        </div>

        <div className="glass-card p-6 border-l-4 border-l-[#052558]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Feedback</span>
            <div className="p-2 bg-[#f0f7ff] text-[#052558] rounded-lg">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-900">2,543</span>
            <span className="text-sm font-bold text-emerald-500 mb-1 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              12%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Growth in monthly submissions</p>
        </div>

        <div className="glass-card p-6 border-l-4 border-l-emerald-400">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Satisfaction</span>
            <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-900">98%</span>
            <span className="text-sm font-bold text-emerald-500 mb-1 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              High
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Positive sentiment analysis</p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/40">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-bold text-slate-900">User Testimonials</h3>
            <div className="h-5 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#052558] text-white text-[10px] font-bold rounded-full">All</span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full hover:bg-slate-200 cursor-pointer">Pending</span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full hover:bg-slate-200 cursor-pointer">Flagged</span>
            </div>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search feedback..." 
              className="pl-10 pr-4 py-2 bg-white/80 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#052558]/10 outline-none w-64 transition-all"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {reviews.map((review) => (
            <div key={review.id} className="p-6 hover:bg-slate-50/50 transition-colors group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#052558] to-[#527FB0] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#052558]/10 flex-shrink-0">
                    {review.avatar}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-sm font-bold text-slate-900">{review.user}</h4>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-current' : 'text-slate-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                      "{review.comment}"
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <Clock className="w-3 h-3" />
                        {review.date}
                      </span>
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        review.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                        review.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                        'bg-rose-50 text-rose-600'
                      }`}>
                        {review.status}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 bg-white border border-slate-200 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm" title="Approve">
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-white border border-slate-200 rounded-lg text-rose-600 hover:bg-rose-50 transition-all shadow-sm" title="Flag">
                    <XCircle className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-slate-50/30 flex justify-center border-t border-slate-100">
          <button className="text-xs font-bold text-[#052558] hover:opacity-80 transition-colors uppercase tracking-widest">
            Load More Reviews
          </button>
        </div>
      </div>
    </div>
  );
}
