import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Trophy, Activity, Award, ShieldAlert, CheckCircle2, Calendar, X, AlertCircle } from 'lucide-react';
import { getTeamUpcomingFixtures } from './PitchView';

export interface PlayerDetailData {
  id: number;
  web_name: string;
  full_name?: string;
  position: 1 | 2 | 3 | 4;
  teamName?: string;
  teamShort?: string;
  now_cost: number;
  total_points: number;
  form?: number;
  status?: string;
  news?: string;
  chance_of_playing?: number;
  goals?: number;
  assists?: number;
  clean_sheets?: number;
  bonus?: number;
  yellow_cards?: number;
  red_cards?: number;
  fixtures?: { opponent: string; isHome: boolean; difficulty: number }[];
}

interface PlayerDetailModalProps {
  player: PlayerDetailData | null;
  onClose: () => void;
}

export const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({ player, onClose }) => {
  const { t, isRtl } = useLanguage();

  if (!player) return null;

  const posLabel = player.position === 1 ? t('gkp') : player.position === 2 ? t('def') : player.position === 3 ? t('mid') : t('fwd');
  const posBadgeColor = player.position === 1 ? '#eab308' : player.position === 2 ? '#2563eb' : player.position === 3 ? '#dc2626' : '#0284c7';

  const fixturesToDisplay = player.fixtures && player.fixtures.length > 0
    ? player.fixtures
    : getTeamUpcomingFixtures(player.teamShort || player.teamName, 1, 3);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '480px',
          padding: '28px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
          color: '#0f172a',
          position: 'relative',
          direction: isRtl ? 'rtl' : 'ltr',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            [isRtl ? 'left' : 'right']: '20px',
            background: '#f1f5f9',
            border: 'none',
            color: '#64748b',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={18} />
        </button>

        {/* Header with Player Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: posBadgeColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.3rem',
              color: '#ffffff',
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            }}
          >
            {player.teamShort || 'FPL'}
          </div>

          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '4px',
                background: posBadgeColor,
                color: '#fff',
                marginBottom: '4px',
                display: 'inline-block',
              }}
            >
              {posLabel}
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--fpl-purple)', margin: '2px 0 0 0' }}>
              {player.full_name || player.web_name}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
              {player.teamName || 'Premier League Club'}
            </p>
          </div>
        </div>

        {/* Status News Banner */}
        {player.news ? (
          <div
            style={{
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: '12px',
              padding: '10px 14px',
              marginBottom: '20px',
              fontSize: '0.85rem',
              color: '#e11d48',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <ShieldAlert size={16} />
            <div><strong>{t('status')}:</strong> {player.news}</div>
          </div>
        ) : (
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              padding: '10px 14px',
              marginBottom: '20px',
              fontSize: '0.85rem',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle2 size={16} />
            <div><strong>{t('status')}:</strong> {t('available')}</div>
          </div>
        )}

        {/* Main Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>{t('totalPoints')}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--fpl-green)' }}>{player.total_points}</div>
          </div>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>{t('price')}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--fpl-purple)' }}>£{(player.now_cost / 10).toFixed(1)}m</div>
          </div>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>{t('form')}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--fpl-cyan)' }}>{player.form || '0.0'}</div>
          </div>
        </div>

        {/* Breakdown Stats Table */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={14} style={{ color: '#059669' }} /> {t('goals')}:
              </span>
              <strong style={{ color: '#0f172a' }}>{player.goals || 0}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={14} style={{ color: '#2563eb' }} /> {t('assists')}:
              </span>
              <strong style={{ color: '#0f172a' }}>{player.assists || 0}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} style={{ color: '#059669' }} /> {t('cleanSheets')}:
              </span>
              <strong style={{ color: '#0f172a' }}>{player.clean_sheets || 0}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Trophy size={14} style={{ color: '#d97706' }} /> {t('bonus')}:
              </span>
              <strong style={{ color: 'var(--fpl-gold)' }}>{player.bonus || 0}</strong>
            </div>
          </div>
        </div>

        {/* Upcoming Fixtures with FDR */}
        <div>
          <h4 style={{ fontSize: '0.85rem', marginBottom: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} />
            <span>{t('upcomingFixtures')}</span>
          </h4>
          <div style={{ display: 'flex', gap: '8px' }}>
            {fixturesToDisplay.map((fix, idx) => {
              const diffBg =
                fix.difficulty <= 2
                  ? '#059669'
                  : fix.difficulty === 3
                  ? '#64748b'
                  : fix.difficulty === 4
                  ? '#e11d48'
                  : '#881337';

              return (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    background: diffBg,
                    color: '#ffffff',
                    padding: '8px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                  }}
                >
                  <div>{fix.opponent} ({fix.isHome ? 'H' : 'A'})</div>
                  <div style={{ fontSize: '0.65rem', opacity: 0.85 }}>FDR {fix.difficulty}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
