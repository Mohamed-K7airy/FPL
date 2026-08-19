import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { GoogleAd } from '../components/GoogleAd';
import { ShieldCheck, Mail, Lock, Cookie, FileText } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  const { lang } = useLanguage();

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 20px' }}>
      <div className="glass-card" style={{ padding: '36px', lineHeight: 1.8 }}>
        {lang === 'ar' ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <ShieldCheck size={36} color="var(--fpl-green)" />
              <h1 style={{ color: 'var(--fpl-purple)', fontSize: '2.2rem', fontWeight: 800, margin: 0 }}>
                سياسة الخصوصية للموقع - Privacy Policy
              </h1>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
              تاريخ آخر تحديث: 28 يوليو 2026
            </p>

            <section style={{ marginBottom: '28px' }}>
              <h2 style={{ color: 'var(--fpl-cyan)', fontSize: '1.3rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} /> 1. مقدمة وهدف السياسة
              </h2>
              <p>
                أهلاً بكم في منصة <strong>MINI FPL</strong>. نحن نولي خصوصية زوارنا ومستخدمينا أهمية قصوى ونلتزم بحمايتها بشكل كامل. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وتأمين البيانات الشخصية والمعلومات التقنية، وتتوافق التزاماً تاماً مع شروط وسياسات برنامج <strong>Google AdSense</strong> ولوائح حماية البيانات العامة (GDPR).
              </p>
            </section>

            <section style={{ marginBottom: '28px' }}>
              <h2 style={{ color: 'var(--fpl-cyan)', fontSize: '1.3rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cookie size={20} /> 2. إعلانات Google AdSense وملفات تعريف الارتباط (Cookies)
              </h2>
              <p>
                نحن نستخدم شركات إعلانية من طرف ثالث، وفي مقدمتها <strong>Google AdSense</strong>، لتقديم الإعلانات عند زيارتك لمنصتنا:
              </p>
              <ul style={{ paddingRight: '24px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>تستخدم شركة Google ومزودو الخدمة الجدد ملفات تعريف الارتباط (Cookies) لعرض الإعلانات بناءً على زيارات المستخدم السابقة لموقعنا أو لمواقع أخرى على شبكة الإنترنت.</li>
                <li>يساعد استخدام Google لملفات تعريف الإعلانات (مثل DART cookie) على عرض إعلانات مخصصة للمستخدمين بناءً على تصفحهم لموقعنا والمواقع الأخرى.</li>
                <li>يمكن للمستخدمين إيقاف الإعلانات المخصصة عبر التوجه إلى <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" style={{ color: 'var(--fpl-cyan)', textDecoration: 'underline' }}>إعدادات الإعلانات من Google</a>.</li>
                <li>كما يمكنك زيارة موقع <a href="http://www.aboutads.info/choices/" target="_blank" rel="noreferrer" style={{ color: 'var(--fpl-cyan)', textDecoration: 'underline' }}>AboutAds.info</a> لإلغاء استخدام ملفات تعريف الارتباط من قِبل موردي الإعلانات الخارجيين.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '28px' }}>
              <h2 style={{ color: 'var(--fpl-cyan)', fontSize: '1.3rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={20} /> 3. البيانات التي نجمعها وكيفية حمايتها
              </h2>
              <p>
                نحن نجمع الحد الأدنى المطلق من البيانات لغرض تشغيل لعبة الفانتازي وحساب النقاط فقط:
              </p>
              <ul style={{ paddingRight: '24px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>بيانات الحساب:</strong> البريد الإلكتروني، كلمة المرور (مشفّرة بنظام Bcrypt ولا تظهر لأي شخص)، واسم تشكيلة الفانتازي.</li>
                <li><strong>بيانات الاستخدام التلقائية:</strong> يتم تسجيل عنوان IP ونوع المتصفح ونظام التشغيل لغرض تحسين الأداء والأمان ومكافحة الاحتيال.</li>
                <li><strong>السرية والخصوصية:</strong> نعدكم بعدم بيع أو مشاركة أو تأجير أي بيانات شخصية لأي جهات خارجية تحت أي ظرف.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '28px' }}>
              <h2 style={{ color: 'var(--fpl-cyan)', fontSize: '1.3rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={20} /> 4. حقوق المستخدم والتواصل معنا
              </h2>
              <p>
                يحق لكل مستخدم طلب تعديل أو حذف بياناته أو استفساره حول أي بنود متعلقة بالخصوصية. يسعدنا استقبال استفساراتكم عبر التواصل الإلكتروني على:
                <br />
                <span style={{ color: 'var(--fpl-purple)', fontWeight: 700 }}>support@sphinxcs.online</span>
              </p>
            </section>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <ShieldCheck size={36} color="var(--fpl-green)" />
              <h1 style={{ color: 'var(--fpl-purple)', fontSize: '2.2rem', fontWeight: 800, margin: 0 }}>
                Privacy Policy - MINI FPL
              </h1>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
              Last Updated: July 28, 2026
            </p>

            <section style={{ marginBottom: '28px' }}>
              <h2 style={{ color: 'var(--fpl-cyan)', fontSize: '1.3rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} /> 1. Overview & Policy Objective
              </h2>
              <p>
                Welcome to <strong>MINI FPL</strong>. We respect the privacy of our visitors and users and are committed to protecting personal data in full compliance with <strong>Google AdSense Publisher Policies</strong> and general data protection standards (GDPR / CCPA).
              </p>
            </section>

            <section style={{ marginBottom: '28px' }}>
              <h2 style={{ color: 'var(--fpl-cyan)', fontSize: '1.3rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cookie size={20} /> 2. Google AdSense & Cookies Policy
              </h2>
              <p>
                We use third-party advertising vendors including <strong>Google AdSense</strong> to serve advertisements when you visit our website:
              </p>
              <ul style={{ paddingLeft: '24px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Google's use of advertising cookies enables it and its partners to serve ads based on user visits to our site and/or other sites on the Internet.</li>
                <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" style={{ color: 'var(--fpl-cyan)', textDecoration: 'underline' }}>Google Ads Settings</a>.</li>
                <li>Alternatively, users can opt out of third-party vendor use of cookies for personalized advertising by visiting <a href="http://www.aboutads.info/choices/" target="_blank" rel="noreferrer" style={{ color: 'var(--fpl-cyan)', textDecoration: 'underline' }}>AboutAds.info</a>.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '28px' }}>
              <h2 style={{ color: 'var(--fpl-cyan)', fontSize: '1.3rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={20} /> 3. Data Collection & Security
              </h2>
              <p>
                We only collect minimal data required to manage your fantasy squad and calculate scoreboards:
              </p>
              <ul style={{ paddingLeft: '24px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Account Data:</strong> Email, bcrypt-hashed password, and squad team name.</li>
                <li><strong>Data Protection:</strong> We never share, sell, or rent user data to third parties.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '28px' }}>
              <h2 style={{ color: 'var(--fpl-cyan)', fontSize: '1.3rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={20} /> 4. Contact Us
              </h2>
              <p>
                If you have questions regarding this Privacy Policy, please reach us at:
                <br />
                <span style={{ color: 'var(--fpl-purple)', fontWeight: 700 }}>support@sphinxcs.online</span>
              </p>
            </section>
          </>
        )}

        <GoogleAd adSlot="9988776655" />
      </div>
    </div>
  );
};

