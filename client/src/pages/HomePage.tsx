import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { AdBanner } from '../components/AdBanner';
import { Trophy, ShieldCheck, Zap, BookOpen, Users, Star, ChevronLeft, ChevronRight, HelpCircle, ArrowRight, Plus, TrendingUp } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { isRtl } = useLanguage();

  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div className="home-page-container" style={{ width: '100%' }}>
      {/* Hero Section - Full Bleed Edge-to-Edge */}
      <section className="ref-hero-container">
        <div className="ref-hero-grid-pattern" />
        <div className="ref-hero-glow-1" />
        <div className="ref-hero-glow-2" />

        <div className="ref-hero-layout" style={{ maxWidth: '1320px', margin: '0 auto' }}>
          {/* Right side: Content */}
          <div className="ref-hero-content">
            <div className="ref-hero-logo-badge">
              <img src="/hero/minifpl-logo.jpg" alt="MINI FPL Logo" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              <span className="ref-hero-logo-text">MINI FPL</span>
            </div>

            <h1 className="ref-hero-title">
              الفانتزي هنا بشكل مختلف <span className="highlight-green">عشان تستمتع</span>
            </h1>

            <p className="ref-hero-subtitle">
              تحدَّ أصدقاءك بتشكيلتك الخماسية في دوريات حماسية وتابع حساب النقاط المباشر لكل مواجهة فور حدوثها لتستمتع بالتجربة الأسرع والأمتع في عالم الفانتازي!
            </p>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
              {user ? (
                <Link to="/squad" className="ref-pink-btn">
                  <span>الانتقال لفرقتي ({user.team_name})</span>
                  <ArrowIcon size={22} />
                </Link>
              ) : (
                <Link to="/register" className="ref-pink-btn">
                  <span>انضم الآن</span>
                  <ArrowIcon size={22} />
                </Link>
              )}

              <Link to="/guides" className="ref-outline-btn">
                <BookOpen size={20} />
                <span>عن المنصة وشرح اللعبة</span>
              </Link>
            </div>
          </div>

          {/* Left side: Visual Player Cards Fan Showcase */}
          <div className="ref-hero-visual">
            <div className="ref-cards-fan-container">
              {/* Card 1: Bruno Fernandes */}
              <div className="ref-fpl-card ref-card-1">
                <span className="ref-card-badge mid">MID</span>
                <div className="ref-card-img-wrap">
                  <img src="/hero/bruno.jpg" alt="Bruno Fernandes" />
                </div>
                <div className="ref-card-info">
                  <div className="ref-card-name">B. Fernandes</div>
                  <div className="ref-card-price">£12.0m</div>
                </div>
              </div>

              {/* Card 2: Saka */}
              <div className="ref-fpl-card ref-card-2">
                <span className="ref-card-badge mid">MID</span>
                <div className="ref-card-img-wrap">
                  <img src="/players/saka.png" alt="Saka" />
                </div>
                <div className="ref-card-info">
                  <div className="ref-card-name">Saka</div>
                  <div className="ref-card-price">£9.5m</div>
                </div>
              </div>

              {/* Card 3: Haaland */}
              <div className="ref-fpl-card ref-card-3">
                <span className="ref-card-badge fwd">FWD</span>
                <div className="ref-card-img-wrap">
                  <img src="/hero/haaland.jpg" alt="Haaland" />
                </div>
                <div className="ref-card-info">
                  <div className="ref-card-name">Haaland</div>
                  <div className="ref-card-price">£15.5m</div>
                </div>
              </div>

              {/* Card 4: Pedro */}
              <div className="ref-fpl-card ref-card-4">
                <span className="ref-card-badge fwd">FWD</span>
                <div className="ref-card-img-wrap">
                  <img src="/hero/player3.png" alt="Pedro" />
                </div>
                <div className="ref-card-info">
                  <div className="ref-card-name">Pedro</div>
                  <div className="ref-card-price">£7.5m</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Placement Container */}
      <div style={{ maxWidth: '1320px', margin: '24px auto', padding: '0 24px' }}>
        <AdBanner slotId="1029384756" format="auto" />
      </div>

      {/* 5-a-side Pitch Feature Section - Full Bleed Ambient Band */}
      <section className="fives-pitch-section">
        <div className="fives-pitch-grid" style={{ maxWidth: '1320px', margin: '0 auto' }}>
          {/* Pitch Visual Screenshot */}
          <div className="fives-pitch-visual">
            <img src="/hero/fives_pitch.png" alt="التشكيلة الخماسية MINI FPL" />
          </div>

          {/* Content side */}
          <div className="fives-pitch-content">
            <h2 className="fives-pitch-title">
              اختر فريقك… لكن هذه المرة <span className="highlight-accent">فريقك الخماسي</span>
            </h2>

            <div className="fives-pitch-desc">
              <p>
                ستجد هنا أداة سهلة وبسيطة تساعدك في اختيار تشكيلتك الخماسية (حارس، مدافع، 2 وسط، ومهاجم) وفق أحدث بيانات وتحليلات الدوري الإنجليزي.
              </p>
              <p>
                تحدَّ أصدقاءك في دوريات خماسية حماسية وتابع حساب النقاط المباشر لكل مواجهة فور حدوثها لتستمتع بالتجربة الأسرع والأمتع في عالم الفانتازي!
              </p>
              <p>
                ابدأ تشكيلتك الآن… وابدأ مشوارك في طريق الفوز!
              </p>
            </div>

            <div className="fives-pitch-actions">
              <Link to={user ? "/squad" : "/register"} className="fives-btn-secondary">
                <Plus size={20} />
                <span>اختيار الفريق</span>
              </Link>

              <Link to="/points" className="fives-btn-primary">
                <TrendingUp size={20} />
                <span>الترتيب المباشر</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section - Full Bleed Crisp Band */}
      <section style={{ background: '#ffffff', width: '100%', padding: '75px 24px', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--fpl-purple)', marginBottom: '10px' }}>
              لماذا يفضل المدربون منصة MINI FPL؟
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              كل ما تحتاجه لإدارة فريقك ومنافسة أصدقائك في مكان واحد
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(0, 255, 133, 0.15)',
                  color: 'var(--fpl-purple)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '10px', color: 'var(--fpl-purple)' }}>
                حساب النقاط المباشر
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem' }}>
                متابعة دقيقة للأهداف، التمريرات الحاسمة (Assists)، الشباك النظيفة، ونقاط البونص فور حدوثها في مباريات الدوري الإنجليزي.
              </p>
            </div>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(79, 70, 229, 0.15)',
                  color: 'var(--fpl-purple)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '10px', color: 'var(--fpl-purple)' }}>
                الدوريات الخاصة والعامة
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem' }}>
                أنشئ دوريك الخاص وتنافس مع زملائك بأكواد دعوة سهلة أو قارن ترتيبك في الجدول العالمي للمدربين.
              </p>
            </div>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(235, 0, 139, 0.15)',
                  color: 'var(--fpl-magenta)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <BookOpen size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '10px', color: 'var(--fpl-purple)' }}>
                مقالات واستراتيجيات أسبوعية
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem' }}>
                نصائح دقيقة لاختيار الكابتن، أفضل التغييرات المزدوجة، ومواعيد تفعيل كروت الفري هيت والوايلد كارد.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Publisher Articles Preview Section - Full Bleed Ambient Band */}
      <section
        style={{
          background: '#f8fafc',
          width: '100%',
          padding: '75px 24px',
          borderTop: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--fpl-purple)' }}>
                أحدث إرشادات واستراتيجيات الفانتازي
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
                شروحات متكاملة لرفع نقاطك والوصول لأعلى الترتيب
              </p>
            </div>
            <Link to="/guides" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 800 }}>
              <span>عرض كل المقالات</span>
              <ArrowIcon size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <article
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: 'var(--fpl-magenta)', fontWeight: 800, marginBottom: '8px' }}>
                دليل القواعد
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '8px' }}>
                نظام حساب النقاط ونقاط البونص (BPS)
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
                تعرف على كيفية توزيع النقاط فور نهاية المباراة وكيف يتم تحديد لاعبي البونص الثلاثة في كل مواجهة.
              </p>
              <Link to="/guides#scoring" style={{ color: 'var(--fpl-purple)', fontWeight: 800, fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span>اقرأ التفاصيل</span>
                <ArrowIcon size={14} />
              </Link>
            </article>

            <article
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: 'var(--fpl-green)', fontWeight: 800, marginBottom: '8px' }}>
                الخواص (Chips)
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '8px' }}>
                متى تفعل Wildcard و Free Hit؟
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
                تحليل شامل لأفضل الجولات لتفعيل الكروت الخاصة وتفادي المزدوجات والجولات الفارغة (Blank & Double GWs).
              </p>
              <Link to="/guides#chips" style={{ color: 'var(--fpl-purple)', fontWeight: 800, fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span>اقرأ التفاصيل</span>
                <ArrowIcon size={14} />
              </Link>
            </article>

            <article
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: '#4f46e5', fontWeight: 800, marginBottom: '8px' }}>
                إدارة التشكيلة
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '8px' }}>
                قواعد توازن البنك وتغير الأسعار
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
                كيف تتفوق على ارتفاع وهبوط أسعار اللاعبين وتدير دكة البدلاء بذكاء للحفاظ على قيمة فريقك.
              </p>
              <Link to="/guides#transfers" style={{ color: 'var(--fpl-purple)', fontWeight: 800, fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span>اقرأ التفاصيل</span>
                <ArrowIcon size={14} />
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* FAQ Section - Full Bleed Crisp Band */}
      <section style={{ background: '#ffffff', width: '100%', padding: '75px 24px' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--fpl-purple)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={26} />
              <span>الأسئلة الشائعة حول الفانتازي</span>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '22px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '8px' }}>
                كيف يتم حساب نقاط الكابتن ونائب الكابتن؟
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7 }}>
                يتم مضاعفة نقاط الكابتن (C) مرتين تلقائياً. في حال عدم مشاركة الكابتن في المباراة لأي سبب، تنتقل الشارة المزدوجة إلى نائب الكابتن (V) تلقائياً فور نهاية الجولة.
              </p>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '22px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '8px' }}>
                ما هي تكلفة إجراء تغيير إضافي فوق المسموح؟
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7 }}>
                تحصل على تغيير مجاني واحد (1 FT) كل جولة، وتستطيع ترحيل حتى 5 تغييرات مجانية. كل تغيير إضافي يزيد عن التغييرات المجانية يخصم 4 نقاط (-4 pts) من إجمالي نقاطك في الجولة.
              </p>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '22px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '8px' }}>
                هل خدمات موقع MINI FPL مجانية تماماً؟
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7 }}>
                نعم، جميع الخدمات وحساب التشكيلات والنقاط والدوريات مجانية 100% لجميع المستخدمين والمدربين.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Banner Footer */}
      <div style={{ maxWidth: '1320px', margin: '24px auto', padding: '0 24px' }}>
        <AdBanner slotId="9876543210" format="horizontal" />
      </div>
    </div>
  );
};
