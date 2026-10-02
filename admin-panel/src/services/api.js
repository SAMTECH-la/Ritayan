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
  maxContentLength: 1024 * 1024 * 1024, // 1 GB
  maxBodyLength: 1024 * 1024 * 1024,    // 1 GB
  timeout: 1800000,                      // 30 minutes timeout for up to 1 GB uploads
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ritayan_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Auth
export const adminLogin = async (username, password) => {
  const response = await api.post('/admin/login', { username, password });
  if (response.data.token) {
    localStorage.setItem('ritayan_admin_token', response.data.token);
    localStorage.setItem('ritayan_admin_user', JSON.stringify(response.data.admin));
  }
  return response.data;
};

export const getAdminProfile = async () => {
  const response = await api.get('/admin/me');
  return response.data;
};

export const logoutAdmin = () => {
  localStorage.removeItem('ritayan_admin_token');
  localStorage.removeItem('ritayan_admin_user');
};

// Comics Management
export const getAdminComics = async () => {
  const response = await api.get('/admin/comics');
  return response.data;
};

export const getComicPages = async (slug, lang = 'HI') => {
  const response = await api.get(`/comics/${slug}?lang=${lang}`);
  return response.data;
};

export const createComic = async (comicData) => {
  const response = await api.post('/admin/comics', comicData);
  return response.data;
};

export const updateComic = async (id, comicData) => {
  const response = await api.put(`/admin/comics/${id}`, comicData);
  return response.data;
};

export const deleteComic = async (id) => {
  const response = await api.delete(`/admin/comics/${id}`);
  return response.data;
};

export const uploadCover = async (comicId, file) => {
  const formData = new FormData();
  formData.append('cover', file);
  const response = await api.post(`/admin/comics/${comicId}/cover`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const uploadPages = async (comicId, files, languageCode = 'HI') => {
  const formData = new FormData();
  formData.append('language_code', languageCode);
  for (let i = 0; i < files.length; i++) {
    formData.append('pages[]', files[i]);
  }
  const response = await api.post(`/admin/comics/${comicId}/pages`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const reorderPages = async (pageOrders) => {
  const response = await api.put('/admin/pages/reorder', { pages: pageOrders });
  return response.data;
};

export const deletePage = async (pageId) => {
  const response = await api.delete(`/admin/pages/${pageId}`);
  return response.data;
};

export const publishComic = async (id) => {
  const response = await api.post(`/admin/comics/${id}/publish`);
  return response.data;
};

export const unpublishComic = async (id) => {
  const response = await api.post(`/admin/comics/${id}/unpublish`);
  return response.data;
};

// Dashboard & Analytics
export const getAnalytics = async () => {
  const response = await api.get('/admin/analytics');
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const getActivityLogs = async () => {
  const response = await api.get('/admin/activity');
  return response.data;
};

// Website Settings
export const getAdminSettings = async () => {
  const response = await api.get('/admin/settings');
  return response.data;
};

export const updateAdminSettings = async (settings) => {
  const response = await api.put('/admin/settings', settings);
  return response.data;
};

// Characters Management
export const getAdminCharacters = async () => {
  const response = await api.get('/admin/characters');
  return response.data;
};

export const createCharacter = async (formData) => {
  const response = await api.post('/admin/characters', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateCharacter = async (id, formData) => {
  const response = await api.post(`/admin/characters/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteCharacter = async (id) => {
  const response = await api.delete(`/admin/characters/${id}`);
  return response.data;
};

export default api;
