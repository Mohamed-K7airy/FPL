import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PlayerDetailData } from './PlayerDetailModal';
import { ArrowUpDown, Crown, Shield, Info, X } from 'lucide-react';

export interface SquadSlotItem {
  playerId?: number;
  webName?: string;
  position: 1 | 2 | 3 | 4; // 1 GKP, 2 DEF, 3 MID, 4 FWD
  teamShortName?: string;
  nowCost?: number;
  slot: number;
  isCaptain?: boolean;
  isVice?: boolean;
  points?: number;
  autoSubbed?: boolean;
  fixtureInfo?: string;
  isEmpty?: boolean;
  code?: number;
  fullData?: PlayerDetailData;
}

interface PitchViewProps {
  picks: SquadSlotItem[];
  selectedSlot: number | null;
  onSlotClick: (slot: number) => void;
  onEmptySlotClick?: (position: 1 | 2 | 3 | 4, slot: number) => void;
  onRemovePlayer?: (slot: number) => void;
  onSetCaptain?: (slot: number) => void;
  onSetVice?: (slot: number) => void;
  onPlayerInfoClick?: (player: PlayerDetailData) => void;
  readOnly?: boolean;
  hideFixtures?: boolean;
  benchChips?: {
    benchBoostUsed?: boolean;
    tripleCaptainUsed?: boolean;
    onToggleBenchBoost?: () => void;
    onToggleTripleCaptain?: () => void;
  };
}

