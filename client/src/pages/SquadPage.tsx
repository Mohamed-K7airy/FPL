import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { PitchView, SquadSlotItem } from '../components/PitchView';
import { PlayerDetailModal, PlayerDetailData } from '../components/PlayerDetailModal';
import { GoogleAd } from '../components/GoogleAd';
import { useNavigate } from 'react-router-dom';
import { Bot, Headset, GitCompare, Edit, Save } from 'lucide-react';

export const SquadPage: React.FC = () => {
  const { user } = useAuth();
  const { t, isRtl } = useLanguage();
  const navigate = useNavigate();

  const [squad, setSquad] = useState<SquadSlotItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [activePlayerModal, setActivePlayerModal] = useState<PlayerDetailData | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [gw, setGw] = useState(1);
  const [hideFixtures, setHideFixtures] = useState(false);
  const [benchBoostUsed, setBenchBoostUsed] = useState(false);
  const [tripleCaptainUsed, setTripleCaptainUsed] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const fetchSquad = async () => {
    try {
      const data = await apiFetch<{
        squad: any[];
        squadComplete: boolean;
      }>('/squad');

      if (!data.squadComplete || data.squad.length === 0) {
        navigate('/transfers');
        return;
      }

      const formatted: SquadSlotItem[] = data.squad.map((item: any) => ({
        playerId: item.player_id,
        webName: item.players?.web_name || item.players?.full_name || 'Player',
        code: item.players?.code || item.player_id,
        position: item.players?.position || 2,
        teamShortName: item.players?.fpl_teams?.short_name || 'FPL',
        nowCost: item.players?.now_cost || 50,
        slot: item.slot,
        isCaptain: Boolean(item.is_captain),
        isVice: Boolean(item.is_vice),
        fullData: {
          id: item.player_id,
          web_name: item.players?.web_name || 'Player',
          full_name: item.players?.full_name || 'Player',
          position: item.players?.position || 2,
          teamName: item.players?.fpl_teams?.name,
          teamShort: item.players?.fpl_teams?.short_name,
          now_cost: item.players?.now_cost || 50,
          total_points: item.players?.total_points || 0,
          form: item.players?.form,
          news: item.players?.news,
        },
      }));

      setSquad(formatted);
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSquad();
  }, []);

  const handleSlotClick = (clickedSlot: number) => {
    if (selectedSlot === null) {
      setSelectedSlot(clickedSlot);
      return;
    }

    if (selectedSlot === clickedSlot) {
      setSelectedSlot(null);
      return;
    }

    const newSquad = squad.map((item) => {
      if (item.slot === selectedSlot) return { ...item, slot: clickedSlot };
      if (item.slot === clickedSlot) return { ...item, slot: selectedSlot };
      return item;
    });

    setSquad(newSquad);
    setSelectedSlot(null);
    setHasChanges(true);
  };

  const handleSetCaptain = (slot: number) => {
    setSquad((prev) =>
      prev.map((item) => ({
        ...item,
        isCaptain: item.slot === slot,
        isVice: item.slot === slot ? false : item.isVice,
      }))
    );
    setHasChanges(true);
  };

  const handleSetVice = (slot: number) => {
    setSquad((prev) =>
      prev.map((item) => ({
        ...item,
        isVice: item.slot === slot,
        isCaptain: item.slot === slot ? false : item.isCaptain,
      }))
    );
    setHasChanges(true);
  };

  const handleSaveLineup = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const picks = squad.map((s) => ({
        playerId: s.playerId,
        slot: s.slot,
        isCaptain: s.isCaptain,
        isVice: s.isVice,
      }));

      await apiFetch('/squad/lineup', {
        method: 'PUT',
        body: JSON.stringify({ picks }),
      });

      setMessage({ type: 'success', text: isRtl ? 'تم تحديث التشكيلة وتعيين الكابتن بنجاح!' : 'Lineup updated successfully!' });
      setHasChanges(false);
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message });
    } finally {
      setSaving(false);
    }
  };

  const totalCost = squad.reduce((sum, p) => sum + (p.nowCost || 50), 0);
  const teamRating = Math.min(100, Math.round((squad.reduce((acc, p) => acc + (p.fullData?.total_points || 0), 0) / 15) * 1.2 + 65));

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
        {t('loading')}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {message && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '12px',
            marginBottom: '16px',
            background: message.type === 'success' ? '#f0fdf4' : '#fff1f2',
            border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecdd3'}`,
            color: message.type === 'success' ? '#16a34a' : '#e11d48',
            fontSize: '0.9rem',
            fontWeight: 700,
          }}
        >
          {message.text}
        </div>
      )}

      {/* FantasyProManager Style Master Pitch Card */}
      <div className="fpl-pitch-master-card">
        {/* Top Nav Bar (السابق / الجولة 1 / التالي + Checkbox) */}
        <div className="fpl-top-nav-bar">
          <button
            onClick={() => setGw((prev) => Math.max(1, prev - 1))}
            className="fpl-nav-pink-btn"
          >
            {isRtl ? 'السابق' : 'Previous'}
          </button>

          <div className="fpl-gw-pill-badge">
            <span className="fpl-dot-live" />
            <span>{isRtl ? `الجولة ${gw}` : `Gameweek ${gw}`}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label className="fpl-checkbox-label">
              <input
                type="checkbox"
                checked={hideFixtures}
                onChange={(e) => setHideFixtures(e.target.checked)}
              />
              <span>{isRtl ? 'إخفاء المباريات القادمة' : 'Hide Fixtures'}</span>
            </label>

            <button
              onClick={() => setGw((prev) => Math.min(38, prev + 1))}
              className="fpl-nav-purple-btn"
            >
              {isRtl ? 'التالي' : 'Next'}
            </button>
          </div>
        </div>

        {/* Top 3 Stat Cards Widget Row */}
        <div className="fpl-top-widgets-row">
          <div className="fpl-widget-card">
            <div className="widget-label">{isRtl ? 'اللاعبون المختارون' : 'Players Selected'}</div>
            <div className="widget-badge purple">
              15 / 15
            </div>
          </div>

          <div className="fpl-widget-card featured">
            <div className="widget-label">{isRtl ? 'الميزانية' : 'Budget'}</div>
            <div className="widget-num">£{((user?.bank || 1000 - totalCost) / 10).toFixed(1)}</div>
            <div className="widget-sub-label">{isRtl ? 'إدخال الميزانية' : 'Edit Budget'}</div>
          </div>

          <div className="fpl-widget-card">
            <div className="widget-label">{isRtl ? 'تقييم الفريق' : 'Team Rating'}</div>
            <div className="widget-badge purple">
              {teamRating}/100
            </div>
          </div>
        </div>

        {/* Pitch Container */}
        <div className="fpl-pitch-inner-container">
          <PitchView
            picks={squad}
            selectedSlot={selectedSlot}
            onSlotClick={handleSlotClick}
            onSetCaptain={handleSetCaptain}
            onSetVice={handleSetVice}
            onPlayerInfoClick={(pData) => setActivePlayerModal(pData)}
            hideFixtures={hideFixtures}
            benchChips={{
              benchBoostUsed,
              tripleCaptainUsed,
              onToggleBenchBoost: () => setBenchBoostUsed(!benchBoostUsed),
              onToggleTripleCaptain: () => setTripleCaptainUsed(!tripleCaptainUsed),
            }}
          />
        </div>

        {/* Bottom Floating Action Toolbar */}
        <div className="fpl-bottom-toolbar-container">
          {hasChanges ? (
            <button
              onClick={handleSaveLineup}
              disabled={saving}
              className="fpl-main-submit-emerald-btn"
              style={{ background: 'linear-gradient(135deg, #facc15, #eab308)', color: '#1e1b4b' }}
            >
              <Save size={18} />
              <span>{saving ? t('saving') : (isRtl ? 'حفظ التشكيل' : 'Save Lineup')}</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/transfers')}
              className="fpl-main-submit-emerald-btn"
              style={{ background: '#7e22ce' }}
            >
              <Edit size={18} />
              <span>{isRtl ? 'تعديل الفريق' : 'Edit Team / Transfers'}</span>
            </button>
          )}

          <div className="fpl-toolbar-actions-row">
            <button className="fpl-tool-btn gray">
              <GitCompare size={16} />
              <span>{isRtl ? 'مقارنة الفرق' : 'Compare Teams'}</span>
            </button>

            <button onClick={() => navigate('/transfers')} className="fpl-tool-btn cyan">
              <Headset size={16} />
              <span>{isRtl ? 'استشارة خبير' : 'Expert Advice'}</span>
            </button>

            <button onClick={() => navigate('/transfers')} className="fpl-tool-btn purple">
              <Bot size={16} />
              <span>{isRtl ? 'تغييرات بالذكاء الاصطناعي' : 'AI Smart Transfers'}</span>
            </button>
          </div>
        </div>
      </div>

      <GoogleAd adSlot="1122334455" />

      {activePlayerModal && (
        <PlayerDetailModal player={activePlayerModal} onClose={() => setActivePlayerModal(null)} />
      )}
    </div>
  );
};
