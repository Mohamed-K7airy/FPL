import React from 'react';
import { AdBanner } from '../components/AdBanner';
import { BookOpen, Shield, Award, Sparkles, TrendingUp, CheckCircle, HelpCircle } from 'lucide-react';

export const GuidesPage: React.FC = () => {
  return (
    <div className="guides-page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
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
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 255, 133, 0.15)', color: '#00ff85', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 800, marginBottom: '12px' }}>
          <BookOpen size={16} />
          <span>المكتبة التحريرية ودليل الفانتازي</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '10px', fontFamily: "'Cairo', sans-serif" }}>
          دليل قواعد الفانتازي واستراتيجيات حصد النقاط
        </h1>
        <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.7 }}>
          مجموعة شاملة من المقالات والشروحات التكتيكية لمساعدتك في بناء فريق منافس وإدارة التغييرات بأعلى كفاءة.
        </p>
      </header>

      {/* Article 1: Rules & Scoring System */}
      <article
        id="scoring"
        style={{
          background: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--fpl-purple)' }}>
          <Award size={24} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>
            1. نظام توزيع النقاط الرسمي وشرح Bonus Points System
          </h2>
        </div>

        <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-main)', marginBottom: '16px' }}>
          في لعبتك المفضلة فانتازي الدوري الإنجليزي الممتاز (FPL)، يتم منح عناصر تشكيلتك النقاط بناءً على الأداء الإحصائي الواقعي في المباريات الرسمية. يتوزع حساب النقاط على النحو التالي:
        </p>

        <ul style={{ lineHeight: 1.9, color: 'var(--text-main)', paddingRight: '20px', fontSize: '0.95rem', marginBottom: '20px' }}>
          <li><strong>المشاركة (Minutes Played):</strong> نقطة واحدة عند اللعب حتى 59 دقيقة، ونقطتان عند اللعب 60 دقيقة أو أكثر.</li>
          <li><strong>تسجيل الأهداف (Goals):</strong> 6 نقاط لهدف حارس المرمى أو المدافع، 5 نقاط لخط الوسط، و4 نقاط للمهاجم الصريح.</li>
          <li><strong>التمريرات الحاسمة (Assists):</strong> 3 نقاط لأي تمريرة حاسمة أدت لهدف مباشر، أو كسب ركلة جزاء تم تسجيلها.</li>
          <li><strong>الشباك النظيفة (Clean Sheet):</strong> 4 نقاط لكل من الحارس والمدافعين في حال عدم استقبال أي هدف ولعب 60 دقيقة على الأقل، ونقطة واحدة لخط الوسط.</li>
          <li><strong>تصديات حارس المرمى (Saves):</strong> نقطة واحدة لكل 3 تصديات حاسمة.</li>
          <li><strong>تصدي ركلات الجزاء (Penalty Save):</strong> 5 نقاط للحارس عند تصديه لركلة جزاء.</li>
          <li><strong>نقاط البونص الإضافية (Bonus System):</strong> يتم تقييم أداء جميع اللاعبين عبر نظام BPS الرقمي، ويتم منح 3 نقاط لأفضل لاعب، نقطتان لثاني أفضل لاعب، ونقطة لثالث لاعب.</li>
        </ul>

        <div style={{ background: '#f8fafc', borderRight: '4px solid var(--fpl-purple)', padding: '16px', borderRadius: '8px', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
          <strong>نصيحة ذهبية:</strong> المدافعون الأظهيرة (Wing-backs) يجمعون أعلى المعدلات لأنهم يقدمون عرضيات تسمح بالتمريرات الحاسمة والشباك النظيفة في نفس الوقت.
        </div>
      </article>

      {/* Ad Banner inside Content */}
      <AdBanner slotId="5432167890" format="auto" />

      {/* Article 2: Chips Strategy */}
      <article
        id="chips"
        style={{
          background: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--fpl-magenta)' }}>
          <Sparkles size={24} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>
            2. كروت الخواص (Chips): متى وكيف تفعلها بذكاء؟
          </h2>
        </div>

        <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-main)', marginBottom: '16px' }}>
          تتيح لك اللعبة استخدام 4 خواص فريدة مرة واحدة أو مرتين خلال الموسم، وهي مفتاح التفوق في الجولات المزدوجة والفارغة:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '18px', background: '#fafafa' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '6px' }}>
              الوايلد كارد (Wildcard)
            </h3>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--text-muted)', margin: 0 }}>
              يمنحك إمكانية إجراء انتقالات مجانية غير محدودة وتغيير قائمة الـ 15 لاعباً دون أي خصم نقاط (-4). يتوفر كرت في النصف الأول من الموسم وكرت آخر في النصف الثاني.
            </p>
          </div>

          <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '18px', background: '#fafafa' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '6px' }}>
              الفري هيت (Free Hit)
            </h3>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--text-muted)', margin: 0 }}>
              تغيير التشكيلة للجولة الحالية فقط دون أي خصم، وفور نهاية الجولة تعود تشكيلاتك القديمة كما كانت تلقائياً. ممتاز جداً لاستغلال الجولات المزدوجة المصغرة أو الجولات الفارغة التي تؤجل فيها المباريات.
            </p>
          </div>

          <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '18px', background: '#fafafa' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '6px' }}>
              التريبل كابتن (Triple Captain)
            </h3>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--text-muted)', margin: 0 }}>
              ضرب نقاط كابتن فريقك في 3 بدلاً من 2. يُنصح بشدة بحفظ هذا الكرت لجولة مزدوجة (Double Gameweek) يلعب فيها نجمك الممتاز مباراتين سهلتين.
            </p>
          </div>

          <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '18px', background: '#fafafa' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '6px' }}>
              البنش بوست (Bench Boost)
            </h3>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--text-muted)', margin: 0 }}>
              احتساب نقاط جميع لاعبي مقاعد البدلاء الأربعة (حارس + 3 لاعبين) وإضافتها لحصيلتك الكلية للجولة.
            </p>
          </div>
        </div>
      </article>

      {/* Article 3: Transfer & Price Changes */}
      <article
        id="transfers"
        style={{
          background: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--fpl-green)' }}>
          <TrendingUp size={24} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>
            3. تغير أسعار اللاعبين وإدارة سوق الانتقالات
          </h2>
        </div>

        <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-main)', marginBottom: '14px' }}>
          تتغير أسعار اللاعبين يومياً بمقدار 0.1M بناءً على صافي عملات الشراء والبيع بين جموع المدربين حول العالم:
        </p>

        <ul style={{ lineHeight: 1.9, color: 'var(--text-main)', paddingRight: '20px', fontSize: '0.95rem' }}>
          <li><strong>أرباح البيع (Selling Profit):</strong> عند شراء لاعب بسعر 7.0M وارتفاع سعره إلى 7.4M، فإن سعر بيعه بالنسبة لك سيكون 7.2M (تحصل على نصف الزيادة فقط).</li>
          <li><strong>تجنب الخصم السلبي (-4):</strong> لا تقم بخصم نقاط إضافية إلا إذا كان اللاعب البديل متوقعاً منه حصد 6+ نقاط لتعويض الخصم وتوفير أرقام إيجابية.</li>
          <li><strong>مرونة البنك (Bank Reserve):</strong> احتفظ بـ 0.5M في البنك دائماً لتتيح لك الانتقالات السريعة عند إصابة أحد نجومك الأساسيين.</li>
        </ul>
      </article>

      {/* Footer Ad Unit */}
      <AdBanner slotId="8765432109" format="rectangle" />
    </div>
  );
};
