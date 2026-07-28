import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { SquadPage } from './pages/SquadPage';
import { TransfersPage } from './pages/TransfersPage';
import { PointsPage } from './pages/PointsPage';
import { LeaguesPage } from './pages/LeaguesPage';
import { AdminPage } from './pages/AdminPage';
import { PrivacyPage } from './pages/PrivacyPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>{t('loading')}</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/squad" replace />;
  }

  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/squad" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          <Route
            path="/squad"
            element={
              <ProtectedRoute>
                <SquadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transfers"
            element={
              <ProtectedRoute>
                <TransfersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/points"
            element={
              <ProtectedRoute>
                <PointsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leagues"
            element={
              <ProtectedRoute>
                <LeaguesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
