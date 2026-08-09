import React from 'react';
import { AdBanner } from './AdBanner';

interface GoogleAdProps {
  adSlot?: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export const GoogleAd: React.FC<GoogleAdProps> = ({ adSlot, adFormat = 'auto', fullWidthResponsive = true, style }) => {
  return <AdBanner slotId={adSlot} format={adFormat} responsive={fullWidthResponsive} style={style} />;
};
