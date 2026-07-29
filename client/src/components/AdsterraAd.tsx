import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface AdsterraAdProps {
  scriptSrc?: string;
  containerId?: string;
  style?: React.CSSProperties;
  className?: string;
}

export const AdsterraAd: React.FC<AdsterraAdProps> = ({
  scriptSrc = 'https://pl30596402.effectivecpmnetwork.com/88f7ff39b2fa2bc2777cff2289c5238d/invoke.js',
  containerId = 'container-88f7ff39b2fa2bc2777cff2289c5238d',
  style,
  className = '',
}) => {
  const { lang } = useLanguage();
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    adRef.current.innerHTML = '';

    const containerDiv = document.createElement('div');
    containerDiv.id = containerId;

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = scriptSrc;

    adRef.current.appendChild(containerDiv);
    adRef.current.appendChild(script);
  }, [scriptSrc, containerId]);

  return (
    <div style={{ margin: '24px 0', textAlign: 'center', ...style }}>
      <div
        style={{
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontWeight: 700,
        }}
      >
        {lang === 'ar' ? 'إعلان - ADVERTISEMENT' : 'ADVERTISEMENT'}
      </div>
      <div ref={adRef} style={{ minHeight: '90px', display: 'flex', justifyContent: 'center' }} />
    </div>
  );
};
