import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminNavbar from './components/AdminNavbar';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ComicsListPage from './pages/ComicsListPage';
import ComicCreatePage from './pages/ComicCreatePage';
import ComicEditPage from './pages/ComicEditPage';
import ComicPagesManagerPage from './pages/ComicPagesManagerPage';
import MediaPage from './pages/MediaPage';
import UsersPage from './pages/UsersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import ActivityPage from './pages/ActivityPage';
import CharacterManagerPage from './pages/CharacterManagerPage';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('ritayan_admin_token');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/admin/login';

  return (
    <Routes>
      <Route path="/admin/login" element={<LoginPage />} />

      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-slate-950 text-slate-100 flex">
              <AdminSidebar />
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <AdminNavbar />
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                  <Routes>
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="comics" element={<ComicsListPage />} />
                    <Route path="characters" element={<CharacterManagerPage />} />
                    <Route path="comics/create" element={<ComicCreatePage />} />
                    <Route path="comics/:id/edit" element={<ComicEditPage />} />
                    <Route path="comics/:id/pages" element={<ComicPagesManagerPage />} />
                    <Route path="media" element={<MediaPage />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="activity" element={<ActivityPage />} />
                    <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                  </Routes>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } 
      />

      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}

export default App;
