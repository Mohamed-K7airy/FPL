import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const { lang } = useLanguage();

  return (
    <div className="terms-page-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '30px 20px' }}>
      <header
        style={{
          background: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '30px',
          marginBottom: '30px',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--fpl-purple)', marginBottom: '10px' }}>
          <FileText size={28} />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--fpl-purple)', marginBottom: '8px' }}>
          {lang === 'ar' ? 'شروط واستخدام منصة MINI FPL' : 'Terms of Service - MINI FPL'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          {lang === 'ar' ? 'آخر تحديث: يوليو 2026' : 'Last Updated: July 2026'}
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
        }}
      >
        {lang === 'ar' ? (
          <>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '12px' }}>
              1. القبول بالشروط
            </h2>
            <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
              بمجرد استخدام منصة MINI FPL (`sphinxcs.online`)، فإنك توافق على الالتزام بشروط الخدمة هذه وسياسة الخصوصية الخاصة بنا. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام المنصة.
            </p>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '12px' }}>
              2. طبيعة الخدمة والاستقلالية
            </h2>
            <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
              منصة MINI FPL هي مشروع مستمر ومستقل يقدم محاكاة وأدوات إحصائية لمتابعة الدوري الإنجليزي الممتاز. هذه المنصة غير تابعة ولا مدعومة بشكل رسمي من رابطة الدوري الإنجليزي الممتاز (Premier League) وتوفر خدماتها بغرض الترفيه والتحليل الرياضي.
            </p>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '12px' }}>
              3. حسابات المستخدمين والمسؤولية
            </h2>
            <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
              يتحمل المستخدم المسؤولية الكاملة عن الحفاظ على سرية معلومات حسابه وكلمة المرور. يُحظر استخدام المنصة لأي أغراض شائنة أو محاولات للتأثير على سير الخدمات الفنية.
            </p>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '12px' }}>
              4. الإعلانات والشركاء
            </h2>
            <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
              تستخدم المنصة إعلانات طرف ثالث وشبكات إعلانية معتمدة (مثل Monetag) لدعم استمرار وتطوير الخدمات المجانية للمستخدمين. تخضع هذه الإعلانات لسياسات المزودين الرسميين.
            </p>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '12px' }}>
              1. Acceptance of Terms
            </h2>
            <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
              By using the MINI FPL platform (sphinxcs.online), you agree to comply with these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use the platform.
            </p>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '12px' }}>
              2. Nature of Service & Independence
            </h2>
            <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
              MINI FPL is an independent, ongoing project that provides simulation and statistical tools for following the English Premier League. This platform is not affiliated with or endorsed by the Premier League and provides its services for entertainment and sports analysis purposes.
            </p>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '12px' }}>
              3. User Accounts & Responsibility
            </h2>
            <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
              Users are fully responsible for maintaining the confidentiality of their account information and password. Using the platform for malicious purposes or attempting to disrupt technical services is prohibited.
            </p>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '12px' }}>
              4. Advertising & Partners
            </h2>
            <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
              The platform uses third-party advertisements and certified advertising networks (such as Monetag) to support the continuation and development of free services for users. These advertisements are subject to the official providers' policies.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
