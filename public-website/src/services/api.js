import axios from 'axios';

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (origin.includes(':5173') || origin.includes(':5174')) {
      return 'http://127.0.0.1:8000/api';
    }
    return `${origin}/api`;
  }
  return 'http://127.0.0.1:8000/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getComics = async () => {
  const response = await api.get('/comics');
  return response.data;
};

export const getComicBySlug = async (slug, lang = 'HI') => {
  const response = await api.get(`/comics/${slug}?lang=${lang}`);
  return response.data;
};

export const getComicPages = async (slug, lang = 'HI') => {
  const response = await api.get(`/comics/${slug}/pages?lang=${lang}`);
  return response.data;
};

export const getCharacters = async () => {
  const response = await api.get('/characters');
  return response.data;
};

export const getSettings = async () => {
  const response = await api.get('/settings');
  return response.data;
};

export const saveReadingProgress = async (comicId, currentPage, sessionToken) => {
  const response = await api.post('/progress', {
    comic_id: comicId,
    current_page: currentPage,
    session_token: sessionToken,
  });
  return response.data;
};

export const getReadingProgress = async (comicId, sessionToken) => {
  const response = await api.get(`/progress?comic_id=${comicId}&session_token=${sessionToken}`);
  return response.data;
};

export default api;
