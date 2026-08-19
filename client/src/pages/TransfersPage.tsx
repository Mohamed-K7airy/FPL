import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { PitchView, SquadSlotItem } from '../components/PitchView';
import { PlayerDetailModal, PlayerDetailData } from '../components/PlayerDetailModal';
import { GoogleAd } from '../components/GoogleAd';
import { Search, RotateCcw, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const SLOT_POSITIONS: Record<number, 1 | 2 | 3 | 4> = {
  1: 1,
  2: 2,
  3: 3,
  4: 3,
  5: 4,
};

export const TransfersPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
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
  });

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [isMobilePickerOpen, setIsMobilePickerOpen] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [hasExistingSquad, setHasExistingSquad] = useState(false);
  const [originalSquad, setOriginalSquad] = useState<Record<number, any>>({});

  const fetchExistingSquad = async () => {
    try {
      const data = await apiFetch<{ squad: any[]; squadComplete: boolean }>('/squad');
      if (data.squad && data.squad.length > 0) {
        setHasExistingSquad(true);
        const newSlots: Record<number, any> = { 1: null, 2: null, 3: null, 4: null, 5: null };
        const savedMap: Record<number, any> = {};

        data.squad.slice(0, 5).forEach((item) => {
          const formattedPlayer = {
            id: item.player_id,
            web_name: item.players?.web_name || 'Player',
            full_name: item.players?.full_name || 'Player',
            position: item.players?.position || 2,
            fpl_teams: item.players?.fpl_teams,
            now_cost: item.players?.now_cost || 50,
            total_points: item.players?.total_points || 0,
            isCaptain: Boolean(item.is_captain),
            isVice: Boolean(item.is_vice),
          };
          newSlots[item.slot] = formattedPlayer;
          savedMap[item.slot] = formattedPlayer;
        });

        setSquadSlots(newSlots);
        setOriginalSquad(savedMap);
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

  const [usedChips, setUsedChips] = useState<string[]>([]);
  const [activatingChip, setActivatingChip] = useState(false);

  const fetchChips = async () => {
    try {
      const data = await apiFetch<{ usedChips: any[] }>('/chips');
      const chipsList = (data.usedChips || []).map((c) => c.chip);
      setUsedChips(chipsList);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    fetchExistingSquad();
    fetchChips();
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [search, positionFilter, sort]);

  const isWildcardActive = usedChips.includes('wildcard');
  const isFreeHitActive = usedChips.includes('freehit');

  const handleActivateChip = async (chipKey: 'wildcard' | 'freehit') => {
    setActivatingChip(true);
    try {
      await apiFetch('/chips/activate', {
        method: 'POST',
        body: JSON.stringify({ chip: chipKey }),
      });
      await fetchChips();
      setMessage({
        type: 'success',
        text: isRtl
          ? `تم تفعيل خاصية ${chipKey === 'wildcard' ? 'الوايلد كارد' : 'الفري هيت'} بنجاح وحفظها في الحساب!`
          : `Activated ${chipKey} chip successfully!`,
      });
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message });
    } finally {
      setActivatingChip(false);
    }
  };

  const handleDeactivateChip = async (chipKey: 'wildcard' | 'freehit') => {
    setActivatingChip(true);
    try {
      await apiFetch('/chips/deactivate', {
        method: 'POST',
        body: JSON.stringify({ chip: chipKey }),
      });
      await fetchChips();
      setMessage({
        type: 'success',
        text: isRtl
          ? `تم إلغاء تفعيل خاصية ${chipKey === 'wildcard' ? 'الوايلد كارد' : 'الفري هيت'} بنجاح!`
          : `Deactivated ${chipKey} chip successfully!`,
      });
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

  const filledSlots = Object.values(squadSlots).filter((p) => p !== null);
  const totalCost = filledSlots.reduce((sum, p) => sum + p.now_cost, 0);
  const totalSquadPoints = filledSlots.reduce((sum, p) => sum + (p.total_points || 0), 0);

  const handleAddOrTogglePlayer = (player: any) => {
    const existingSlotEntry = Object.entries(squadSlots).find(([_, p]) => p && p.id === player.id);
    if (existingSlotEntry) {
      const slotNum = parseInt(existingSlotEntry[0], 10);
      setSquadSlots((prev) => ({ ...prev, [slotNum]: null }));
      return;
    }

    let targetSlot = selectedSlot;

    // Helper: Goalkeeper must go to slot 1, outfielders (2,3,4) can go to empty slots 2..5
    if (player.position === 1) {
      if (squadSlots[1] !== null && selectedSlot !== 1) {
        setMessage({ type: 'error', text: isRtl ? 'حارس المرمى ممتلئ.' : 'Goalkeeper slot full.' });
        return;
      }
      targetSlot = 1;
    } else {
      // Outfielder
      if (!targetSlot || targetSlot === 1 || squadSlots[targetSlot] !== null) {
        const emptyOutfieldSlot = [2, 3, 4, 5].find((s) => squadSlots[s] === null);
        if (!emptyOutfieldSlot) {
          setMessage({ type: 'error', text: isRtl ? 'مراكز اللاعبين ممتلئة (4 لاعبين كحد أقصى).' : 'Outfield slots full (4 players max).' });
          return;
        }
        targetSlot = emptyOutfieldSlot;
      }
    }

    const currentFilledCount = Object.values(squadSlots).filter((p) => p !== null).length;
    const isFirstPlayer = currentFilledCount === 0;
    const isSecondPlayer = currentFilledCount === 1;

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
        isCaptain: isFirstPlayer,
        isVice: isSecondPlayer,
      },
    }));

    setSelectedSlot(null);
    setIsMobilePickerOpen(false);
  };

  const handleAutoPick = async () => {
    try {
      const allPlayersData = await apiFetch<{ players: any[] }>('/players?limit=300&sort=total_points');
      const allP = allPlayersData.players || [];

      const gkps = allP.filter((p) => p.position === 1).slice(0, 1);
      const outfielders = allP.filter((p) => p.position !== 1).slice(0, 4);

      if (gkps.length < 1 || outfielders.length < 4) {
        setMessage({ type: 'error', text: 'Not enough players to auto pick.' });
        return;
      }

      const newSlots: Record<number, any> = {
        1: { ...gkps[0], isCaptain: false, isVice: false },
        2: { ...outfielders[0], isCaptain: false, isVice: false },
        3: { ...outfielders[1], isCaptain: false, isVice: false },
        4: { ...outfielders[2], isCaptain: true, isVice: false },
        5: { ...outfielders[3], isCaptain: false, isVice: true },
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
    });
  };

  const handleRemoveSlot = (slot: number) => {
    setSquadSlots((prev) => ({ ...prev, [slot]: null }));
  };

  const handleEmptySlotClick = (position: 1 | 2 | 3 | 4, slot: number) => {
    setSelectedSlot(slot);
    setPositionFilter(position);
    setIsMobilePickerOpen(true);
  };

  const handlePitchSlotClick = (slot: number) => {
    setSelectedSlot(slot);
    const player = squadSlots[slot];
    if (player) {
      setPositionFilter(player.position);
    }
    setIsMobilePickerOpen(true);
  };

  const handleReset = () => {
    setSearch('');
    setPositionFilter(undefined);
    setSort('total_points');
  };

  const handleConfirmSquad = async () => {
    if (filledSlots.length !== 5) {
      setMessage({ type: 'error', text: isRtl ? 'اختر 5 لاعبين قبل الحفظ (حارس مرمى و 4 لاعبين).' : 'Select 5 players (1 GKP and 4 outfield players).' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      let captainSlot = Object.keys(squadSlots).find((s) => squadSlots[parseInt(s, 10)]?.isCaptain);
      let viceSlot = Object.keys(squadSlots).find((s) => squadSlots[parseInt(s, 10)]?.isVice);

      // Ensure Captain and Vice-Captain are assigned and distinct
      if (!captainSlot) {
        captainSlot = '1';
      }
      if (!viceSlot || viceSlot === captainSlot) {
        viceSlot = Object.keys(squadSlots).find((s) => s !== captainSlot) || '2';
      }

      const picks = Object.entries(squadSlots).map(([slotStr, p]) => ({
        playerId: p.id,
        slot: parseInt(slotStr, 10),
        isCaptain: slotStr === captainSlot,
        isVice: slotStr === viceSlot,
      }));

      await apiFetch('/squad', {
        method: 'POST',
        body: JSON.stringify({ picks }),
      });

      await refreshUser();
      await fetchExistingSquad();
      setMessage({ type: 'success', text: isRtl ? 'تم حفظ التشكيلة وتعيين الكابتن بنجاح!' : 'Team changes & squad saved successfully!' });
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

      <div className="fpl-official-grid">
        {/* Left Drawer: Player Selection */}
        <div className="fpl-drawer-col">
          <div className="fpl-drawer-card">
            <h2 className="fpl-section-title">{t('playerSelection')}</h2>
            <p className="fpl-section-sub">
              {isRtl ? 'اختر 5 لاعبين (حارس و 4 لاعبين) بميزانية £50.0m كحد أقصى.' : 'Select 5 players under £50.0m budget limit.'}
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
            {/* Top Bar Navigation (السابق / الجولة 1 / التالي) */}
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

            {/* Official FPL Transfers Stat Cards Row (خواص الانتقالات / الميزانية المتبقية / اللاعبون المختارون) */}
            <div className="fpl-top-widgets-row">
              {/* Widget 1: Transfers Chips (Wildcard & Free Hit) */}
              <div className="fpl-widget-card">
                <div className="widget-label">{isRtl ? 'الخواص المتاحة (Chips)' : 'Chips Available'}</div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px', width: '100%' }}>
                  {isWildcardActive ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ background: '#10b981', color: '#ffffff', padding: '4px 2px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 900, textAlign: 'center' }}>
                        {isRtl ? 'وايلد كارد (مفعل)' : 'Wildcard (Active)'}
                      </div>
                      <button
                        onClick={() => handleDeactivateChip('wildcard')}
                        disabled={activatingChip}
                        style={{ background: '#e11d48', color: '#ffffff', border: 'none', padding: '3px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 800, cursor: 'pointer' }}
                      >
                        {isRtl ? 'إلغاء' : 'Cancel'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleActivateChip('wildcard')}
                      disabled={activatingChip}
                      style={{ flex: 1, background: '#1e1b4b', color: '#38bdf8', border: '1px solid #38bdf8', padding: '6px 4px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 900, cursor: 'pointer' }}
                    >
                      {isRtl ? 'تفعيل وايلد كارد' : 'Activate Wildcard'}
                    </button>
                  )}

                  {isFreeHitActive ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ background: '#10b981', color: '#ffffff', padding: '4px 2px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 900, textAlign: 'center' }}>
                        {isRtl ? 'فري هيت (مفعل)' : 'Free Hit (Active)'}
                      </div>
                      <button
                        onClick={() => handleDeactivateChip('freehit')}
                        disabled={activatingChip}
                        style={{ background: '#e11d48', color: '#ffffff', border: 'none', padding: '3px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 800, cursor: 'pointer' }}
                      >
                        {isRtl ? 'إلغاء' : 'Cancel'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleActivateChip('freehit')}
                      disabled={activatingChip}
                      style={{ flex: 1, background: '#1e1b4b', color: '#ec4899', border: '1px solid #ec4899', padding: '6px 4px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 900, cursor: 'pointer' }}
                    >
                      {isRtl ? 'تفعيل فري هيت' : 'Activate Free Hit'}
                    </button>
                  )}
                </div>
              </div>

              {/* Widget 2: Remaining Budget */}
              <div className="fpl-widget-card featured">
                <div className="widget-label">{isRtl ? 'الميزانية المتبقية' : 'Remaining Budget'}</div>
                <div className="widget-num">£{((500 - totalCost) / 10).toFixed(1)}m</div>
                <div className="widget-sub-label">{isRtl ? 'الميزانية الكلية: £50.0m' : 'Total Budget: £50.0m'}</div>
              </div>

              {/* Widget 3: Available Transfers (التغييرات المتاحة حالياً) */}
              <div className="fpl-widget-card">
                <div className="widget-label">{isRtl ? 'التغييرات المتاحة' : 'Transfers Available'}</div>
                <div className="widget-badge purple" style={{ fontSize: (gw === 1 || isWildcardActive || isFreeHitActive || !hasExistingSquad) ? '0.88rem' : '1.05rem' }}>
                  {(gw === 1 || isWildcardActive || isFreeHitActive || !hasExistingSquad)
                    ? (isRtl ? 'غير محدود' : 'Unlimited')
                    : ((user?.free_transfers ?? 1) > 0 ? (isRtl ? `${user?.free_transfers ?? 1} نقلة مجانية` : `${user?.free_transfers ?? 1} Free`) : (isRtl ? '0 نقلة' : '0 Free'))}
                </div>
                <div className="widget-sub-label" style={{ marginTop: '4px', fontSize: '0.7rem' }}>
                  {(gw === 1 || !hasExistingSquad)
                    ? (isRtl ? 'انتقالات غير محدودة قبل الجولة 1' : 'Unlimited before GW1')
                    : (isWildcardActive || isFreeHitActive)
                      ? (isRtl ? 'خاصية مفعلة - بدون خصم نقاط' : 'Chip Active - 0 pts hit')
                      : ((user?.free_transfers ?? 1) > 0)
                        ? (isRtl ? 'نقلة مجانية متاحة للجولة' : 'Free transfer available')
                        : (isRtl ? 'خصم 4 نقاط لكل نقلة إضافية' : '-4 pts hit per extra transfer')}
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
                gw={gw}
              />
            </div>

            {/* Floating Action Control Bar */}
            <div className="fpl-bottom-toolbar-container">
              {/* Primary Emerald Button: Create Team */}
              <button
                onClick={handleConfirmSquad}
                disabled={submitting || filledSlots.length !== 5}
                className="fpl-main-submit-emerald-btn"
              >
                <CheckCircle2 size={18} />
                <span>{submitting ? t('submitting') : (hasExistingSquad ? (isRtl ? 'تأكيد وحفظ الانتقالات' : 'Save Transfers') : (isRtl ? 'إنشاء فريق' : 'Create Squad'))}</span>
              </button>
            </div>
          </div>

          <GoogleAd adSlot="5566778899" />
        </div>
      </div>

      {activePlayerModal && (
        <PlayerDetailModal player={activePlayerModal} onClose={() => setActivePlayerModal(null)} />
      )}

      {/* Mobile Pop-up Player Picker Sheet / Modal */}
      {isMobilePickerOpen && (
        <div className="fpl-mobile-picker-overlay" onClick={() => setIsMobilePickerOpen(false)}>
          <div className="fpl-mobile-picker-sheet" onClick={(e) => e.stopPropagation()}>
            {/* Top Drag Handle */}
            <div className="fpl-sheet-drag-handle" />

            {/* Header */}
            <div className="fpl-sheet-header">
              <div>
                <div className="fpl-sheet-title">
                  {selectedSlot === 1
                    ? (isRtl ? 'اختر حارس المرمى (GKP)' : 'Select Goalkeeper (GKP)')
                    : selectedSlot === 2
                    ? (isRtl ? 'اختر المدافع (DEF)' : 'Select Defender (DEF)')
                    : selectedSlot === 3 || selectedSlot === 4
                    ? (isRtl ? 'اختر لاعب الوسط (MID)' : 'Select Midfielder (MID)')
                    : selectedSlot === 5
                    ? (isRtl ? 'اختر المهاجم (FWD)' : 'Select Forward (FWD)')
                    : (isRtl ? 'اختر لاعباً لتشكيلتك' : 'Select a Player')}
                </div>
                <div className="fpl-sheet-sub">
                  {isRtl
                    ? `الميزانية المتبقية: £${((500 - totalCost) / 10).toFixed(1)}m`
                    : `Remaining Budget: £${((500 - totalCost) / 10).toFixed(1)}m`}
                </div>
              </div>
              <button className="fpl-sheet-close-btn" onClick={() => setIsMobilePickerOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Search Input */}
            <div className="fpl-search-box" style={{ margin: '14px 0 10px 0' }}>
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder={t('searchByName')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="fpl-search-input"
              />
            </div>

            {/* Filter Row */}
            <div className="fpl-filter-row" style={{ marginBottom: '12px' }}>
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

            {/* Scrollable Player List */}
            <div className="fpl-player-list" style={{ maxHeight: '55vh', overflowY: 'auto' }}>
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
                        <tr
                          key={p.id}
                          className={`fpl-table-row ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleAddOrTogglePlayer(p)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td>
                            <button
                              className="fpl-table-info-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActivePlayerModal({
                                  id: p.id,
                                  web_name: p.web_name,
                                  full_name: p.full_name,
                                  position: p.position,
                                  teamShort: p.fpl_teams?.short_name || 'FPL',
                                  teamName: p.fpl_teams?.name || 'Premier League',
                                  now_cost: p.now_cost,
                                  total_points: p.total_points || 0,
                                  goals: p.goals || p.goals_scored || 0,
                                  assists: p.assists || 0,
                                  clean_sheets: p.clean_sheets || 0,
                                  bonus: p.bonus || 0,
                                  form: p.form || '0.0',
                                });
                              }}
                            >
                              <Info size={14} />
                            </button>
                          </td>
                          <td>
                            <div className="fpl-table-player-name">{p.web_name}</div>
                            <div className="fpl-table-team-name">{p.fpl_teams?.name || 'Premier League'}</div>
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 800 }}>
                            £{(p.now_cost / 10).toFixed(1)}m
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 900, color: 'var(--fpl-cyan)' }}>
                            {p.total_points || 0}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              className={`fpl-table-action-btn ${isSelected ? 'remove' : 'add'}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddOrTogglePlayer(p);
                              }}
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
      )}
    </div>
  );
};
