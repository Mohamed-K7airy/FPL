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

        <div style={{ display: 'flex', gap: '24px', fontWeight: 700, marginTop: '8px' }}>
          <Link to="/squad" style={{ color: 'var(--fpl-purple)' }}>
            {t('mySquad')}
          </Link>

          <Link to="/transfers" style={{ color: 'var(--fpl-purple)' }}>
            {t('transfers')}
          </Link>

          <Link to="/leagues" style={{ color: 'var(--fpl-purple)' }}>
            {t('leagues')}
          </Link>

          <Link to="/privacy" style={{ color: 'var(--fpl-cyan)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} />
            <span>{t('privacyPolicy')}</span>
            <ExternalLink size={12} />
          </Link>
        </div>

        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '12px' }}>
          {t('footerRights')}
        </div>
      </div>
    </footer>
  );
};
