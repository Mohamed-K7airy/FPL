import React from 'react';
import { Info, Target, Zap, Heart } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="about-page-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '30px 20px' }}>
      <header
        style={{
          background: 'linear-gradient(135deg, #37003c 0%, #1a001d 100%)',
          borderRadius: '20px',
          padding: '40px 30px',
          color: '#ffffff',
          marginBottom: '30px',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#00ff85', marginBottom: '10px' }}>
          <Info size={28} />
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '8px', fontFamily: "'Cairo', sans-serif" }}>
          عن منصة MINI FPL
        </h1>
        <p style={{ color: '#cbd5e1', fontSize: '1rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>
          منصة عربية متكاملة مخصصة لعشاق ومدرّبي فانتازي الدوري الإنجليزي الممتاز حول العالم.
        </p>
      </header>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '30px',
          lineHeight: 1.8,
          color: 'var(--text-main)',
          marginBottom: '30px',
        }}
      >
        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--fpl-purple)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={20} />
          <span>رؤيتنا وهدفنا</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', marginBottom: '24px' }}>
          تم تأسيس منصة MINI FPL لتقديم تجربة سلسة وتفاعلية تمكن جميع المدربين العرب من تجربة بناء التشكيلات وإدارة التغييرات ومتابعة النقاط فور حدوثها في مباريات البريميرليج ببيانات رسمية وسريعة.
        </p>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--fpl-purple)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={20} />
          <span>ماذا نقدم لمدرّبي الفانتازي؟</span>
        </h2>
        <ul style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.9, paddingRight: '20px' }}>
          <li>حساب النقاط المباشرة لجميع اللاعبين بما في ذلك الشباك النظيفة والتمريرات الحاسمة.</li>
          <li>نظام دوريات خاصة وعامة يتيح إنشاء وتحدي الأصدقاء بأكواد دعوة سريعة.</li>
          <li>مكتبة مقالات وإرشادات أسبوعية لتحليل الجولات واختيارات الكابتن المناسبة.</li>
          <li>واجهة سريعة ومتجاوبة تعمل بكفاءة على الهواتف والأجهزة اللوحية والحواسيب.</li>
        </ul>
      </div>
    </div>
  );
};
