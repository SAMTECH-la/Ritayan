import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle, AlertCircle, Globe } from 'lucide-react';
import { getAdminSettings, updateAdminSettings, getAdminComics } from '../services/api';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    site_title: 'RITAYAN — युगों की गाथा',
    hero_title: 'RITAYAN: युगों की गाथा',
    hero_subtitle: 'Experience the grand epic of Indian mythology brought to life in interactive digital 3D graphic novels.',
    featured_issue_id: '1',
    about_text: 'RITAYAN is a landmark digital comic platform dedicated to rendering ancient Vedic and Puranic chronicles into breathtaking visual graphic novel format.',
    contact_email: 'contact@ritayan.com',
    instagram_url: 'https://instagram.com/ritayan_comics',
    twitter_url: 'https://twitter.com/ritayan_comics',
    youtube_url: 'https://youtube.com/@ritayan'
  });

  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getAdminSettings(), getAdminComics()])
      .then(([setRes, comRes]) => {
        if (setRes.settings) setSettings(prev => ({ ...prev, ...setRes.settings }));
        if (comRes.comics) setComics(comRes.comics);
      })
      .catch(err => setError('Failed to load settings from API'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await updateAdminSettings(settings);
      setSuccess('Website settings updated in MySQL! Public site updated immediately.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError('Failed to update website settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-500">Loading website settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-black font-serif text-white">
          WEBSITE CONFIGURATION
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Changes here update MySQL `website_settings` table. The public website receives updates via `GET /api/settings`.
        </p>
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
        
        <div className="space-y-4">
          <h3 className="text-sm font-bold font-serif text-amber-400 uppercase flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>Homepage Hero Banner Settings</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">Website Title</label>
            <input 
              type="text" 
              value={settings.site_title}
              onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">Hero Main Heading</label>
            <input 
              type="text" 
              value={settings.hero_title}
              onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-bold focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">Hero Subtitle</label>
            <textarea 
              rows="2"
              value={settings.hero_subtitle}
              onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">Featured Issue Spotlight</label>
            <select 
              value={settings.featured_issue_id}
              onChange={(e) => setSettings({ ...settings, featured_issue_id: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500"
            >
              {comics.map(c => (
                <option key={c.id} value={c.id}>
                  Issue #{c.issue_number} — {c.title} ({c.status})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-serif text-amber-400 uppercase">About & Contact Info</h3>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">About Text</label>
            <textarea 
              rows="3"
              value={settings.about_text}
              onChange={(e) => setSettings({ ...settings, about_text: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">Contact Email</label>
            <input 
              type="email" 
              value={settings.contact_email}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'SAVING SETTINGS...' : 'SAVE SETTINGS TO MYSQL'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};

export default SettingsPage;
