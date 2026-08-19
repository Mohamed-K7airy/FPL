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

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const AppContent: React.FC = () => {
  const location = useLocation();

  // Track Google Analytics pageviews on route change
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-TQB2VKNFRS', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  // Site Lockdown & Coming Soon Mode (default: true)
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

  const isLocked = comingSoonMode && !isPreviewMode;

  // Helper guard for private game app routes (/squad, /transfers, /points, /leagues, /login, /register)
  const PrivateGameRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (isLocked) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

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

      {/* Render Navbar when not locked on Homepage, or render LandingPage header inside LandingPage */}
      {!isLocked && <Navbar />}
      
      <main className="main-content">
        <Routes>
          {/* Homepage: Renders LandingPage during lockdown, or HomePage when preview mode active */}
          <Route path="/" element={isLocked ? <LandingPage onBypassLock={enablePreviewMode} /> : <HomePage />} />
          <Route path="/intro" element={<LandingPage onBypassLock={enablePreviewMode} />} />

          {/* PUBLIC SEO CONTENT ROUTES - Open for Googlebot Indexing */}
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/rules" element={<GuidesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/tips" element={<TipsPage />} />
          <Route path="/tips/:slug" element={<ArticlePage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* PRIVATE GAME APP ROUTES - Locked to LandingPage during Coming Soon Mode */}
          <Route path="/login" element={<PrivateGameRoute><LoginPage /></PrivateGameRoute>} />
          <Route path="/register" element={<PrivateGameRoute><RegisterPage /></PrivateGameRoute>} />
          <Route
            path="/squad"
            element={
              <PrivateGameRoute>
                <ProtectedRoute>
                  <SquadPage />
                </ProtectedRoute>
              </PrivateGameRoute>
            }
          />
          <Route
            path="/transfers"
            element={
              <PrivateGameRoute>
                <ProtectedRoute>
                  <TransfersPage />
                </ProtectedRoute>
              </PrivateGameRoute>
            }
          />
          <Route
            path="/points"
            element={
              <PrivateGameRoute>
                <ProtectedRoute>
                  <PointsPage />
                </ProtectedRoute>
              </PrivateGameRoute>
            }
          />
          <Route
            path="/leagues"
            element={
              <PrivateGameRoute>
                <ProtectedRoute>
                  <LeaguesPage />
                </ProtectedRoute>
              </PrivateGameRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateGameRoute>
                <ProtectedRoute adminOnly={true}>
                  <AdminPage />
                </ProtectedRoute>
              </PrivateGameRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isLocked && <Footer />}
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

