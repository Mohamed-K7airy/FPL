import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PlayerDetailData } from './PlayerDetailModal';
import { ArrowUpDown, Crown, Shield, Info, X, Eye } from 'lucide-react';

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
  gw?: number;
  benchChips?: {
    benchBoostUsed?: boolean;
    tripleCaptainUsed?: boolean;
    onToggleBenchBoost?: () => void;
    onToggleTripleCaptain?: () => void;
  };
}

/* Premier League 2026/27 Official Team Fixtures for All 38 Gameweeks (from Official FPL API) */
const TEAM_SCHEDULES: Record<string, { opp: string; isHome: boolean }[]> = {
  ARS: [{ opp: 'COV', isHome: true }, { opp: 'AVL', isHome: false }, { opp: 'CHE', isHome: true }, { opp: 'SUN', isHome: false }, { opp: 'BHA', isHome: false }, { opp: 'LEE', isHome: true }, { opp: 'NFO', isHome: false }, { opp: 'EVE', isHome: true }, { opp: 'LIV', isHome: false }, { opp: 'HUL', isHome: true }, { opp: 'NEW', isHome: false }, { opp: 'MCI', isHome: true }, { opp: 'BRE', isHome: false }, { opp: 'TOT', isHome: false }, { opp: 'BOU', isHome: true }, { opp: 'MUN', isHome: true }, { opp: 'CRY', isHome: false }, { opp: 'FUL', isHome: false }, { opp: 'IPS', isHome: true }, { opp: 'BRE', isHome: true }, { opp: 'HUL', isHome: false }, { opp: 'NEW', isHome: true }, { opp: 'MCI', isHome: false }, { opp: 'LIV', isHome: true }, { opp: 'IPS', isHome: false }, { opp: 'FUL', isHome: true }, { opp: 'MUN', isHome: false }, { opp: 'CRY', isHome: true }, { opp: 'CHE', isHome: false }, { opp: 'SUN', isHome: true }, { opp: 'COV', isHome: false }, { opp: 'AVL', isHome: true }, { opp: 'BOU', isHome: false }, { opp: 'TOT', isHome: true }, { opp: 'LEE', isHome: false }, { opp: 'NFO', isHome: true }, { opp: 'EVE', isHome: false }, { opp: 'BHA', isHome: true }],
  AVL: [{ opp: 'BHA', isHome: false }, { opp: 'ARS', isHome: true }, { opp: 'HUL', isHome: false }, { opp: 'NFO', isHome: true }, { opp: 'TOT', isHome: false }, { opp: 'BRE', isHome: true }, { opp: 'NEW', isHome: false }, { opp: 'MCI', isHome: true }, { opp: 'FUL', isHome: true }, { opp: 'MUN', isHome: false }, { opp: 'SUN', isHome: true }, { opp: 'IPS', isHome: false }, { opp: 'EVE', isHome: true }, { opp: 'CRY', isHome: true }, { opp: 'COV', isHome: false }, { opp: 'CHE', isHome: false }, { opp: 'LEE', isHome: true }, { opp: 'LIV', isHome: true }, { opp: 'BOU', isHome: false }, { opp: 'EVE', isHome: false }, { opp: 'MUN', isHome: true }, { opp: 'FUL', isHome: false }, { opp: 'IPS', isHome: true }, { opp: 'SUN', isHome: false }, { opp: 'BOU', isHome: true }, { opp: 'LEE', isHome: false }, { opp: 'CHE', isHome: true }, { opp: 'LIV', isHome: false }, { opp: 'HUL', isHome: true }, { opp: 'NFO', isHome: false }, { opp: 'BHA', isHome: true }, { opp: 'ARS', isHome: false }, { opp: 'COV', isHome: true }, { opp: 'CRY', isHome: false }, { opp: 'BRE', isHome: false }, { opp: 'NEW', isHome: true }, { opp: 'MCI', isHome: false }, { opp: 'TOT', isHome: true }],
  BHA: [{ opp: 'AVL', isHome: true }, { opp: 'CHE', isHome: false }, { opp: 'LEE', isHome: true }, { opp: 'COV', isHome: false }, { opp: 'ARS', isHome: true }, { opp: 'SUN', isHome: false }, { opp: 'CRY', isHome: true }, { opp: 'LIV', isHome: false }, { opp: 'MCI', isHome: false }, { opp: 'BRE', isHome: true }, { opp: 'HUL', isHome: false }, { opp: 'NEW', isHome: true }, { opp: 'BOU', isHome: false }, { opp: 'NFO', isHome: false }, { opp: 'EVE', isHome: true }, { opp: 'IPS', isHome: true }, { opp: 'FUL', isHome: false }, { opp: 'TOT', isHome: false }, { opp: 'MUN', isHome: true }, { opp: 'BOU', isHome: true }, { opp: 'BRE', isHome: false }, { opp: 'MCI', isHome: true }, { opp: 'NEW', isHome: false }, { opp: 'HUL', isHome: true }, { opp: 'MUN', isHome: false }, { opp: 'TOT', isHome: true }, { opp: 'IPS', isHome: false }, { opp: 'FUL', isHome: true }, { opp: 'LEE', isHome: false }, { opp: 'COV', isHome: true }, { opp: 'AVL', isHome: false }, { opp: 'CHE', isHome: true }, { opp: 'EVE', isHome: false }, { opp: 'NFO', isHome: true }, { opp: 'SUN', isHome: true }, { opp: 'CRY', isHome: false }, { opp: 'LIV', isHome: true }, { opp: 'ARS', isHome: false }],
  BOU: [{ opp: 'MCI', isHome: false }, { opp: 'EVE', isHome: true }, { opp: 'NEW', isHome: false }, { opp: 'BRE', isHome: true }, { opp: 'LIV', isHome: true }, { opp: 'CHE', isHome: false }, { opp: 'SUN', isHome: true }, { opp: 'MUN', isHome: false }, { opp: 'LEE', isHome: true }, { opp: 'IPS', isHome: false }, { opp: 'NFO', isHome: true }, { opp: 'FUL', isHome: false }, { opp: 'BHA', isHome: true }, { opp: 'HUL', isHome: true }, { opp: 'ARS', isHome: false }, { opp: 'COV', isHome: true }, { opp: 'TOT', isHome: false }, { opp: 'CRY', isHome: false }, { opp: 'AVL', isHome: true }, { opp: 'BHA', isHome: false }, { opp: 'IPS', isHome: true }, { opp: 'NFO', isHome: false }, { opp: 'FUL', isHome: true }, { opp: 'LEE', isHome: false }, { opp: 'AVL', isHome: false }, { opp: 'CRY', isHome: true }, { opp: 'COV', isHome: false }, { opp: 'TOT', isHome: true }, { opp: 'NEW', isHome: true }, { opp: 'BRE', isHome: false }, { opp: 'MCI', isHome: true }, { opp: 'EVE', isHome: false }, { opp: 'ARS', isHome: true }, { opp: 'HUL', isHome: false }, { opp: 'MUN', isHome: true }, { opp: 'SUN', isHome: false }, { opp: 'CHE', isHome: true }, { opp: 'LIV', isHome: false }],
  BRE: [{ opp: 'TOT', isHome: true }, { opp: 'LEE', isHome: false }, { opp: 'SUN', isHome: true }, { opp: 'BOU', isHome: false }, { opp: 'CHE', isHome: true }, { opp: 'AVL', isHome: false }, { opp: 'LIV', isHome: true }, { opp: 'HUL', isHome: false }, { opp: 'NFO', isHome: true }, { opp: 'BHA', isHome: false }, { opp: 'EVE', isHome: true }, { opp: 'MUN', isHome: false }, { opp: 'ARS', isHome: true }, { opp: 'MCI', isHome: true }, { opp: 'FUL', isHome: false }, { opp: 'NEW', isHome: true }, { opp: 'IPS', isHome: false }, { opp: 'COV', isHome: false }, { opp: 'CRY', isHome: true }, { opp: 'ARS', isHome: false }, { opp: 'BHA', isHome: true }, { opp: 'EVE', isHome: false }, { opp: 'MUN', isHome: true }, { opp: 'NFO', isHome: false }, { opp: 'CRY', isHome: false }, { opp: 'COV', isHome: true }, { opp: 'NEW', isHome: false }, { opp: 'IPS', isHome: true }, { opp: 'SUN', isHome: false }, { opp: 'BOU', isHome: true }, { opp: 'TOT', isHome: false }, { opp: 'LEE', isHome: true }, { opp: 'FUL', isHome: true }, { opp: 'MCI', isHome: false }, { opp: 'AVL', isHome: true }, { opp: 'LIV', isHome: false }, { opp: 'HUL', isHome: true }, { opp: 'CHE', isHome: false }],
  CHE: [{ opp: 'FUL', isHome: false }, { opp: 'BHA', isHome: true }, { opp: 'ARS', isHome: false }, { opp: 'HUL', isHome: true }, { opp: 'BRE', isHome: false }, { opp: 'BOU', isHome: true }, { opp: 'EVE', isHome: false }, { opp: 'TOT', isHome: true }, { opp: 'MUN', isHome: true }, { opp: 'SUN', isHome: false }, { opp: 'LEE', isHome: true }, { opp: 'NFO', isHome: false }, { opp: 'CRY', isHome: true }, { opp: 'LIV', isHome: true }, { opp: 'MCI', isHome: false }, { opp: 'AVL', isHome: true }, { opp: 'COV', isHome: false }, { opp: 'IPS', isHome: false }, { opp: 'NEW', isHome: true }, { opp: 'CRY', isHome: false }, { opp: 'SUN', isHome: true }, { opp: 'LEE', isHome: false }, { opp: 'NFO', isHome: true }, { opp: 'MUN', isHome: false }, { opp: 'NEW', isHome: false }, { opp: 'IPS', isHome: true }, { opp: 'AVL', isHome: false }, { opp: 'COV', isHome: true }, { opp: 'ARS', isHome: true }, { opp: 'HUL', isHome: false }, { opp: 'FUL', isHome: true }, { opp: 'BHA', isHome: false }, { opp: 'MCI', isHome: true }, { opp: 'LIV', isHome: false }, { opp: 'TOT', isHome: false }, { opp: 'EVE', isHome: true }, { opp: 'BOU', isHome: false }, { opp: 'BRE', isHome: true }],
  COV: [{ opp: 'ARS', isHome: false }, { opp: 'HUL', isHome: true }, { opp: 'MCI', isHome: false }, { opp: 'BHA', isHome: true }, { opp: 'NFO', isHome: false }, { opp: 'NEW', isHome: true }, { opp: 'TOT', isHome: false }, { opp: 'FUL', isHome: true }, { opp: 'SUN', isHome: true }, { opp: 'EVE', isHome: false }, { opp: 'CRY', isHome: true }, { opp: 'LEE', isHome: false }, { opp: 'IPS', isHome: true }, { opp: 'MUN', isHome: false }, { opp: 'AVL', isHome: true }, { opp: 'BOU', isHome: false }, { opp: 'CHE', isHome: true }, { opp: 'BRE', isHome: true }, { opp: 'LIV', isHome: false }, { opp: 'IPS', isHome: false }, { opp: 'EVE', isHome: true }, { opp: 'SUN', isHome: false }, { opp: 'LEE', isHome: true }, { opp: 'CRY', isHome: false }, { opp: 'LIV', isHome: true }, { opp: 'BRE', isHome: false }, { opp: 'BOU', isHome: true }, { opp: 'CHE', isHome: false }, { opp: 'MCI', isHome: true }, { opp: 'BHA', isHome: false }, { opp: 'ARS', isHome: true }, { opp: 'HUL', isHome: false }, { opp: 'AVL', isHome: false }, { opp: 'MUN', isHome: true }, { opp: 'NEW', isHome: false }, { opp: 'TOT', isHome: true }, { opp: 'FUL', isHome: false }, { opp: 'NFO', isHome: true }],
  CRY: [{ opp: 'EVE', isHome: false }, { opp: 'MCI', isHome: true }, { opp: 'FUL', isHome: false }, { opp: 'IPS', isHome: true }, { opp: 'LEE', isHome: false }, { opp: 'NFO', isHome: true }, { opp: 'BHA', isHome: false }, { opp: 'NEW', isHome: true }, { opp: 'TOT', isHome: false }, { opp: 'LIV', isHome: true }, { opp: 'COV', isHome: false }, { opp: 'HUL', isHome: true }, { opp: 'CHE', isHome: false }, { opp: 'AVL', isHome: false }, { opp: 'MUN', isHome: true }, { opp: 'SUN', isHome: false }, { opp: 'ARS', isHome: true }, { opp: 'BOU', isHome: true }, { opp: 'BRE', isHome: false }, { opp: 'CHE', isHome: true }, { opp: 'LIV', isHome: false }, { opp: 'TOT', isHome: true }, { opp: 'HUL', isHome: false }, { opp: 'COV', isHome: true }, { opp: 'BRE', isHome: true }, { opp: 'BOU', isHome: false }, { opp: 'SUN', isHome: true }, { opp: 'ARS', isHome: false }, { opp: 'FUL', isHome: true }, { opp: 'IPS', isHome: false }, { opp: 'EVE', isHome: true }, { opp: 'MCI', isHome: false }, { opp: 'MUN', isHome: false }, { opp: 'AVL', isHome: true }, { opp: 'NFO', isHome: false }, { opp: 'BHA', isHome: true }, { opp: 'NEW', isHome: false }, { opp: 'LEE', isHome: true }],
  EVE: [{ opp: 'CRY', isHome: true }, { opp: 'BOU', isHome: false }, { opp: 'MUN', isHome: true }, { opp: 'TOT', isHome: false }, { opp: 'IPS', isHome: true }, { opp: 'HUL', isHome: false }, { opp: 'CHE', isHome: true }, { opp: 'ARS', isHome: false }, { opp: 'NEW', isHome: false }, { opp: 'COV', isHome: true }, { opp: 'BRE', isHome: false }, { opp: 'LIV', isHome: true }, { opp: 'AVL', isHome: false }, { opp: 'FUL', isHome: true }, { opp: 'BHA', isHome: false }, { opp: 'NFO', isHome: false }, { opp: 'SUN', isHome: true }, { opp: 'MCI', isHome: true }, { opp: 'LEE', isHome: false }, { opp: 'AVL', isHome: true }, { opp: 'COV', isHome: false }, { opp: 'BRE', isHome: true }, { opp: 'LIV', isHome: false }, { opp: 'NEW', isHome: true }, { opp: 'LEE', isHome: true }, { opp: 'SUN', isHome: false }, { opp: 'NFO', isHome: true }, { opp: 'MCI', isHome: false }, { opp: 'MUN', isHome: false }, { opp: 'TOT', isHome: true }, { opp: 'CRY', isHome: false }, { opp: 'BOU', isHome: true }, { opp: 'BHA', isHome: true }, { opp: 'FUL', isHome: false }, { opp: 'HUL', isHome: true }, { opp: 'CHE', isHome: false }, { opp: 'ARS', isHome: true }, { opp: 'IPS', isHome: false }],
  FUL: [{ opp: 'CHE', isHome: true }, { opp: 'SUN', isHome: false }, { opp: 'CRY', isHome: true }, { opp: 'LIV', isHome: false }, { opp: 'MUN', isHome: true }, { opp: 'IPS', isHome: false }, { opp: 'HUL', isHome: true }, { opp: 'COV', isHome: false }, { opp: 'AVL', isHome: false }, { opp: 'NEW', isHome: true }, { opp: 'MCI', isHome: false }, { opp: 'BOU', isHome: true }, { opp: 'TOT', isHome: false }, { opp: 'EVE', isHome: false }, { opp: 'BRE', isHome: true }, { opp: 'LEE', isHome: false }, { opp: 'BHA', isHome: true }, { opp: 'ARS', isHome: true }, { opp: 'NFO', isHome: false }, { opp: 'TOT', isHome: true }, { opp: 'NEW', isHome: false }, { opp: 'AVL', isHome: true }, { opp: 'BOU', isHome: false }, { opp: 'MCI', isHome: true }, { opp: 'NFO', isHome: true }, { opp: 'ARS', isHome: false }, { opp: 'LEE', isHome: true }, { opp: 'BHA', isHome: false }, { opp: 'CRY', isHome: false }, { opp: 'LIV', isHome: true }, { opp: 'CHE', isHome: false }, { opp: 'SUN', isHome: true }, { opp: 'BRE', isHome: false }, { opp: 'EVE', isHome: true }, { opp: 'IPS', isHome: true }, { opp: 'HUL', isHome: false }, { opp: 'COV', isHome: true }, { opp: 'MUN', isHome: false }],
  HUL: [{ opp: 'MUN', isHome: true }, { opp: 'COV', isHome: false }, { opp: 'AVL', isHome: true }, { opp: 'CHE', isHome: false }, { opp: 'NEW', isHome: false }, { opp: 'EVE', isHome: true }, { opp: 'FUL', isHome: false }, { opp: 'BRE', isHome: true }, { opp: 'IPS', isHome: true }, { opp: 'ARS', isHome: false }, { opp: 'BHA', isHome: true }, { opp: 'CRY', isHome: false }, { opp: 'NFO', isHome: true }, { opp: 'BOU', isHome: false }, { opp: 'TOT', isHome: true }, { opp: 'MCI', isHome: false }, { opp: 'LIV', isHome: true }, { opp: 'LEE', isHome: true }, { opp: 'SUN', isHome: false }, { opp: 'NFO', isHome: false }, { opp: 'ARS', isHome: true }, { opp: 'IPS', isHome: false }, { opp: 'CRY', isHome: true }, { opp: 'BHA', isHome: false }, { opp: 'SUN', isHome: true }, { opp: 'LIV', isHome: false }, { opp: 'MCI', isHome: true }, { opp: 'LEE', isHome: false }, { opp: 'AVL', isHome: false }, { opp: 'CHE', isHome: true }, { opp: 'MUN', isHome: false }, { opp: 'COV', isHome: true }, { opp: 'TOT', isHome: false }, { opp: 'BOU', isHome: true }, { opp: 'EVE', isHome: false }, { opp: 'FUL', isHome: true }, { opp: 'BRE', isHome: false }, { opp: 'NEW', isHome: true }],
  IPS: [{ opp: 'SUN', isHome: true }, { opp: 'MUN', isHome: false }, { opp: 'LIV', isHome: true }, { opp: 'CRY', isHome: false }, { opp: 'EVE', isHome: false }, { opp: 'FUL', isHome: true }, { opp: 'MCI', isHome: false }, { opp: 'NFO', isHome: true }, { opp: 'HUL', isHome: false }, { opp: 'BOU', isHome: true }, { opp: 'TOT', isHome: false }, { opp: 'AVL', isHome: true }, { opp: 'COV', isHome: false }, { opp: 'LEE', isHome: false }, { opp: 'NEW', isHome: true }, { opp: 'BHA', isHome: false }, { opp: 'BRE', isHome: true }, { opp: 'CHE', isHome: true }, { opp: 'ARS', isHome: false }, { opp: 'COV', isHome: true }, { opp: 'BOU', isHome: false }, { opp: 'HUL', isHome: true }, { opp: 'AVL', isHome: false }, { opp: 'TOT', isHome: true }, { opp: 'ARS', isHome: true }, { opp: 'CHE', isHome: false }, { opp: 'BHA', isHome: true }, { opp: 'BRE', isHome: false }, { opp: 'LIV', isHome: false }, { opp: 'CRY', isHome: true }, { opp: 'SUN', isHome: false }, { opp: 'MUN', isHome: true }, { opp: 'NEW', isHome: false }, { opp: 'LEE', isHome: true }, { opp: 'FUL', isHome: false }, { opp: 'MCI', isHome: true }, { opp: 'NFO', isHome: false }, { opp: 'EVE', isHome: true }],
  LEE: [{ opp: 'NFO', isHome: false }, { opp: 'BRE', isHome: true }, { opp: 'BHA', isHome: false }, { opp: 'NEW', isHome: true }, { opp: 'CRY', isHome: true }, { opp: 'ARS', isHome: false }, { opp: 'MUN', isHome: true }, { opp: 'SUN', isHome: false }, { opp: 'BOU', isHome: false }, { opp: 'TOT', isHome: true }, { opp: 'CHE', isHome: false }, { opp: 'COV', isHome: true }, { opp: 'MCI', isHome: false }, { opp: 'IPS', isHome: true }, { opp: 'LIV', isHome: false }, { opp: 'FUL', isHome: true }, { opp: 'AVL', isHome: false }, { opp: 'HUL', isHome: false }, { opp: 'EVE', isHome: true }, { opp: 'MCI', isHome: true }, { opp: 'TOT', isHome: false }, { opp: 'CHE', isHome: true }, { opp: 'COV', isHome: false }, { opp: 'BOU', isHome: true }, { opp: 'EVE', isHome: false }, { opp: 'AVL', isHome: true }, { opp: 'FUL', isHome: false }, { opp: 'HUL', isHome: true }, { opp: 'BHA', isHome: true }, { opp: 'NEW', isHome: false }, { opp: 'NFO', isHome: true }, { opp: 'BRE', isHome: false }, { opp: 'LIV', isHome: true }, { opp: 'IPS', isHome: false }, { opp: 'ARS', isHome: true }, { opp: 'MUN', isHome: false }, { opp: 'SUN', isHome: true }, { opp: 'CRY', isHome: false }],
  LIV: [{ opp: 'NEW', isHome: false }, { opp: 'NFO', isHome: true }, { opp: 'IPS', isHome: false }, { opp: 'FUL', isHome: true }, { opp: 'BOU', isHome: false }, { opp: 'MCI', isHome: true }, { opp: 'BRE', isHome: false }, { opp: 'BHA', isHome: true }, { opp: 'ARS', isHome: true }, { opp: 'CRY', isHome: false }, { opp: 'MUN', isHome: true }, { opp: 'EVE', isHome: false }, { opp: 'SUN', isHome: true }, { opp: 'CHE', isHome: false }, { opp: 'LEE', isHome: true }, { opp: 'TOT', isHome: true }, { opp: 'HUL', isHome: false }, { opp: 'AVL', isHome: false }, { opp: 'COV', isHome: true }, { opp: 'SUN', isHome: false }, { opp: 'CRY', isHome: true }, { opp: 'MUN', isHome: false }, { opp: 'EVE', isHome: true }, { opp: 'ARS', isHome: false }, { opp: 'COV', isHome: false }, { opp: 'HUL', isHome: true }, { opp: 'TOT', isHome: false }, { opp: 'AVL', isHome: true }, { opp: 'IPS', isHome: true }, { opp: 'FUL', isHome: false }, { opp: 'NEW', isHome: true }, { opp: 'NFO', isHome: false }, { opp: 'LEE', isHome: false }, { opp: 'CHE', isHome: true }, { opp: 'MCI', isHome: false }, { opp: 'BRE', isHome: true }, { opp: 'BHA', isHome: false }, { opp: 'BOU', isHome: true }],
  MCI: [{ opp: 'BOU', isHome: true }, { opp: 'CRY', isHome: false }, { opp: 'COV', isHome: true }, { opp: 'MUN', isHome: false }, { opp: 'SUN', isHome: true }, { opp: 'LIV', isHome: false }, { opp: 'IPS', isHome: true }, { opp: 'AVL', isHome: false }, { opp: 'BHA', isHome: true }, { opp: 'NFO', isHome: false }, { opp: 'FUL', isHome: true }, { opp: 'ARS', isHome: false }, { opp: 'LEE', isHome: true }, { opp: 'BRE', isHome: false }, { opp: 'CHE', isHome: true }, { opp: 'HUL', isHome: true }, { opp: 'NEW', isHome: false }, { opp: 'EVE', isHome: false }, { opp: 'TOT', isHome: true }, { opp: 'LEE', isHome: false }, { opp: 'NFO', isHome: true }, { opp: 'BHA', isHome: false }, { opp: 'ARS', isHome: true }, { opp: 'FUL', isHome: false }, { opp: 'TOT', isHome: false }, { opp: 'NEW', isHome: true }, { opp: 'HUL', isHome: false }, { opp: 'EVE', isHome: true }, { opp: 'COV', isHome: false }, { opp: 'MUN', isHome: true }, { opp: 'BOU', isHome: false }, { opp: 'CRY', isHome: true }, { opp: 'CHE', isHome: false }, { opp: 'BRE', isHome: true }, { opp: 'LIV', isHome: true }, { opp: 'IPS', isHome: false }, { opp: 'AVL', isHome: true }, { opp: 'SUN', isHome: false }],
  MUN: [{ opp: 'HUL', isHome: false }, { opp: 'IPS', isHome: true }, { opp: 'EVE', isHome: false }, { opp: 'MCI', isHome: true }, { opp: 'FUL', isHome: false }, { opp: 'TOT', isHome: true }, { opp: 'LEE', isHome: false }, { opp: 'BOU', isHome: true }, { opp: 'CHE', isHome: false }, { opp: 'AVL', isHome: true }, { opp: 'LIV', isHome: false }, { opp: 'BRE', isHome: true }, { opp: 'NEW', isHome: false }, { opp: 'COV', isHome: true }, { opp: 'CRY', isHome: false }, { opp: 'ARS', isHome: false }, { opp: 'NFO', isHome: true }, { opp: 'SUN', isHome: true }, { opp: 'BHA', isHome: false }, { opp: 'NEW', isHome: true }, { opp: 'AVL', isHome: false }, { opp: 'LIV', isHome: true }, { opp: 'BRE', isHome: false }, { opp: 'CHE', isHome: true }, { opp: 'BHA', isHome: true }, { opp: 'NFO', isHome: false }, { opp: 'ARS', isHome: true }, { opp: 'SUN', isHome: false }, { opp: 'EVE', isHome: true }, { opp: 'MCI', isHome: false }, { opp: 'HUL', isHome: true }, { opp: 'IPS', isHome: false }, { opp: 'CRY', isHome: true }, { opp: 'COV', isHome: false }, { opp: 'BOU', isHome: false }, { opp: 'LEE', isHome: true }, { opp: 'TOT', isHome: false }, { opp: 'FUL', isHome: true }],
  NEW: [{ opp: 'LIV', isHome: true }, { opp: 'TOT', isHome: false }, { opp: 'BOU', isHome: true }, { opp: 'LEE', isHome: false }, { opp: 'HUL', isHome: true }, { opp: 'COV', isHome: false }, { opp: 'AVL', isHome: true }, { opp: 'CRY', isHome: false }, { opp: 'EVE', isHome: true }, { opp: 'FUL', isHome: false }, { opp: 'ARS', isHome: true }, { opp: 'BHA', isHome: false }, { opp: 'MUN', isHome: true }, { opp: 'SUN', isHome: true }, { opp: 'IPS', isHome: false }, { opp: 'BRE', isHome: false }, { opp: 'MCI', isHome: true }, { opp: 'NFO', isHome: true }, { opp: 'CHE', isHome: false }, { opp: 'MUN', isHome: false }, { opp: 'FUL', isHome: true }, { opp: 'ARS', isHome: false }, { opp: 'BHA', isHome: true }, { opp: 'EVE', isHome: false }, { opp: 'CHE', isHome: true }, { opp: 'MCI', isHome: false }, { opp: 'BRE', isHome: true }, { opp: 'NFO', isHome: false }, { opp: 'BOU', isHome: false }, { opp: 'LEE', isHome: true }, { opp: 'LIV', isHome: false }, { opp: 'TOT', isHome: true }, { opp: 'IPS', isHome: true }, { opp: 'SUN', isHome: false }, { opp: 'COV', isHome: true }, { opp: 'AVL', isHome: false }, { opp: 'CRY', isHome: true }, { opp: 'HUL', isHome: false }],
  NFO: [{ opp: 'LEE', isHome: true }, { opp: 'LIV', isHome: false }, { opp: 'TOT', isHome: true }, { opp: 'AVL', isHome: false }, { opp: 'COV', isHome: true }, { opp: 'CRY', isHome: false }, { opp: 'ARS', isHome: true }, { opp: 'IPS', isHome: false }, { opp: 'BRE', isHome: false }, { opp: 'MCI', isHome: true }, { opp: 'BOU', isHome: false }, { opp: 'CHE', isHome: true }, { opp: 'HUL', isHome: false }, { opp: 'BHA', isHome: true }, { opp: 'SUN', isHome: false }, { opp: 'EVE', isHome: true }, { opp: 'MUN', isHome: false }, { opp: 'NEW', isHome: false }, { opp: 'FUL', isHome: true }, { opp: 'HUL', isHome: true }, { opp: 'MCI', isHome: false }, { opp: 'BOU', isHome: true }, { opp: 'CHE', isHome: false }, { opp: 'BRE', isHome: true }, { opp: 'FUL', isHome: false }, { opp: 'MUN', isHome: true }, { opp: 'EVE', isHome: false }, { opp: 'NEW', isHome: true }, { opp: 'TOT', isHome: false }, { opp: 'AVL', isHome: true }, { opp: 'LEE', isHome: false }, { opp: 'LIV', isHome: true }, { opp: 'SUN', isHome: true }, { opp: 'BHA', isHome: false }, { opp: 'CRY', isHome: true }, { opp: 'ARS', isHome: false }, { opp: 'IPS', isHome: true }, { opp: 'COV', isHome: false }],
  SUN: [{ opp: 'IPS', isHome: false }, { opp: 'FUL', isHome: true }, { opp: 'BRE', isHome: false }, { opp: 'ARS', isHome: true }, { opp: 'MCI', isHome: false }, { opp: 'BHA', isHome: true }, { opp: 'BOU', isHome: false }, { opp: 'LEE', isHome: true }, { opp: 'COV', isHome: false }, { opp: 'CHE', isHome: true }, { opp: 'AVL', isHome: false }, { opp: 'TOT', isHome: true }, { opp: 'LIV', isHome: false }, { opp: 'NEW', isHome: false }, { opp: 'NFO', isHome: true }, { opp: 'CRY', isHome: true }, { opp: 'EVE', isHome: false }, { opp: 'MUN', isHome: false }, { opp: 'HUL', isHome: true }, { opp: 'LIV', isHome: true }, { opp: 'CHE', isHome: false }, { opp: 'COV', isHome: true }, { opp: 'TOT', isHome: false }, { opp: 'AVL', isHome: true }, { opp: 'HUL', isHome: false }, { opp: 'EVE', isHome: true }, { opp: 'CRY', isHome: false }, { opp: 'MUN', isHome: true }, { opp: 'BRE', isHome: true }, { opp: 'ARS', isHome: false }, { opp: 'IPS', isHome: true }, { opp: 'FUL', isHome: false }, { opp: 'NFO', isHome: false }, { opp: 'NEW', isHome: true }, { opp: 'BHA', isHome: false }, { opp: 'BOU', isHome: true }, { opp: 'LEE', isHome: false }, { opp: 'MCI', isHome: true }],
  TOT: [{ opp: 'BRE', isHome: false }, { opp: 'NEW', isHome: true }, { opp: 'NFO', isHome: false }, { opp: 'EVE', isHome: true }, { opp: 'AVL', isHome: true }, { opp: 'MUN', isHome: false }, { opp: 'COV', isHome: true }, { opp: 'CHE', isHome: false }, { opp: 'CRY', isHome: true }, { opp: 'LEE', isHome: false }, { opp: 'IPS', isHome: true }, { opp: 'SUN', isHome: false }, { opp: 'FUL', isHome: true }, { opp: 'ARS', isHome: true }, { opp: 'HUL', isHome: false }, { opp: 'LIV', isHome: false }, { opp: 'BOU', isHome: true }, { opp: 'BHA', isHome: true }, { opp: 'MCI', isHome: false }, { opp: 'FUL', isHome: false }, { opp: 'LEE', isHome: true }, { opp: 'CRY', isHome: false }, { opp: 'SUN', isHome: true }, { opp: 'IPS', isHome: false }, { opp: 'MCI', isHome: true }, { opp: 'BHA', isHome: false }, { opp: 'LIV', isHome: true }, { opp: 'BOU', isHome: false }, { opp: 'NFO', isHome: true }, { opp: 'EVE', isHome: false }, { opp: 'BRE', isHome: true }, { opp: 'NEW', isHome: false }, { opp: 'HUL', isHome: true }, { opp: 'ARS', isHome: false }, { opp: 'CHE', isHome: true }, { opp: 'COV', isHome: false }, { opp: 'MUN', isHome: true }, { opp: 'AVL', isHome: false }],
};

