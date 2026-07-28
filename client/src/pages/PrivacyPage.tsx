import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { GoogleAd } from '../components/GoogleAd';

export const PrivacyPage: React.FC = () => {
  const { lang } = useLanguage();

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <div className="glass-card" style={{ padding: '32px', lineHeight: 1.8 }}>
        {lang === 'ar' ? (
          <>
            <h1 style={{ color: 'var(--fpl-green)', fontSize: '2rem', marginBottom: '16px' }}>
              سياسة الخصوصية للموقع - Privacy Policy
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
              آخر تحديث: 28 يوليو 2026
            </p>

            <section style={{ marginBottom: '24px' }}>
              <h2 style={{ color: 'var(--fpl-cyan)', fontSize: '1.3rem', marginBottom: '8px' }}>
                1. مقدمة
              </h2>
              <p>
                أهلاً بكم في منصة <strong>MINI FPL</strong>. نحن نحترم خصوصية جميع زوارنا ومستخدمينا ونلتزم بحمايتها بالكامل. توضح سياسة الخصوصية هذه نوع البيانات التي نجمعها وكيفية استخدامها وحمايتها، وتلتزم بأعلى معايير الأمان والشروط المطلوبة من برنامج <strong>Google AdSense</strong>.
              </p>
            </section>

            <section style={{ marginBottom: '24px' }}>
              <h2 style={{ color: 'var(--fpl-cyan)', fontSize: '1.3rem', marginBottom: '8px' }}>
                2. إعلانات Google AdSense وملفات تعريف الارتباط (Cookies)
              </h2>
              <p>
                نحن نستخدم خدمات الإعلانات المقدمة من **Google AdSense** لعرض الإعلانات عند زيارتك لموقعنا.
              </p>
              <ul style={{ paddingRight: '20px', marginTop: '8px' }}>
                <li>تستخدم شركة Google ملفات تعريف الارتباط (Cookies) لعرض الإعلانات بناءً على زيارات المستخدمين السابقة لموقعنا أو لمواقع أخرى على شبكة الإنترنت.</li>
                <li>يساعد ملف تعريف الارتباط DART شركة Google وشركاءها على عرض الإعلانات للمستخدمين استناداً إلى زياراتهم لموقعنا ومواقع أخرى.</li>
                <li>يمكن للمستخدمين إلغاء استخدام ملف تعريف الارتباط DART لزيارة الإعلانات ذات الاهتمامات المشتركة من خلال زيارة سياسة الخصوصية الخاصة بإعلانات Google وشبكة المحتوى.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '24px' }}>
              <h2 style={{ color: 'var(--fpl-cyan)', fontSize: '1.3rem', marginBottom: '8px' }}>
                3. البيانات التي نجمعها
              </h2>
              <p>
                عند تسجيل حساب في منصتنا، نطلب بيانات تقتصر على البريد الإلكتروني وكلمة المرور المشفرة واسم الفريق لغرض تمكينك من بناء تشكيلة الفانتازي وحساب النقاط، ولا نشارك هذه البيانات مع أي أطراف خارجية إطلاقاً.
              </p>
            </section>

            <section style={{ marginBottom: '24px' }}>
              <h2 style={{ color: 'var(--fpl-cyan)', fontSize: '1.3rem', marginBottom: '8px' }}>
                4. الاتصال بنا
              </h2>
              <p>
                إذا كانت لديك أي استفسارات أو أسئلة حول سياسة الخصوصية أو استخدام الإعلانات، يمكنك التواصل معنا مباشرة عبر البريد الإلكتروني الخاص بمدير الموقع.
              </p>
            </section>
          </>
        ) : (
          <>
            <h1 style={{ color: 'var(--fpl-green)', fontSize: '2rem', marginBottom: '16px' }}>
              Privacy Policy - MINI FPL
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
              Last Updated: July 28, 2026
            </p>

            <section style={{ marginBottom: '24px' }}>
              <h2 style={{ color: 'var(--fpl-cyan)', fontSize: '1.3rem', marginBottom: '8px' }}>
                1. Introduction
              </h2>
              <p>
                Welcome to <strong>MINI FPL</strong>. We respect the privacy of our visitors and are committed to protecting it. This Privacy Policy outlines the information we collect and how it is used, fully complying with <strong>Google AdSense</strong> publisher policies.
              </p>
            </section>

            <section style={{ marginBottom: '24px' }}>
              <h2 style={{ color: 'var(--fpl-cyan)', fontSize: '1.3rem', marginBottom: '8px' }}>
                2. Google AdSense & Cookies
              </h2>
              <p>
                We use third-party advertising companies such as Google AdSense to serve ads when you visit our website.
              </p>
              <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                <li>Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to our sites and/or other sites on the Internet.</li>
                <li>Users may opt out of personalized advertising by visiting Google's Ads Settings.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '24px' }}>
              <h2 style={{ color: 'var(--fpl-cyan)', fontSize: '1.3rem', marginBottom: '8px' }}>
                3. Data We Collect
              </h2>
              <p>
                We only store your account email, hashed password, and fantasy team name to calculate gameweek scores. We do not sell or transfer your personal data to third parties.
              </p>
            </section>
          </>
        )}

        <GoogleAd adSlot="9988776655" />
      </div>
    </div>
  );
};
