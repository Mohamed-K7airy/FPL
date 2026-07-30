import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { AdBanner } from '../components/AdBanner';
import { Trophy, ShieldCheck, Zap, BookOpen, Users, Star, ChevronLeft, ChevronRight, HelpCircle, ArrowRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { isRtl } = useLanguage();

  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div className="home-page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #37003c 0%, #150017 100%)',
          borderRadius: '24px',
          padding: '50px 30px',
          color: '#ffffff',
          marginTop: '20px',
          boxShadow: '0 20px 40px rgba(55, 0, 60, 0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: isRtl ? '-50px' : 'auto',
            left: isRtl ? 'auto' : '-50px',
            width: '250px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(0,255,133,0.2) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(0, 255, 133, 0.15)',
              border: '1px solid rgba(0, 255, 133, 0.4)',
              color: '#00ff85',
              padding: '6px 16px',
              borderRadius: '30px',
              fontSize: '0.88rem',
              fontWeight: 800,
              marginBottom: '20px',
            }}
          >
            <Trophy size={16} />
            <span>منصة MINI FPL الرسمية للفانتازي 2026</span>
          </div>

          <h1
            style={{
              fontSize: '2.6rem',
              fontWeight: 900,
              lineHeight: 1.2,
              marginBottom: '20px',
              fontFamily: "'Cairo', 'Outfit', sans-serif",
            }}
          >
            دليلك الشامل ومستشارك في <span style={{ color: '#00ff85' }}>فانتازي الدوري الإنجليزي</span>
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              lineHeight: 1.8,
              color: '#e2e8f0',
              marginBottom: '32px',
              fontWeight: 500,
            }}
          >
            اختر تشكيلتك بميزانية 100 مليون، تابع حساب النقاط المباشر لجميع اللاعبين، واستفد من أحدث التحليلات واستراتيجيات الكابتن والـ Chips لحصد أعلى الترتيب في دوريك.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <Link to="/squad" className="btn-primary" style={{ padding: '12px 28px', fontSize: '1rem', fontWeight: 800 }}>
                <span>الانتقال لفرقتي ({user.team_name})</span>
                <ArrowIcon size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary" style={{ padding: '12px 28px', fontSize: '1rem', fontWeight: 800 }}>
                  <span>إنشاء فريق مجاناً</span>
                  <ArrowIcon size={18} />
                </Link>
                <Link
                  to="/guides"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.2)',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                  }}
                >
                  <BookOpen size={18} />
                  <span>دليل القواعد والنصائح</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Ad Placement Container (Controlled AdSense Unit) */}
      <AdBanner slotId="1029384756" format="auto" />

      {/* Platform Features Section */}
      <section style={{ margin: '50px 0' }}>
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
      </section>

      {/* Publisher Articles Preview Section */}
      <section
        style={{
          background: '#f8fafc',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          padding: '40px 30px',
          margin: '50px 0',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--fpl-purple)' }}>
              أحدث إرشادات واستراتيجيات الفانتازي
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '4px' }}>
              شروحات متكاملة لرفع نقاطك والوصول لأعلى الترتيب
            </p>
          </div>
          <Link to="/guides" className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
            <span>عرض كل المقالات</span>
            <ArrowIcon size={16} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <article
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '20px',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ fontSize: '0.78rem', color: 'var(--fpl-magenta)', fontWeight: 800, marginBottom: '8px' }}>
              دليل القواعد
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '8px' }}>
              نظام حساب النقاط ونقاط البونص (BPS)
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '14px' }}>
              تعرف على كيفية توزيع النقاط فور نهاية المباراة وكيف يتم تحديد لاعبي البونص الثلاثة في كل مواجهة.
            </p>
            <Link to="/guides#scoring" style={{ color: 'var(--fpl-purple)', fontWeight: 700, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span>اقرأ التفاصيل</span>
              <ArrowIcon size={14} />
            </Link>
          </article>

          <article
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '20px',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ fontSize: '0.78rem', color: 'var(--fpl-green)', fontWeight: 800, marginBottom: '8px' }}>
              الخواص (Chips)
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '8px' }}>
              متى تفعل Wildcard و Free Hit؟
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '14px' }}>
              تحليل شامل لأفضل الجولات لتفعيل الكروت الخاصة وتفادي المزدوجات والجولات الفارغة (Blank & Double GWs).
            </p>
            <Link to="/guides#chips" style={{ color: 'var(--fpl-purple)', fontWeight: 700, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span>اقرأ التفاصيل</span>
              <ArrowIcon size={14} />
            </Link>
          </article>

          <article
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '20px',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ fontSize: '0.78rem', color: '#4f46e5', fontWeight: 800, marginBottom: '8px' }}>
              إدارة التشكيلة
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '8px' }}>
              قواعد توازن البنك وتغير الأسعار
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '14px' }}>
              كيف تتفوق على ارتفاع هبوط أسعار اللاعبين وتدير دكة البدلاء بذكاء للحفاظ على قيمة فريقك.
            </p>
            <Link to="/guides#transfers" style={{ color: 'var(--fpl-purple)', fontWeight: 700, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span>اقرأ التفاصيل</span>
              <ArrowIcon size={14} />
            </Link>
          </article>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ margin: '50px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--fpl-purple)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={24} />
            <span>الأسئلة الشائعة حول الفانتازي</span>
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '8px' }}>
              كيف يتم حساب نقاط الكابتن ونائب الكابتن؟
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7 }}>
              يتم مضاعفة نقاط الكابتن (C) مرتين تلقائياً. في حال عدم مشاركة الكابتن في المباراة لأي سبب، تنتقل الشارة المزدوجة إلى نائب الكابتن (V) تلقائياً فور نهاية الجولة.
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '8px' }}>
              ما هي تكلفة إجراء تغيير إضافي فوق المسموح؟
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7 }}>
              تحصل على تغيير مجاني واحد (1 FT) كل جولة، وتستطيع ترحيل حتى 5 تغييرات مجانية. كل تغيير إضافي يزيد عن التغييرات المجانية يخصم 4 نقاط (-4 pts) من إجمالي نقاطك في الجولة.
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '8px' }}>
              هل خدمات موقع MINI FPL مجانية تماماً؟
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7 }}>
              نعم، جميع الخدمات وحساب التشكيلات والنقاط والدوريات مجانية 100% لجميع المستخدمين والمدربين.
            </p>
          </div>
        </div>
      </section>

      {/* Ad Banner Footer */}
      <AdBanner slotId="9876543210" format="horizontal" />
    </div>
  );
};
