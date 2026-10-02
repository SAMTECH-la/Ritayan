import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Upload, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { createComic, uploadPages, getAdminComics } from '../services/api';

const ComicCreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    issue_number: 5,
    title: '',
    subtitle: '',
    description: '',
    author: 'Ritayan Studio',
    status: 'draft',
    release_date: new Date().toISOString().split('T')[0]
  });

  const [coverFile, setCoverFile] = useState(null);
  const [pageFiles, setPageFiles] = useState([]);

  // Dynamically calculate next available issue number
  useEffect(() => {
    getAdminComics()
      .then(res => {
        if (res.comics && res.comics.length > 0) {
          const maxNum = Math.max(...res.comics.map(c => parseInt(c.issue_number) || 0));
          setFormData(prev => ({
            ...prev,
            issue_number: maxNum + 1
          }));
        }
      })
      .catch(err => console.warn('Could not auto-calculate next issue #:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const postData = new FormData();
      postData.append('issue_number', formData.issue_number);
      postData.append('title', formData.title);
      postData.append('subtitle', formData.subtitle);
      postData.append('description', formData.description);
      postData.append('author', formData.author);
      postData.append('status', formData.status);
      postData.append('release_date', formData.release_date);

      if (coverFile) {
        postData.append('cover', coverFile);
      }

      const res = await createComic(postData);

      if (res.comic && res.comic.id) {
        const comicId = res.comic.id;

        // Upload batch pages if selected
        if (pageFiles.length > 0) {
          await uploadPages(comicId, pageFiles);
        }

        setSuccess(`Issue #${formData.issue_number} "${formData.title}" created successfully in MySQL!`);
        setTimeout(() => {
          navigate(`/admin/comics/${comicId}/pages`);
        }, 1200);
      } else {
        setError(res.error || 'Failed to create comic issue');
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || 'Server error creating comic';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
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
            CREATE NEW COMIC ISSUE
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Fill details, upload cover & pages. Saved as Draft by default.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
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
              min="1"
              value={formData.issue_number}
              onChange={(e) => setFormData({...formData, issue_number: parseInt(e.target.value) || 1})}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Initial Status *</label>
            <select 
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500"
            >
              <option value="draft">DRAFT (Hidden from Public)</option>
              <option value="published">PUBLISHED (Visible immediately on Public Site)</option>
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
              placeholder="e.g. VAMANA or KALKI"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Subtitle (Hindi / Devanagari)</label>
            <input 
              type="text" 
              value={formData.subtitle}
              onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
              placeholder="e.g. तीन पग भूमि"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 devanagari font-semibold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Synopsis / Description</label>
          <textarea 
            rows="3"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Detailed storyline synopsis..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Author / Studio</label>
            <input 
              type="text" 
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Release Date</label>
            <input 
              type="date" 
              value={formData.release_date}
              onChange={(e) => setFormData({...formData, release_date: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Cover Upload */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <label className="block text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
            <Upload className="w-4 h-4" />
            <span>Upload Cover Image (webp, svg, jpg, png)</span>
          </label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files[0])}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950"
          />
        </div>

        {/* Batch Pages Upload */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <label className="block text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
            <Upload className="w-4 h-4" />
            <span>Upload Batch Comic Pages (Select multiple files page-001, page-002...)</span>
          </label>
          <input 
            type="file" 
            multiple
            accept="image/*"
            onChange={(e) => setPageFiles(Array.from(e.target.files))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-slate-200"
          />
          {pageFiles.length > 0 && (
            <p className="text-xs text-emerald-400 font-semibold">{pageFiles.length} page files selected for upload.</p>
          )}
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button 
            type="button"
            onClick={() => navigate('/admin/comics')}
            className="px-6 py-3 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center gap-2 disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{loading ? 'CREATING ISSUE...' : 'SAVE & PROCEED TO PAGES'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};

export default ComicCreatePage;