/* Premier League Official Team Fixtures & FDR Mapping */
const TEAM_SCHEDULES: Record<string, { next: string; fixtures: { opp: string; diff: number }[] }> = {
  ARS: { next: 'WOL (H)', fixtures: [{ opp: 'WOL', diff: 2 }, { opp: 'AVL', diff: 3 }, { opp: 'BHA', diff: 3 }, { opp: 'TOT', diff: 4 }, { opp: 'MCI', diff: 5 }] },
  MCI: { next: 'CHE (A)', fixtures: [{ opp: 'CHE', diff: 4 }, { opp: 'IPS', diff: 2 }, { opp: 'WHU', diff: 2 }, { opp: 'BRE', diff: 2 }, { opp: 'ARS', diff: 5 }] },
  LIV: { next: 'IPS (A)', fixtures: [{ opp: 'IPS', diff: 2 }, { opp: 'BRE', diff: 2 }, { opp: 'MUN', diff: 4 }, { opp: 'NFO', diff: 2 }, { opp: 'BOU', diff: 2 }] },
  CHE: { next: 'MCI (H)', fixtures: [{ opp: 'MCI', diff: 5 }, { opp: 'WOL', diff: 2 }, { opp: 'CRY', diff: 3 }, { opp: 'BOU', diff: 2 }, { opp: 'WHU', diff: 3 }] },
  MUN: { next: 'FUL (H)', fixtures: [{ opp: 'FUL', diff: 2 }, { opp: 'BHA', diff: 3 }, { opp: 'LIV', diff: 5 }, { opp: 'SOU', diff: 2 }, { opp: 'CRY', diff: 3 }] },
  TOT: { next: 'LEI (A)', fixtures: [{ opp: 'LEI', diff: 2 }, { opp: 'EVE', diff: 2 }, { opp: 'NEW', diff: 4 }, { opp: 'ARS', diff: 5 }, { opp: 'BRE', diff: 2 }] },
  NEW: { next: 'SOU (H)', fixtures: [{ opp: 'SOU', diff: 2 }, { opp: 'BOU', diff: 2 }, { opp: 'TOT', diff: 4 }, { opp: 'WOL', diff: 2 }, { opp: 'FUL', diff: 2 }] },
  AVL: { next: 'WHU (A)', fixtures: [{ opp: 'WHU', diff: 3 }, { opp: 'ARS', diff: 5 }, { opp: 'LEI', diff: 2 }, { opp: 'EVE', diff: 2 }, { opp: 'WOL', diff: 2 }] },
  BOU: { next: 'NFO (A)', fixtures: [{ opp: 'NFO', diff: 2 }, { opp: 'NEW', diff: 4 }, { opp: 'EVE', diff: 2 }, { opp: 'CHE', diff: 4 }, { opp: 'LIV', diff: 5 }] },
  BRE: { next: 'CRY (H)', fixtures: [{ opp: 'CRY', diff: 3 }, { opp: 'LIV', diff: 5 }, { opp: 'SOU', diff: 2 }, { opp: 'MCI', diff: 5 }, { opp: 'TOT', diff: 4 }] },
  BHA: { next: 'EVE (A)', fixtures: [{ opp: 'EVE', diff: 2 }, { opp: 'MUN', diff: 4 }, { opp: 'ARS', diff: 5 }, { opp: 'IPS', diff: 2 }, { opp: 'NFO', diff: 2 }] },
  CRY: { next: 'BRE (A)', fixtures: [{ opp: 'BRE', diff: 2 }, { opp: 'WHU', diff: 3 }, { opp: 'CHE', diff: 4 }, { opp: 'LEI', diff: 2 }, { opp: 'MUN', diff: 4 }] },
  EVE: { next: 'BHA (H)', fixtures: [{ opp: 'BHA', diff: 3 }, { opp: 'TOT', diff: 4 }, { opp: 'BOU', diff: 2 }, { opp: 'AVL', diff: 3 }, { opp: 'LEI', diff: 2 }] },
  FUL: { next: 'MUN (A)', fixtures: [{ opp: 'MUN', diff: 4 }, { opp: 'LEI', diff: 2 }, { opp: 'IPS', diff: 2 }, { opp: 'WHU', diff: 3 }, { opp: 'NEW', diff: 4 }] },
  IPS: { next: 'LIV (H)', fixtures: [{ opp: 'LIV', diff: 5 }, { opp: 'MCI', diff: 5 }, { opp: 'FUL', diff: 3 }, { opp: 'BHA', diff: 3 }, { opp: 'SOU', diff: 2 }] },
  LEI: { next: 'TOT (H)', fixtures: [{ opp: 'TOT', diff: 4 }, { opp: 'FUL', diff: 3 }, { opp: 'AVL', diff: 3 }, { opp: 'CRY', diff: 3 }, { opp: 'EVE', diff: 2 }] },
  NFO: { next: 'BOU (H)', fixtures: [{ opp: 'BOU', diff: 2 }, { opp: 'SOU', diff: 2 }, { opp: 'WOL', diff: 2 }, { opp: 'LIV', diff: 5 }, { opp: 'BHA', diff: 3 }] },
  SOU: { next: 'NEW (A)', fixtures: [{ opp: 'NEW', diff: 4 }, { opp: 'NFO', diff: 2 }, { opp: 'BRE', diff: 2 }, { opp: 'MUN', diff: 4 }, { opp: 'IPS', diff: 2 }] },
  WHU: { next: 'AVL (H)', fixtures: [{ opp: 'AVL', diff: 3 }, { opp: 'CRY', diff: 3 }, { opp: 'MCI', diff: 5 }, { opp: 'FUL', diff: 3 }, { opp: 'CHE', diff: 4 }] },
  WOL: { next: 'ARS (A)', fixtures: [{ opp: 'ARS', diff: 5 }, { opp: 'CHE', diff: 4 }, { opp: 'NFO', diff: 2 }, { opp: 'NEW', diff: 4 }, { opp: 'AVL', diff: 3 }] },
};

const getTeamSchedule = (teamCode?: string) => {
  const code = teamCode?.toUpperCase().trim() || 'FPL';
  return (
    TEAM_SCHEDULES[code] || {
      next: 'MUN (H)',
      fixtures: [
        { opp: 'IPS', diff: 2 },
        { opp: 'FUL', diff: 2 },
        { opp: 'BRE', diff: 3 },
        { opp: 'ARS', diff: 5 },
        { opp: 'MCI', diff: 5 },
      ],
    }
  );
};

