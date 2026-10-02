import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, BookOpen, Layers } from 'lucide-react';
import { getComics } from '../services/api';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getComics()
      .then(res => {
        if (res.comics) setComics(res.comics);
      })
      .catch(err => console.error('Failed to search comics:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ q: searchQuery });
  };

  const results = comics.filter(c => {
    if (!queryParam.trim()) return true;
    const q = queryParam.toLowerCase();
    return c.title.toLowerCase().includes(q) ||
           (c.subtitle && c.subtitle.toLowerCase().includes(q)) ||
           (c.description && c.description.toLowerCase().includes(q)) ||
           String(c.issue_number).includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header & Input */}
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h1 className="text-3xl sm:text-5xl font-black font-serif text-white">
          SEARCH ARCHIVES
        </h1>
        <p className="text-slate-400 text-sm">
          Search across titles, subtitles, issue numbers, and descriptions.
        </p>

        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Type search terms (e.g. Matsya, 001, Kurma)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-full pl-12 pr-28 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 shadow-xl"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results Header */}
      <div className="border-b border-slate-800 pb-4 text-xs font-semibold text-slate-400 flex items-center justify-between">
        <span>Showing {results.length} result(s) {queryParam ? `for "${queryParam}"` : ''}</span>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-500">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Searching RITAYAN archives...
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20 text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
          <p className="font-semibold text-base mb-1">No comics found for "{queryParam}"</p>
          <p className="text-xs text-slate-500">Try searching for keywords like "Matsya", "Kurma", or issue numbers.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map(comic => (
            <div 
              key={comic.id}
              className="group bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition duration-300 flex flex-col justify-between shadow-xl"
            >
              <div className="relative h-72 overflow-hidden bg-slate-950">
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
                  <h3 className="text-2xl font-bold font-serif text-white group-hover:text-amber-400 transition">
                    {comic.title}
                  </h3>
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
                  <Link 
                    to={`/read/${comic.slug}`}
                    className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs no-underline transition flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>READ NOW</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default SearchPage;
