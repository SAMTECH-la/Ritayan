import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, Maximize2, Minimize2, 
  BookOpen, Grid, Volume2, VolumeX, Eye, ArrowLeft, Sparkles, Globe 
} from 'lucide-react';
import { saveReadingProgress } from '../services/api';

const ComicReader = ({ comic, isPreview = false, initialPage = 1, currentLang = 'HI', onLanguageChange, onBack }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState('next'); // 'next' or 'prev'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const containerRef = useRef(null);

  // Prepend Cover Page as Page 1 of the physical comic book
  const coverUrl = comic?.cover_url || comic?.cover_image;
  const rawPages = comic?.pages || [];

  const pages = useMemo(() => {
    if (!coverUrl) return rawPages;
    const coverObj = {
      id: 'cover_page',
      page_number: 1,
      image_path: coverUrl,
      image_url: coverUrl,
      page_title: 'Front Cover'
    };
    const interior = rawPages.map((p, idx) => ({
      ...p,
      page_number: idx + 2
    }));
    return [coverObj, ...interior];
  }, [coverUrl, rawPages]);

  const totalPages = pages.length;

  // Session token for reading progress
  const getSessionToken = () => {
    let token = localStorage.getItem('ritayan_session_token');
    if (!token) {
      token = 'guest_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('ritayan_session_token', token);
    }
    return token;
  };

  useEffect(() => {
    if (comic?.id && currentPage > 0 && !isPreview) {
      saveReadingProgress(comic.id, currentPage, getSessionToken()).catch(err => {
        console.warn('Failed to auto-save progress:', err);
      });
    }
  }, [currentPage, comic?.id, isPreview]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrevPage();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, isFlipping, isFullscreen]);

  // SYNTHESIZE REALISTIC PAPER FLIP / SWOOSH SOUND VIA WEB AUDIO API
  const playFlipSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // 1. Paper texture rustle noise
      const bufferSize = Math.floor(ctx.sampleRate * 0.22); // 220ms page swoosh
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const t = i / bufferSize;
        // Modulated paper friction noise with bell-curve envelope
        const envelope = Math.sin(t * Math.PI) * Math.pow(1 - t, 0.8);
        data[i] = (Math.random() * 2 - 1) * envelope;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter for paper paper crispness (3.5kHz down to 900Hz)
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3600, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.22);
      filter.Q.value = 1.4;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      // 2. Low-frequency paper page swoosh sweep
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.22);

      oscGain.gain.setValueAtTime(0.15, ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      noise.start(ctx.currentTime);
      osc.start(ctx.currentTime);
      noise.stop(ctx.currentTime + 0.22);
      osc.stop(ctx.currentTime + 0.22);
    } catch (e) {
      // Audio fallback
    }
  };

  const handleNextPage = () => {
    if (currentPage >= totalPages || isFlipping) return;
    setFlipDirection('next');
    setIsFlipping(true);
    playFlipSound();

    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setIsFlipping(false);
    }, 520);
  };

  const handlePrevPage = () => {
    if (currentPage <= 1 || isFlipping) return;
    setFlipDirection('prev');
    setIsFlipping(true);
    playFlipSound();

    setTimeout(() => {
      setCurrentPage(prev => prev - 1);
      setIsFlipping(false);
    }, 520);
  };

  const handleJumpToPage = (pageNum) => {
    if (pageNum === currentPage || isFlipping) return;
    setFlipDirection(pageNum > currentPage ? 'next' : 'prev');
    setIsFlipping(true);
    playFlipSound();

    setTimeout(() => {
      setCurrentPage(pageNum);
      setIsFlipping(false);
    }, 420);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const currentImg = pages[currentPage - 1]?.image_url || pages[currentPage - 1]?.image_path;
  const nextImg = pages[currentPage]?.image_url || pages[currentPage]?.image_path;
  const prevImg = pages[currentPage - 2]?.image_url || pages[currentPage - 2]?.image_path;

  const isCoverActive = currentPage === 1 && coverUrl;

  return (
    <div 
      ref={containerRef}
      className={`relative min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden select-none ${
        isFullscreen ? 'fixed inset-0 z-50 p-2' : ''
      }`}
    >
      {/* 1. ADMIN PREVIEW BANNER */}
      {isPreview && (
        <div className="bg-amber-600/90 text-amber-95 px-4 py-2 text-center text-xs font-bold tracking-widest uppercase shadow-md backdrop-blur border-b border-amber-400 flex items-center justify-center gap-2 z-30">
          <Eye className="w-4 h-4 animate-pulse" />
          <span>PREVIEW MODE — NOT PUBLIC</span>
        </div>
      )}

      {/* 2. READER HEADER */}
      <header className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between z-20 backdrop-blur">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
          <div>
            <h1 className="text-sm font-bold font-serif tracking-wide text-amber-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>RITAYAN — ISSUE #{comic?.issue_number}</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              {comic?.title} {comic?.subtitle ? `• ${comic?.subtitle}` : ''}
              <span className="ml-2 font-bold text-amber-400">
                {isCoverActive ? '(FRONT COVER)' : `(Page ${currentPage - 1} of ${totalPages - 1})`}
              </span>
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 text-xs">
          {/* Comic Language Selector Dropdown */}
          {onLanguageChange && (
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/40 rounded-lg px-2.5 py-1.5 shadow-sm">
              <Globe className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-bold text-slate-300 hidden md:inline">COMIC LANGUAGE:</span>
              <select
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="bg-transparent text-amber-400 font-black text-xs focus:outline-none cursor-pointer"
              >
                <option value="HI" className="bg-slate-900 text-slate-200">🇮🇳 HI (हिन्दी)</option>
                <option value="EN" className="bg-slate-900 text-slate-200">🇬🇧 EN (English)</option>
                <option value="MR" className="bg-slate-900 text-slate-200">🚩 MR (मराठी)</option>
              </select>
            </div>
          )}

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg transition flex items-center gap-1.5 ${
              soundEnabled ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-500'
            }`}
            title={soundEnabled ? "Mute Page Turning Sound" : "Enable Page Turning Sound"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            <span className="hidden sm:inline font-bold">{soundEnabled ? 'Sound ON' : 'Sound OFF'}</span>
          </button>

          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`p-2 rounded-lg transition flex items-center gap-1.5 ${
              showThumbnails ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Toggle Page Grid"
          >
            <Grid className="w-4 h-4" />
            <span className="hidden sm:inline">Pages</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 3. PHYSICAL 3D BOOK DISPLAY CONTAINER */}
      <main className="flex-1 relative flex items-center justify-center p-4 sm:p-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-blue-600/5 pointer-events-none"></div>

        {totalPages === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-600 animate-bounce" />
            <p className="font-semibold text-lg">No comic pages available</p>
            <p className="text-xs text-slate-500">Upload pages from the admin panel to start reading.</p>
          </div>
        ) : (
          /* ULTRA SMOOTH 3D BOOK STAGE WITH PERSPECTIVE */
          <div 
            className="relative transition-all duration-500 flex items-center justify-center"
            style={{ perspective: '2400px' }}
          >
            {/* Soft Ambient Book Shadow */}
            <div className="absolute -bottom-8 w-[92%] h-10 bg-black/70 rounded-full blur-2xl pointer-events-none"></div>

            {/* 3D Physical Comic Canvas */}
            <div 
              className={`relative w-[340px] sm:w-[480px] md:w-[560px] h-[480px] sm:h-[680px] md:h-[780px] bg-slate-900 rounded-lg shadow-2xl border transition-all duration-500 overflow-hidden ${
                isCoverActive ? 'border-amber-400/60 ring-4 ring-amber-500/20' : 'border-amber-500/20'
              }`}
              style={{
                transformStyle: 'preserve-3d',
                boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(245, 158, 11, 0.15)'
              }}
            >
              {/* Spine Effect Lines */}
              <div className="absolute top-0 bottom-0 left-0 w-7 bg-gradient-to-r from-black/85 via-black/40 to-transparent z-30 pointer-events-none"></div>
              <div className="absolute top-0 bottom-0 right-0 w-3 bg-gradient-to-l from-black/50 to-transparent z-30 pointer-events-none"></div>

              {/* Cover Badge Overlay */}
              {isCoverActive && (
                <div className="absolute top-4 right-4 z-30 bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                  FRONT COVER
                </div>
              )}

              {/* CURRENT ACTIVE PAGE */}
              <div className="absolute inset-0 z-10 bg-slate-900">
                {currentImg ? (
                  <img 
                    src={currentImg} 
                    alt={`Page ${currentPage}`} 
                    className="w-full h-full object-contain bg-slate-950"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
                    Page {currentPage} Image
                  </div>
                )}
                {/* Paper Surface Highlight overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/5 pointer-events-none"></div>
              </div>

              {/* ULTRA SMOOTH 3D ANIMATED FLIPPING PAGE OVERLAY */}
              {isFlipping && (
                <div 
                  className={`absolute inset-0 z-20 overflow-hidden ${
                    flipDirection === 'next' ? 'animate-smooth-flip-next' : 'animate-smooth-flip-prev'
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transformOrigin: flipDirection === 'next' ? 'left center' : 'right center',
                  }}
                >
                  {/* Front Side of turning page */}
                  <div 
                    className="absolute inset-0 bg-slate-900 border-r border-amber-500/30 overflow-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <img 
                      src={flipDirection === 'next' ? currentImg : prevImg} 
                      alt="Turning page front" 
                      className="w-full h-full object-contain bg-slate-950"
                    />
                    {/* Dynamic Moving Shadow */}
                    <div className="absolute inset-0 animate-shadow-fade-front pointer-events-none"></div>
                  </div>

                  {/* Back Side of turning page */}
                  <div 
                    className="absolute inset-0 bg-slate-900 border-l border-amber-500/30 overflow-hidden"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    <img 
                      src={flipDirection === 'next' ? nextImg : currentImg} 
                      alt="Turning page back" 
                      className="w-full h-full object-contain bg-slate-950 opacity-95"
                    />
                    {/* Dynamic Back Paper Shadow */}
                    <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/20 to-transparent pointer-events-none"></div>
                  </div>
                </div>
              )}
            </div>

            {/* PREVIOUS PAGE BUTTON (LEFT) */}
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1 || isFlipping}
              className={`absolute -left-4 sm:-left-14 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-slate-900/90 border border-slate-700 text-amber-400 shadow-2xl hover:bg-amber-500 hover:text-slate-950 transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed z-40 group ${
                currentPage <= 1 ? 'opacity-0 pointer-events-none' : ''
              }`}
              title="Previous Page (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </button>

            {/* NEXT PAGE BUTTON (RIGHT) */}
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages || isFlipping}
              className={`absolute -right-4 sm:-right-14 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-slate-900/90 border border-slate-700 text-amber-400 shadow-2xl hover:bg-amber-500 hover:text-slate-950 transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed z-40 group ${
                currentPage >= totalPages ? 'opacity-0 pointer-events-none' : ''
              }`}
              title="Next Page (Right Arrow or Spacebar)"
            >
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* THUMBNAIL DRAWER OVERLAY */}
        {showThumbnails && (
          <div className="absolute bottom-20 inset-x-4 max-w-4xl mx-auto bg-slate-900/95 border border-slate-800 rounded-xl p-4 shadow-2xl backdrop-blur z-40">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <Grid className="w-4 h-4" />
                Select Page (Front Cover + {totalPages - 1} Interior Pages)
              </span>
              <button 
                onClick={() => setShowThumbnails(false)}
                className="text-slate-400 hover:text-white"
              >
                Close ✕
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-500">
              {pages.map((p, idx) => {
                const num = idx + 1;
                const imgUrl = p.image_url || p.image_path;
                const isCover = num === 1 && coverUrl;

                return (
                  <button
                    key={p.id || idx}
                    onClick={() => {
                      handleJumpToPage(num);
                      setShowThumbnails(false);
                    }}
                    className={`flex-shrink-0 relative w-20 h-28 rounded-lg overflow-hidden border-2 transition ${
                      currentPage === num 
                        ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105' 
                        : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={isCover ? "Front Cover" : `Page ${num - 1}`} className="w-full h-full object-cover" />
                    <span className={`absolute bottom-0 inset-x-0 text-[10px] font-bold text-center py-0.5 ${
                      isCover ? 'bg-amber-500 text-slate-950 font-black' : 'bg-black/80 text-slate-200'
                    }`}>
                      {isCover ? 'COVER' : `Page ${num - 1}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* 4. READER FOOTER CONTROLS & SLIDER */}
      <footer className="bg-slate-900/90 border-t border-slate-800 px-4 py-3 z-20 backdrop-blur">
        <div className="max-w-xl mx-auto flex items-center gap-4">
          <span className="text-xs font-bold text-slate-400 min-w-[95px] text-right">
            {currentPage === 1 && coverUrl ? 'Front Cover' : `Page ${currentPage - 1} / ${totalPages - 1}`}
          </span>

          <input 
            type="range"
            min="1"
            max={totalPages || 1}
            value={currentPage}
            onChange={(e) => handleJumpToPage(parseInt(e.target.value))}
            className="flex-1 accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1 || isFlipping}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-slate-200 text-xs font-medium"
            >
              Prev
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages || isFlipping}
              className="p-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold disabled:opacity-30 rounded text-xs"
            >
              Next
            </button>
          </div>
        </div>
      </footer>

      {/* 5. ULTRA SMOOTH 3D PAGE FLIP KEYFRAME ANIMATIONS */}
      <style>{`
        .animate-smooth-flip-next {
          animation: smoothFlipNext 0.52s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
        }

        .animate-smooth-flip-prev {
          animation: smoothFlipPrev 0.52s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
        }

        @keyframes smoothFlipNext {
          0% {
            transform: rotateY(0deg) rotateZ(0deg);
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
          }
          35% {
            transform: rotateY(-65deg) rotateZ(-0.8deg) scale(0.99);
            box-shadow: -20px 10px 30px rgba(0,0,0,0.7);
          }
          70% {
            transform: rotateY(-130deg) rotateZ(-0.4deg) scale(0.995);
            box-shadow: -15px 5px 20px rgba(0,0,0,0.5);
          }
          100% {
            transform: rotateY(-180deg) rotateZ(0deg);
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
          }
        }

        @keyframes smoothFlipPrev {
          0% {
            transform: rotateY(-180deg) rotateZ(0deg);
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
          }
          35% {
            transform: rotateY(-115deg) rotateZ(0.8deg) scale(0.99);
            box-shadow: 20px 10px 30px rgba(0,0,0,0.7);
          }
          70% {
            transform: rotateY(-50deg) rotateZ(0.4deg) scale(0.995);
            box-shadow: 15px 5px 20px rgba(0,0,0,0.5);
          }
          100% {
            transform: rotateY(0deg) rotateZ(0deg);
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
          }
        }

        .animate-shadow-fade-front {
          animation: shadowFade 0.52s ease-in-out forwards;
        }

        @keyframes shadowFade {
          0% { background: rgba(0, 0, 0, 0); }
          50% { background: rgba(0, 0, 0, 0.45); }
          100% { background: rgba(0, 0, 0, 0); }
        }
      `}</style>
    </div>
  );
};

export default ComicReader;
