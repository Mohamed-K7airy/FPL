import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Trophy, 
  Users, 
  BookOpen, 
  Clock, 
  Share2, 
  Check, 
  ArrowLeft, 
  ChevronDown, 
  CheckCircle2, 
  Award, 
  Lock,
  Mail,
  Copy,
  Download,
  X,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import './LandingPage.css';

interface LandingPageProps {
  onBypassLock?: () => void;
}

interface VIPSubscriber {
  email: string;
  code: string;
  date: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onBypassLock }) => {
  const { user } = useAuth();

  // Determine if Admin tools should be visible
  const searchParams = new URLSearchParams(window.location.search);
  const isAdminParam = searchParams.get('admin') === 'true' || searchParams.get('preview') === 'true';
  const isLocalAdminMode = localStorage.getItem('minifpl_preview_mode') === 'true';
  const showAdminTools = user?.role === 'admin' || isAdminParam || isLocalAdminMode;

  // 15-day live countdown calculation
  const [timeLeft, setTimeLeft] = useState({
    days: 15,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [vipPassCode, setVipPassCode] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Admin VIP Subscribers Viewer Modal state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [subscribers, setSubscribers] = useState<VIPSubscriber[]>([]);
  const [copiedEmails, setCopiedEmails] = useState(false);

  // Load subscribers from localStorage & Supabase
  const loadSubscribers = async () => {
    const local = JSON.parse(localStorage.getItem('minifpl_vip_subscribers') || '[]');
    setSubscribers(local);

    try {
      const { data } = await supabase.from('vip_subscribers').select('*');
      if (data && data.length > 0) {
        const merged = [...data, ...local];
        const unique = Array.from(new Set(merged.map(s => s.email))).map(e => merged.find(s => s.email === e));
        setSubscribers(unique as VIPSubscriber[]);
      }
    } catch {
      // Fallback to local
    }
  };

  useEffect(() => {
    loadSubscribers();

    const savedTarget = localStorage.getItem('minifpl_launch_target');
    let targetTime: number;

    if (savedTarget) {
      targetTime = parseInt(savedTarget, 10);
    } else {
      targetTime = Date.now() + 15 * 24 * 60 * 60 * 1000;
      localStorage.setItem('minifpl_launch_target', targetTime.toString());
    }

    const timer = setInterval(() => {
      const now = Date.now();
      const difference = targetTime - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    const randomCode = `VIP-${Math.floor(1000 + Math.random() * 9000)}`;
    setVipPassCode(randomCode);
    setIsSubmitted(true);

    const newSub: VIPSubscriber = { email, code: randomCode, date: new Date().toLocaleDateString('ar-EG') };
    
    // Save to local storage
    const existing = JSON.parse(localStorage.getItem('minifpl_vip_subscribers') || '[]');
    existing.push(newSub);
    localStorage.setItem('minifpl_vip_subscribers', JSON.stringify(existing));
    setSubscribers(existing);

    // Save to Supabase if available
    try {
      await supabase.from('vip_subscribers').insert([{ email, code: randomCode }]);
    } catch {
      // Ignore if table does not exist
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const copyAllEmails = () => {
    const emailList = subscribers.map(s => s.email).join(', ');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(emailList);
      setCopiedEmails(true);
      setTimeout(() => setCopiedEmails(false), 3000);
    }
  };

  const exportCSV = () => {
    const headers = "Email,VIP Code,Date\n";
    const rows = subscribers.map(s => `"${s.email}","${s.code}","${s.date}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `minifpl_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="cs-landing-page">
      {/* Top Gradient Banner */}
      <div className="top-color-banner" />

      {/* Clean White Navbar Header */}
      <header className="navbar" style={{ background: '#ffffff', borderBottom: '1px solid var(--border-color)', color: '#0f172a' }}>
        <div className="navbar-brand-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.png" alt="MINI FPL Logo" className="navbar-logo-img" />
          </div>

          <div className="navbar-deadline-badge hide-tablet">
            <Clock size={14} style={{ color: 'var(--fpl-purple)' }} />
            <span>الانطلاق الرسمي بعد: 15 يوماً</span>
          </div>
        </div>

        <div className="navbar-actions">
          <button onClick={handleShare} className="btn-secondary" style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid var(--border-color)', fontSize: '0.85rem', fontWeight: 800 }}>
            {copiedLink ? <Check size={16} color="var(--fpl-green)" /> : <Share2 size={16} />}
            <span>{copiedLink ? 'تم نسخ الرابط' : 'مشاركة الرابط'}</span>
          </button>

          {/* ADMIN TOOLS - ONLY VISIBLE TO SITE OWNER / ADMIN / ?admin=true */}
          {showAdminTools && (
            <>
              <button 
                onClick={() => setShowAdminModal(true)} 
                className="btn-secondary" 
                style={{ background: 'rgba(79, 70, 229, 0.08)', color: 'var(--fpl-purple)', border: '1px solid rgba(79, 70, 229, 0.2)', fontSize: '0.82rem', fontWeight: 800 }}
              >
                <Mail size={14} />
                <span>الإيميلات المسجلة ({subscribers.length})</span>
              </button>

              {onBypassLock && (
                <button onClick={onBypassLock} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
                  <span>معاينة الأدمن</span>
                </button>
              )}
            </>
          )}
        </div>
      </header>

      {/* Brand Hero Section */}
      <section className="cs-hero-container">
        <div className="cs-hero-grid-pattern" />
        <div className="cs-hero-glow-1" />
        <div className="cs-hero-glow-2" />

        <div className="cs-hero-layout">
          {/* Content Side */}
          <div className="cs-hero-content">
            <div className="cs-brand-badge">
              <img src="/hero/minifpl-logo.jpg" alt="MINI FPL Logo" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              <span className="cs-brand-text">MINI FPL</span>
            </div>

            <h1 className="cs-hero-title">
              موقعنا سيكون متاحاً قريباً <br />
              <span style={{ color: '#00ff85' }}>الفانتزي بشكل مختلف عشان تستمتع</span>
            </h1>

            <p className="cs-hero-subtitle">
              تحدَّ أصدقاءك بتشكيلتك الخماسية في دوريات حماسية وتابع حساب النقاط المباشر لكل مواجهة فور حدوثها لتستمتع بالتجربة الأسرع والأمتع في عالم الفانتازي!
            </p>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', borderRadius: '12px', background: 'rgba(0, 255, 133, 0.15)', border: '1px solid rgba(0, 255, 133, 0.3)', color: '#00ff85', fontWeight: 800, fontSize: '0.9rem' }}>
                <Lock size={16} />
                <span>الموقع في مرحلة الجاهزية النهائية</span>
              </div>
            </div>
          </div>

          {/* Authentic Visual Player Cards Fan Showcase */}
          <div className="cs-fan-showcase">
            <div className="cs-fan-container">
              {/* Card 1: Bruno Fernandes */}
              <div className="cs-player-card cs-card-1">
                <span className="cs-card-badge mid">MID</span>
                <div className="cs-card-img-wrap">
                  <img src="/hero/bruno.jpg" alt="Bruno Fernandes" />
                </div>
                <div className="cs-card-info">
                  <div className="cs-card-name">B. Fernandes</div>
                  <div className="cs-card-price">£12.0m</div>
                </div>
              </div>

              {/* Card 2: Saka */}
              <div className="cs-player-card cs-card-2">
                <span className="cs-card-badge mid">MID</span>
                <div className="cs-card-img-wrap">
                  <img src="/players/saka.png" alt="Saka" />
                </div>
                <div className="cs-card-info">
                  <div className="cs-card-name">Saka</div>
                  <div className="cs-card-price">£9.5m</div>
                </div>
              </div>

              {/* Card 3: Haaland */}
              <div className="cs-player-card cs-card-3">
                <span className="cs-card-badge fwd">FWD</span>
                <div className="cs-card-img-wrap">
                  <img src="/hero/haaland.jpg" alt="Haaland" />
                </div>
                <div className="cs-card-info">
                  <div className="cs-card-name">Haaland</div>
                  <div className="cs-card-price">£15.5m</div>
                </div>
              </div>

              {/* Card 4: Pedro */}
              <div className="cs-player-card cs-card-4">
                <span className="cs-card-badge fwd">FWD</span>
                <div className="cs-card-img-wrap">
                  <img src="/hero/player3.png" alt="Pedro" />
                </div>
                <div className="cs-card-info">
                  <div className="cs-card-name">Pedro</div>
                  <div className="cs-card-price">£7.5m</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 15-Day Live Countdown & VIP Pre-Registration */}
      <section className="cs-countdown-section">
        <div className="cs-countdown-box">
          <div className="cs-countdown-title-wrap">
            <Clock size={18} />
            <span>العداد التنازلي للافتتاح المباشر (15 يوماً)</span>
          </div>

          <div className="cs-timer-grid">
            <div className="cs-timer-card">
              <div className="cs-timer-val">{String(timeLeft.days).padStart(2, '0')}</div>
              <div className="cs-timer-lbl">يوم</div>
            </div>

            <div className="cs-timer-card">
              <div className="cs-timer-val">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="cs-timer-lbl">ساعة</div>
            </div>

            <div className="cs-timer-card">
              <div className="cs-timer-val">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="cs-timer-lbl">دقيقة</div>
            </div>

            <div className="cs-timer-card">
              <div className="cs-timer-val">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="cs-timer-lbl">ثانية</div>
            </div>
          </div>

          {/* VIP Registration */}
          <div style={{ marginTop: '24px' }}>
            <h3 style={{ fontSize: 'clamp(1.15rem, 2.5vw, 1.35rem)', fontWeight: 900, marginBottom: '8px', color: '#ffffff' }}>
              كن أول من يسجل فور الانطلاق
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.6 }}>
              أدخل بريدك الإلكتروني ليصلك إشعار فوري وتصريح VIP عند تفعيل تسجيل الفرق رسمياً.
            </p>

            {!isSubmitted ? (
              <form onSubmit={handleSubscribe} className="cs-vip-form">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="أدخل بريدك الإلكتروني"
                  className="cs-vip-input"
                  required
                />
                <button type="submit" className="cs-vip-btn">
                  <span>انضم لقائمة VIP</span>
                  <ArrowLeft size={18} />
                </button>
              </form>
            ) : (
              <div style={{ background: 'rgba(0, 255, 133, 0.1)', border: '1px solid rgba(0, 255, 133, 0.4)', borderRadius: '16px', padding: '18px 14px' }}>
                <CheckCircle2 size={32} color="#00ff85" style={{ margin: '0 auto 8px' }} />
                <div style={{ color: '#00ff85', fontWeight: 900, fontSize: '1.05rem' }}>تم التسجيل بنجاح!</div>
                <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '2px', margin: '8px 0' }}>
                  {vipPassCode}
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>احفظ رمز VIP الخاص بك لافتتاح المنصة.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5-a-side Pitch Explanation Section */}
      <section className="cs-section">
        <div className="cs-pitch-banner">
          <div className="cs-pitch-img-box">
            <img src="/hero/fives_pitch.png" alt="التشكيلة الخماسية MINI FPL" />
          </div>

          <div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, color: '#ffffff', marginBottom: '16px' }}>
              اختر فريقك… لكن هذه المرة <span style={{ color: '#00ff85' }}>فريقك الخماسي</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.7 }}>
              <p>
                ستجد هنا أداة سهلة وبسيطة تساعدك في اختيار تشكيلتك الخماسية (حارس، مدافع، 2 وسط، ومهاجم) وفق أحدث بيانات وتحليلات الدوري الإنجليزي الممتاز.
              </p>
              <p>
                تحدَّ أصدقاءك في دوريات خماسية حماسية وتابع حساب النقاط المباشر لكل مواجهة فور حدوثها لتستمتع بالتجربة الأسرع والأمتع في عالم الفانتازي!
              </p>
              <p style={{ fontWeight: 800, color: '#00ff85' }}>
                استعد لتشكيل فريقك المنافس فور افتتاح المنصة خلال الأيام القادمة!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="cs-section" style={{ paddingTop: 0 }}>
        <h2 className="cs-section-title">لماذا يفضل المدربون منصة MINI FPL؟</h2>
        <p className="cs-section-subtitle">كل ما تحتاجه لإدارة فريقك ومنافسة أصدقائك في مكان واحد</p>

        <div className="cs-features-grid">
          <div className="cs-feature-card">
            <div className="cs-feature-icon">
              <Zap size={24} />
            </div>
            <h3 className="cs-feature-h3">حساب النقاط المباشر</h3>
            <p className="cs-feature-p">
              متابعة دقيقة للأهداف، التمريرات الحاسمة، الشباك النظيفة، ونقاط البونص فور حدوثها في مباريات الدوري الإنجليزي.
            </p>
          </div>

          <div className="cs-feature-card">
            <div className="cs-feature-icon">
              <Users size={24} />
            </div>
            <h3 className="cs-feature-h3">الدوريات الخاصة والعامة</h3>
            <p className="cs-feature-p">
              أنشئ دوريك الخاص وتنافس مع زملائك بأكواد دعوة سهلة أو قارن ترتيبك في الجدول العالمي للمدربين.
            </p>
          </div>

          <div className="cs-feature-card">
            <div className="cs-feature-icon">
              <BookOpen size={24} />
            </div>
            <h3 className="cs-feature-h3">استراتيجيات وأدلة أسبوعية</h3>
            <p className="cs-feature-p">
              نصائح دقيقة لاختيار الكابتن، أفضل التغييرات، ومواعيد تفعيل كروت الفري هيت والوايلد كارد.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="cs-section" style={{ paddingTop: 0 }}>
        <h2 className="cs-section-title">الأسئلة الشائعة حول الانطلاق</h2>
        <p className="cs-section-subtitle">إليك إجابات حول موعد المتاح وطريقة المشاركة</p>

        <div className="cs-faq-container">
          <div className="cs-faq-card" onClick={() => toggleFaq(0)}>
            <h4 className="cs-faq-h4">
              <span>متى سيكون الموقع متاحاً للجمهور؟</span>
              <ChevronDown size={18} style={{ transform: openFaqIndex === 0 ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </h4>
            {openFaqIndex === 0 && (
              <p className="cs-faq-p">
                سيكون الموقع متاحاً للجمهور فور نهاية العداد التنازلي الموضح بالصفحة (15 يوماً).
              </p>
            )}
          </div>

          <div className="cs-faq-card" onClick={() => toggleFaq(1)}>
            <h4 className="cs-faq-h4">
              <span>هل الخدمات والدوريات مجانية؟</span>
              <ChevronDown size={18} style={{ transform: openFaqIndex === 1 ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </h4>
            {openFaqIndex === 1 && (
              <p className="cs-faq-p">
                نعم، جميع خدمات موقع MINI FPL وإنشاء التشكيلات وحساب النقاط والدوريات مجانية 100%.
              </p>
            )}
          </div>

          <div className="cs-faq-card" onClick={() => toggleFaq(2)}>
            <h4 className="cs-faq-h4">
              <span>كيف يمكنني المشاركة كأول المسجلين؟</span>
              <ChevronDown size={18} style={{ transform: openFaqIndex === 2 ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </h4>
            {openFaqIndex === 2 && (
              <p className="cs-faq-p">
                يمكنك إدخال بريدك الإلكتروني في نموذج VIP الموضح أعلى الصفحة لتصلك رسالة فور تفعيل التسجيل مباشرة.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="cs-footer">
        <div className="cs-footer-text">
          جميع الحقوق محفوظة © {new Date().getFullYear()} MINI FPL — الفانتزي الخماسي الأسرع والأمتع
        </div>

        {/* ADMIN TOOLS IN FOOTER - ONLY VISIBLE TO SITE OWNER / ADMIN / ?admin=true */}
        {showAdminTools && (
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '12px' }}>
            <button onClick={() => setShowAdminModal(true)} className="cs-admin-btn">
              <Eye size={14} />
              <span>عرض قائمة الإيميلات المسجلة VIP ({subscribers.length})</span>
            </button>

            {onBypassLock && (
              <button onClick={onBypassLock} className="cs-admin-btn">
                <span>دخول الأدمن للمعاينة (Admin Bypass)</span>
              </button>
            )}
          </div>
        )}
      </footer>

      {/* Admin VIP Subscribers Viewer Modal */}
      {showAdminModal && showAdminTools && (
        <div className="cs-admin-modal-backdrop" onClick={() => setShowAdminModal(false)}>
          <div className="cs-admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cs-admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={20} color="#00ff85" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff' }}>
                  قائمة الإيميلات المسجلة في VIP ({subscribers.length})
                </h3>
              </div>
              <button 
                onClick={() => setShowAdminModal(false)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="cs-admin-modal-body">
              {subscribers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 10px', color: '#94a3b8' }}>
                  لا توجد إيميلات مسجلة بعد. سيظهر أي إيميل يقوم الزائر بكتابته هنا فورياً!
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                    <button 
                      onClick={copyAllEmails} 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      {copiedEmails ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedEmails ? 'تم نسخ جميع الإيميلات' : 'نسخ كل الإيميلات'}</span>
                    </button>

                    <button 
                      onClick={exportCSV} 
                      className="btn-secondary" 
                      style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.08)', color: '#ffffff' }}
                    >
                      <Download size={14} />
                      <span>تصدير ملف CSV</span>
                    </button>
                  </div>

                  <table className="cs-email-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>البريد الإلكتروني</th>
                        <th>كود VIP</th>
                        <th>تاريخ التسجيل</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((sub, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td style={{ color: '#00ff85', fontWeight: 800 }}>{sub.email}</td>
                          <td><span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>{sub.code}</span></td>
                          <td style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{sub.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
