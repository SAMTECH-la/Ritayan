import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const TRANSLATIONS = {
  EN: {
    // Navigation
    home: 'Home',
    library: 'Comic Library',
    avatars: 'Mythic Avatars',
    about: 'About Saga',
    contact: 'Contact Us',
    searchPlaceholder: 'Search issues...',
    adminLink: 'Admin Login',
    tagline: 'Epics of the Yugas',
    
    // Hero & Home
    heroTag: 'CONNECTED DIGITAL COMIC PLATFORM',
    heroTitle: 'RITAYAN: Epics of the Yugas',
    heroSubtitle: 'Experience the grand epic of Indian mythology brought to life in interactive digital 3D graphic novels.',
    startReading: 'START READING ISSUE #1',
    exploreLibrary: 'EXPLORE ALL ISSUES',
    latestReleases: 'LATEST DIGITAL ISSUES',
    readIn3D: 'READ ISSUE IN 3D',

    // Characters Page
    codexTag: 'MYTHIC AVATARS & CHARACTER CODEX',
    codexTitle: 'Epics & Mythic Characters',
    codexDesc: 'Discover the mighty avatars, devas, sages, and kings of RITAYAN with high-definition artwork, sound effects, and canvas animations.',
    filterAll: 'All Characters',
    filterDashavatara: 'Dashavatara Avatars',
    filterOthers: 'Kings & Nagas',
    powerLevel: 'POWER POTENTIAL',
    weaponSymbol: 'WEAPON & DIVINE SYMBOL',
    overview: 'CHARACTER OVERVIEW',
    lore: 'PURANIC CHRONICLE & LORE',
    invokeHint: 'INVOKE ARTWORK & ANIMATION',
    featuredNovel: 'FEATURED GRAPHIC NOVEL',
    read3D: 'READ ISSUE IN 3D',

    // Reader Page
    frontCover: 'Front Cover Page',
    page: 'Page',
    of: 'of',
    prevPage: 'Previous Page',
    nextPage: 'Next Page',
    soundFx: 'Page Sound FX',
    soundOn: 'Sound ON',
    soundOff: 'Sound OFF',
    readingMode: 'Reading Mode',
    mode3D: '3D Physical Flip',
    modeScroll: 'Vertical Webtoon Scroll',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    resetZoom: 'Reset Zoom',
    backToLibrary: 'Back to Library',

    // Footer
    quickLinks: 'QUICK NAVIGATION',
    allRights: 'All Rights Reserved. Digital Graphic Novels Platform.'
  },

  HI: {
    // Navigation
    home: 'मुख्य पृष्ठ',
    library: 'कॉमिक ग्रंथालय',
    avatars: 'पौराणिक पात्र',
    about: 'गाथा परिचय',
    contact: 'संपर्क करें',
    searchPlaceholder: 'खोजें...',
    adminLink: 'प्रशासक प्रवेश',
    tagline: 'युगों की गाथा',
    
    // Hero & Home
    heroTag: 'डिजिटल कॉमिक प्लेटफॉर्म',
    heroTitle: 'रामायण एवं पौराणिक गाथा',
    heroSubtitle: 'भारतीय पौराणिक महाकाव्यों को जीवंत एवं डिजिटल 3D ग्राफिक उपन्यास रूप में अनुभव करें।',
    startReading: 'अध्याय #1 पढ़ें',
    exploreLibrary: 'सभी संस्करण देखें',
    latestReleases: 'नवीनतम प्रकाशित अंक',
    readIn3D: '3D में पढ़ें',

    // Characters Page
    codexTag: 'पौराणिक पात्र एवं चरित्र संग्रह',
    codexTitle: 'युगों के पौराणिक पात्र',
    codexDesc: 'रामायण एवं वैदिक गाथाओं के दिव्य अवतारों, राजाओं और नागराज के दिव्य चित्र, ध्वनि प्रभाव और एनीमेशन का आनंद लें।',
    filterAll: 'सभी पात्र',
    filterDashavatara: 'दशावतार',
    filterOthers: 'राजा और नाग',
    powerLevel: 'दिव्य शक्ति स्तर',
    weaponSymbol: 'शस्त्र एवं दिव्य प्रतीक',
    overview: 'पात्र विवरण',
    lore: 'पौराणिक गाथा एवं इतिहास',
    invokeHint: 'पात्र एनीमेशन एवं ध्वनि सुनें',
    featuredNovel: 'विशेष ग्राफिक उपन्यास',
    read3D: '3D में पढ़ें',

    // Reader Page
    frontCover: 'मुख्य आवरण पृष्ठ',
    page: 'पृष्ठ',
    of: 'का',
    prevPage: 'पिछला पृष्ठ',
    nextPage: 'अगला पृष्ठ',
    soundFx: 'पृष्ठ ध्वनि प्रभाव',
    soundOn: 'ध्वनि चालू',
    soundOff: 'ध्वनि बंद',
    readingMode: 'पठन शैली',
    mode3D: '3D पुस्तक पठन',
    modeScroll: 'वर्टिकल वेबटून',
    zoomIn: 'ज़ूम इन',
    zoomOut: 'ज़ूम आउट',
    resetZoom: 'सामान्य आकार',
    backToLibrary: 'ग्रंथालय पर लौटें',

    // Footer
    quickLinks: 'मुख्य नेविगेशन',
    allRights: 'सर्वाधिकार सुरक्षित। डिजिटल कॉमिक प्लेटफॉर्म।'
  },

  MR: {
    // Navigation
    home: 'मुख्य पृष्ठ',
    library: 'कॉमिक ग्रंथालय',
    avatars: 'पौराणिक पात्रे',
    about: 'गाथा माहिती',
    contact: 'संपर्क साधा',
    searchPlaceholder: 'शोधा...',
    adminLink: 'प्रशासन लॉगिन',
    tagline: 'युगांची गाथा',
    
    // Hero & Home
    heroTag: 'डिजिटल कॉमिक प्लॅटफॉर्म',
    heroTitle: 'रामायण व पौराणिक गाथा',
    heroSubtitle: 'भारतीय पौराणिक महाकाव्ये डिजिटल ३D ग्राफिक्स आणि संवाद रूपात अनुभवा.',
    startReading: 'अंक #१ वाचा',
    exploreLibrary: 'सर्व अंक पहा',
    latestReleases: 'नवीनतम प्रकाशित अंक',
    readIn3D: '३D मध्ये वाचा',

    // Characters Page
    codexTag: 'पौराणिक अवतार व पात्र संग्रह',
    codexTitle: 'युगांतील पौराणिक पात्रे',
    codexDesc: 'वैदिक व पौराणिक अवतारांची उच्च-गुणवत्ता चित्रे, ध्वनी प्रभाव आणि ॲनिमेशनचा अनुभव घ्या.',
    filterAll: 'सर्व पात्रे',
    filterDashavatara: 'दशावतार',
    filterOthers: 'राजे व नाग',
    powerLevel: 'दिव्य शक्ती स्तर',
    weaponSymbol: 'शस्त्र व दिव्य प्रतीक',
    overview: 'पात्र माहिती',
    lore: 'पौराणिक कथा व इतिहास',
    invokeHint: 'पात्र ॲनिमेशन व ध्वनी ऐका',
    featuredNovel: 'विशेष कॉमिक ग्रंथ',
    read3D: '३D मध्ये वाचा',

    // Reader Page
    frontCover: 'मुख्य मुखपृष्ठ',
    page: 'पान',
    of: 'पैकी',
    prevPage: 'मागील पान',
    nextPage: 'पुढील पान',
    soundFx: 'पान उलटण्याचा आवाज',
    soundOn: 'आवाज सुरू',
    soundOff: 'आवाज बंद',
    readingMode: 'वाचन प्रकार',
    mode3D: '३D पुस्तक वाचन',
    modeScroll: 'वेबटून स्क्रोल',
    zoomIn: 'झूम इन',
    zoomOut: 'झूम आऊट',
    resetZoom: 'मूळ आकार',
    backToLibrary: 'ग्रंथालयात परत',

    // Footer
    quickLinks: 'मुख्य नेव्हिगेशन',
    allRights: 'सर्व हक्क राखीव. डिजिटल कॉमिक प्लॅटफॉर्म.'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('ritayan_lang') || 'HI'; // Default to Hindi
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
