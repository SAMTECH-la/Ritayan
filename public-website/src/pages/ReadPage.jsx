import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ComicReader from '../components/ComicReader';
import { getComicBySlug, getReadingProgress } from '../services/api';

const ReadPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialPage, setInitialPage] = useState(1);
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('ritayan_comic_lang') || 'HI';
  });

  const fetchComicAndProgress = async (lang = currentLang) => {
    setLoading(true);
    try {
      const res = await getComicBySlug(slug, lang);
      if (res.comic) {
        setComic(res.comic);

        // Check if there is saved reading progress for this user
        const sessionToken = localStorage.getItem('ritayan_session_token');
        if (sessionToken && res.comic.id) {
          try {
            const progRes = await getReadingProgress(res.comic.id, sessionToken);
            if (progRes.progress && progRes.progress.current_page) {
              setInitialPage(parseInt(progRes.progress.current_page));
            }
          } catch (pErr) {
            console.warn('Progress check silent fail:', pErr);
          }
        }
      } else {
        setError('Comic not found.');
      }
    } catch (err) {
      console.error('Failed to load comic reader:', err);
      setError('Comic not found or unavailable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComicAndProgress(currentLang);
  }, [slug]);

  const handleLanguageChange = (newLang) => {
    setCurrentLang(newLang);
    localStorage.setItem('ritayan_comic_lang', newLang);
    fetchComicAndProgress(newLang);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 space-y-3">
        <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-semibold text-sm">Opening 3D Comic Reader...</p>
      </div>
    );
  }

  if (error || !comic) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 p-4 space-y-4">
        <h2 className="text-2xl font-bold font-serif text-red-400">Unable to load comic reader</h2>
        <p className="text-xs text-slate-400">{error}</p>
        <button 
          onClick={() => navigate('/comics')}
          className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs"
        >
          Return to Library
        </button>
      </div>
    );
  }

  return (
    <ComicReader 
      comic={comic} 
      isPreview={false}
      initialPage={initialPage}
      currentLang={currentLang}
      onLanguageChange={handleLanguageChange}
      onBack={() => navigate('/comics')}
    />
  );
};

export default ReadPage;
