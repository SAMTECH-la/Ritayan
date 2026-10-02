import React from 'react';
import { User, Bell, Database, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const AdminNavbar = () => {
  const adminUser = JSON.parse(localStorage.getItem('ritayan_admin_user') || '{}');
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between z-20">
      <div className="flex items-center gap-3">
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-amber-400" />
          <span>{t('connected')}</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Selector Dropdown */}
        <div className="flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
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

        <div className="flex items-center gap-3 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
          <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
            {adminUser.username ? adminUser.username[0].toUpperCase() : 'A'}
          </div>
          <div className="text-left leading-tight pr-2">
            <span className="text-xs font-bold text-slate-200 block">{adminUser.username || 'Admin'}</span>
            <span className="text-[10px] text-amber-400 font-medium block">{adminUser.role || 'Super Admin'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
