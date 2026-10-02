import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, Search, Menu, X, Sparkles, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Navbar = ({ siteTitle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        window.location.href = '/admin';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-slate-950/90 border-b border-amber-500/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo with Secret Double-Click Redirect to Admin */}
          <div 
            onDoubleClick={() => { window.location.href = '/admin'; }}
            className="flex items-center gap-3 group cursor-pointer"
            title="Double-click for Admin Portal"
          >
            <Link to="/" className="flex items-center gap-3 no-underline">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-amber-400 group-hover:rotate-12 transition-transform" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold font-serif tracking-wider gold-text-gradient block">
                  RITAYAN
                </span>
                <span className="text-[10px] tracking-[0.2em] font-semibold text-slate-400 devanagari block">
                  {t('tagline')}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `no-underline transition ${isActive ? 'text-amber-400 border-b-2 border-amber-400 pb-1' : 'text-slate-300 hover:text-amber-300'}`
              }
            >
              {t('home')}
            </NavLink>

            <NavLink 
              to="/comics" 
              className={({ isActive }) => 
                `no-underline transition ${isActive ? 'text-amber-400 border-b-2 border-amber-400 pb-1' : 'text-slate-300 hover:text-amber-300'}`
              }
            >
              {t('library')}
            </NavLink>

            <NavLink 
              to="/characters" 
              className={({ isActive }) => 
                `no-underline transition flex items-center gap-1.5 ${isActive ? 'text-amber-400 border-b-2 border-amber-400 pb-1' : 'text-slate-300 hover:text-amber-300'}`
              }
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{t('avatars')}</span>
            </NavLink>

            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                `no-underline transition ${isActive ? 'text-amber-400 border-b-2 border-amber-400 pb-1' : 'text-slate-300 hover:text-amber-300'}`
              }
            >
              {t('about')}
            </NavLink>

            <NavLink 
              to="/contact" 
              className={({ isActive }) => 
                `no-underline transition ${isActive ? 'text-amber-400 border-b-2 border-amber-400 pb-1' : 'text-slate-300 hover:text-amber-300'}`
              }
            >
              {t('contact')}
            </NavLink>
          </div>

          {/* Search Bar & Language Selector */}
          <div className="hidden md:flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-full pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 w-44 focus:w-56 transition-all"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>

            {/* Language Selector Dropdown */}
            <div className="relative flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-full px-3 py-1.5 shadow-sm">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-amber-400 font-bold text-xs focus:outline-none cursor-pointer pr-1"
              >
                <option value="HI" className="bg-slate-900 text-slate-200">HI (हिन्दी)</option>
                <option value="EN" className="bg-slate-900 text-slate-200">EN (English)</option>
                <option value="MR" className="bg-slate-900 text-slate-200">MR (मराठी)</option>
              </select>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-300 hover:text-amber-400 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-400">LANGUAGE / भाषा</span>
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-full px-3 py-1">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-amber-400 font-bold text-xs focus:outline-none"
              >
                <option value="HI" className="bg-slate-900 text-slate-200">HI (हिन्दी)</option>
                <option value="EN" className="bg-slate-900 text-slate-200">EN (English)</option>
                <option value="MR" className="bg-slate-900 text-slate-200">MR (मराठी)</option>
              </select>
            </div>
          </div>

          <form onSubmit={handleSearch} className="relative mb-3">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <Link 
            to="/" 
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-semibold text-slate-200 hover:bg-slate-900 hover:text-amber-400 no-underline"
          >
            {t('home')}
          </Link>
          <Link 
            to="/comics" 
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-semibold text-slate-200 hover:bg-slate-900 hover:text-amber-400 no-underline"
          >
            {t('library')}
          </Link>
          <Link 
            to="/characters" 
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-semibold text-amber-400 hover:bg-slate-900 no-underline flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{t('avatars')}</span>
          </Link>
          <Link 
            to="/about" 
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-semibold text-slate-200 hover:bg-slate-900 hover:text-amber-400 no-underline"
          >
            {t('about')}
          </Link>
          <Link 
            to="/contact" 
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-semibold text-slate-200 hover:bg-slate-900 hover:text-amber-400 no-underline"
          >
            {t('contact')}
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
