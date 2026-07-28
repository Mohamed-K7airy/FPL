import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { PitchView, SquadSlotItem } from '../components/PitchView';
import { PlayerDetailModal, PlayerDetailData } from '../components/PlayerDetailModal';
import { GoogleAd } from '../components/GoogleAd';
import { Search, Sparkles, RotateCcw, Trash2, CheckCircle2, Info, ChevronLeft, ChevronRight, Eye, EyeOff, Bot, Headset, GitCompare } from 'lucide-react';

const SLOT_POSITIONS: Record<number, 1 | 2 | 3 | 4> = {
  1: 1,
  2: 2, 3: 2, 4: 2, 5: 2,
  6: 3, 7: 3, 8: 3, 9: 3,
  10: 4, 11: 4,
  12: 1,
  13: 2,
  14: 3,
  15: 4,
};

export const TransfersPage: React.FC = () => {
  const { refreshUser } = useAuth();
  const { t, isRtl } = useLanguage();

  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState<number | undefined>(undefined);
  const [sort, setSort] = useState('total_points');
  const [activePlayerModal, setActivePlayerModal] = useState<PlayerDetailData | null>(null);

  const [gw, setGw] = useState(1);
  const [hideFixtures, setHideFixtures] = useState(false);

  const [squadSlots, setSquadSlots] = useState<Record<number, any | null>>({
    1: null, 2: null, 3: null, 4: null, 5: null,
    6: null, 7: null, 8: null, 9: null, 10: null, 11: null,
    12: null, 13: null, 14: null, 15: null,
  });

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchExistingSquad = async () => {
    try {
      const data = await apiFetch<{ squad: any[]; squadComplete: boolean }>('/squad');
      if (data.squadComplete && data.squad.length === 15) {
        const newSlots: Record<number, any> = { ...squadSlots };
        data.squad.forEach((item) => {
          newSlots[item.slot] = {
            id: item.player_id,
            web_name: item.players.web_name,
            full_name: item.players.full_name,
            position: item.players.position,
            fpl_teams: item.players.fpl_teams,
            now_cost: item.players.now_cost,
            total_points: item.players.total_points,
            isCaptain: item.is_captain,
            isVice: item.is_vice,
          };
        });
        setSquadSlots(newSlots);
      }
    } catch {
      // User has no squad yet
    }
  };

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (positionFilter) params.append('position', positionFilter.toString());
      params.append('sort', sort);
      params.append('limit', '100');

      const data = await apiFetch<{ players: any[] }>(`/players?${params.toString()}`);
      setPlayers(data.players || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExistingSquad();
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [search, positionFilter, sort]);

  const filledSlots = Object.values(squadSlots).filter((p) => p !== null);
  const totalCost = filledSlots.reduce((sum, p) => sum + p.now_cost, 0);

  // Calculate team rating out of 100 based on selected squad total points
  const teamRating = Math.min(100, Math.round((filledSlots.reduce((acc, p) => acc + (p.total_points || 0), 0) / 15) * 1.2));

  const handleAddOrTogglePlayer = (player: any) => {
    const existingSlotEntry = Object.entries(squadSlots).find(([_, p]) => p && p.id === player.id);
    if (existingSlotEntry) {
      const slotNum = parseInt(existingSlotEntry[0], 10);
      setSquadSlots((prev) => ({ ...prev, [slotNum]: null }));
      return;
    }

    let targetSlot = selectedSlot;

    if (!targetSlot || SLOT_POSITIONS[targetSlot] !== player.position || squadSlots[targetSlot] !== null) {
      const emptySlotStr = Object.keys(SLOT_POSITIONS).find(
        (s) => SLOT_POSITIONS[parseInt(s, 10)] === player.position && squadSlots[parseInt(s, 10)] === null
      );

      if (!emptySlotStr) {
        const posName = player.position === 1 ? t('goalkeepers') : player.position === 2 ? t('defenders') : player.position === 3 ? t('midfielders') : t('forwards');
        setMessage({ type: 'error', text: `${posName} full.` });
        return;
      }
      targetSlot = parseInt(emptySlotStr, 10);
    }

    setSquadSlots((prev) => ({
      ...prev,
      [targetSlot!]: {
        id: player.id,
        web_name: player.web_name,
        full_name: player.full_name,
        position: player.position,
        fpl_teams: player.fpl_teams,
        now_cost: player.now_cost,
        total_points: player.total_points,
        isCaptain: targetSlot === 10,
        isVice: targetSlot === 11,
      },
    }));

    setSelectedSlot(null);
  };

  const handleAutoPick = async () => {
    try {
      const allPlayersData = await apiFetch<{ players: any[] }>('/players?limit=300&sort=total_points');
      const allP = allPlayersData.players || [];

      const gkps = allP.filter((p) => p.position === 1).slice(0, 2);
      const defs = allP.filter((p) => p.position === 2).slice(0, 5);
      const mids = allP.filter((p) => p.position === 3).slice(0, 5);
      const fwds = allP.filter((p) => p.position === 4).slice(0, 3);

      if (gkps.length < 2 || defs.length < 5 || mids.length < 5 || fwds.length < 3) {
        setMessage({ type: 'error', text: 'Not enough players to auto pick.' });
        return;
      }

      const newSlots: Record<number, any> = {
        1: { ...gkps[0], isCaptain: false, isVice: false },
        2: { ...defs[0], isCaptain: false, isVice: false },
        3: { ...defs[1], isCaptain: false, isVice: false },
        4: { ...defs[2], isCaptain: false, isVice: false },
        5: { ...defs[3], isCaptain: false, isVice: false },
        6: { ...mids[0], isCaptain: false, isVice: false },
        7: { ...mids[1], isCaptain: false, isVice: false },
        8: { ...mids[2], isCaptain: false, isVice: false },
        9: { ...mids[3], isCaptain: false, isVice: false },
        10: { ...fwds[0], isCaptain: true, isVice: false },
        11: { ...fwds[1], isCaptain: false, isVice: true },
        12: { ...gkps[1], isCaptain: false, isVice: false },
        13: { ...defs[4], isCaptain: false, isVice: false },
        14: { ...mids[4], isCaptain: false, isVice: false },
        15: { ...fwds[2], isCaptain: false, isVice: false },
      };

      setSquadSlots(newSlots);
      setMessage({ type: 'success', text: isRtl ? 'تم اختيار التشكيلة بالذكاء الاصطناعي بنجاح!' : 'Auto Picked squad successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message });
    }
  };

  const handleClearSquad = () => {
    setSquadSlots({
      1: null, 2: null, 3: null, 4: null, 5: null,
      6: null, 7: null, 8: null, 9: null, 10: null, 11: null,
      12: null, 13: null, 14: null, 15: null,
    });
  };

  const handleRemoveSlot = (slot: number) => {
    setSquadSlots((prev) => ({ ...prev, [slot]: null }));
  };

  const handleEmptySlotClick = (position: 1 | 2 | 3 | 4, slot: number) => {
    setSelectedSlot(slot);
    setPositionFilter(position);
  };

  const handlePitchSlotClick = (slot: number) => {
    setSelectedSlot(slot);
    const player = squadSlots[slot];
    if (player) {
      setPositionFilter(player.position);
    }
  };

  const handleReset = () => {
    setSearch('');
    setPositionFilter(undefined);
    setSort('total_points');
  };

  const handleConfirmSquad = async () => {
    if (filledSlots.length !== 15) {
      setMessage({ type: 'error', text: isRtl ? 'اختر 15 لاعباً قبل الحفظ (حارسان، 5 مدافعين، 5 وسط، 3 مهاجمين).' : 'Select 15 players (2 GKP, 5 DEF, 5 MID, 3 FWD).' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const picks = Object.entries(squadSlots).map(([slotStr, p]) => ({
        playerId: p.id,
        slot: parseInt(slotStr, 10),
        isCaptain: p.isCaptain || parseInt(slotStr, 10) === 10,
        isVice: p.isVice || parseInt(slotStr, 10) === 11,
      }));

      await apiFetch('/squad', {
        method: 'POST',
        body: JSON.stringify({ picks }),
      });

      await refreshUser();
      setMessage({ type: 'success', text: isRtl ? 'تم إنشاء وحفظ الفريق بنجاح!' : 'Team selection confirmed & saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message });
    } finally {
      setSubmitting(false);
    }
  };

  const pitchPicks: SquadSlotItem[] = Object.keys(SLOT_POSITIONS).map((slotStr) => {
    const slot = parseInt(slotStr, 10);
    const p = squadSlots[slot];
    const defaultPos = SLOT_POSITIONS[slot];

    if (!p) {
      return {
        slot,
        position: defaultPos,
        isEmpty: true,
      };
    }

    return {
      playerId: p.id,
      webName: p.web_name,
      position: p.position,
      teamShortName: p.fpl_teams?.short_name || 'FPL',
      nowCost: p.now_cost,
      slot,
      isCaptain: Boolean(p.isCaptain),
      isVice: Boolean(p.isVice),
      isEmpty: false,
      fullData: {
        id: p.id,
        web_name: p.web_name,
        full_name: p.full_name,
        position: p.position,
        teamName: p.fpl_teams?.name,
        teamShort: p.fpl_teams?.short_name,
        now_cost: p.now_cost,
        total_points: p.total_points || 0,
      },
    };
  });

  return (
    <div className="fpl-transfers-page">
      {message && (
        <div
          style={{
            padding: '12px 16px',
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

      <div className="fpl-official-grid">
        {/* Left Drawer: Player Selection */}
        <div className="fpl-drawer-col">
          <div className="fpl-drawer-card">
            <h2 className="fpl-section-title">{t('playerSelection')}</h2>
            <p className="fpl-section-sub">
              {isRtl ? 'اختر 15 لاعباً بميزانية £100.0m كحد أقصى (3 لاعبين لكل فريق).' : 'Select 15 players under £100.0m budget limit.'}
            </p>

            <div className="fpl-search-box">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder={t('searchByName')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="fpl-search-input"
              />
            </div>

            <div className="fpl-filter-row">
              <select
                value={positionFilter || ''}
                onChange={(e) => setPositionFilter(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                className="fpl-filter-pill"
              >
                <option value="">{t('allPlayers')}</option>
                <option value="1">{t('goalkeepers')}</option>
                <option value="2">{t('defenders')}</option>
                <option value="3">{t('midfielders')}</option>
                <option value="4">{t('forwards')}</option>
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="fpl-filter-pill"
              >
                <option value="total_points">{t('sortByPoints')}</option>
                <option value="price">{t('sortByPrice')}</option>
                <option value="name">{t('sortByName')}</option>
              </select>

              <button onClick={handleReset} className="fpl-filter-pill reset" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <RotateCcw size={12} />
                <span>{t('reset')}</span>
              </button>
            </div>

            <div className="fpl-count-banner">
              {players.length} {isRtl ? 'لاعب معروض' : 'players shown'}
            </div>

            {/* Player List */}
            <div className="fpl-player-list">
              <table className="fpl-table">
                <thead>
                  <tr>
                    <th style={{ width: '24px' }}></th>
                    <th>{isRtl ? 'اللاعب' : 'Player'}</th>
                    <th style={{ textAlign: 'right' }}>{isRtl ? 'السعر' : 'Price'}</th>
                    <th style={{ textAlign: 'right' }}>{isRtl ? 'النقاط' : 'TP'}</th>
                    <th style={{ textAlign: 'center', width: '36px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                        {t('loading')}
                      </td>
                    </tr>
                  ) : (
                    players.map((p) => {
                      const isSelected = Object.values(squadSlots).some((sp) => sp && sp.id === p.id);
                      return (
                        <tr key={p.id} className={isSelected ? 'selected-row' : ''}>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              onClick={() =>
                                setActivePlayerModal({
                                  id: p.id,
                                  web_name: p.web_name,
                                  full_name: p.full_name,
                                  position: p.position,
                                  teamName: p.fpl_teams?.name,
                                  teamShort: p.fpl_teams?.short_name,
                                  now_cost: p.now_cost,
                                  total_points: p.total_points,
                                  form: p.form,
                                  news: p.news,
                                })
                              }
                              style={{
                                background: '#f1f5f9',
                                color: 'var(--fpl-cyan)',
                                border: '1px solid #cbd5e1',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                              }}
                            >
                              <Info size={12} />
                            </button>
                          </td>
                          <td>
                            <div className="player-row-info">
                              <span className="player-name">{p.web_name}</span>
                              <span className="player-team">{p.fpl_teams?.name}</span>
                            </div>
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 700 }}>
                            £{(p.now_cost / 10).toFixed(1)}m
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--fpl-green)' }}>
                            {p.total_points}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              onClick={() => handleAddOrTogglePlayer(p)}
                              className={`circle-action-btn ${isSelected ? 'remove' : 'add'}`}
                            >
                              {isSelected ? '×' : '+'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Panel: Pitch & Top Stats Widgets matching FantasyProManager */}
        <div className="fpl-pitch-panel-col">
          {/* Top Gradient Container Wrapper */}
          <div className="fpl-pitch-master-card">
            {/* Top Bar Navigation (السابق / الجولة 1 / التالي + Checkbox) */}
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

            {/* Top 3 Stat Cards Widget Row (اللاعبون المختارون / الميزانية / تقييم الفريق) */}
            <div className="fpl-top-widgets-row">
              {/* Widget 1: Selected Players */}
              <div className="fpl-widget-card">
                <div className="widget-label">{isRtl ? 'اللاعبون المختارون' : 'Players Selected'}</div>
                <div className="widget-badge purple">
                  {filledSlots.length} / 15
                </div>
              </div>

              {/* Widget 2: Budget */}
              <div className="fpl-widget-card featured">
                <div className="widget-label">{isRtl ? 'الميزانية' : 'Budget'}</div>
                <div className="widget-num">£{((1000 - totalCost) / 10).toFixed(1)}</div>
                <div className="widget-sub-label">{isRtl ? 'إدخال الميزانية' : 'Edit Budget'}</div>
              </div>

              {/* Widget 3: Team Rating */}
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
                picks={pitchPicks}
                selectedSlot={selectedSlot}
                onSlotClick={handlePitchSlotClick}
                onEmptySlotClick={handleEmptySlotClick}
                onRemovePlayer={handleRemoveSlot}
                onPlayerInfoClick={(pData) => setActivePlayerModal(pData)}
                hideFixtures={hideFixtures}
              />
            </div>

            {/* Floating Action Control Bar matching FantasyProManager bottom bar */}
            <div className="fpl-bottom-toolbar-container">
              {/* Primary Emerald Button: Create Team */}
              <button
                onClick={handleConfirmSquad}
                disabled={submitting || filledSlots.length !== 15}
                className="fpl-main-submit-emerald-btn"
              >
                <CheckCircle2 size={18} />
                <span>{submitting ? t('submitting') : (isRtl ? 'إنشاء فريق' : 'Create Squad')}</span>
              </button>

              {/* Toolbar Secondary Actions */}
              <div className="fpl-toolbar-actions-row">
                <button className="fpl-tool-btn gray">
                  <GitCompare size={16} />
                  <span>{isRtl ? 'مقارنة الفرق' : 'Compare Teams'}</span>
                </button>

                <button onClick={handleAutoPick} className="fpl-tool-btn cyan">
                  <Headset size={16} />
                  <span>{isRtl ? 'استشارة خبير' : 'Expert Advice'}</span>
                </button>

                <button onClick={handleAutoPick} className="fpl-tool-btn purple">
                  <Bot size={16} />
                  <span>{isRtl ? 'تغييرات بالذكاء الاصطناعي' : 'AI Smart Transfers'}</span>
                </button>
              </div>
            </div>
          </div>

          <GoogleAd adSlot="5566778899" />
        </div>
      </div>

      {activePlayerModal && (
        <PlayerDetailModal player={activePlayerModal} onClose={() => setActivePlayerModal(null)} />
      )}
    </div>
  );
};
