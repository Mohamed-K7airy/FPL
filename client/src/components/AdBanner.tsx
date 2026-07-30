import React, { useEffect } from 'react';

interface AdBannerProps {
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  responsive?: boolean;
  style?: React.CSSProperties;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slotId = '1234567890',
  format = 'auto',
  responsive = true,
  style,
}) => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (err) {
      console.log('AdSense script notification:', err);
    }
  }, []);

  return (
    <div
      className="ad-banner-container"
      style={{
        margin: '24px 0',
        textAlign: 'center',
        background: 'rgba(241, 245, 249, 0.6)',
        border: '1px dashed #cbd5e1',
        borderRadius: '12px',
        padding: '16px',
        minHeight: '100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
        إعلان / Advertisement
      </div>

      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: '90px' }}
        data-ad-client="ca-pub-6219326586167234"
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};
