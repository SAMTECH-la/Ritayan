import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileEdit, Upload, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { getAdminComics, updateComic, uploadCover } from '../services/api';

const ComicEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    issue_number: 1,
    title: '',
    subtitle: '',
    description: '',
    author: 'Ritayan Studio',
    status: 'draft',
    release_date: ''
  });

  const [coverFile, setCoverFile] = useState(null);
  const [coverUrl, setCoverUrl] = useState('');

  useEffect(() => {
    getAdminComics()
      .then(res => {
        if (res.comics) {
          const target = res.comics.find(c => String(c.id) === String(id));
          if (target) {
            setFormData({
              issue_number: target.issue_number,
              title: target.title,
              subtitle: target.subtitle || '',
              description: target.description || '',
              author: target.author || 'Ritayan Studio',
              status: target.status || 'draft',
              release_date: target.release_date || ''
            });
            setCoverUrl(target.cover_url || target.cover_image);
          }
        }
      })
      .catch(err => setError('Failed to fetch comic details'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await updateComic(id, formData);

      if (coverFile) {
        const coverRes = await uploadCover(id, coverFile);
        if (coverRes.cover_url) setCoverUrl(coverRes.cover_url);
      }

      setSuccess('Comic updated successfully in MySQL!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update comic');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        Loading comic data...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <button 
            onClick={() => navigate('/admin/comics')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 font-semibold mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Comics</span>
          </button>
          <h1 className="text-3xl font-black font-serif text-white">
            EDIT COMIC — ISSUE #{formData.issue_number}
          </h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Issue Number *</label>
            <input 
              type="number" 
              required
              value={formData.issue_number}
              onChange={(e) => setFormData({...formData, issue_number: parseInt(e.target.value) || 1})}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Status *</label>
            <select 
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500"
            >
              <option value="draft">DRAFT (Hidden from Public)</option>
              <option value="published">PUBLISHED (Visible on Public Site)</option>
              <option value="unpublished">UNPUBLISHED</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Title (English) *</label>
            <input 
              type="text" 
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Subtitle (Hindi / Devanagari)</label>
            <input 
              type="text" 
              value={formData.subtitle}
              onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 devanagari font-semibold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Description</label>
          <textarea 
            rows="3"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
          ></textarea>
        </div>

        {/* Cover Preview & Upload */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <label className="block text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
            <Upload className="w-4 h-4" />
            <span>Cover Image</span>
          </label>

          <div className="flex items-center gap-6">
            {coverUrl && (
              <div className="w-20 h-28 rounded-lg overflow-hidden border border-slate-700 flex-shrink-0">
                <img src={coverUrl} alt="Cover Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files[0])}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-between items-center">
          <button 
            type="button"
            onClick={() => navigate(`/admin/comics/${id}/pages`)}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs"
          >
            Manage Comic Pages →
          </button>

          <div className="flex gap-3">
            <button 
              type="button"
              onClick={() => navigate('/admin/comics')}
              className="px-6 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={saving}
              className="px-8 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition disabled:opacity-50"
            >
              {saving ? 'SAVING...' : 'UPDATE ISSUE'}
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};

export default ComicEditPage;
