import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Sparkles, ArrowRight, Play, Eye, Flame, Layers, Star, Zap } from 'lucide-react';
import { getComics } from '../services/api';

const HomePage = ({ settings }) => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getComics()
      .then(res => {
        if (res.comics) {
          setComics(res.comics);
        }
      })
      .catch(err => console.error('Failed to load homepage comics:', err))
      .finally(() => setLoading(false));
  }, []);

  const featuredComic = comics.find(c => String(c.id) === String(settings?.featured_issue_id)) || comics[0];

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO BANNER SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-10 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        
        {/* Animated Background Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-8 uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>PREMIUM DIGITAL GRAPHIC NOVELS</span>
          </div>

          {/* Hero Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-serif tracking-tight text-white mb-6 leading-tight">
            {settings?.hero_title || 'RITAYAN: युगों की गाथा'}
          </h1>

          {/* Hero Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-300 font-medium mb-10 leading-relaxed">
            {settings?.hero_subtitle || 'Step into the primordial age of gods, avatars, and cosmic lore with our interactive 3D digital comic reader.'}
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {featuredComic && (
              <Link 
                to={`/read/${featuredComic.slug}`}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl hover:shadow-amber-500/25 transition-all no-underline flex items-center justify-center gap-2 group"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>READ ISSUE #{featuredComic.issue_number} NOW</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}

            <Link 
              to="/comics"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500/50 text-slate-200 hover:text-white font-bold text-sm transition no-underline flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>EXPLORE ALL ISSUES</span>
            </Link>
          </div>

          {/* Live Platform Stats Ticker */}
          <div className="mt-16 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl backdrop-blur">
              <span className="text-2xl font-bold text-amber-400 font-serif block">{comics.length}</span>
              <span className="text-xs text-slate-400 uppercase font-semibold">Published Graphic Novels</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl backdrop-blur">
              <span className="text-2xl font-bold text-amber-400 font-serif block">
                {comics.reduce((acc, c) => acc + (parseInt(c.total_pages) || 0), 0)}
              </span>
              <span className="text-xs text-slate-400 uppercase font-semibold">Illustrated Panels</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl backdrop-blur">
              <span className="text-2xl font-bold text-amber-400 font-serif block">3D</span>
              <span className="text-xs text-slate-400 uppercase font-semibold">Realistic Page Flip</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl backdrop-blur">
              <span className="text-2xl font-bold text-emerald-400 font-serif block flex items-center gap-1">
                <Zap className="w-5 h-5 text-emerald-400" /> Instant
              </span>
              <span className="text-xs text-slate-400 uppercase font-semibold">HD Web Reader</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED ISSUE SPOTLIGHT */}
      {featuredComic && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-slate-900/90 border border-amber-500/30 overflow-hidden shadow-2xl p-6 sm:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-64 sm:w-80 h-[380px] sm:h-[460px] rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/40 group">
                <img 
                  src={featuredComic.cover_url || featuredComic.cover_image} 
                  alt={featuredComic.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  FEATURED ISSUE #{featuredComic.issue_number}
                </div>
              </div>
            </div>

            <div className="md:col-span-7 space-y-6 text-left">
              <div className="space-y-2">
                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Flame className="w-4 h-4" /> FEATURED GRAPHIC NOVEL
                </span>
                <h2 className="text-3xl sm:text-5xl font-black font-serif text-white">
                  {featuredComic.title}
                </h2>
                {featuredComic.subtitle && (
                  <p className="text-xl sm:text-2xl font-semibold text-amber-400 devanagari">
                    {featuredComic.subtitle}
                  </p>
                )}
              </div>

              <p className="text-slate-300 text-base leading-relaxed">
                {featuredComic.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-slate-400">
                <div>
                  <span className="text-slate-500 block">TOTAL PAGES</span>
                  <span className="text-slate-200 font-bold text-sm">{featuredComic.total_pages || 0} Pages</span>
                </div>
                <div>
                  <span className="text-slate-500 block">CREATOR</span>
                  <span className="text-slate-200 font-bold text-sm">{featuredComic.author}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">FORMAT</span>
                  <span className="text-emerald-400 font-bold text-sm uppercase">Interactive 3D</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link 
                  to={`/read/${featuredComic.slug}`}
                  className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition no-underline flex items-center gap-2 shadow-lg"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>START READING IN 3D</span>
                </Link>

                <Link 
                  to={`/comics/${featuredComic.slug}`}
                  className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition no-underline"
                >
                  View Details & Outline
                </Link>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 3. PUBLISHED COMICS CATALOG GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h2 className="text-2xl sm:text-4xl font-black font-serif text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-amber-500" />
              <span>GRAPHIC NOVEL CATALOG</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Explore officially published RITAYAN digital comic issues.
            </p>
          </div>
          <Link 
            to="/comics"
            className="text-amber-400 hover:text-amber-300 font-bold text-xs uppercase tracking-wider no-underline flex items-center gap-1"
          >
            <span>View All ({comics.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-500">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            Loading graphic novels...
          </div>
        ) : comics.length === 0 ? (
          <div className="text-center py-16 text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
            <p className="font-semibold text-base mb-1">No comics available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {comics.map(comic => (
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
                    <p className="text-slate-400 text-xs mt-3 line-clamp-2 leading-relaxed">
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
                      <span>READ</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default HomePage;
