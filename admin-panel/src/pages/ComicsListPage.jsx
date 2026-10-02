import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, PlusCircle, CheckCircle, XCircle, FileEdit, 
  Trash2, Eye, Layers, ArrowUpRight, Search, AlertCircle 
} from 'lucide-react';
import { getAdminComics, publishComic, unpublishComic, deleteComic } from '../services/api';

const ComicsListPage = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const fetchComics = () => {
    setLoading(true);
    getAdminComics()
      .then(res => {
        if (res.comics) setComics(res.comics);
      })
      .catch(err => console.error('Error fetching admin comics:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchComics();
  }, []);

  const handlePublish = async (id, title) => {
    try {
      await publishComic(id);
      setActionMessage(`Issue "${title}" published! Now live on public website.`);
      fetchComics();
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err) {
      alert('Failed to publish comic');
    }
  };

  const handleUnpublish = async (id, title) => {
    try {
      await unpublishComic(id);
      setActionMessage(`Issue "${title}" unpublished. Removed from public library.`);
      fetchComics();
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err) {
      alert('Failed to unpublish comic');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This removes all associated page files from disk.`)) {
      return;
    }
    try {
      await deleteComic(id);
      setActionMessage(`Issue "${title}" deleted.`);
      fetchComics();
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err) {
      alert('Failed to delete comic');
    }
  };

  const filtered = comics.filter(c => {
    const q = search.toLowerCase();
    return c.title.toLowerCase().includes(q) || 
           (c.subtitle && c.subtitle.toLowerCase().includes(q)) ||
           String(c.issue_number).includes(q);
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black font-serif text-white">
            COMICS MANAGEMENT
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Control draft, published, and unpublished states. All records stored in single MySQL database.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            to="/admin/comics/create"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs no-underline transition flex items-center gap-2 shadow-lg"
          >
            <PlusCircle className="w-4 h-4" />
            <span>CREATE COMIC ISSUE</span>
          </Link>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Filter search */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search by title or issue #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <span className="text-xs text-slate-400">{filtered.length} total issues</span>
      </div>

      {/* Datatable */}
      {loading ? (
        <div className="text-center py-20 text-slate-500">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Fetching comics matrix from MySQL...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
          <p className="font-semibold text-base mb-1">No comics found</p>
          <p className="text-xs text-slate-500">Click "Create Comic Issue" to add a new comic.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-4">Cover</th>
                <th className="p-4">Issue #</th>
                <th className="p-4">Title & Subtitle</th>
                <th className="p-4">Pages</th>
                <th className="p-4">Status</th>
                <th className="p-4">Release Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs text-slate-300">
              {filtered.map(comic => (
                <tr key={comic.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4">
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                      <img src={comic.cover_url || comic.cover_image} alt={comic.title} className="w-full h-full object-cover" />
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg">
                      #{comic.issue_number}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-white text-sm">{comic.title}</div>
                    {comic.subtitle && <div className="text-amber-400 devanagari font-semibold">{comic.subtitle}</div>}
                    <div className="text-[11px] text-slate-500">{comic.slug}</div>
                  </td>

                  <td className="p-4 font-semibold text-slate-300">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      {comic.total_pages || 0} Pages
                    </span>
                  </td>

                  <td className="p-4">
                    {comic.status === 'published' && (
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Published
                      </span>
                    )}
                    {comic.status === 'draft' && (
                      <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Draft
                      </span>
                    )}
                    {comic.status === 'unpublished' && (
                      <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Unpublished
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-slate-400 text-[11px]">
                    {comic.release_date}
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Publish / Unpublish Toggle */}
                      {comic.status === 'published' ? (
                        <button
                          onClick={() => handleUnpublish(comic.id, comic.title)}
                          className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-bold transition"
                          title="Unpublish comic"
                        >
                          Unpublish
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePublish(comic.id, comic.title)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-bold transition"
                          title="Publish comic to public website"
                        >
                          Publish
                        </button>
                      )}

                      {/* Manage Pages & Preview */}
                      <Link
                        to={`/admin/comics/${comic.id}/pages`}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 transition"
                        title="Manage Pages & Preview 3D Reader"
                      >
                        <Layers className="w-4 h-4" />
                      </Link>

                      {/* Edit */}
                      <Link
                        to={`/admin/comics/${comic.id}/edit`}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="Edit Details"
                      >
                        <FileEdit className="w-4 h-4" />
                      </Link>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(comic.id, comic.title)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                        title="Delete Issue"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default ComicsListPage;
