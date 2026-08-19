import React, { useEffect } from 'react';

interface AdBannerProps {
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  responsive?: boolean;
  style?: React.CSSProperties;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slotId,
  format = 'auto',
  responsive = true,
  style,
}) => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && slotId) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (err) {
      // AdSense push notification
    }
  }, [slotId]);

  if (!slotId) {
    return null;
  }

  return (
    <div
      className="ad-banner-container"
      style={{
        margin: '20px 0',
        textAlign: 'center',
        overflow: 'hidden',
        ...style,
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-6219326586167234"
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};
