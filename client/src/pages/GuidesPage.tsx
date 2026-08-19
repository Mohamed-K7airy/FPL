import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { AdBanner } from '../components/AdBanner';
import { 
  Trophy, 
  Zap, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle, 
  ArrowLeft, 
  ArrowRight,
  Flame,
  Target,
  Compass,
  Star,
  Clock,
  Layers,
  Award,
  BookOpen,
  ChevronDown,
  Repeat,
  Shield,
  Activity,
  PlusCircle,
  BarChart3
} from 'lucide-react';

export const GuidesPage: React.FC = () => {
  const { user } = useAuth();
  const { isRtl } = useLanguage();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const chips = [
    {
      id: 'wildcard',
      nameAr: 'الوايلد كارد (Wildcard)',
      nameEn: 'Wildcard',
      icon: <Repeat size={28} />,
      color: '#38bdf8',
      bgGrad: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(14, 165, 233, 0.05) 100%)',
      borderCol: 'rgba(56, 189, 248, 0.3)',
      descAr: 'إجراء تغييرات مجانية غير محدودة على تشكيلتك بالكامل دون أي خصم نقاط (-4). فرصة لإعادة بناء فريقك بالكامل.',
      descEn: 'Make unlimited free transfers to completely overhaul your 5-man squad without any points hit (-4 pts).',
      tagAr: 'مرتان في الموسم (جولة 1-19 وجولة 20-38)',
      tagEn: '2 per season (GW 1-19 & GW 20-38)',
      tipAr: 'الوقت المثالي: عند تقلب جداول المباريات أو حدوث إصابات متعددة في نجوم فريقك.',
      tipEn: 'Best used during major fixture swings or international break injuries.',
    },
    {
      id: 'freehit',
      nameAr: 'الفري هيت (Free Hit)',
      nameEn: 'Free Hit',
      icon: <Zap size={28} />,
      color: '#ec4899',
      bgGrad: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(219, 39, 119, 0.05) 100%)',
      borderCol: 'rgba(236, 72, 153, 0.3)',
      descAr: 'تغيير تشكيلتك لجولة واحدة فقط بحرية تامة، ثم تعود تشكيلتك الأصلية القديمة تلقائياً في الجولة التالية.',
      descEn: 'Make unlimited free transfers for a single Gameweek only. Your old team returns the following week.',
      tagAr: 'مرة واحدة في الموسم',
      tagEn: '1 per season',
      tipAr: 'الوقت المثالي: في الجولات المزدوجة (Double Gameweeks) أو جولات التأجيلات (Blank GWs).',
      tipEn: 'Ideal for Blank Gameweeks or Double Gameweek fixture peaks.',
    },
    {
      id: '3xc',
      nameAr: 'التريبل كابتن (Triple Captain)',
      nameEn: 'Triple Captain (3x)',
      icon: <Flame size={28} />,
      color: '#f59e0b',
      bgGrad: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.05) 100%)',
      borderCol: 'rgba(245, 158, 11, 0.3)',
      descAr: 'مضاعفة نقاط كابتن فريقك ثلاث مرات (x3) بدلاً من مرتين، مما يحقق قفزة صاروخية في ترتيبك العام.',
      descEn: 'Multiplies your captain’s points by 3x instead of the usual 2x for massive point returns.',
      tagAr: 'مرة واحدة في الموسم',
      tagEn: '1 per season',
      tipAr: 'الوقت المثالي: عندما يلعب نجمك الأفضل (مثل هالاند أو صلاح) مباراتين في جولة واحدة أو على ملعبه ضد دفاع ضعيف.',
      tipEn: 'Best triggered during Double Gameweeks for a top premium captain playing twice.',
    },
    {
      id: 'bboost',
      nameAr: 'البنش بوست (Bench Boost)',
      nameEn: 'Bench Boost',
      icon: <ShieldCheck size={28} />,
      color: '#10b981',
      bgGrad: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)',
      borderCol: 'rgba(16, 185, 129, 0.3)',
      descAr: 'احتساب نقاط إضافية معززة لمجمل عناصر تشكيلتك في الجولة الكلية لرفع إجمالي نقاطك الأسبوعية.',
      descEn: 'Boosts your overall squad returns for maximum cumulative Gameweek haul.',
      tagAr: 'مرة واحدة في الموسم',
      tagEn: '1 per season',
      tipAr: 'الوقت المثالي: بالتزامن مع تفعيل الوايلد كارد قبلها بجولة لضمان جاهزية جميع لاعبيك.',
      tipEn: 'Best executed right after a Wildcard when all squad players are starting and in-form.',
    },
  ];

  const scoringRules = [
    {
      actionAr: 'المشاركة (حتى 59 دقيقة)',
      actionEn: 'Playing up to 59 minutes',
      gkp: '+1', def: '+1', mid: '+1', fwd: '+1',
    },
    {
      actionAr: 'المشاركة الكاملة (60 دقيقة فأكثر)',
      actionEn: 'Playing 60+ minutes',
      gkp: '+2', def: '+2', mid: '+2', fwd: '+2',
    },
    {
      actionAr: 'تسجيل هدف (Goal)',
      actionEn: 'Goal scored',
      gkp: '+6', def: '+6', mid: '+5', fwd: '+4',
      highlight: true,
    },
    {
      actionAr: 'تمريرة حاسمة (Assist)',
      actionEn: 'Assist provided',
      gkp: '+3', def: '+3', mid: '+3', fwd: '+3',
      highlight: true,
    },
    {
      actionAr: 'شباك نظيفة (Clean Sheet - 60+ دقيقة)',
      actionEn: 'Clean Sheet (60+ mins played)',
      gkp: '+4', def: '+4', mid: '+1', fwd: '0',
    },
    {
      actionAr: 'كل 3 تصديات حاسمة للحارس (Saves)',
      actionEn: 'Every 3 Goalkeeper Saves',
      gkp: '+1', def: '—', mid: '—', fwd: '—',
    },
    {
      actionAr: 'تصدي ركلة جزاء (Penalty Save)',
      actionEn: 'Penalty Save',
      gkp: '+5', def: '—', mid: '—', fwd: '—',
    },
    {
      actionAr: 'إهدار ركلة جزاء (Penalty Miss)',
      actionEn: 'Penalty Miss',
      gkp: '-2', def: '-2', mid: '-2', fwd: '-2',
      isNegative: true,
    },
    {
      actionAr: 'نقاط البونص لأفضل اللاعبين (Bonus Points BPS)',
      actionEn: 'Bonus Points (BPS system)',
      gkp: '+1 إلى +3', def: '+1 إلى +3', mid: '+1 إلى +3', fwd: '+1 إلى +3',
    },
    {
      actionAr: 'بطاقة صفراء (Yellow Card)',
      actionEn: 'Yellow Card',
      gkp: '-1', def: '-1', mid: '-1', fwd: '-1',
      isNegative: true,
    },
    {
      actionAr: 'بطاقة حمراء (Red Card)',
      actionEn: 'Red Card',
      gkp: '-3', def: '-3', mid: '-3', fwd: '-3',
      isNegative: true,
    },
  ];

  const faqs = [
    {
      qAr: 'هل منصة MINI FPL مجانية تماماً؟',
      qEn: 'Is MINI FPL platform 100% free to play?',
      aAr: 'نعم بكل تأكيد! جميع خدمات بناء التشكيلة الخماسية، الانضمام للدوريات العامة والخاصة، ومتابعة النقاط المباشرة مجانية تماماً لكافة المدربين.',
      aEn: 'Yes, completely free! Building your 5-a-side team, joining private leagues, and tracking live points is 100% free for all managers.',
    },
    {
      qAr: 'ماذا يحدث إذا لم يشارك الكابتن (C) في المباراة؟',
      qEn: 'What happens if my Captain (C) does not play?',
      aAr: 'في حال عدم مشاركة الكابتن لأي سبب (0 دقيقة)، تنتقل شارة الكابتن والمضاعف (x2) تلقائياً إلى نائب الكابتن (V) فور انتهاء مباريات الجولة.',
      aEn: 'If your captain does not play (0 minutes), the 2x multiplier automatically passes to your designated Vice-Captain (V) after the round ends.',
    },
    {
      qAr: 'متى يكون الموعد النهائي (Deadline) لإجراء الانتقالات وتعيين الكابتن؟',
      qEn: 'When is the transfer & captaincy deadline?',
      aAr: 'يُقفل الموعد النهائي (Deadline) دائماً قبل انطلاق أول مباراة في الجولة بـ 90 دقيقة. يمكنك إجراء أي عدد من التعديلات قبل هذا الموعد مجاناً.',
      aEn: 'The deadline is strictly 90 minutes before the kickoff of the first match of the Gameweek.',
    },
    {
      qAr: 'كيف تختلف التشكيلة الخماسية (5-a-side) عن الفانتازي التقليدي؟',
      qEn: 'How does 5-a-side differ from traditional 15-man FPL?',
      aAr: 'توفر لك التشكيلة الخماسية تجربة خفيفة وسريعة: 5 لاعبين أساسيين فقط (حارس، مدافع، 2 وسط، ومهاجم) بدون تعقيدات دكة البدلاء وبمتابعة مباشرة ومثيرة لكل هدف وتمريرة.',
      aEn: '5-a-side eliminates bench headaches: select 5 core stars (1 GKP, 1 DEF, 2 MID, 1 FWD) for fast-paced, high-voltage weekly competition.',
    },
  ];

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#ffffff', color: '#0f172a' }}>
      
      {/* 1. HERO BANNER HEADER */}
      <header
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #311042 50%, #0f172a 100%)',
          color: '#ffffff',
          padding: '70px 24px 60px 24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Glow Effects */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(0, 255, 133, 0.12) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '960px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {/* Top Pill Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(0, 255, 133, 0.15)',
              border: '1px solid rgba(0, 255, 133, 0.35)',
              color: '#00ff85',
              padding: '6px 18px',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: 800,
              marginBottom: '20px',
            }}
          >
            <Compass size={16} />
            <span>{isRtl ? 'دليل وقواعد اللعبة الرسمية | MINI FPL' : 'Official Rules & Game Guide | MINI FPL'}</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 900,
              lineHeight: 1.25,
              marginBottom: '20px',
              letterSpacing: '-0.02em',
              fontFamily: "'Cairo', sans-serif",
            }}
          >
            {isRtl ? (
              <>
                قواعد الفانتازي الخماسية <span style={{ color: '#00ff85' }}>ونظام احتساب النقاط والخواص</span>
              </>
            ) : (
              <>
                5-a-Side Rules, <span style={{ color: '#00ff85' }}>Scoring Matrix & Chips Masterclass</span>
              </>
            )}
          </h1>

          <p
            style={{
              color: '#cbd5e1',
              fontSize: 'clamp(1rem, 2vw, 1.18rem)',
              lineHeight: 1.8,
              maxWidth: '820px',
              margin: '0 auto 36px auto',
              fontWeight: 500,
            }}
          >
            {isRtl
              ? 'دليلك الشامل والشامل لفهم طريقة لعب التشكيلة الخماسية، حساب نقاط الأهداف والشباك النظيفة، واستغلال الخواص الأربعة للوصول لقمة الدوريات.'
              : 'Your definitive guide to mastering 5-a-side fantasy, understanding clean sheets and bonus scoring, and deploying the 4 chips strategically.'}
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to={user ? '/squad' : '/register'}
              className="ref-pink-btn"
              style={{ padding: '14px 36px', fontSize: '1.05rem', fontWeight: 900 }}
            >
              <span>{user ? (isRtl ? 'الذهاب لتشكيلتي الخماسية' : 'Go to My Squad') : (isRtl ? 'ابدأ تشكيلتك الخماسية مجاناً' : 'Start Your Squad Free')}</span>
              <ArrowIcon size={20} />
            </Link>
          </div>
        </div>
      </header>

      {/* QUICK JUMP ANCHOR NAV */}
      <nav
        style={{
          background: '#ffffff',
          borderBottom: '1px solid var(--border-color)',
          padding: '12px 20px',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            padding: '4px 0',
          }}
        >
          <a
            href="#concept"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#334155',
              fontSize: '0.85rem',
              fontWeight: 800,
            }}
          >
            <Layers size={14} color="#0284c7" />
            <span>{isRtl ? '1. فكرة الخماسي' : '1. 5-a-Side Concept'}</span>
          </a>

          <a
            href="#scoring"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#334155',
              fontSize: '0.85rem',
              fontWeight: 800,
            }}
          >
            <BarChart3 size={14} color="#10b981" />
            <span>{isRtl ? '2. مصفوفة النقاط' : '2. Scoring Matrix'}</span>
          </a>

          <a
            href="#chips"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#334155',
              fontSize: '0.85rem',
              fontWeight: 800,
            }}
          >
            <Zap size={14} color="#ec4899" />
            <span>{isRtl ? '3. الخواص الأربعة (Chips)' : '3. The 4 Chips'}</span>
          </a>

          <a
            href="#steps"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#334155',
              fontSize: '0.85rem',
              fontWeight: 800,
            }}
          >
            <Target size={14} color="#8b5cf6" />
            <span>{isRtl ? '4. خطوات البداية' : '4. How to Play'}</span>
          </a>

          <a
            href="#faq"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#334155',
              fontSize: '0.85rem',
              fontWeight: 800,
            }}
          >
            <HelpCircle size={14} color="#d97706" />
            <span>{isRtl ? '5. الأسئلة الشائعة' : '5. FAQ'}</span>
          </a>
        </div>
      </nav>

      {/* Ad Placement Container */}
      <div style={{ maxWidth: '1200px', margin: '24px auto', padding: '0 24px' }}>
        <AdBanner slotId="5432167890" format="auto" />
      </div>

      {/* SECTION 1: 5-A-SIDE CONCEPT & PITCH BREAKDOWN */}
      <section id="concept" style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#0284c7',
              fontWeight: 800,
              fontSize: '0.88rem',
              marginBottom: '8px',
            }}
          >
            <Layers size={18} />
            <span>{isRtl ? 'نظام ثوري ومبتكر' : 'Innovative & Streamlined'}</span>
          </div>
          <h2 style={{ fontSize: '2.3rem', fontWeight: 900, color: 'var(--fpl-purple)', marginBottom: '12px' }}>
            {isRtl ? 'كيف تعمل التشكيلة الخماسية (5-a-Side)؟' : 'How Does 5-a-Side Fantasy Work?'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '700px', margin: '0 auto' }}>
            {isRtl
              ? 'تخلص من صداع 15 لاعباً ومقاعد البدلاء، وركز على 5 نجوم يصنعون الفارق أسبوعياً!'
              : 'Pick 5 starting superstars with no bench headaches, and track live gameweek returns.'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {/* Card GKP */}
          <div
            style={{
              background: '#ffffff',
              border: '1.5px solid #e2e8f0',
              borderRadius: '18px',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontWeight: 900, fontSize: '1.2rem' }}>
              1
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--fpl-purple)', marginBottom: '8px' }}>
              {isRtl ? 'حارس مرمى واحد (GKP)' : '1 Goalkeeper (GKP)'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              {isRtl
                ? 'حارس أساسي يجمع نقاط الشباك النظيفة (+4)، التصديات الحاسمة (+1 لكل 3)، وتصدي ركلات الجزاء (+5).'
                : '1 Goalkeeper earning clean sheet points (+4), save points (+1 per 3 saves), and penalty saves (+5).'}
            </p>
          </div>

          {/* Card DEF */}
          <div
            style={{
              background: '#ffffff',
              border: '1.5px solid #e2e8f0',
              borderRadius: '18px',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontWeight: 900, fontSize: '1.2rem' }}>
              1
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--fpl-purple)', marginBottom: '8px' }}>
              {isRtl ? 'مدافع واحد (DEF)' : '1 Defender (DEF)'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              {isRtl
                ? 'درع الدفاع وعنصر هجومي هادف: شباك نظيفة (+4)، أهداف (+6)، وصناعة فرص (+3).'
                : '1 Defender offering dual routes to points: clean sheets (+4), goals (+6), and assists (+3).'}
            </p>
          </div>

          {/* Card MID */}
          <div
            style={{
              background: '#ffffff',
              border: '1.5px solid #e2e8f0',
              borderRadius: '18px',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#f3e8ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontWeight: 900, fontSize: '1.2rem' }}>
              2
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--fpl-purple)', marginBottom: '8px' }}>
              {isRtl ? 'اثنان من لاعبي الوسط (2x MID)' : '2 Midfielders (2x MID)'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              {isRtl
                ? 'محرك النقاط الأكبر في اللعبة: أهداف (+5)، تمريرات حاسمة (+3)، وشباك نظيفة (+1).'
                : 'The ultimate engine: +5 pts per goal, +3 pts per assist, and +1 pt clean sheet bonus.'}
            </p>
          </div>

          {/* Card FWD */}
          <div
            style={{
              background: '#ffffff',
              border: '1.5px solid #e2e8f0',
              borderRadius: '18px',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontWeight: 900, fontSize: '1.2rem' }}>
              1
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--fpl-purple)', marginBottom: '8px' }}>
              {isRtl ? 'مهاجم صريح (1x FWD)' : '1 Forward (1x FWD)'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              {isRtl
                ? 'القناص الهجومي لهز الشباك: +4 نقاط لكل هدف وصناعة الأهداف ونقاط البونص (BPS).'
                : 'Primary goal-scoring machine: +4 pts per goal, assists (+3), and maximum BPS potential.'}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: OFFICIAL SCORING MATRIX */}
      <section id="scoring" style={{ background: '#f8fafc', padding: '70px 24px', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#10b981',
                fontWeight: 800,
                fontSize: '0.88rem',
                marginBottom: '8px',
              }}
            >
              <BarChart3 size={18} />
              <span>{isRtl ? 'المصفوفة الرسمية' : 'Official Point Allocation'}</span>
            </div>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 900, color: 'var(--fpl-purple)', marginBottom: '12px' }}>
              {isRtl ? 'جدول حساب النقاط الرسمي (Scoring Matrix)' : 'Official FPL Scoring Matrix'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '750px', margin: '0 auto' }}>
              {isRtl
                ? 'كيف تُحسب نقاط نجومك الخمسة في كل مباراة رسمية بالدوري الإنجليزي الممتاز؟'
                : 'Detailed breakdown of points awarded across all actions in Premier League matches.'}
            </p>
          </div>

          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1.5px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
                <thead>
                  <tr style={{ background: '#0f172a', color: '#ffffff' }}>
                    <th style={{ padding: '18px 20px', fontSize: '0.95rem', fontWeight: 800 }}>{isRtl ? 'الحدث / الفعل' : 'Match Action'}</th>
                    <th style={{ padding: '18px 20px', fontSize: '0.95rem', fontWeight: 800, textAlign: 'center' }}>
                      <span style={{ background: '#f59e0b', color: '#ffffff', padding: '3px 10px', borderRadius: '6px' }}>GKP</span>
                    </th>
                    <th style={{ padding: '18px 20px', fontSize: '0.95rem', fontWeight: 800, textAlign: 'center' }}>
                      <span style={{ background: '#2563eb', color: '#ffffff', padding: '3px 10px', borderRadius: '6px' }}>DEF</span>
                    </th>
                    <th style={{ padding: '18px 20px', fontSize: '0.95rem', fontWeight: 800, textAlign: 'center' }}>
                      <span style={{ background: '#7c3aed', color: '#ffffff', padding: '3px 10px', borderRadius: '6px' }}>MID</span>
                    </th>
                    <th style={{ padding: '18px 20px', fontSize: '0.95rem', fontWeight: 800, textAlign: 'center' }}>
                      <span style={{ background: '#dc2626', color: '#ffffff', padding: '3px 10px', borderRadius: '6px' }}>FWD</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {scoringRules.map((rule, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        background: rule.highlight ? '#f0fdf4' : idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                      }}
                    >
                      <td style={{ padding: '16px 20px', fontWeight: rule.highlight ? 900 : 700, color: rule.highlight ? '#059669' : '#0f172a', fontSize: '0.92rem' }}>
                        {isRtl ? rule.actionAr : rule.actionEn}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'center', fontWeight: 800, color: rule.isNegative ? '#e11d48' : '#0f172a' }}>
                        {rule.gkp}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'center', fontWeight: 800, color: rule.isNegative ? '#e11d48' : '#0f172a' }}>
                        {rule.def}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'center', fontWeight: 800, color: rule.isNegative ? '#e11d48' : '#0f172a' }}>
                        {rule.mid}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'center', fontWeight: 800, color: rule.isNegative ? '#e11d48' : '#0f172a' }}>
                        {rule.fwd}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Captaincy Callout Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, #2e1065 0%, #4c1d95 100%)',
                color: '#ffffff',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#00ff85', color: '#1e1b4b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem' }}>
                  C
                </div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#00ff85' }}>
                    {isRtl ? 'مضاعف شارة الكابتن (Captain x2)' : 'Captaincy Multiplier (2x)'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                    {isRtl ? 'نقاط كابتن فريقك تتضاعف x2 تلقائياً في كل جولة!' : 'Your captain scores double points (2x) every gameweek.'}
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  padding: '6px 14px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  color: '#ffffff',
                }}
              >
                {isRtl ? 'مع التريبل كابتن ⬅️ تتضاعف x3' : 'With Triple Captain ⬅️ 3x points'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE 4 CHIPS MASTERCLASS */}
      <section id="chips" style={{ padding: '70px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#ec4899',
              fontWeight: 800,
              fontSize: '0.88rem',
              marginBottom: '8px',
            }}
          >
            <Zap size={18} />
            <span>{isRtl ? 'أسلحتك السرية' : 'Strategic Powerups'}</span>
          </div>
          <h2 style={{ fontSize: '2.3rem', fontWeight: 900, color: 'var(--fpl-purple)', marginBottom: '12px' }}>
            {isRtl ? 'الخواص الأربعة الذكية (The 4 Chips Masterclass)' : 'The 4 Powerful Chips Explained'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '750px', margin: '0 auto' }}>
            {isRtl
              ? 'تمنحك اللعبة 4 خواص فريدة لاستخدامها في الأوقات الحاسمة لحصد أكبر قدر من النقاط.'
              : 'Four tactical power-ups to turbocharge your rank at pivotal moments of the Premier League season.'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '20px' }}>
          {chips.map((chip) => (
            <div
              key={chip.id}
              style={{
                background: '#ffffff',
                border: `1.5px solid ${chip.borderCol}`,
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div>
                {/* Header Icon & Tag */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '16px',
                      background: chip.bgGrad,
                      border: `1px solid ${chip.borderCol}`,
                      color: chip.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {chip.icon}
                  </div>
                  <span
                    style={{
                      background: '#f1f5f9',
                      color: '#475569',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                    }}
                  >
                    {isRtl ? chip.tagAr : chip.tagEn}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--fpl-purple)', marginBottom: '10px' }}>
                  {isRtl ? chip.nameAr : chip.nameEn}
                </h3>

                <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
                  {isRtl ? chip.descAr : chip.descEn}
                </p>
              </div>

              {/* Pro Tip Box */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  fontSize: '0.82rem',
                  color: '#334155',
                  lineHeight: 1.5,
                  fontWeight: 600,
                }}
              >
                <strong style={{ color: chip.color, display: 'block', marginBottom: '4px' }}>
                  {isRtl ? 'نصيحة الاستخدام الذكي:' : 'Pro Strategy:'}
                </strong>
                {isRtl ? chip.tipAr : chip.tipEn}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: 4 STEPS ROADMAP */}
      <section id="steps" style={{ background: '#f8fafc', padding: '70px 24px', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#8b5cf6',
                fontWeight: 800,
                fontSize: '0.88rem',
                marginBottom: '8px',
              }}
            >
              <Target size={18} />
              <span>{isRtl ? 'الانطلاق السريع' : 'Fast Setup'}</span>
            </div>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 900, color: 'var(--fpl-purple)', marginBottom: '12px' }}>
              {isRtl ? 'كيف تبدأ وتلعب في MINI FPL خلال دقائق؟' : 'How to Get Started in 4 Quick Steps'}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '24px', position: 'relative' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, marginBottom: '14px' }}>
                1
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--fpl-purple)', marginBottom: '8px' }}>
                {isRtl ? 'سجّل حسابك مجاناً' : '1. Free Account'}
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {isRtl ? 'أنشئ حسابك في ثوانٍ واختر اسماً مميزاً لفريقك الخماسي.' : 'Sign up in seconds and name your dream 5-a-side squad.'}
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '24px', position: 'relative' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, marginBottom: '14px' }}>
                2
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--fpl-purple)', marginBottom: '8px' }}>
                {isRtl ? 'اختر تشكيلتك الخماسية' : '2. Pick 5 Stars'}
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {isRtl ? 'اختر (حارس، مدافع، 2 وسط، ومهاجم) من نجوم البريميرليج ضمن ميزانيتك.' : 'Select 1 GKP, 1 DEF, 2 MID, 1 FWD within your starting budget.'}
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '24px', position: 'relative' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, marginBottom: '14px' }}>
                3
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--fpl-purple)', marginBottom: '8px' }}>
                {isRtl ? 'عيّن الكابتن والنائب' : '3. Set Captain'}
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {isRtl ? 'حدد نجمك المفضل كـ (C) لمضاعفة نقاطه x2، ونائب الكابتن (V) كبديل.' : 'Assign Captain (C) for double points (2x) and Vice-Captain (V).'}
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '24px', position: 'relative' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, marginBottom: '14px' }}>
                4
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--fpl-purple)', marginBottom: '8px' }}>
                {isRtl ? 'نافِس وتصدر الترتيب' : '4. Compete & Win'}
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {isRtl ? 'انضم لدوريات الأصدقاء وتابع النقاط المباشرة لحظة بلحظة فور تسجيل الأهداف!' : 'Join mini-leagues and track real-time scores during matchdays.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FAQ ACCORDION */}
      <section id="faq" style={{ padding: '70px 24px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#d97706',
              fontWeight: 800,
              fontSize: '0.88rem',
              marginBottom: '8px',
            }}
          >
            <HelpCircle size={18} />
            <span>{isRtl ? 'إجابات مباشرة' : 'Quick Answers'}</span>
          </div>
          <h2 style={{ fontSize: '2.3rem', fontWeight: 900, color: 'var(--fpl-purple)', marginBottom: '12px' }}>
            {isRtl ? 'الأسئلة الشائعة حول المنصة' : 'Frequently Asked Questions'}
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                style={{
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#ffffff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                }}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: isOpen ? '#f8fafc' : '#ffffff',
                    border: 'none',
                    textAlign: isRtl ? 'right' : 'left',
                    cursor: 'pointer',
                    gap: '12px',
                  }}
                >
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--fpl-purple)' }}>
                    {isRtl ? faq.qAr : faq.qEn}
                  </span>
                  <ChevronDown
                    size={20}
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      color: '#64748b',
                      flexShrink: 0,
                    }}
                  />
                </button>

                {isOpen && (
                  <div style={{ padding: '0 20px 20px 20px', color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                    {isRtl ? faq.aAr : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section
        style={{
          background: 'linear-gradient(135deg, #2e1065 0%, #1e1b4b 100%)',
          color: '#ffffff',
          padding: '80px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '16px', color: '#ffffff' }}>
            {isRtl ? 'جاهز لتحدي الفانتزي الخماسية؟' : 'Ready to Build Your 5-a-Side Team?'}
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.15rem', lineHeight: 1.8, marginBottom: '32px' }}>
            {isRtl
              ? 'انضم الآن لآلاف المدربين، اختر نجومك الخمسة ونافس أصدقاءك في كل جولة أسبوعية!'
              : 'Join thousands of managers today. Pick your top 5 stars and dominate your mini-leagues!'}
          </p>

          <Link
            to={user ? '/squad' : '/register'}
            className="ref-pink-btn"
            style={{ padding: '16px 42px', fontSize: '1.15rem', fontWeight: 900 }}
          >
            <span>{user ? (isRtl ? 'الانتقال لتشكيلتي' : 'Go to My Squad') : (isRtl ? 'ابدأ تشكيلتك مجاناً الآن' : 'Create Free Squad Now')}</span>
            <ArrowIcon size={22} />
          </Link>
        </div>
      </section>

      {/* Bottom Ad Banner */}
      <div style={{ maxWidth: '1200px', margin: '24px auto', padding: '0 24px' }}>
        <AdBanner slotId="8765432109" format="auto" />
      </div>

    </div>
  );
};
