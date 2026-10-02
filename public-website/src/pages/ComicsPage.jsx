import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Layers } from 'lucide-react';
import { getComics } from '../services/api';

const ComicsPage = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getComics()
      .then(res => {
        if (res.comics) setComics(res.comics);
      })
      .catch(err => console.error('Error fetching comics library:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredComics = comics.filter(c => {
    const q = search.toLowerCase();
    return c.title.toLowerCase().includes(q) || 
           (c.subtitle && c.subtitle.toLowerCase().includes(q)) || 
           (c.description && c.description.toLowerCase().includes(q)) ||
           String(c.issue_number).includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
        <div>
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-2">
            GRAPHIC NOVEL ARCHIVES
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-serif text-white">
            COMIC LIBRARY
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-xl">
            Browse all officially published RITAYAN digital graphic novel issues.
          </p>
        </div>

        {/* Filter / Search Bar */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Filter by title or issue #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Comics Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-500">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Loading comic archives...
        </div>
      ) : filteredComics.length === 0 ? (
        <div className="text-center py-20 text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
          <p className="font-semibold text-lg mb-1">No comics matched your search</p>
          <p className="text-xs text-slate-500">Try adjusting your filter terms or query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredComics.map(comic => (
            <div 
              key={comic.id}
              className="group bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition duration-300 flex flex-col justify-between shadow-xl"
            >
              <div className="relative h-80 overflow-hidden bg-slate-950">
                <img 
                  src={comic.cover_url || comic.cover_image} 
                  alt={comic.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur border border-amber-500/40 text-amber-400 font-bold text-xs px-3 py-1 rounded-full shadow">
                  ISSUE #{comic.issue_number}
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-serif text-white group-hover:text-amber-400 transition">
                    {comic.title}
                  </h2>
                  {comic.subtitle && (
                    <p className="text-sm font-semibold text-amber-400 devanagari mt-0.5">
                      {comic.subtitle}
                    </p>
                  )}
                  <p className="text-slate-400 text-xs mt-3 line-clamp-3 leading-relaxed">
                    {comic.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>{comic.total_pages || 0} Pages</span>
                  <div className="flex gap-2">
                    <Link 
                      to={`/comics/${comic.slug}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs no-underline transition"
                    >
                      Details
                    </Link>
                    <Link 
                      to={`/read/${comic.slug}`}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs no-underline transition flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Read</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComicsPage;