const TEAM_NAME_TO_SHORT: Record<string, string> = {
  ARSENAL: 'ARS', ARS: 'ARS',
  'ASTON VILLA': 'AVL', VILLA: 'AVL', AVL: 'AVL',
  BRIGHTON: 'BHA', BHA: 'BHA',
  BOURNEMOUTH: 'BOU', BOU: 'BOU',
  BRENTFORD: 'BRE', BRE: 'BRE',
  CHELSEA: 'CHE', CHE: 'CHE',
  COVENTRY: 'COV', COV: 'COV',
  'CRYSTAL PALACE': 'CRY', PALACE: 'CRY', CRY: 'CRY',
  EVERTON: 'EVE', EVE: 'EVE',
  FULHAM: 'FUL', FUL: 'FUL',
  'HULL CITY': 'HUL', HULL: 'HUL', HUL: 'HUL',
  IPSWICH: 'IPS', IPS: 'IPS',
  'LEEDS UNITED': 'LEE', LEEDS: 'LEE', LEE: 'LEE',
  LIVERPOOL: 'LIV', LIV: 'LIV',
  'MANCHESTER CITY': 'MCI', 'MAN CITY': 'MCI', MCI: 'MCI',
  'MANCHESTER UNITED': 'MUN', 'MAN UTD': 'MUN', MUN: 'MUN',
  NEWCASTLE: 'NEW', NEW: 'NEW',
  'NOTTINGHAM FOREST': 'NFO', FOREST: 'NFO', NFO: 'NFO',
  SUNDERLAND: 'SUN', SUN: 'SUN',
  TOTTENHAM: 'TOT', SPURS: 'TOT', TOT: 'TOT',
};

