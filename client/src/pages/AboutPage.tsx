import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Info, Target, Zap, Award, BarChart3, ShieldCheck, Mail } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { lang } = useLanguage();

  return (
    <div className="about-page-container" style={{ maxWidth: '960px', margin: '0 auto', padding: '36px 20px' }}>
      <header
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #311042 50%, #0f172a 100%)',
          borderRadius: '24px',
          padding: '48px 32px',
          color: '#ffffff',
          marginBottom: '36px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#00ff85', marginBottom: '14px' }}>
          <Info size={32} />
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '12px', fontFamily: "'Cairo', sans-serif" }}>
          {lang === 'ar' ? 'عن منصة MINI FPL' : 'About MINI FPL'}
        </h1>
        <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.8 }}>
          {lang === 'ar'
            ? 'المركز التحليلي العربي الرائد لاستراتيجيات وإحصائيات فانتازي الدوري الإنجليزي الممتاز (FPL).'
            : 'The premier analytical hub for Fantasy Premier League (FPL) strategies, advanced statistics, and expert gameweek management.'}
        </p>
      </header>

      {/* Vision & Mission Card */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          padding: '36px',
          lineHeight: 1.85,
          color: 'var(--text-main)',
          marginBottom: '28px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--fpl-purple)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Target size={22} style={{ color: '#00ff85' }} />
          <span>{lang === 'ar' ? 'رؤيتنا ورسالتنا التحريرية' : 'Our Vision & Editorial Mission'}</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '20px' }}>
          {lang === 'ar'
            ? 'تأسست منصة MINI FPL بهدف سد الفجوة في المحتوى التحليلي العربي المتخصص في لعبة فانتازي الدوري الإنجليزي الممتاز. نؤمن بأن النجاح في الفانتازي ليس مجرد ضربة حظ، بل هو علم يعتمد على قراءة المؤشرات الرياضية المتقدمة وتحليل سلوك السوق والتخطيط الاستراتيجي متعدد الجولات.'
            : 'MINI FPL was established to provide top-tier analytical coverage for Fantasy Premier League managers. We believe that sustained fantasy success is driven by data intelligence, tactical planning, and market understanding.'}
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0' }}>
          {lang === 'ar'
            ? 'يقوم فريقنا التحريري بإعداد مقالات معمقة أسبوعياً تشمل دراسة الأهداف المتوقعة (xG)، التمريرات الحاسمة المتوقعة (xA)، وتحليل أداء الأندية دفاعياً وهجومياً، لمساعدة المدربين في اتخاذ قرارات مدروسة وتجنب الخصومات السلبية.'
            : 'Our editorial and analytics team publishes weekly deep-dives covering Expected Goals (xG), Expected Assists (xA), fixture difficulty swings, and chip strategies to empower managers with winning decisions.'}
        </p>
      </div>

      {/* Methodology & Data Intelligence */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          padding: '36px',
          lineHeight: 1.85,
          color: 'var(--text-main)',
          marginBottom: '28px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--fpl-purple)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BarChart3 size={22} style={{ color: '#38bdf8' }} />
          <span>{lang === 'ar' ? 'منهجيتنا الإحصائية والتحليلية' : 'Our Analytical Methodology'}</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e1b4b', marginBottom: '8px' }}>
              {lang === 'ar' ? '1. مؤشرات الأداء الحقيقي' : '1. Underlying Performance'}
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#64748b', margin: 0 }}>
              {lang === 'ar'
                ? 'الاعتماد على إحصائيات xG و xA والتسديدات داخل منطقة الجزاء بدلاً من الاكتفاء بالنتائج الرقمية اللحظية.'
                : 'Prioritizing shot volume inside the box, key pass generation, and xG over deceptive short-term luck.'}
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e1b4b', marginBottom: '8px' }}>
              {lang === 'ar' ? '2. خوارزميات حركة الأسعار' : '2. Market Price Trends'}
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#64748b', margin: 0 }}>
              {lang === 'ar'
                ? 'رصد تغيرات أسعار اللاعبين اليومية لتنمية القيمة الشرائية للتشكيلة قبل غلق المواعيد النهائية.'
                : 'Monitoring daily net transfer volumes to expand overall squad budget before deadlines.'}
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e1b4b', marginBottom: '8px' }}>
              {lang === 'ar' ? '3. إدارة الخواص التكتيكية' : '3. Tactical Chip Execution'}
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#64748b', margin: 0 }}>
              {lang === 'ar'
                ? 'توجيهات مخصصة لاستخدام الوايلد كارد، الفري هيت، التريبل كابتن، والبنش بوست في الجولات المزدوجة والفارغة.'
                : 'Customized deployment models for Wildcards, Free Hits, Triple Captains, and Bench Boosts during DGWs/BGWs.'}
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer & Contact Card */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          padding: '36px',
          lineHeight: 1.85,
          color: 'var(--text-main)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--fpl-purple)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={22} style={{ color: '#ec4899' }} />
          <span>{lang === 'ar' ? 'إخلاء المسؤولية والتواصل' : 'Disclaimer & Contact Info'}</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '16px' }}>
          {lang === 'ar'
            ? 'منصة MINI FPL هي موقع رياضي تحليلي مستقل غير تابع رسمياً للدوري الإنجليزي الممتاز (Premier League) أو للعلامة التجارية المسجلة Fantasy Premier League. كافة الإحصائيات والأرقام الواردة تُستخدم لأغراض التحليل الإخباري والرياضي التثقيفي.'
            : 'MINI FPL is an independent sports analytics portal not officially affiliated with the Premier League or Fantasy Premier League. All data is referenced for analytical, journalistic, and educational purposes.'}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', color: 'var(--text-main)', fontWeight: 700 }}>
          <Mail size={20} style={{ color: '#0284c7' }} />
          <span>{lang === 'ar' ? 'البريد الإلكتروني للتحرير والدعم:' : 'Editorial & Support Contact:'}</span>
          <a href="mailto:support@sphinxcs.online" style={{ color: '#0284c7', textDecoration: 'underline' }}>
            support@sphinxcs.online
          </a>
        </div>
      </div>
    </div>
  );
};
