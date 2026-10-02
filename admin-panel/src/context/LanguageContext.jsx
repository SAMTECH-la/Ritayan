import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const TRANSLATIONS = {
  EN: {
    adminTitle: 'RITAYAN ADMIN CONTROL CENTER',
    connected: 'Single Source MySQL Connected',
    dashboard: 'Dashboard',
    comics: 'All Comics',
    characters: 'Character Codex',
    createComic: 'Create Comic',
    media: 'Media Library',
    users: 'Users & Progress',
    analytics: 'Analytics',
    settings: 'Website Settings',
    activity: 'Activity Audit',
    publicWebsite: 'Public Website',
    signOut: 'Sign Out'
  },
  HI: {
    adminTitle: 'रामायण प्रशासन केंद्र',
    connected: 'MySQL डेटाबेस कनेक्टेड',
    dashboard: 'डैशबोर्ड',
    comics: 'सभी कॉमिक्स',
    characters: 'पौराणिक पात्र',
    createComic: 'नई कॉमिक बनाएं',
    media: 'मीडिया संग्रह',
    users: 'उपयोगकर्ता व प्रगति',
    analytics: 'विश्लेषण',
    settings: 'वेबसाइट सेटिंग्स',
    activity: 'गतिविधि ऑडिट',
    publicWebsite: 'सार्वजनिक वेबसाइट',
    signOut: 'लॉग आउट'
  },
  MR: {
    adminTitle: 'रामायण प्रशासन केंद्र',
    connected: 'MySQL डेटाबेस जोडलेले',
    dashboard: 'डॅशबोर्ड',
    comics: 'सर्व कॉमिक्स',
    characters: 'पौराणिक पात्रे',
    createComic: 'नवीन कॉमिक तयार करा',
    media: 'मीडिया संग्रह',
    users: 'वापरकर्ते व प्रगती',
    analytics: 'विश्लेषण',
    settings: 'वेबसाइट सेटिंग्स',
    activity: 'कृती ऑडिट',
    publicWebsite: 'सार्वजनिक वेबसाइट',
    signOut: 'बाहेर पडा'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('ritayan_lang') || 'HI';
  });

  useEffect(() => {
    localStorage.setItem('ritayan_lang', language);
  }, [language]);

  const t = (key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['EN']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
