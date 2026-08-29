import React from 'react';

interface AdBannerProps {
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  style,
  className,
}) => {
  // Google AdSense removed in favor of Monetag.
  // Container placeholder preserved for future ad zone placements.
  return (
    <div
      className={`ad-container ${className || ''}`}
      style={{
        margin: '0',
        textAlign: 'center',
        ...style,
      }}
    />
  );
};
