import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
import { HomePage } from './pages/HomePage';
import { GuidesPage } from './pages/GuidesPage';
import { TermsPage } from './pages/TermsPage';
import { AboutPage } from './pages/AboutPage';
import { TipsPage } from './pages/TipsPage';
import { ArticlePage } from './pages/ArticlePage';
import { ContactPage } from './pages/ContactPage';
import { LandingPage } from './pages/LandingPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>{t('loading')}</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/squad" replace />;
  }

  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  const location = useLocation();

  // Site Lockdown & Coming Soon Mode
  // Default is true (Coming Soon Mode enabled)
  const [comingSoonMode, setComingSoonMode] = useState<boolean>(true);
  
  // Check for admin preview mode override via URL parameter ?preview=true or localStorage
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('preview') === 'true' || searchParams.get('admin') === 'true') {
      localStorage.setItem('minifpl_preview_mode', 'true');
      return true;
    }
    return localStorage.getItem('minifpl_preview_mode') === 'true';
  });

  const enablePreviewMode = () => {
    localStorage.setItem('minifpl_preview_mode', 'true');
    setIsPreviewMode(true);
  };

  const disablePreviewMode = () => {
    localStorage.removeItem('minifpl_preview_mode');
    setIsPreviewMode(false);
  };

  // If coming soon mode is enabled and user is NOT in admin preview mode, restrict everything to LandingPage
  const isLocked = comingSoonMode && !isPreviewMode;

  if (isLocked) {
    return (
      <Routes>
        <Route path="*" element={<LandingPage onBypassLock={enablePreviewMode} />} />
      </Routes>
    );
  }

  return (
    <div className="app-container">
      {/* Admin Preview Mode Banner */}
      {isPreviewMode && (
        <div style={{
          background: 'linear-gradient(90deg, #2e1065, #00ff85)',
          color: '#ffffff',
          padding: '8px 16px',
          textAlign: 'center',
          fontSize: '0.85rem',
          fontWeight: 800,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          zIndex: 9999
        }}>
          <span>أنت تشاهد المعاينة الخاصة بالأدمن (Admin Preview Mode Enabled)</span>
          <button 
            onClick={disablePreviewMode}
            style={{
              background: 'rgba(0,0,0,0.4)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '6px',
              padding: '2px 10px',
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            إغلاق المعاينة والعودة لوضع القفل
          </button>
        </div>
      )}

      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/intro" element={<LandingPage onBypassLock={enablePreviewMode} />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/rules" element={<GuidesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/tips" element={<TipsPage />} />
          <Route path="/tips/:slug" element={<ArticlePage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/contact" element={<ContactPage />} />

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
          <Route path="*" element={<Navigate to="/" replace />} />
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

