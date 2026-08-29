import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { PitchView, SquadSlotItem } from '../components/PitchView';
import { PlayerDetailModal, PlayerDetailData } from '../components/PlayerDetailModal';
import { GoogleAd } from '../components/GoogleAd';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const PointsPage: React.FC = () => {
  const { t, isRtl } = useLanguage();
  const [gw, setGw] = useState<number>(1);
  const [activeGwId, setActiveGwId] = useState<number>(1);
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
      if (res?.activePointsGwId) {
        setActiveGwId(res.activePointsGwId);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Initial load: Fetch current active gameweek status first
  useEffect(() => {
    let isMounted = true;
    const initGameweek = async () => {
      try {
        const status = await apiFetch<any>('/gameweeks/status');
        if (isMounted && status?.activePointsGwId) {
          const targetGw = status.activePointsGwId;
          setGw(targetGw);
          setActiveGwId(targetGw);
          fetchPoints(targetGw);
          return;
        }
      } catch {
        // Fallback: fetch current directly
      }
      if (isMounted) {
        fetchPoints(gw);
      }
    };

    initGameweek();
    return () => {
      isMounted = false;
    };
  }, []);

  const handlePrevGw = () => {
    const newGw = Math.max(1, gw - 1);
    setGw(newGw);
    fetchPoints(newGw);
  };

  const handleNextGw = () => {
    const newGw = Math.min(38, gw + 1);
    setGw(newGw);
    fetchPoints(newGw);
  };

  const handleJumpToCurrent = () => {
    setGw(activeGwId);
    fetchPoints(activeGwId);
  };

  const formattedPicks: SquadSlotItem[] = (data?.picks || []).map((item: any) => ({
    playerId: item.player_id,
    webName: item.players?.web_name || item.players?.full_name || 'Player',
    position: item.players?.position || 2,
    teamShortName: item.players?.fpl_teams?.short_name || 'FPL',
    nowCost: item.players?.now_cost || 50,
    slot: item.slot,
    isCaptain: Boolean(item.is_captain),
    isVice: Boolean(item.is_vice),
    points: item.calculatedPoints ?? item.points ?? 0,
    autoSubbed: Boolean(item.auto_subbed),
    fullData: {
      id: item.player_id,
      web_name: item.players?.web_name || item.players?.full_name || 'Player',
      full_name: item.players?.full_name || item.players?.web_name || 'Player',
      position: item.players?.position || 2,
      teamName: item.players?.fpl_teams?.name || 'Premier League Club',
      teamShort: item.players?.fpl_teams?.short_name || 'FPL',
      now_cost: item.players?.now_cost || 50,
      total_points: item.players?.total_points ?? 0,
      gw_points: item.calculatedPoints ?? item.points ?? 0,
      form: item.players?.form ?? 0,
      status: item.players?.status,
      news: item.players?.news,
      chance_of_playing: item.players?.chance_of_playing,
      goals: item.stats?.goals ?? item.players?.goals ?? 0,
      assists: item.stats?.assists ?? item.players?.assists ?? 0,
      clean_sheets: item.stats?.clean_sheets ?? item.players?.clean_sheets ?? 0,
      bonus: item.stats?.bonus ?? item.players?.bonus ?? 0,
    },
  }));

  const userScore = data?.summary?.net_points ?? (data?.summary?.raw_points ?? (data?.userScore ?? 0));
  const avgScore = data?.summary?.averagePoints ?? (data?.avgScore ?? (data?.summary?.is_final ? 48 : 0));
  const highestScore = data?.summary?.highestPoints ?? (data?.highestScore ?? (data?.summary?.is_final ? 94 : 0));

  const isTripleCaptainActive = data?.summary?.chip === '3xc' || data?.summary?.active_chip === '3xc' || data?.chip === '3xc';

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
        {/* Gameweek Selector Bar with Live Status */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
            }}
          >
            <button
              onClick={handlePrevGw}
              disabled={gw <= 1 || loading}
              title={isRtl ? 'الجولة السابقة' : 'Previous Gameweek'}
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
                cursor: gw <= 1 ? 'not-allowed' : 'pointer',
                opacity: gw <= 1 ? 0.4 : 1,
                transition: 'all 0.2s ease',
              }}
            >
              {isRtl ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.7rem', fontWeight: 900, letterSpacing: '-0.5px' }}>
                {isRtl ? `الجولة ${gw}` : `Gameweek ${gw}`}
              </h2>
            </div>

            <button
              onClick={handleNextGw}
              disabled={gw >= 38 || loading}
              title={isRtl ? 'الجولة التالية' : 'Next Gameweek'}
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
                cursor: gw >= 38 ? 'not-allowed' : 'pointer',
                opacity: gw >= 38 ? 0.4 : 1,
                transition: 'all 0.2s ease',
              }}
            >
              {isRtl ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
            </button>
          </div>

          {/* Dynamic Status Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {gw === activeGwId ? (
              <div
                style={{
                  background: '#10b981',
                  color: '#ffffff',
                  padding: '2px 10px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '0 2px 6px rgba(16, 185, 129, 0.4)',
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    display: 'inline-block',
                    animation: 'pulse 1.5s infinite',
                  }}
                />
                {isRtl ? 'الجولة الحالية (مباشر)' : 'Current Gameweek (Live)'}
              </div>
            ) : (
              <button
                onClick={handleJumpToCurrent}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  color: '#ffffff',
                  padding: '3px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {isRtl ? `← الانتقال للجولة الحالية (${activeGwId})` : `→ Jump to Current GW (${activeGwId})`}
              </button>
            )}
          </div>
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
            {isRtl ? 'التشكيلة' : 'Squad'}
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
            {isRtl ? 'القائمة' : 'List'}
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
              {isRtl ? 'المتوسط' : 'Average'}
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
              {isRtl ? 'نقاطك' : 'Your Score'}
            </div>
          </div>

          {/* Highest */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1.1 }}>
              {highestScore}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, opacity: 0.9, marginTop: '4px' }}>
              {isRtl ? 'الأعلى' : 'Highest'}
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
            {isRtl ? `تفاصيل لاعبي الجولة ${gw}` : `Gameweek ${gw} Player Breakdown`}
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table className="fpl-official-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>{isRtl ? 'اللاعب' : 'Player'}</th>
                  <th>{isRtl ? 'الفريق' : 'Team'}</th>
                  <th style={{ textAlign: 'center' }}>{t('rawPoints')}</th>
                  <th style={{ textAlign: 'center' }}>{isRtl ? 'المضاعف' : 'Multiplier'}</th>
                  <th style={{ textAlign: 'right' }}>{t('netPoints')}</th>
                </tr>
              </thead>
              <tbody>
                {formattedPicks.map((p, idx) => {
                  const rawScore = (data?.picks?.[idx]?.raw_points ?? data?.picks?.[idx]?.rawPoints) !== undefined
                    ? (data?.picks?.[idx]?.raw_points ?? data?.picks?.[idx]?.rawPoints)
                    : (p.isCaptain ? Math.round((p.points || 0) / (isTripleCaptainActive ? 3 : 2)) : (p.points || 0));

                  const multiplierLabel = p.isCaptain ? (isTripleCaptainActive ? '3x' : '2x') : '1x';

                  return (
                    <tr key={p.playerId || idx}>
                      <td>{idx + 1}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 800, color: '#0f172a' }}>{p.webName}</span>
                          {p.isCaptain && (
                            <span className="fpl-role-badge-pill captain">{isTripleCaptainActive ? '(3x C)' : '(C)'}</span>
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
                        {rawScore}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800 }}>
                          {multiplierLabel}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 900, color: 'var(--fpl-green)', fontSize: '1.05rem' }}>
                        {p.points || 0} {t('pts')}
                      </td>
                    </tr>
                  );
                })}
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
