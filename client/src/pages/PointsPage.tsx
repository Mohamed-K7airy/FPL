import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { PitchView, SquadSlotItem } from '../components/PitchView';
import { PlayerDetailModal, PlayerDetailData } from '../components/PlayerDetailModal';
import { GoogleAd } from '../components/GoogleAd';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export const PointsPage: React.FC = () => {
  const { t, isRtl } = useLanguage();
  const [gw, setGw] = useState(1);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'squad' | 'list'>('squad');
  const [activePlayerModal, setActivePlayerModal] = useState<PlayerDetailData | null>(null);

  const fetchPoints = async (gwNum: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch<any>(`/points/${gwNum}`);
      setData(res);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoints(gw);
  }, [gw]);

  const formattedPicks: SquadSlotItem[] = (data?.picks || []).map((item: any) => ({
    playerId: item.player_id,
    webName: item.players?.web_name || 'Player',
    position: item.players?.position || 2,
    teamShortName: item.players?.fpl_teams?.short_name || 'FPL',
    nowCost: item.players?.now_cost || 50,
    slot: item.slot,
    isCaptain: Boolean(item.is_captain),
    isVice: Boolean(item.is_vice),
    points: item.calculatedPoints,
    autoSubbed: Boolean(item.auto_subbed),
    fullData: {
      id: item.player_id,
      web_name: item.players?.web_name || 'Player',
      full_name: item.players?.full_name || 'Player',
      position: item.players?.position || 2,
      teamName: item.players?.fpl_teams?.name,
      teamShort: item.players?.fpl_teams?.short_name,
      now_cost: item.players?.now_cost || 50,
      total_points: item.calculatedPoints || 0,
    },
  }));

  const userScore = data?.summary?.net_points ?? (data?.summary?.raw_points || 0);
  const avgScore = data?.summary?.averagePoints ?? (data?.summary?.is_final ? 48 : 0);
  const highestScore = data?.summary?.highestPoints ?? (data?.summary?.is_final ? 94 : 0);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Top Banner Gradient Header matching Official FPL Mobile Points View */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 50%, #818cf8 100%)',
          borderRadius: '24px',
          padding: '24px 20px',
          color: '#ffffff',
          boxShadow: '0 12px 32px rgba(14, 165, 233, 0.25)',
          marginBottom: '24px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Gameweek Selector Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '20px',
          }}
        >
          <button
            onClick={() => setGw((prev) => Math.max(1, prev - 1))}
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '12px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <ChevronLeft size={22} />
          </button>

          <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.5px' }}>
            Gameweek {gw}
          </h2>

          <button
            onClick={() => setGw((prev) => Math.min(38, prev + 1))}
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '12px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Squad / List Toggle Segmented Pill */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '16px',
            padding: '4px',
            display: 'inline-flex',
            width: '100%',
            maxWidth: '340px',
            marginBottom: '24px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <button
            onClick={() => setViewMode('squad')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 900,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: viewMode === 'squad' ? '#ffffff' : 'transparent',
              color: viewMode === 'squad' ? '#1e1b4b' : '#ffffff',
              boxShadow: viewMode === 'squad' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            {isRtl ? 'التشكيلة (Squad)' : 'Squad'}
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 900,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: viewMode === 'list' ? '#ffffff' : 'transparent',
              color: viewMode === 'list' ? '#1e1b4b' : '#ffffff',
              boxShadow: viewMode === 'list' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            {isRtl ? 'القائمة (List)' : 'List'}
          </button>
        </div>

        {/* 3 Main Stat Cards (Average | Your Score | Highest) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr 1fr',
            gap: '12px',
            alignItems: 'end',
            maxWidth: '500px',
            margin: '0 auto',
          }}
        >
          {/* Average */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1.1 }}>
              {avgScore}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, opacity: 0.9, marginTop: '4px' }}>
              {isRtl ? 'المتوسط (Average)' : 'Average'}
            </div>
          </div>

          {/* Center: Your Score */}
          <div
            style={{
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              padding: '12px 8px',
              border: '1px solid rgba(255, 255, 255, 0.4)',
            }}
          >
            <div style={{ fontSize: '3.2rem', fontWeight: 900, lineHeight: 1 }}>
              {userScore}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 900, marginTop: '6px', color: '#ffffff' }}>
              {isRtl ? 'نقاطك (Your Score)' : 'Your Score'}
            </div>
          </div>

          {/* Highest */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1.1 }}>
              {highestScore}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, opacity: 0.9, marginTop: '4px' }}>
              {isRtl ? 'الأعلى (Highest)' : 'Highest'}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          {t('loading')}
        </div>
      ) : error ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          {error}
        </div>
      ) : viewMode === 'squad' ? (
        <PitchView
          picks={formattedPicks}
          selectedSlot={null}
          onSlotClick={() => { }}
          onPlayerInfoClick={(pData) => setActivePlayerModal(pData)}
          readOnly={true}
          gw={gw}
        />
      ) : (
        /* List View View Mode */
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', color: 'var(--fpl-purple)', fontWeight: 800 }}>
            {isRtl ? `تفاصيل لاعبين الجولة ${gw}` : `Gameweek ${gw} Player Breakdown`}
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table className="fpl-official-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t('playerSelection')}</th>
                  <th>{t('gkp')}</th>
                  <th style={{ textAlign: 'center' }}>{t('rawPoints')}</th>
                  <th style={{ textAlign: 'center' }}>{isRtl ? 'المضاعف' : 'Multiplier'}</th>
                  <th style={{ textAlign: 'right' }}>{t('netPoints')}</th>
                </tr>
              </thead>
              <tbody>
                {formattedPicks.map((p, idx) => (
                  <tr key={p.playerId || idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, color: '#0f172a' }}>{p.webName}</span>
                        {p.isCaptain && (
                          <span className="fpl-role-badge-pill captain">(C)</span>
                        )}
                        {p.isVice && (
                          <span className="fpl-role-badge-pill vice">(V)</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="player-team">{p.teamShortName}</span>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 700 }}>
                      {p.fullData?.total_points || 0}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800 }}>
                        {p.isCaptain ? '2x' : '1x'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 900, color: 'var(--fpl-green)', fontSize: '1.05rem' }}>
                      {p.points || 0} {t('pts')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <GoogleAd adSlot="3344556677" />

      {activePlayerModal && (
        <PlayerDetailModal player={activePlayerModal} onClose={() => setActivePlayerModal(null)} />
      )}
    </div>
  );
};
