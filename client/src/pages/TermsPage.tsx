import React from 'react';
import { ShieldCheck, FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
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
          شروط واستخدام منصة MINI FPL
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          آخر تحديث: يوليو 2026
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
          تستخدم المنصة إعلانات طرف ثالث مثل Google AdSense لدعم استمرار وتطوير الخدمات المجانية للمستخدمين. تخضع هذه الإعلانات لسياسات المزودين الرسميين.
        </p>
      </div>
    </div>
  );
};
