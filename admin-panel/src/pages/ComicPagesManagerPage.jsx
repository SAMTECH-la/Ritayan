import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Layers, Upload, MoveUp, MoveDown, Trash2, Eye, 
  ArrowLeft, CheckCircle, AlertCircle, Save, BookOpen 
} from 'lucide-react';
import { getAdminComics, getComicPages, uploadPages, reorderPages, deletePage } from '../services/api';
import ComicReader from '../components/ComicReader';

const LANGUAGES = [
  { code: 'HI', label: 'हिन्दी (HI)', flag: '🇮🇳' },
  { code: 'EN', label: 'English (EN)', flag: '🇬🇧' },
  { code: 'MR', label: 'मराठी (MR)', flag: '🚩' }
];

const ComicPagesManagerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [comic, setComic] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedLang, setSelectedLang] = useState('HI');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [newFiles, setNewFiles] = useState([]);

  const loadData = (lang = selectedLang) => {
    setLoading(true);
    getAdminComics()
      .then(res => {
        if (res.comics) {
          const target = res.comics.find(c => String(c.id) === String(id));
          if (target) {
            setComic(target);
            // Fetch exact page list for selected language
            getComicPages(target.slug, lang)
              .then(data => {
                if (data.comic && data.comic.pages) {
                  setPages(data.comic.pages);
                } else if (data.pages) {
                  setPages(data.pages);
                } else {
                  setPages([]);
                }
              })
              .catch(err => console.error(err));
          }
        }
      })
      .catch(err => setError('Failed to load comic pages'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData(selectedLang);
  }, [id, selectedLang]);

  // Page reorder helpers: Move page up/down in list
  const movePage = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pages.length) return;

    const newPages = [...pages];
    const temp = newPages[index];
    newPages[index] = newPages[targetIndex];
    newPages[targetIndex] = temp;

    // Recalculate page_number sequentially
    const updated = newPages.map((p, idx) => ({
      ...p,
      page_number: idx + 1
    }));

    setPages(updated);
  };

  // Save new page order to MySQL
  const handleSaveOrder = async () => {
    setReordering(true);
    setError('');
    try {
      const pageOrders = pages.map((p, idx) => ({
        id: p.id,
        page_number: idx + 1
      }));

      await reorderPages(pageOrders);
      setMessage(`Page order updated for ${selectedLang} in MySQL database! Public reader instantly updated.`);
      loadData(selectedLang);
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setError('Failed to save page order to backend');
    } finally {
      setReordering(false);
    }
  };

  // Upload new pages
  const handleUploadNewPages = async (e) => {
    e.preventDefault();
    if (newFiles.length === 0) return;

    setUploading(true);
    setError('');
    try {
      await uploadPages(id, newFiles, selectedLang);
      setMessage(`${newFiles.length} new pages uploaded for ${selectedLang} edition and appended to MySQL.`);
      setNewFiles([]);
      loadData(selectedLang);
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setError('Failed to upload new pages');
    } finally {
      setUploading(false);
    }
  };

  // Delete page
  const handleDeletePage = async (pageId, pageNum) => {
    if (!window.confirm(`Delete page ${pageNum} (${selectedLang})?`)) return;

    try {
      await deletePage(pageId);
      setMessage(`Page ${pageNum} (${selectedLang}) deleted and reindexed.`);
      loadData(selectedLang);
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      alert('Failed to delete page');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        Loading page manager...
      </div>
    );
  }

  // IF PREVIEW MODE IS ACTIVE: render 3D Reader in Preview Mode
  if (showPreviewModal && comic) {
    const fullComicData = { ...comic, pages: pages };
    return (
      <div className="fixed inset-0 z-50 bg-slate-950">
        <ComicReader 
          comic={fullComicData}
          isPreview={true}
          onBack={() => setShowPreviewModal(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <button 
            onClick={() => navigate('/admin/comics')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 font-semibold mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Comics</span>
          </button>
          <h1 className="text-3xl font-black font-serif text-white">
            MANAGE PAGES — ISSUE #{comic?.issue_number} ({comic?.title})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Reorder page sequence, upload new pages, delete pages, or preview in 3D Reader.
          </p>
        </div>

        {/* PREVIEW BUTTON */}
        <button
          onClick={() => setShowPreviewModal(true)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition shadow-xl flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          <span>PREVIEW IN 3D READER</span>
        </button>
      </div>

      {/* Multi-Lingual Language Selector Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>Multi-Lingual Pages Edition</span>
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Select a language to view, upload, or reorder pages for that specific language edition.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                setSelectedLang(lang.code);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                selectedLang === lang.code
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg ring-1 ring-amber-500/50'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      </div>

      {message && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Batch Upload Additional Pages */}
      <form onSubmit={handleUploadNewPages} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold font-serif text-amber-400 uppercase flex items-center gap-2">
          <Upload className="w-4 h-4" />
          <span>Upload Pages ({LANGUAGES.find(l=>l.code===selectedLang)?.label})</span>
        </h3>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input 
            type="file"
            multiple
            accept="image/*,.svg"
            onChange={(e) => setNewFiles(Array.from(e.target.files))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-slate-200"
          />
          <button
            type="submit"
            disabled={uploading || newFiles.length === 0}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition disabled:opacity-40 flex-shrink-0"
          >
            {uploading ? `Uploading to ${selectedLang}...` : `Upload to ${selectedLang}`}
          </button>
        </div>
      </form>

      {/* Page Reorder List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold font-serif text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>Current Page Sequence ({pages.length} Pages)</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Use Move Up / Move Down buttons to reorder pages, then click "Save Page Order to Database".
            </p>
          </div>

          <button
            onClick={handleSaveOrder}
            disabled={reordering || pages.length === 0}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{reordering ? 'Saving Order...' : 'SAVE PAGE ORDER'}</span>
          </button>
        </div>

        {pages.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No pages uploaded for this issue yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {pages.map((p, idx) => {
              const pageNum = idx + 1;
              const imgUrl = p.image_url || p.image_path;

              return (
                <div 
                  key={p.id || idx}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-4 hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-4">
                    {/* Position badge */}
                    <span className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs flex items-center justify-center">
                      #{pageNum}
                    </span>

                    {/* Thumbnail */}
                    <div className="w-14 h-18 rounded overflow-hidden bg-slate-900 border border-slate-800 flex-shrink-0">
                      <img src={imgUrl} alt={`Page ${pageNum}`} className="w-full h-full object-cover" />
                    </div>

                    {/* Details */}
                    <div>
                      <span className="font-bold text-slate-200 text-xs block">
                        {p.page_title || `Page ${pageNum}`}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate max-w-xs block">
                        {p.image_path}
                      </span>
                    </div>
                  </div>

                  {/* Reorder & Delete controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => movePage(idx, 'up')}
                      disabled={idx === 0}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-20 text-xs transition"
                      title="Move Up"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => movePage(idx, 'down')}
                      disabled={idx === pages.length - 1}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-20 text-xs transition"
                      title="Move Down"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeletePage(p.id, pageNum)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition ml-2"
                      title="Delete Page"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default ComicPagesManagerPage;
