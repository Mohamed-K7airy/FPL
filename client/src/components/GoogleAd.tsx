import React from 'react';
import { AdBanner } from './AdBanner';

interface GoogleAdProps {
  adSlot?: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * @deprecated Google AdSense has been decommissioned in favor of Monetag.
 * This component remains as a fallback wrapper around AdBanner to preserve layout compatibility.
 */
export const GoogleAd: React.FC<GoogleAdProps> = ({ adSlot, adFormat = 'auto', fullWidthResponsive = true, style, className }) => {
  return <AdBanner slotId={adSlot} format={adFormat} responsive={fullWidthResponsive} style={style} className={className} />;
};
