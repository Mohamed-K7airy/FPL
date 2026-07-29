import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { PitchView, SquadSlotItem } from '../components/PitchView';
import { PlayerDetailModal, PlayerDetailData } from '../components/PlayerDetailModal';
import { GoogleAd } from '../components/GoogleAd';
import { useNavigate } from 'react-router-dom';
import { Bot, Headset, GitCompare, Edit, Save, CheckCircle2, AlertCircle } from 'lucide-react';

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
  const [hasChanges, setHasChanges] = useState(false);
  const [hideFixtures, setHideFixtures] = useState(false);
  const [gw, setGw] = useState(1);
  const [usedChips, setUsedChips] = useState<string[]>([]);
  const [activatingChip, setActivatingChip] = useState(false);

  const fetchChips = async () => {
    try {
      const data = await apiFetch<{ usedChips: any[] }>('/chips');
      const chipsList = (data.usedChips || []).map((c) => c.chip);
      setUsedChips(chipsList);
    } catch {
      // Ignore if empty
    }
  };

  useEffect(() => {
    fetchChips();
  }, []);

  const isTripleCaptainActive = usedChips.includes('3xc');

  const handleActivateTripleCaptain = async () => {
    setActivatingChip(true);
    try {
      await apiFetch('/chips/activate', {
        method: 'POST',
        body: JSON.stringify({ chip: '3xc' }),
      });
      await fetchChips();
      setMessage({ type: 'success', text: isRtl ? 'تم تفعيل خاصية تريبل كابتن بنجاح!' : 'Triple Captain chip activated!' });
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message });
    } finally {
      setActivatingChip(false);
    }
  };

  const handleDeactivateTripleCaptain = async () => {
    setActivatingChip(true);
    try {
      await apiFetch('/chips/deactivate', {
        method: 'POST',
        body: JSON.stringify({ chip: '3xc' }),
      });
      await fetchChips();
      setMessage({ type: 'success', text: isRtl ? 'تم إلغاء تفعيل خاصية تريبل كابتن بنجاح!' : 'Triple Captain chip deactivated!' });
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message });
    } finally {
      setActivatingChip(false);
    }
  };

  // Auto-dismiss toast messages after 3.5s
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [message]);

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
  const gwPoints = squad.reduce((sum, p) => {
    let pPts = p.points || 0;
    if (p.isCaptain) {
      pPts = pPts * (isTripleCaptainActive ? 3 : 2);
    }
    return sum + pPts;
  }, 0);

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
        <div className="fpl-toast-popup-container">
          <div className={`fpl-toast-popup ${message.type}`}>
            <div className="fpl-toast-icon">
              {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            </div>
            <div className="fpl-toast-text">{message.text}</div>
            <button onClick={() => setMessage(null)} className="fpl-toast-close">×</button>
          </div>
        </div>
      )}

      {/* FantasyProManager Style Master Pitch Card */}
      <div className="fpl-pitch-master-card">
        {/* Top Nav Bar (السابق / الجولة 1 / التالي) */}
        <div className="fpl-top-nav-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setGw((prev) => Math.max(1, prev - 1))}
            className="fpl-nav-purple-btn"
          >
            {isRtl ? 'السابق' : 'Previous'}
          </button>

          <div className="fpl-gw-pill-badge" style={{ margin: '0 auto' }}>
            <span className="fpl-dot-live" />
            <span>{isRtl ? `الجولة ${gw}` : `Gameweek ${gw}`}</span>
          </div>

          <button
            onClick={() => setGw((prev) => Math.min(38, prev + 1))}
            className="fpl-nav-purple-btn"
          >
            {isRtl ? 'التالي' : 'Next'}
          </button>
        </div>

        {/* Stat Cards Row (اليمين: خاصية الجولة | الوسط: قيمة التشكيلة | اليسار: ترتيب الجولة) */}
        <div className="fpl-top-widgets-row">
          {/* Card 1 (اليمين - Right): خاصية التريبل كابتن (3x) */}
          <div className="fpl-widget-card">
            <div className="widget-label">{isRtl ? 'خاصية الجولة (Chip)' : 'Gameweek Chip'}</div>
            {isTripleCaptainActive ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px', width: '100%' }}>
                <div
                  style={{
                    background: '#10b981',
                    color: '#ffffff',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    fontWeight: 900,
                    fontSize: '0.82rem',
                    textAlign: 'center',
                  }}
                >
                  {isRtl ? 'تريبل كابتن (مفعّلة x3)' : 'Triple Captain Active (x3)'}
                </div>
                <button
                  onClick={handleDeactivateTripleCaptain}
                  disabled={activatingChip}
                  style={{
                    background: '#e11d48',
                    color: '#ffffff',
                    border: 'none',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  {activatingChip ? (isRtl ? 'جاري الإلغاء...' : 'Cancelling...') : (isRtl ? 'إلغاء التفعيل' : 'Deactivate')}
                </button>
              </div>
            ) : (
              <button
                onClick={handleActivateTripleCaptain}
                disabled={activatingChip}
                style={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                  color: '#ffffff',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontWeight: 900,
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  marginTop: '6px',
                  fontSize: '0.85rem',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)',
                }}
              >
                {activatingChip ? (isRtl ? 'جاري التفعيل...' : 'Activating...') : (isRtl ? 'تفعيل تريبل كابتن (3x)' : 'Play Triple Captain (3x)')}
              </button>
            )}
            <div className="widget-sub-label" style={{ marginTop: '4px' }}>
              {isTripleCaptainActive
                ? (isRtl ? 'محفوظة ومفعلة للجولة' : 'Saved & Active for GW')
                : (isRtl ? 'اضغط لتفعيل الخاصية' : 'Click to activate')}
            </div>
          </div>

          {/* Card 2 (الوسط - Center Featured): قيمة التشكيلة */}
          <div className="fpl-widget-card featured">
            <div className="widget-label">{isRtl ? 'قيمة التشكيلة' : 'Squad Value'}</div>
            <div className="widget-num">£{((squad.reduce((sum, p) => sum + (p.nowCost || 50), 0)) / 10).toFixed(1)}m</div>
            <div className="widget-sub-label">{isRtl ? 'إجمالي قيمة لاعبي التشكيلة' : 'Total squad value'}</div>
          </div>

          {/* Card 3 (اليسار - Left): ترتيب الجولة بين جميع المشاركين */}
          <div className="fpl-widget-card">
            <div className="widget-label">{isRtl ? 'ترتيب الجولة' : 'GW Rank'}</div>
            <div className="widget-badge purple">
              #{user?.rank || 1}
            </div>
            <div className="widget-sub-label" style={{ marginTop: '4px' }}>
              {isRtl ? 'ترتيبك بين جميع المشاركين' : 'Rank among all users'}
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
            gw={gw}
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
        </div>
      </div>

      <GoogleAd adSlot="1122334455" />

      {activePlayerModal && (
        <PlayerDetailModal player={activePlayerModal} onClose={() => setActivePlayerModal(null)} />
      )}
    </div>
  );
};
