import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Clock, LogOut, Shield, Users, Trophy, Repeat, LayoutGrid } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { t, lang, toggleLang } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className="top-color-banner" />

      <header className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="/logo.png"
              alt="MINI FPL Logo"
              style={{ height: '42px', objectFit: 'contain' }}
            />
          </NavLink>

          <div
            className="navbar-deadline-badge hide-mobile"
            style={{
              background: 'rgba(79, 70, 229, 0.08)',
              border: '1px solid var(--border-color)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              color: 'var(--fpl-purple)',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Clock size={14} style={{ color: 'var(--fpl-purple)' }} />
            <span>GW1 Deadline: 21 Aug, 20:30</span>
          </div>
        </div>

        {user && (
          <nav className="desktop-nav">
            <ul className="nav-links">
              <li>
                <NavLink to="/points" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  {t('points')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/squad" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  {t('mySquad')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/transfers" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  {t('transfers')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/leagues" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  {t('leagues')}
                </NavLink>
              </li>
              {user.role === 'admin' && (
                <li>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    style={{ color: 'var(--fpl-magenta)', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Shield size={14} />
                    <span>{t('adminPanel')}</span>
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={toggleLang}
            style={{
              background: '#f1f5f9',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Globe size={14} />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="user-team-pill" style={{ textAlign: lang === 'ar' ? 'left' : 'right' }}>
                <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--fpl-purple)' }}>{user.team_name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--fpl-green)', fontWeight: 800 }}>
                  £{(user.bank / 10).toFixed(1)}m | {user.free_transfers} FT
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="btn-secondary"
                style={{ padding: '6px 10px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                title={t('logout')}
              >
                <LogOut size={14} />
                <span className="hide-mobile">{t('logout')}</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '6px' }}>
              <NavLink to="/login" className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.78rem' }}>
                {t('login')}
              </NavLink>
              <NavLink to="/register" className="btn-primary" style={{ padding: '6px 10px', fontSize: '0.78rem' }}>
                {t('register')}
              </NavLink>
            </div>
          )}
        </div>
      </header>

      {/* Floating Mobile Bottom Navigation Dock Bar for Native App Feel */}
      {user && (
        <div className="mobile-bottom-dock">
          <NavLink to="/points" className={({ isActive }) => `mobile-dock-item ${isActive ? 'active' : ''}`}>
            <Trophy size={20} />
            <span>{t('points')}</span>
          </NavLink>

          <NavLink to="/squad" className={({ isActive }) => `mobile-dock-item ${isActive ? 'active' : ''}`}>
            <LayoutGrid size={20} />
            <span>{t('mySquad')}</span>
          </NavLink>

          <NavLink to="/transfers" className={({ isActive }) => `mobile-dock-item ${isActive ? 'active' : ''}`}>
            <Repeat size={20} />
            <span>{t('transfers')}</span>
          </NavLink>

          <NavLink to="/leagues" className={({ isActive }) => `mobile-dock-item ${isActive ? 'active' : ''}`}>
            <Users size={20} />
            <span>{t('leagues')}</span>
          </NavLink>
        </div>
      )}
    </>
  );
};