export const getTeamFixtureForGw = (teamCode?: string, targetGw: number = 1): string => {
  const raw = teamCode?.toUpperCase().trim() || 'ARS';
  const code = TEAM_NAME_TO_SHORT[raw] || raw;
  const list = TEAM_SCHEDULES[code] || TEAM_SCHEDULES['ARS'];
  const idx = Math.max(0, targetGw - 1) % list.length;
  const f = list[idx];
  return `${f.opp} (${f.isHome ? 'H' : 'A'})`;
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
  gw = 1,
  benchChips,
}) => {
  const { t, isRtl } = useLanguage();
  const [activeMenuSlot, setActiveMenuSlot] = useState<SquadSlotItem | null>(null);

  const starters = picks.filter((p) => p.slot <= 5);

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

  const renderCard = (p: SquadSlotItem) => {
    const isSelected = selectedSlot === p.slot;
    const posLabel = p.position === 1 ? t('gkp') : p.position === 2 ? t('def') : p.position === 3 ? t('mid') : t('fwd');

    if (p.isEmpty) {
      return (
        <div key={p.slot} className="fpl-player-wrapper">
          <div
            className="fpl-official-card empty"
            style={{
              background: 'rgba(0, 60, 35, 0.35)',
              border: '1.5px dashed rgba(255, 255, 255, 0.4)',
            }}
            onClick={() => onEmptySlotClick && onEmptySlotClick(p.position, p.slot)}
          >
            <div className="fpl-official-card-top-bar">
              <span className="fpl-card-price-tag" style={{ opacity: 0.8 }}>£5.0m</span>
            </div>

            <div className="fpl-official-card-jersey-wrap">
              <RealisticTeamJersey position={p.position} isEmpty={true} />
            </div>

            <div className="fpl-official-card-white-box">
              <div className="fpl-official-card-name" style={{ color: 'var(--fpl-purple)' }}>
                {isRtl ? '+ إضافة لاعب' : '+ Add Player'}
              </div>
              <div className="fpl-official-card-fixture" style={{ color: '#64748b' }}>
                {posLabel}
              </div>
            </div>
          </div>
        </div>
      );
    }

    const upcomingFix = p.fixtureInfo || getTeamFixtureForGw(p.teamShortName, gw || 1);
    const pointsText = p.points !== undefined && (gw || 1) === 1 ? `${p.points} ${t('pts')}` : '';
    const fixtureText = pointsText ? `${pointsText} • ${upcomingFix}` : upcomingFix;
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

    const isTransfersMode = Boolean(onRemovePlayer);

    return (
      <div key={p.slot} className="fpl-player-wrapper">
        <div
          className={`fpl-official-card ${isSelected ? 'selected-swap' : ''}`}
          onClick={() => handleCardClick(p)}
        >
          {/* Top Bar Header: Non-overlapping badges & price tags */}
          <div className="fpl-official-card-top-bar">
            {isTransfersMode ? (
              <button
                className="fpl-card-remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onRemovePlayer) onRemovePlayer(p.slot);
                }}
                title={isRtl ? 'إزالة اللاعب' : 'Remove Player'}
              >
                ×
              </button>
            ) : p.isCaptain ? (
              <div className="fpl-role-badge-pill captain" title="Captain (x2 pts)">C</div>
            ) : p.isVice ? (
              <div className="fpl-role-badge-pill vice" title="Vice Captain">V</div>
            ) : (
              <span className="fpl-card-price-tag">{costText}</span>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {(p.isCaptain || p.isVice || isTransfersMode) && (
                <span className="fpl-card-price-tag">{costText}</span>
              )}
              {onPlayerInfoClick && (
                <button className="fpl-badge-white-circle" onClick={handleInfoClick} title="View Stats">
                  <Eye size={12} style={{ color: '#0f172a' }} />
                </button>
              )}
            </div>
          </div>

          {/* Center Graphic: 3D Jersey */}
          <div className="fpl-official-card-jersey-wrap">
            <RealisticTeamJersey position={p.position} teamShort={p.teamShortName} />
          </div>

          {/* Bottom Official White Card Box matching user screenshot */}
          <div className="fpl-official-card-white-box">
            <div className="fpl-official-card-name">{playerNameText}</div>
            {!hideFixtures && (
              <div className="fpl-official-card-fixture">{fixtureText}</div>
            )}
          </div>

          {/* Swap Active Indicator */}
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

        {/* Pitch Rows */}
        <div className="fpl-pitch-rows">
          <div className="fpl-row">{gkpRow.map((p) => renderCard(p))}</div>
          <div className="fpl-row">{defRow.map((p) => renderCard(p))}</div>
          <div className="fpl-row">{midRow.map((p) => renderCard(p))}</div>
          <div className="fpl-row">{fwdRow.map((p) => renderCard(p))}</div>
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

              {/* Option 2: Make Captain */}
              {onSetCaptain && activeMenuSlot.slot <= 5 && (
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

              {/* Option 3: Make Vice Captain */}
              {onSetVice && activeMenuSlot.slot <= 5 && (
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
