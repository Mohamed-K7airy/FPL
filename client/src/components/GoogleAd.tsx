import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface GoogleAdProps {
  adSlot?: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export const GoogleAd: React.FC<GoogleAdProps> = ({
  adSlot = '1234567890',
  adFormat = 'auto',
  fullWidthResponsive = true,
  style = { display: 'block', minHeight: '100px' },
  className = '',
}) => {
  const { lang } = useLanguage();

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (e) {
      // Ignore initial render push error in development
    }
  }, []);

  const publisherId = import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-6219326586167234';

  return (
    <div className={`google-ad-wrapper ${className}`} style={{ margin: '20px 0', textAlign: 'center' }}>
      <div
        style={{
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          marginBottom: '4px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
      >
        {lang === 'ar' ? 'إعلان - ADVERTISEMENT' : 'ADVERTISEMENT'}
      </div>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px stroke rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          overflow: 'hidden',
          ...style,
        }}
        data-ad-client={publisherId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  );
};
