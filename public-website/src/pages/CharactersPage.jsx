import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Shield, Search, Flame, BookOpen, Sword, Compass } from 'lucide-react';
import { getCharacters } from '../services/api';
import CharacterModal from '../components/CharacterModal';
import { useLanguage } from '../context/LanguageContext';

const BACKEND_URL = 'http://127.0.0.1:8000';

const CharactersPage = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [search, setSearch] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    getCharacters()
      .then(res => {
        if (res.characters) setCharacters(res.characters);
      })
      .catch(err => console.error('Failed to load character codex:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = characters.filter(ch => {
    const q = search.toLowerCase();
    const matchesSearch = ch.name.toLowerCase().includes(q) || 
                          (ch.title && ch.title.toLowerCase().includes(q)) || 
                          (ch.description && ch.description.toLowerCase().includes(q));
    
    if (filterType === 'DASHAVATARA') {
      return matchesSearch && ch.avatar_type.includes('Dashavatara');
    }
    if (filterType === 'OTHERS') {
      return matchesSearch && !ch.avatar_type.includes('Dashavatara');
    }
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* 1. HERO HEADER */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-4 h-4" />
          <span>{t('codexTag')}</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black font-serif text-white">
          {t('codexTitle')}
        </h1>
        
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          {t('codexDesc')}
        </p>
      </div>

      {/* 2. FILTER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl backdrop-blur">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 ${
              filterType === 'ALL' 
                ? 'bg-amber-500 text-slate-950 shadow-md' 
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {t('filterAll')} ({characters.length})
          </button>
          <button
            onClick={() => setFilterType('DASHAVATARA')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 ${
              filterType === 'DASHAVATARA' 
                ? 'bg-amber-500 text-slate-950 shadow-md' 
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {t('filterDashavatara')}
          </button>
          <button
            onClick={() => setFilterType('OTHERS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 ${
              filterType === 'OTHERS' 
                ? 'bg-amber-500 text-slate-950 shadow-md' 
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {t('filterOthers')}
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

      </div>

      {/* 3. CHARACTERS GRID */}
      {loading ? (
        <div className="text-center py-20 text-slate-500">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Summoning character codex...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
          <p className="font-semibold text-base mb-1">No characters matched your query</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(ch => {
            const imageUrl = ch.avatar_url || (ch.avatar_image ? (ch.avatar_image.startsWith('http') ? ch.avatar_image : `${BACKEND_URL}/uploads/${ch.avatar_image}`) : null);
            return (
              <div
                key={ch.id}
                onClick={() => setSelectedCharacter(ch)}
                className="group cursor-pointer relative bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden hover:border-amber-500/60 transition-all duration-500 hover:-translate-y-2 shadow-2xl flex flex-col justify-between"
                style={{
                  boxShadow: `0 10px 30px -10px ${ch.theme_color || '#F59E0B'}20`
                }}
              >
                {/* Dynamic Artwork Header */}
                <div className="h-64 relative overflow-hidden bg-slate-950">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={ch.name} 
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-serif font-black text-4xl text-amber-500/40" style={{ background: ch.bg_gradient }}>
                      {ch.name[0]}
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

                  {/* Top Badges */}
                  <div className="flex items-center justify-between relative z-10 p-5">
                    <span className="px-3 py-1 rounded-full bg-slate-950/90 border border-amber-400/40 text-amber-400 font-bold text-[10px] uppercase shadow-lg backdrop-blur">
                      {ch.avatar_type}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 bg-black/60 px-2.5 py-1 rounded-full border border-slate-800 backdrop-blur">
                      {ch.yuga}
                    </span>
                  </div>

                  {/* Character Name Banner */}
                  <div className="absolute bottom-4 left-5 right-5 z-10">
                    <h3 className="text-2xl font-black font-serif text-white group-hover:text-amber-400 transition drop-shadow-md">
                      {ch.name}
                    </h3>
                    <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      {ch.title}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between bg-slate-900">
                  <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                    {ch.description}
                  </p>

                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-semibold">DIVINE SYMBOL</span>
                      <span className="text-amber-400 font-bold text-[11px] truncate max-w-[160px]">{ch.weapon_symbol}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-slate-400">POWER LEVEL</span>
                        <span className="text-amber-400">{ch.power_level} / 100</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${ch.power_level}%`, backgroundColor: ch.theme_color }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Invoke Hint */}
                  <div className="pt-2 text-center">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:text-white transition">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
                      <span>INVOKE ARTWORK & ANIMATION</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. MIND-BLOWING CHARACTER MODAL */}
      {selectedCharacter && (
        <CharacterModal 
          character={selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
        />
      )}

    </div>
  );
};

export default CharactersPage;
