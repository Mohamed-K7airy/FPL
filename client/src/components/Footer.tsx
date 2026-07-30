import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer
      style={{
        background: '#f8fafc',
        borderTop: '1px solid var(--border-color)',
        padding: '32px 24px',
        marginTop: '60px',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" alt="MINI FPL" style={{ height: '44px', objectFit: 'contain' }} />
        </div>

        <p style={{ maxWidth: '600px', lineHeight: 1.6, color: 'var(--text-muted)' }}>
          {t('adDisclaimer')}
        </p>

        <div style={{ display: 'flex', gap: '20px', fontWeight: 700, marginTop: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/" style={{ color: 'var(--fpl-purple)' }}>
            {t('home')}
          </Link>

          <Link to="/guides" style={{ color: 'var(--fpl-purple)' }}>
            {t('guides')}
          </Link>

          <Link to="/about" style={{ color: 'var(--fpl-purple)' }}>
            {t('about')}
          </Link>

          <Link to="/terms" style={{ color: 'var(--fpl-purple)' }}>
            {t('terms')}
          </Link>

          <Link to="/privacy" style={{ color: 'var(--fpl-purple)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} />
            <span>{t('privacyPolicy')}</span>
          </Link>
        </div>

        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '12px' }}>
          {t('footerRights')}
        </div>
      </div>
    </footer>
  );
};
