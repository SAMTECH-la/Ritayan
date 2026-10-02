import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ComicsPage from './pages/ComicsPage';
import ComicDetailPage from './pages/ComicDetailPage';
import ReadPage from './pages/ReadPage';
import CharactersPage from './pages/CharactersPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SearchPage from './pages/SearchPage';
import { getSettings } from './services/api';

function App() {
  const [settings, setSettings] = useState(null);
  const location = useLocation();

  useEffect(() => {
    getSettings()
      .then(res => {
        if (res.settings) setSettings(res.settings);
      })
      .catch(err => console.warn('Could not fetch settings:', err));
  }, []);

  const isReaderRoute = location.pathname.startsWith('/read/');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {!isReaderRoute && <Navbar siteTitle={settings?.site_title} />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage settings={settings} />} />
          <Route path="/comics" element={<ComicsPage />} />
          <Route path="/comics/:slug" element={<ComicDetailPage />} />
          <Route path="/read/:slug" element={<ReadPage />} />
          <Route path="/characters" element={<CharactersPage />} />
          <Route path="/about" element={<AboutPage settings={settings} />} />
          <Route path="/contact" element={<ContactPage settings={settings} />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </main>

      {!isReaderRoute && <Footer settings={settings} />}
    </div>
  );
}

export default App;
