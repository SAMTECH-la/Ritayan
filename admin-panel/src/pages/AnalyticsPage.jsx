import React, { useState, useEffect } from 'react';
import { BarChart3, Eye, BookOpen, Users, Layers } from 'lucide-react';
import { getAnalytics } from '../services/api';

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics()
      .then(res => setData(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats || {};

  return (
    <div className="space-y-8">
      
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-black font-serif text-white">
          READERSHIP & ANALYTICS
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Detailed metrics calculated directly from MySQL `reading_progress` & `reading_history`.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading analytics...</div>
      ) : (
        <div className="space-y-8">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <span className="text-slate-400 text-xs uppercase font-bold block mb-1">Total Reading Sessions</span>
              <span className="text-4xl font-black font-serif text-amber-400">{stats.total_reads || 0}</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <span className="text-slate-400 text-xs uppercase font-bold block mb-1">Registered Readers</span>
              <span className="text-4xl font-black font-serif text-emerald-400">{stats.total_users || 0}</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <span className="text-slate-400 text-xs uppercase font-bold block mb-1">Published Graphic Novels</span>
              <span className="text-4xl font-black font-serif text-blue-400">{stats.published_comics || 0}</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <span className="text-slate-400 text-xs uppercase font-bold block mb-1">Total Pages Rendered</span>
              <span className="text-4xl font-black font-serif text-purple-400">{stats.total_pages || 0}</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold font-serif text-white">Popular Issues Ranking</h3>
            <div className="space-y-3">
              {(data?.top_comics || []).map((c, i) => (
                <div key={c.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-amber-400 font-bold font-serif text-lg">#{i + 1}</span>
                    <div>
                      <span className="font-bold text-white text-sm block">Issue #{c.issue_number} — {c.title}</span>
                      <span className="text-[11px] text-slate-500">Slug: {c.slug}</span>
                    </div>
                  </div>
                  <span className="text-emerald-400 font-bold text-xs bg-emerald-500/10 px-3 py-1 rounded-full">
                    {c.read_count || 0} Reads
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default AnalyticsPage;
