import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, MessageSquare, Send, CheckCircle, PhoneCall, HelpCircle } from 'lucide-react';
import { GoogleAd } from '../components/GoogleAd';

export const ContactPage: React.FC = () => {
  const { lang } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Send form data via mailto link as fallback
    const subject = encodeURIComponent(formData.subject);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    );
    window.open(`mailto:support@sphinxcs.online?subject=${subject}&body=${body}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 20px' }}>
      <header
        style={{
          background: 'linear-gradient(135deg, var(--fpl-purple) 0%, #1a001d 100%)',
          borderRadius: '20px',
          padding: '40px 30px',
          color: '#ffffff',
          marginBottom: '30px',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#00ff85', marginBottom: '10px' }}>
          <Mail size={32} />
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '8px', fontFamily: "'Cairo', sans-serif" }}>
          {lang === 'ar' ? 'اتصل بنا - مركز الدعم والمساعدة' : 'Contact Us - Help Center'}
        </h1>
        <p style={{ color: '#cbd5e1', fontSize: '1rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>
          {lang === 'ar'
            ? 'يسعدنا دائماً استلام استفساراتكم واقتراحاتكم حول منصة MINI FPL وتحليلات فانتازي الدوري الإنجليزي الممتاز.'
            : 'We are happy to receive your inquiries and feedback regarding MINI FPL and Fantasy Premier League analytics.'}
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Contact Information & FAQ */}
        <div className="glass-card" style={{ padding: '30px', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PhoneCall size={20} />
            <span>{lang === 'ar' ? 'معلومات التواصل' : 'Contact Info'}</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.95rem', lineHeight: 1.7 }}>
            <div>
              <strong>{lang === 'ar' ? 'البريد الإلكتروني للدعم:' : 'Support Email:'}</strong>
              <br />
              <span style={{ color: 'var(--fpl-cyan)', fontWeight: 700 }}>support@sphinxcs.online</span>
            </div>

            <div>
              <strong>{lang === 'ar' ? 'ساعات العمل والإجابة:' : 'Working Hours:'}</strong>
              <br />
              <span style={{ color: 'var(--text-muted)' }}>
                {lang === 'ar' ? 'نرد على جميع الرسائل خلال 24 ساعة عمل طوال أيام الأسبوع.' : 'We respond within 24 business hours 7 days a week.'}
              </span>
            </div>

            <hr style={{ border: 0, borderTop: '1px solid var(--border-color)', margin: '10px 0' }} />

            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--fpl-purple)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={18} />
              <span>{lang === 'ar' ? 'أسئلة شائعة متكررة' : 'Frequently Asked Questions'}</span>
            </h3>

            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <p style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                {lang === 'ar' ? 'كيف يتم تفعيل الحسابات وتحديث النقاط؟' : 'How are scores updated?'}
              </p>
              <p style={{ margin: 0 }}>
                {lang === 'ar'
                  ? 'يتم تحديث النقاط تلقائياً بناءً على البيانات الرسمية لمباريات البريميرليج بشكل مباشر.'
                  : 'Scores are updated automatically in real-time from official Premier League data.'}
              </p>
            </div>

            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <p style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                {lang === 'ar' ? 'هل المنصة مجانية بالكامل؟' : 'Is the platform completely free?'}
              </p>
              <p style={{ margin: 0 }}>
                {lang === 'ar'
                  ? 'نعم، جميع الخدمات والمقالات والتحليلات مجانية 100% لجميع المدربين.'
                  : 'Yes, all services, analytics, and articles are 100% free for all managers.'}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass-card" style={{ padding: '30px', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={20} />
            <span>{lang === 'ar' ? 'أرسل لنا رسالة' : 'Send Us a Message'}</span>
          </h2>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--fpl-green)' }}>
              <CheckCircle size={48} style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                {lang === 'ar' ? 'تم استلام رسالتك بنجاح!' : 'Message Received Successfully!'}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                {lang === 'ar'
                  ? 'شكراً لتواصلك معنا. سيقوم فريق Support بالرد عليك عبر البريد الإلكتروني في أقرب وقت.'
                  : 'Thank you for reaching out. Our support team will reply via email shortly.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
                  {lang === 'ar' ? 'الاسم الكامل:' : 'Full Name:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ar' ? 'أدخل اسمك الكريم' : 'Enter your name'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
                  {lang === 'ar' ? 'البريد الإلكتروني:' : 'Email Address:'}
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
                  {lang === 'ar' ? 'موضوع الرسالة:' : 'Subject:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ar' ? 'مثال: استفسار عن نقاط الكابتن' : 'e.g. Question about scores'}
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
                  {lang === 'ar' ? 'تفاصيل الرسالة:' : 'Message Details:'}
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={lang === 'ar' ? 'اكتب استفسارك هنا...' : 'Write your message here...'}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', fontWeight: 800, marginTop: '8px' }}
              >
                <Send size={16} />
                <span>{lang === 'ar' ? 'إرسال الرسالة' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      <GoogleAd adSlot="1122334455" />
    </div>
  );
};
