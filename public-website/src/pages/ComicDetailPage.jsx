import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Calendar, User, Layers, ArrowLeft, Play, ShieldCheck } from 'lucide-react';
import { getComicBySlug } from '../services/api';

const ComicDetailPage = () => {
  const { slug } = useParams();
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getComicBySlug(slug)
      .then(res => {
        if (res.comic) setComic(res.comic);
        else setError('Comic issue not found.');
      })
      .catch(err => {
        console.error('Failed to fetch comic details:', err);
        setError('Comic issue not found or unpublished.');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-slate-500">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        Loading comic details...
      </div>
    );
  }

  if (error || !comic) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold font-serif text-red-400">Issue Not Available</h2>
        <p className="text-slate-400 text-sm">{error || 'This comic issue is not published yet.'}</p>
        <Link to="/comics" className="inline-block px-6 py-2.5 rounded-xl bg-slate-800 text-amber-400 font-bold text-xs no-underline">
          Return to Library
        </Link>
      </div>
    );
  }

  const pages = comic.pages || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Back button */}
      <Link to="/comics" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 no-underline transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Comic Library</span>
      </Link>

      {/* Main Comic Detail Hero */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-10 items-center shadow-2xl">
        
        {/* Cover Preview */}
        <div className="md:col-span-4 flex justify-center">
          <div className="w-64 sm:w-72 h-[380px] sm:h-[430px] rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl relative group">
            <img 
              src={comic.cover_url || comic.cover_image} 
              alt={comic.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-red-600 text-white font-bold text-xs px-3 py-1 rounded-full uppercase">
              ISSUE #{comic.issue_number}
            </div>
          </div>
        </div>

        {/* Info & Meta */}
        <div className="md:col-span-8 space-y-6 text-left">
          <div className="space-y-2">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
              RITAYAN GRAPHIC NOVEL
            </span>
            <h1 className="text-4xl sm:text-6xl font-black font-serif text-white">
              {comic.title}
            </h1>
            {comic.subtitle && (
              <p className="text-2xl font-bold text-amber-400 devanagari">
                {comic.subtitle}
              </p>
            )}
          </div>

          <p className="text-slate-300 text-base leading-relaxed">
            {comic.description}
          </p>

          <div className="flex flex-wrap items-center gap-8 py-4 border-y border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Layers className="w-4 h-4 text-amber-400" />
              <span><strong>{pages.length}</strong> Illustrated Pages</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <User className="w-4 h-4 text-amber-400" />
              <span>By <strong>{comic.author}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Released <strong>{comic.release_date}</strong></span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link 
              to={`/read/${comic.slug}`}
              className="px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition no-underline flex items-center gap-2 shadow-xl"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>LAUNCH 3D PHYSICAL READER</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Pages Outline Grid */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold font-serif text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <span>Page Table of Contents</span>
        </h3>

        {pages.length === 0 ? (
          <p className="text-slate-500 text-xs">No pages uploaded for this issue.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {pages.map((p, idx) => (
              <Link 
                key={p.id || idx}
                to={`/read/${comic.slug}`}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3 hover:border-amber-500/50 transition group no-underline text-left block"
              >
                <div className="h-36 rounded-lg overflow-hidden bg-slate-950 mb-2">
                  <img 
                    src={p.image_url || p.image_path} 
                    alt={`Page ${idx + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="text-xs font-bold text-slate-200">Page {idx + 1}</div>
                <div className="text-[11px] text-slate-400 truncate">{p.page_title || `Scene ${idx + 1}`}</div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default ComicDetailPage;
