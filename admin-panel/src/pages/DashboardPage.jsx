import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, CheckCircle, FileEdit, Layers, Users, 
  Eye, PlusCircle, Settings, Activity, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { getAnalytics } from '../services/api';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics()
      .then(res => setData(res))
      .catch(err => console.error('Failed to load dashboard stats:', err))
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats || {
    total_comics: 0,
    published_comics: 0,
    draft_comics: 0,
    total_pages: 0,
    total_users: 0,
    total_reads: 0
  };

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CONNECTED SINGLE DATABASE SYSTEM</span>
          </div>
          <h1 className="text-3xl font-black font-serif text-white">
            RITAYAN Admin Control Panel
          </h1>
          <p className="text-slate-400 text-xs max-w-xl">
            All statistics are computed directly from MySQL. Changes published here instantly update the public website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link 
            to="/admin/comics/create"
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs no-underline transition flex items-center gap-2 shadow-lg"
          >
            <PlusCircle className="w-4 h-4" />
            <span>CREATE NEW ISSUE</span>
          </Link>

          <a 
            href="http://localhost:5173" 
            target="_blank" 
            rel="noreferrer"
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs no-underline transition"
          >
            Open Public Site ↗
          </a>
        </div>
      </div>

      {/* KPI Stats Cards (Direct MySQL aggregates) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Total Comics</span>
            <BookOpen className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-3xl font-black font-serif text-white block">{stats.total_comics}</span>
          <span className="text-[10px] text-slate-500">In MySQL database</span>
        </div>

        <div className="bg-slate-900 border border-emerald-500/30 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-bold uppercase">Published</span>
            <CheckCircle className="w-4 h-4" />
          </div>
          <span className="text-3xl font-black font-serif text-emerald-400 block">{stats.published_comics}</span>
          <span className="text-[10px] text-slate-500">Visible on public site</span>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold uppercase">Drafts</span>
            <FileEdit className="w-4 h-4" />
          </div>
          <span className="text-3xl font-black font-serif text-amber-400 block">{stats.draft_comics}</span>
          <span className="text-[10px] text-slate-500">Hidden from public</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Total Pages</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-3xl font-black font-serif text-white block">{stats.total_pages}</span>
          <span className="text-[10px] text-slate-500">Comic pages in DB</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Total Users</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-3xl font-black font-serif text-white block">{stats.total_users}</span>
          <span className="text-[10px] text-slate-500">Registered readers</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Total Reads</span>
            <Eye className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-3xl font-black font-serif text-white block">{stats.total_reads}</span>
          <span className="text-[10px] text-slate-500">Reading sessions</span>
        </div>

      </div>

      {/* Main Grid: Recent Activity & Top Read Comics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Activity Audit Log */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold font-serif text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" />
              <span>Recent Activity Logs</span>
            </h3>
            <Link to="/admin/activity" className="text-xs text-amber-400 font-bold no-underline hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {(!data?.recent_activity || data.recent_activity.length === 0) ? (
              <p className="text-slate-500 text-xs py-4 text-center">No recent activity logged.</p>
            ) : (
              data.recent_activity.slice(0, 6).map(act => (
                <div key={act.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-amber-400 block">{act.action}</span>
                    <span className="text-slate-300 block">{act.details}</span>
                  </div>
                  <div className="text-right text-[11px] text-slate-500">
                    <div>{act.admin_name || 'Admin'}</div>
                    <div>{act.created_at}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Read Comics */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold font-serif text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>Comic Issue Summary</span>
            </h3>
            <Link to="/admin/comics" className="text-xs text-amber-400 font-bold no-underline hover:underline">
              Manage Catalog
            </Link>
          </div>

          <div className="space-y-3">
            {(!data?.top_comics || data.top_comics.length === 0) ? (
              <p className="text-slate-500 text-xs py-4 text-center">No comic data.</p>
            ) : (
              data.top_comics.map(c => (
                <div key={c.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded">#{c.issue_number}</span>
                    <span className="font-bold text-slate-200">{c.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-[11px]">{c.read_count || 0} reads</span>
                    <Link to={`/admin/comics/${c.id}/pages`} className="text-amber-400 hover:text-amber-300 font-bold no-underline">
                      Pages →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
