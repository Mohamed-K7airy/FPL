import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { PitchView, SquadSlotItem } from '../components/PitchView';
import { PlayerDetailModal, PlayerDetailData } from '../components/PlayerDetailModal';
import { GoogleAd } from '../components/GoogleAd';
import { BarChart2, TrendingUp, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

export const PointsPage: React.FC = () => {
  const { t, isRtl } = useLanguage();
  const [gw, setGw] = useState(1);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
    webName: item.players.web_name,
    position: item.players.position,
    teamShortName: item.players.fpl_teams?.short_name,
    nowCost: item.players.now_cost,
    slot: item.slot,
    isCaptain: Boolean(item.is_captain),
    isVice: Boolean(item.is_vice),
    points: item.calculatedPoints,
    autoSubbed: Boolean(item.auto_subbed),
    fullData: {
      id: item.player_id,
      web_name: item.players.web_name,
      full_name: item.players.full_name,
      position: item.players.position,
      teamName: item.players.fpl_teams?.name,
      teamShort: item.players.fpl_teams?.short_name,
      now_cost: item.players.now_cost,
      total_points: item.calculatedPoints || 0,
    },
  }));

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--fpl-green)' }}>{t('pointsBreakdown')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Live performance, captain multipliers, and auto-substitutions
          </p>
        </div>

        {/* Gameweek Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setGw((prev) => Math.max(1, prev - 1))}
            className="btn-secondary"
            style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <ChevronLeft size={16} />
            <span>GW{gw - 1}</span>
          </button>
          <span style={{ fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--fpl-purple)' }}>
            Gameweek {gw}
          </span>
          <button
            onClick={() => setGw((prev) => Math.min(38, prev + 1))}
            className="btn-secondary"
            style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <span>GW{gw + 1}</span>
            <ChevronRight size={16} />
          </button>
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
      ) : (
        <>
          {/* Summary Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div className="glass-card" style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <BarChart2 size={14} />
                <span>{t('rawPoints')}</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>{data.summary?.raw_points || 0}</div>
            </div>

            <div className="glass-card" style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <TrendingUp size={14} style={{ color: 'var(--fpl-magenta)' }} />
                <span>{t('transferCost')}</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--fpl-magenta)' }}>-{data.summary?.transfer_cost || 0}</div>
            </div>

            <div className="glass-card" style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Zap size={14} style={{ color: 'var(--fpl-cyan)' }} />
                <span>{t('netPoints')}</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--fpl-cyan)' }}>{data.summary?.net_points || 0}</div>
            </div>

            <div className="glass-card" style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('activeChip')}</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--fpl-gold)', marginTop: '4px' }}>
                {data.summary?.chip ? data.summary.chip.toUpperCase() : t('none')}
              </div>
            </div>
          </div>

          <PitchView
            picks={formattedPicks}
            selectedSlot={null}
            onSlotClick={() => { }}
            onPlayerInfoClick={(pData) => setActivePlayerModal(pData)}
            readOnly={true}
          />

          <GoogleAd adSlot="3344556677" />
        </>
      )}

      {activePlayerModal && (
        <PlayerDetailModal player={activePlayerModal} onClose={() => setActivePlayerModal(null)} />
      )}
    </div>
  );
};
