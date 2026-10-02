import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, PlusCircle, Image as ImageIcon, 
  Users, BarChart3, Settings, Activity, LogOut, ShieldCheck, Globe, Sparkles
} from 'lucide-react';
import { logoutAdmin } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen flex flex-col justify-between p-4 z-30">
      <div className="space-y-6">
        
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 py-3 border-b border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-bold font-serif text-amber-400 block tracking-wide">
              RITAYAN ADMIN
            </span>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wider block">
              Control Center
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold no-underline transition ${
                isActive ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`
            }
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{t('dashboard')}</span>
          </NavLink>

          <NavLink 
            to="/admin/comics" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold no-underline transition ${
                isActive ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`
            }
          >
            <BookOpen className="w-4 h-4" />
            <span>{t('comics')}</span>
          </NavLink>

          <NavLink 
            to="/admin/characters" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold no-underline transition ${
                isActive ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`
            }
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('characters')}</span>
          </NavLink>

          <NavLink 
            to="/admin/comics/create" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold no-underline transition ${
                isActive ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`
            }
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('createComic')}</span>
          </NavLink>

          <NavLink 
            to="/admin/media" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold no-underline transition ${
                isActive ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`
            }
          >
            <ImageIcon className="w-4 h-4" />
            <span>{t('media')}</span>
          </NavLink>

          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold no-underline transition ${
                isActive ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`
            }
          >
            <Users className="w-4 h-4" />
            <span>{t('users')}</span>
          </NavLink>

          <NavLink 
            to="/admin/analytics" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold no-underline transition ${
                isActive ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`
            }
          >
            <BarChart3 className="w-4 h-4" />
            <span>{t('analytics')}</span>
          </NavLink>

          <NavLink 
            to="/admin/settings" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold no-underline transition ${
                isActive ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`
            }
          >
            <Settings className="w-4 h-4" />
            <span>{t('settings')}</span>
          </NavLink>

          <NavLink 
            to="/admin/activity" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold no-underline transition ${
                isActive ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`
            }
          >
            <Activity className="w-4 h-4" />
            <span>{t('activity')}</span>
          </NavLink>
        </nav>
      </div>

      {/* Footer / Public Link & Logout */}
      <div className="space-y-2 pt-4 border-t border-slate-800">
        <a 
          href="http://localhost:5173" 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-amber-400 hover:bg-slate-800 no-underline transition"
        >
          <span className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>{t('publicWebsite')}</span>
          </span>
          <span className="text-[10px] text-amber-500 font-bold">↗</span>
        </a>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('signOut')}</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
