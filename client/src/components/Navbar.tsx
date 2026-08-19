import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Clock, LogOut, Shield, Users, Trophy, Repeat, LayoutGrid, Home, BookOpen, Lightbulb, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { t, lang, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <div className="top-color-banner" />

      <header className="navbar">
        <div className="navbar-brand-container">
          <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }} onClick={closeMenu}>
            <img
              src="/logo.png"
              alt="MINI FPL Logo"
              className="navbar-logo-img"
            />
          </NavLink>

          <div className="navbar-deadline-badge hide-tablet">
            <Clock size={14} style={{ color: 'var(--fpl-purple)' }} />
            <span>GW1 Deadline: 21 Aug, 20:30</span>
          </div>
        </div>

        <nav className="desktop-nav">
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                <Home size={15} />
                <span>{t('home')}</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/guides" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <BookOpen size={15} />
                <span>{t('guides')}</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/tips" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Lightbulb size={15} />
                <span>{t('tips')}</span>
              </NavLink>
            </li>
            {user && (
              <>
                <li>
                  <NavLink to="/points" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Trophy size={15} />
                    <span>{t('points')}</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/squad" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <LayoutGrid size={15} />
                    <span>{t('mySquad')}</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/transfers" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Repeat size={15} />
                    <span>{t('transfers')}</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/leagues" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Users size={15} />
                    <span>{t('leagues')}</span>
                  </NavLink>
                </li>
                {user.role === 'admin' && (
                  <li>
                    <NavLink
                      to="/admin"
                      className={({ isActive }) => `nav-link admin-nav-link ${isActive ? 'active' : ''}`}
                    >
                      <Shield size={15} />
                      <span>{t('adminPanel')}</span>
                    </NavLink>
                  </li>
                )}
              </>
            )}
          </ul>
        </nav>

        <div className="navbar-actions">
          <button onClick={toggleLang} className="lang-toggle-btn">
            <Globe size={14} />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {user ? (
            <div className="user-profile-actions">
              <button
                onClick={handleLogout}
                className="btn-logout hide-mobile"
                title={t('logout')}
              >
                <LogOut size={14} />
                <span className="logout-text">{t('logout')}</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons hide-mobile">
              <NavLink to="/login" className="btn-secondary nav-auth-btn">
                {t('login')}
              </NavLink>
              <NavLink to="/register" className="btn-primary nav-auth-btn">
                {t('register')}
              </NavLink>
            </div>
          )}

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-hamburger-btn"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Slide-out Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-backdrop" onClick={closeMenu}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div style={{ fontWeight: 900, color: 'var(--fpl-purple)', fontSize: '1.1rem' }}>
                {lang === 'ar' ? 'قائمة MINI FPL' : 'MINI FPL Menu'}
              </div>
              <button onClick={closeMenu} className="mobile-drawer-close">
                <X size={20} />
              </button>
            </div>

            <nav className="mobile-drawer-nav">
              <NavLink to="/" onClick={closeMenu} className="mobile-drawer-link">
                <Home size={18} />
                <span>{t('home')}</span>
              </NavLink>
              <NavLink to="/guides" onClick={closeMenu} className="mobile-drawer-link">
                <BookOpen size={18} />
                <span>{t('guides')}</span>
              </NavLink>
              <NavLink to="/tips" onClick={closeMenu} className="mobile-drawer-link">
                <Lightbulb size={18} />
                <span>{t('tips')}</span>
              </NavLink>
              {user ? (
                <>
                  <NavLink to="/points" onClick={closeMenu} className="mobile-drawer-link">
                    <Trophy size={18} />
                    <span>{t('points')}</span>
                  </NavLink>
                  <NavLink to="/squad" onClick={closeMenu} className="mobile-drawer-link">
                    <LayoutGrid size={18} />
                    <span>{t('mySquad')}</span>
                  </NavLink>
                  <NavLink to="/transfers" onClick={closeMenu} className="mobile-drawer-link">
                    <Repeat size={18} />
                    <span>{t('transfers')}</span>
                  </NavLink>
                  <NavLink to="/leagues" onClick={closeMenu} className="mobile-drawer-link">
                    <Users size={18} />
                    <span>{t('leagues')}</span>
                  </NavLink>
                  {user.role === 'admin' && (
                    <NavLink to="/admin" onClick={closeMenu} className="mobile-drawer-link admin">
                      <Shield size={18} />
                      <span>{t('adminPanel')}</span>
                    </NavLink>
                  )}
                  <button onClick={handleLogout} className="mobile-drawer-link logout">
                    <LogOut size={18} />
                    <span>{t('logout')}</span>
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
                  <NavLink to="/login" onClick={closeMenu} className="btn-secondary" style={{ textAlign: 'center', padding: '10px' }}>
                    {t('login')}
                  </NavLink>
                  <NavLink to="/register" onClick={closeMenu} className="btn-primary" style={{ textAlign: 'center', padding: '10px' }}>
                    {t('register')}
                  </NavLink>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Floating Mobile Bottom Navigation Dock Bar for Native App Feel */}
      <div className="mobile-bottom-dock">
        <NavLink to="/" className={({ isActive }) => `mobile-dock-item ${isActive ? 'active' : ''}`} end>
          <Home size={18} />
          <span>{t('home')}</span>
        </NavLink>

        {user ? (
          <>
            <NavLink to="/points" className={({ isActive }) => `mobile-dock-item ${isActive ? 'active' : ''}`}>
              <Trophy size={18} />
              <span>{t('points')}</span>
            </NavLink>

            <NavLink to="/squad" className={({ isActive }) => `mobile-dock-item ${isActive ? 'active' : ''}`}>
              <LayoutGrid size={18} />
              <span>{t('mySquad')}</span>
            </NavLink>

            <NavLink to="/transfers" className={({ isActive }) => `mobile-dock-item ${isActive ? 'active' : ''}`}>
              <Repeat size={18} />
              <span>{t('transfers')}</span>
            </NavLink>

            <NavLink to="/tips" className={({ isActive }) => `mobile-dock-item ${isActive ? 'active' : ''}`}>
              <Lightbulb size={18} />
              <span>{t('tips')}</span>
            </NavLink>

            <NavLink to="/leagues" className={({ isActive }) => `mobile-dock-item ${isActive ? 'active' : ''}`}>
              <Users size={18} />
              <span>{lang === 'ar' ? 'الدوريات' : t('leagues')}</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/guides" className={({ isActive }) => `mobile-dock-item ${isActive ? 'active' : ''}`}>
              <BookOpen size={18} />
              <span>{t('guides')}</span>
            </NavLink>

            <NavLink to="/tips" className={({ isActive }) => `mobile-dock-item ${isActive ? 'active' : ''}`}>
              <Lightbulb size={18} />
              <span>{t('tips')}</span>
            </NavLink>

            <NavLink to="/login" className={({ isActive }) => `mobile-dock-item ${isActive ? 'active' : ''}`}>
              <LogOut size={18} />
              <span>{t('login')}</span>
            </NavLink>
          </>
        )}
      </div>
    </>
  );
};
