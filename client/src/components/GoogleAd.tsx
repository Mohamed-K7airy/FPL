import React from 'react';
import { AdsterraAd } from './AdsterraAd';

interface GoogleAdProps {
  adSlot?: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export const GoogleAd: React.FC<GoogleAdProps> = ({ style, className = '' }) => {
  return <AdsterraAd style={style} className={className} />;
};
