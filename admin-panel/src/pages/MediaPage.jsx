import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Layers, BookOpen } from 'lucide-react';
import { getAdminComics } from '../services/api';

const MediaPage = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminComics()
      .then(res => {
        if (res.comics) setComics(res.comics);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-black font-serif text-white">
          MEDIA ASSET GALLERY
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Browse uploaded covers, banners, and comic page artwork stored in file system.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading media library...</div>
      ) : (
        <div className="space-y-8">
          {comics.map(comic => (
            <div key={comic.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold font-serif text-amber-400 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>Issue #{comic.issue_number} — {comic.title}</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {/* Cover */}
                <div className="bg-slate-950 p-2 rounded-xl border border-amber-500/40 text-center">
                  <div className="h-36 rounded overflow-hidden bg-black mb-2">
                    <img src={comic.cover_url || comic.cover_image} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase block">Cover Image</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default MediaPage;