/* Ultra-Realistic 3D Team Jersey Component Fallback */
const RealisticTeamJersey: React.FC<{ position: number; teamShort?: string; isEmpty?: boolean }> = ({ position, teamShort, isEmpty }) => {
  if (isEmpty) {
    return (
      <svg width="78" height="72" viewBox="0 0 120 105" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="emptyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>
        <g>
          <path d="M 34 22 L 8 38 L 18 64 L 34 44 Z" fill="#64748b" stroke="#cbd5e1" strokeWidth="0.8" />
          <path d="M 86 22 L 112 38 L 102 64 L 86 44 Z" fill="#64748b" stroke="#cbd5e1" strokeWidth="0.8" />
          <path d="M 34 22 Q 60 28 86 22 L 92 94 Q 60 98 28 94 Z" fill="url(#emptyGrad)" stroke="#334155" strokeWidth="1" />
          <path d="M 44 22 C 48 34 72 34 76 22 C 70 27 50 27 44 22 Z" fill="#cbd5e1" />
          <path d="M 60 48 L 60 74 M 47 61 L 73 61" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  const team = teamShort?.toUpperCase().trim() || 'FPL';
  const idSuffix = Math.floor(Math.random() * 1000);

  if (position === 1) {
    let gkLight = '#fef08a', gkPrimary = '#eab308', gkDark = '#a16207';
    if (team === 'MCI' || team === 'ARS') {
      gkLight = '#a7f3d0'; gkPrimary = '#10b981'; gkDark = '#047857';
    } else if (team === 'LIV' || team === 'CHE') {
      gkLight = '#fbcfe8'; gkPrimary = '#ec4899'; gkDark = '#be185d';
    }

    return (
      <svg width="78" height="72" viewBox="0 0 120 105" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`gkBodyGrad-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gkLight} />
            <stop offset="50%" stopColor={gkPrimary} />
            <stop offset="100%" stopColor={gkDark} />
          </linearGradient>
        </defs>
        <g>
          <path d="M 34 22 L 6 56 L 14 78 L 32 46 Z" fill={gkPrimary} stroke={gkDark} strokeWidth="0.8" />
          <path d="M 86 22 L 114 56 L 106 78 L 88 46 Z" fill={gkPrimary} stroke={gkDark} strokeWidth="0.8" />
          <rect x="6" y="73" width="10" height="7" rx="2" fill="#0f172a" />
          <rect x="104" y="73" width="10" height="7" rx="2" fill="#0f172a" />
          <path d="M 34 22 Q 60 28 86 22 L 92 94 Q 60 98 28 94 Z" fill={`url(#gkBodyGrad-${idSuffix})`} stroke={gkDark} strokeWidth="1" />
          <path d="M 44 22 C 48 32 72 32 76 22 C 70 26 50 26 44 22 Z" fill="#0f172a" />
          <text x="60" y="62" fontSize="12" fontWeight="900" fill="#0f172a" textAnchor="middle" fontFamily="Outfit, sans-serif" letterSpacing="0.8">
            {team}
          </text>
        </g>
      </svg>
    );
  }

  let lightColor = '#f87171';
  let primaryColor = '#dc2626';
  let darkColor = '#991b1b';
  let sleeveColor = '#ffffff';
  let secondaryColor = '#ffffff';
  let accentColor = '#0f172a';
  let textColor = '#ffffff';
  let patternType: 'sleeves' | 'stripes' | 'sash' | 'solid' = 'solid';

  if (team === 'ARS') {
    lightColor = '#f87171'; primaryColor = '#dc2626'; darkColor = '#991b1b';
    sleeveColor = '#ffffff'; secondaryColor = '#ffffff'; accentColor = '#991b1b'; textColor = '#ffffff'; patternType = 'sleeves';
  } else if (team === 'AVL' || team === 'WHU' || team === 'WHA') {
    lightColor = '#9f1239'; primaryColor = '#881337'; darkColor = '#4c0519';
    sleeveColor = '#38bdf8'; secondaryColor = '#38bdf8'; accentColor = '#ffffff'; textColor = '#ffffff'; patternType = 'sleeves';
  } else if (team === 'BOU') {
    lightColor = '#ef4444'; primaryColor = '#dc2626'; darkColor = '#1e1b4b';
    sleeveColor = '#0f172a'; secondaryColor = '#0f172a'; accentColor = '#ffffff'; textColor = '#ffffff'; patternType = 'stripes';
  } else if (team === 'BRE' || team === 'SOU') {
    lightColor = '#f87171'; primaryColor = '#dc2626'; darkColor = '#991b1b';
    sleeveColor = '#dc2626'; secondaryColor = '#ffffff'; accentColor = '#0f172a'; textColor = '#ffffff'; patternType = 'stripes';
  } else if (team === 'BHA') {
    lightColor = '#3b82f6'; primaryColor = '#2563eb'; darkColor = '#1d4ed8';
    sleeveColor = '#ffffff'; secondaryColor = '#ffffff'; accentColor = '#1d4ed8'; textColor = '#ffffff'; patternType = 'stripes';
  } else if (team === 'CHE') {
    lightColor = '#3b82f6'; primaryColor = '#1d4ed8'; darkColor = '#1e3a8a';
    sleeveColor = '#1d4ed8'; secondaryColor = '#ffffff'; accentColor = '#eab308'; textColor = '#ffffff'; patternType = 'solid';
  } else if (team === 'CRY') {
    lightColor = '#3b82f6'; primaryColor = '#1d4ed8'; darkColor = '#991b1b';
    sleeveColor = '#dc2626'; secondaryColor = '#dc2626'; accentColor = '#ffffff'; textColor = '#ffffff'; patternType = 'stripes';
  } else if (team === 'EVE' || team === 'IPS' || team === 'LEI') {
    lightColor = '#3b82f6'; primaryColor = '#1d4ed8'; darkColor = '#1e3a8a';
    sleeveColor = '#1d4ed8'; secondaryColor = '#ffffff'; accentColor = '#f59e0b'; textColor = '#ffffff'; patternType = 'solid';
  } else if (team === 'FUL') {
    lightColor = '#ffffff'; primaryColor = '#f8fafc'; darkColor = '#cbd5e1';
    sleeveColor = '#0f172a'; secondaryColor = '#0f172a'; accentColor = '#dc2626'; textColor = '#0f172a'; patternType = 'sleeves';
  } else if (team === 'LIV') {
    lightColor = '#b91c1c'; primaryColor = '#991b1b'; darkColor = '#7f1d1d';
    sleeveColor = '#991b1b'; secondaryColor = '#ffffff'; accentColor = '#f59e0b'; textColor = '#ffffff'; patternType = 'solid';
  } else if (team === 'MCI') {
    lightColor = '#7dd3fc'; primaryColor = '#38bdf8'; darkColor = '#0284c7';
    sleeveColor = '#38bdf8'; secondaryColor = '#ffffff'; accentColor = '#0f172a'; textColor = '#0f172a'; patternType = 'sash';
  } else if (team === 'MUN') {
    lightColor = '#ef4444'; primaryColor = '#dc2626'; darkColor = '#991b1b';
    sleeveColor = '#dc2626'; secondaryColor = '#0f172a'; accentColor = '#ffffff'; textColor = '#ffffff'; patternType = 'solid';
  } else if (team === 'NEW') {
    lightColor = '#334155'; primaryColor = '#0f172a'; darkColor = '#000000';
    sleeveColor = '#0f172a'; secondaryColor = '#ffffff'; accentColor = '#3b82f6'; textColor = '#ffffff'; patternType = 'stripes';
  } else if (team === 'NFO') {
    lightColor = '#ef4444'; primaryColor = '#dc2626'; darkColor = '#991b1b';
    sleeveColor = '#dc2626'; secondaryColor = '#ffffff'; accentColor = '#991b1b'; textColor = '#ffffff'; patternType = 'solid';
  } else if (team === 'TOT') {
    lightColor = '#ffffff'; primaryColor = '#f8fafc'; darkColor = '#cbd5e1';
    sleeveColor = '#1e1b4b'; secondaryColor = '#1e1b4b'; accentColor = '#38bdf8'; textColor = '#0f172a'; patternType = 'solid';
  } else if (team === 'WOL') {
    lightColor = '#fbbf24'; primaryColor = '#f59e0b'; darkColor = '#d97706';
    sleeveColor = '#f59e0b'; secondaryColor = '#0f172a'; accentColor = '#ffffff'; textColor = '#0f172a'; patternType = 'solid';
  }

  return (
    <svg width="78" height="72" viewBox="0 0 120 105" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`gradBody-${team}-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={lightColor} />
          <stop offset="50%" stopColor={primaryColor} />
          <stop offset="100%" stopColor={darkColor} />
        </linearGradient>
      </defs>

      <g>
        <path d="M 34 22 L 8 38 L 18 64 L 34 44 Z" fill={sleeveColor} stroke={secondaryColor} strokeWidth="0.8" />
        <path d="M 86 22 L 112 38 L 102 64 L 86 44 Z" fill={sleeveColor} stroke={secondaryColor} strokeWidth="0.8" />
        <path d="M 34 22 Q 60 28 86 22 L 92 94 Q 60 98 28 94 Z" fill={`url(#gradBody-${team}-${idSuffix})`} stroke={primaryColor} strokeWidth="1" />
        <path d="M 44 22 C 48 32 72 32 76 22 C 70 26 50 26 44 22 Z" fill={secondaryColor} stroke={accentColor} strokeWidth="0.8" />
        <text
          x="60"
          y="64"
          fontSize="12"
          fontWeight="900"
          fill={textColor}
          textAnchor="middle"
          fontFamily="Outfit, sans-serif"
          letterSpacing="0.8"
        >
          {team}
        </text>
      </g>
    </svg>
  );
};

export const PitchView: React.FC<PitchViewProps> = ({
  picks,
  selectedSlot,
  onSlotClick,
  onEmptySlotClick,
  onRemovePlayer,
  onSetCaptain,
  onSetVice,
  onPlayerInfoClick,
  readOnly = false,
  hideFixtures = false,
  benchChips,
}) => {
  const { t, isRtl } = useLanguage();
  const [activeMenuSlot, setActiveMenuSlot] = useState<SquadSlotItem | null>(null);

  const starters = picks.filter((p) => p.slot <= 11);
  const bench = picks.filter((p) => p.slot > 11).sort((a, b) => a.slot - b.slot);

  const gkpRow = starters.filter((p) => p.position === 1);
  const defRow = starters.filter((p) => p.position === 2);
  const midRow = starters.filter((p) => p.position === 3);
  const fwdRow = starters.filter((p) => p.position === 4);

  const handleCardClick = (p: SquadSlotItem) => {
    if (readOnly) {
      if (onPlayerInfoClick && p.fullData) onPlayerInfoClick(p.fullData);
      return;
    }

    if (selectedSlot !== null) {
      onSlotClick(p.slot);
      return;
    }

    setActiveMenuSlot(p);
  };

  const handleDirectSwapClick = (e: React.MouseEvent, slot: number) => {
    e.stopPropagation();
    onSlotClick(slot);
  };

  const renderCard = (p: SquadSlotItem, benchIndex?: number) => {
    const isSelected = selectedSlot === p.slot;
    const posLabel = p.position === 1 ? t('gkp') : p.position === 2 ? t('def') : p.position === 3 ? t('mid') : t('fwd');

    let benchPosHeader = '';
    if (benchIndex !== undefined) {
      benchPosHeader = p.position === 1 ? (isRtl ? 'حارس مرمى' : 'Goalkeeper') : p.position === 2 ? (isRtl ? 'مدافع' : 'Defender') : p.position === 3 ? (isRtl ? 'لاعب وسط' : 'Midfielder') : (isRtl ? 'مهاجم' : 'Forward');
    }

    if (p.isEmpty) {
      return (
        <div key={p.slot} className="fpl-player-wrapper">
          {benchIndex !== undefined && (
            <div className="fpl-bench-pos-label">
              {benchPosHeader}
            </div>
          )}
          <div
            className="fpl-player-node empty"
            onClick={() => onEmptySlotClick && onEmptySlotClick(p.position, p.slot)}
          >
            <div className="fpl-jersey-box">
              <RealisticTeamJersey position={p.position} isEmpty={true} />
            </div>
            <div className="fpl-card-box empty">
              <div className="fpl-player-name-dark-bar" style={{ background: 'var(--fpl-purple)' }}>
                {isRtl ? 'إضافة لاعب' : 'Add player'}
              </div>
              <div className="fpl-player-fixture-box" style={{ background: '#f8fafc', color: '#64748b' }}>
                {posLabel}
              </div>
            </div>
          </div>
        </div>
      );
    }

    const schedule = getTeamSchedule(p.teamShortName);
    const fixtureText = p.points !== undefined ? `${p.points} ${t('pts')}` : p.fixtureInfo || schedule.next;
    const costText = p.nowCost ? `£${(p.nowCost / 10).toFixed(1)}m` : '£5.0m';
    const playerNameText = p.webName || p.fullData?.web_name || 'Player';

    const handleInfoClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onPlayerInfoClick) {
        onPlayerInfoClick(
          p.fullData || {
            id: p.playerId || 0,
            web_name: playerNameText,
            position: p.position,
            teamShort: p.teamShortName,
            now_cost: p.nowCost || 50,
            total_points: p.points || 0,
          }
        );
      }
    };

    return (
      <div key={p.slot} className="fpl-player-wrapper">
        {benchIndex !== undefined && (
          <div className="fpl-bench-pos-label">
            {benchPosHeader}
          </div>
        )}

        <div
          className={`fpl-player-node ${isSelected ? 'selected-swap' : ''}`}
          onClick={() => handleCardClick(p)}
        >
          {/* Top-Right White Circle Action Badges matching screenshot (Upper: Eye, Lower: Swap) */}
          <div className="fpl-action-badges-right-stacked">
            {onPlayerInfoClick && (
              <button className="fpl-badge-white-circle" onClick={handleInfoClick} title="View Stats">
                <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0f172a', fontStyle: 'italic' }}>👁</span>
              </button>
            )}

            {!readOnly && (
              <button
                className={`fpl-badge-white-circle swap ${isSelected ? 'active' : ''}`}
                onClick={(e) => handleDirectSwapClick(e, p.slot)}
                title="Swap Player"
              >
                <ArrowUpDown size={12} style={{ color: '#0f172a' }} />
              </button>
            )}
          </div>

          {/* Captain / Vice Captain Badge Floating on Top Center */}
          {p.isCaptain && <div className="fpl-role-badge-top captain">C</div>}
          {p.isVice && <div className="fpl-role-badge-top vice">V</div>}

          {/* Top Graphic Area: Always displays 3D Team Jersey cleanly */}
          <div className="fpl-photo-portrait-card">
            <div className="fpl-jersey-center-container">
              <RealisticTeamJersey position={p.position} teamShort={p.teamShortName} />
            </div>
          </div>

          {/* Bottom Official Card Box matching user's screenshot */}
          <div className="fpl-card-box">
            {/* Dark Purple Name Bar - Always displays player web name in crisp white text */}
            <div className="fpl-player-name-dark-bar">{playerNameText}</div>

            {!hideFixtures && (
              <>
                {/* White Price & Next Fixture Bar */}
                <div className="fpl-player-fixture-box">
                  {costText} {fixtureText}
                </div>

                {/* 5 FDR Fixtures Bar */}
                <div className="fpl-fdr-5-bar">
                  {schedule.fixtures.map((fix, idx) => {
                    const bg = fix.diff <= 2 ? '#10b981' : fix.diff === 3 ? '#64748b' : fix.diff === 4 ? '#e11d48' : '#881337';
                    return (
                      <span key={idx} className="fdr-pill" style={{ background: bg }}>
                        {fix.opp}
                      </span>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Swap Active Badge Indicator */}
          {isSelected && (
            <div className="fpl-swap-active-indicator" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowUpDown size={11} />
              <span>{isRtl ? 'جاري التبديل...' : 'Swapping...'}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fpl-pitch-wrapper">
      {/* 3D Perspective Pitch */}
      <div className="fpl-pitch-3d">
        {/* Top Sponsor Ads Banner Flanking Goal Net */}
        <div className="fpl-pitch-sponsor-row">
          <div className="fpl-sponsor-banner-card">
            <img src="/logo.png" alt="MINI FPL" style={{ height: '26px', objectFit: 'contain' }} />
          </div>

          <div className="fpl-top-goal-net" />

          <div className="fpl-sponsor-banner-card">
            <img src="/logo.png" alt="MINI FPL" style={{ height: '26px', objectFit: 'contain' }} />
          </div>
        </div>

        {/* Pitch Lines Overlay */}
        <div className="fpl-pitch-lines">
          <div className="fpl-penalty-box-top" />
          <div className="fpl-half-circle" />
          <div className="fpl-center-line" />
        </div>

        {/* Starter Rows */}
        <div className="fpl-pitch-rows">
          <div className="fpl-row">{gkpRow.map((p) => renderCard(p))}</div>
          <div className="fpl-row">{defRow.map((p) => renderCard(p))}</div>
          <div className="fpl-row">{midRow.map((p) => renderCard(p))}</div>
          <div className="fpl-row">{fwdRow.map((p) => renderCard(p))}</div>
        </div>

        {/* Bench Tray at the Bottom with Chips (Bench Boost & Triple Captain) */}
        <div className="fpl-bench-tray">
          <div className="fpl-bench-row">
            {bench.map((p, idx) => renderCard(p, idx))}
          </div>

          <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', marginTop: '8px' }}>
            {/* Left Pink Chip: Bench Boost */}
            {benchChips && (
              <button
                onClick={benchChips.onToggleBenchBoost}
                className={`fpl-chip-pink-btn ${benchChips.benchBoostUsed ? 'active' : ''}`}
              >
                {isRtl ? 'بنش بووست' : 'Bench Boost'}
              </button>
            )}

            <div className="fpl-bench-footer-label" style={{ margin: 0 }}>
              {isRtl ? 'الدكة' : 'Bench'}
            </div>

            {/* Right Pink Chip: Triple Captain */}
            {benchChips && (
              <button
                onClick={benchChips.onToggleTripleCaptain}
                className={`fpl-chip-pink-btn ${benchChips.tripleCaptainUsed ? 'active' : ''}`}
              >
                {isRtl ? 'تربل كابتن' : 'Triple Captain'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sleek Player Action Sheet Modal */}
      {activeMenuSlot && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setActiveMenuSlot(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '380px',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
              color: '#0f172a',
              textAlign: 'center',
              direction: isRtl ? 'rtl' : 'ltr',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Player Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', justifyContent: 'center' }}>
              <div style={{ transform: 'scale(0.9)' }}>
                <RealisticTeamJersey position={activeMenuSlot.position} teamShort={activeMenuSlot.teamShortName} />
              </div>
              <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--fpl-purple)', margin: 0 }}>
                  {activeMenuSlot.webName}
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {activeMenuSlot.teamShortName} | £{((activeMenuSlot.nowCost || 50) / 10).toFixed(1)}m
                </span>
              </div>
            </div>

            {/* Menu Options Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Option 1: Swap Position */}
              <button
                onClick={() => {
                  onSlotClick(activeMenuSlot.slot);
                  setActiveMenuSlot(null);
                }}
                style={{
                  background: 'linear-gradient(135deg, #facc15, #eab308)',
                  color: '#1e1b4b',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  padding: '14px 18px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(234, 179, 8, 0.3)',
                }}
              >
                <ArrowUpDown size={16} />
                <span>{isRtl ? 'تبديل اللاعب' : 'Switch / Swap Player'}</span>
              </button>

              {/* Option 2: Make Captain (if starter) */}
              {onSetCaptain && activeMenuSlot.slot <= 11 && (
                <button
                  onClick={() => {
                    onSetCaptain(activeMenuSlot.slot);
                    setActiveMenuSlot(null);
                  }}
                  style={{
                    background: 'var(--fpl-purple)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <Crown size={16} style={{ color: 'var(--fpl-green)' }} />
                  <span>{isRtl ? 'تعيين كابتن (C)' : 'Make Captain (C)'}</span>
                </button>
              )}

              {/* Option 3: Make Vice Captain (if starter) */}
              {onSetVice && activeMenuSlot.slot <= 11 && (
                <button
                  onClick={() => {
                    onSetVice(activeMenuSlot.slot);
                    setActiveMenuSlot(null);
                  }}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <Shield size={16} style={{ color: '#0f172a' }} />
                  <span>{isRtl ? 'تعيين نائب كابتن (V)' : 'Make Vice Captain (V)'}</span>
                </button>
              )}

              {/* Option 4: View Player Stats */}
              {onPlayerInfoClick && activeMenuSlot.fullData && (
                <button
                  onClick={() => {
                    onPlayerInfoClick(activeMenuSlot.fullData!);
                    setActiveMenuSlot(null);
                  }}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: 'var(--fpl-cyan)',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    padding: '12px 18px',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <Info size={16} />
                  <span>{isRtl ? 'تفاصيل وإحصائيات اللاعب' : 'Player Performance Stats'}</span>
                </button>
              )}

              {/* Close Button */}
              <button
                onClick={() => setActiveMenuSlot(null)}
                style={{
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  fontSize: '0.88rem',
                  padding: '8px',
                  marginTop: '4px',
                  fontWeight: 600,
                }}
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
