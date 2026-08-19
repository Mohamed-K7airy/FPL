import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { AdBanner } from '../components/AdBanner';
import { getArticleBySlug, getArticles } from '../services/articleService';
import { Article, ArticleSection } from '../data/articles';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Trophy,
  Share2,
  BookOpen,
  AlertTriangle,
  Shield,
  Award,
  TrendingUp,
  Check,
  Sparkles,
  Layers
} from 'lucide-react';

export const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang, isRtl } = useLanguage();
  const [article, setArticle] = useState<Article | undefined>(undefined);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);

  const BackArrow = isRtl ? ArrowRight : ArrowLeft;
  const ForwardArrow = isRtl ? ArrowLeft : ArrowRight;

  useEffect(() => {
    if (slug) {
      const current = getArticleBySlug(slug);
      setArticle(current);
      if (current) {
        const all = getArticles();
        setRelatedArticles(all.filter((a) => a.id !== current.id).slice(0, 2));

        // Update document title dynamically
        const currentTitle = lang === 'ar' ? current.title : current.titleEn;
        document.title = `${currentTitle} | MINI FPL`;

        // Inject / update Schema.org Article Structured Data
        const scriptId = 'article-structured-data';
        let scriptTag = document.getElementById(scriptId) as HTMLScriptElement;
        if (!scriptTag) {
          scriptTag = document.createElement('script');
          scriptTag.id = scriptId;
          scriptTag.type = 'application/ld+json';
          document.head.appendChild(scriptTag);
        }
        scriptTag.text = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: currentTitle,
          description: lang === 'ar' ? current.excerpt : current.excerptEn,
          author: {
            '@type': 'Person',
            name: current.author || 'MINI FPL Editorial',
          },
          publisher: {
            '@type': 'Organization',
            name: 'MINI FPL',
            logo: {
              '@type': 'ImageObject',
              url: 'https://sphinxcs.online/logo.png',
            },
          },
          datePublished: current.date,
          dateModified: current.date,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://sphinxcs.online/tips/${current.slug}`,
          },
        });
      }
    }
  }, [slug, lang]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!article) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--text-muted)' }}>
        <BookOpen size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
        <h2 style={{ marginBottom: '12px', color: 'var(--fpl-purple)' }}>
          {lang === 'ar' ? 'المقال غير موجود' : 'Article not found'}
        </h2>
        <Link to="/tips" className="btn-primary" style={{ display: 'inline-flex', padding: '10px 24px' }}>
          {lang === 'ar' ? 'العودة للمقالات والتحليلات' : 'Back to articles'}
        </Link>
      </div>
    );
  }

  const content = (lang === 'ar' ? article.content : article.contentEn) || article.content;

  const handleShare = async () => {
    const shareData = {
      title: lang === 'ar' ? article.title : article.titleEn,
      text: lang === 'ar' ? article.excerpt : article.excerptEn,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert(lang === 'ar' ? 'تم نسخ رابط المقال بنجاح!' : 'Article link copied to clipboard!');
      }
    } catch {
      // User cancelled share
    }
  };

  const renderSection = (section: ArticleSection, index: number) => {
    switch (section.type) {
      case 'heading':
        return (
          <h2 key={index} className="article-section-heading">
            {section.text}
          </h2>
        );

      case 'paragraph':
        return (
          <p key={index} className="article-section-paragraph">
            {section.text}
          </p>
        );

      case 'warning':
        return (
          <div key={index} className="article-warning-box">
            <AlertTriangle size={20} style={{ color: '#f59e0b', flexShrink: 0 }} />
            <div className="article-warning-text">{section.text}</div>
          </div>
        );

      case 'tip-card':
        return (
          <div key={index} className="article-tip-card">
            <div className="article-tip-icon">
              <Award size={28} style={{ color: '#00ff85' }} />
            </div>
            <div className="article-tip-text">{section.text}</div>
          </div>
        );

      case 'player-card':
        return (
          <div key={index} className={`article-player-card ${section.highlight ? 'highlighted' : ''}`}>
            <div className="article-player-header">
              {section.playerImage ? (
                <div className="article-player-avatar-img">
                  <img src={section.playerImage} alt={section.playerName} />
                </div>
              ) : (
                <div className="article-player-avatar">
                  <Shield size={24} style={{ color: '#ffffff' }} />
                </div>
              )}
              <div className="article-player-info">
                <div className="article-player-name">{section.playerName}</div>
                <div className="article-player-team">{section.playerTeam}</div>
              </div>
              <div className="article-player-price">{section.playerPrice}</div>
            </div>

            {section.tier && (
              <div className="article-player-tier">
                {section.highlight && <Trophy size={14} style={{ color: '#fbbf24' }} />}
                <span>{section.tier}</span>
              </div>
            )}

            {section.items && (
              <ul className="article-player-points">
                {section.items.map((item, i) => (
                  <li key={i}>
                    <Check size={14} className="article-check-icon" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      case 'divider':
        return <hr key={index} className="article-divider" />;

      default:
        return null;
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Top Fixed Reading Progress Bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: `${scrollProgress}%`,
          height: '3.5px',
          background: 'linear-gradient(90deg, #ec4899 0%, #00ff85 100%)',
          zIndex: 1000,
          transition: 'width 0.1s ease',
        }}
      />

      <div className="article-page-container">
        {/* Back Link & Share Action Row */}
        <div className="article-back-row">
          <Link to="/tips" className="article-back-link">
            <BackArrow size={16} />
            <span>{lang === 'ar' ? 'العودة للمقالات والتحليلات' : 'Back to articles'}</span>
          </Link>

          <button className="article-share-btn" onClick={handleShare}>
            <Share2 size={14} />
            <span>{lang === 'ar' ? 'مشاركة المقال' : 'Share'}</span>
          </button>
        </div>

        {/* Article Header */}
        <header className="article-header">
          {article.coverImage && (
            article.coverFit === 'auto' ? (
              <div
                style={{
                  width: '100%',
                  maxWidth: '650px',
                  margin: '0 auto 24px auto',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                  border: '1px solid #e2e8f0',
                }}
              >
                <img
                  src={article.coverImage}
                  alt={article.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    borderRadius: '20px',
                    transform: article.coverZoom ? `scale(${article.coverZoom / 100})` : 'scale(1)',
                    transformOrigin: article.coverPosition || 'center center',
                    transition: 'transform 0.3s ease',
                  }}
                />
              </div>
            ) : article.coverFit === 'contain' ? (
              <div
                style={{
                  width: '100%',
                  height: article.coverHeight ? `${article.coverHeight}px` : '420px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  marginBottom: '24px',
                  background: '#0d001f',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                }}
              >
                <img
                  src={article.coverImage}
                  alt={article.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    transform: article.coverZoom ? `scale(${article.coverZoom / 100})` : 'scale(1)',
                    transformOrigin: article.coverPosition || 'center center',
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: '100%',
                  height: article.coverHeight ? `${article.coverHeight}px` : '360px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  marginBottom: '24px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  transition: 'all 0.3s ease',
                }}
              >
                <img
                  src={article.coverImage}
                  alt={article.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: article.coverPosition || 'center center',
                    transform: article.coverZoom ? `scale(${article.coverZoom / 100})` : 'scale(1)',
                    transformOrigin: article.coverPosition || 'center center',
                    transition: 'transform 0.3s ease',
                  }}
                />
              </div>
            )
          )}

          <div className="article-category-pill" style={{ background: article.categoryColor }}>
            {lang === 'ar' ? article.category : article.categoryEn}
          </div>

          <h1 className="article-title">
            {lang === 'ar' ? article.title : article.titleEn}
          </h1>

          <p className="article-excerpt">
            {lang === 'ar' ? article.excerpt : article.excerptEn}
          </p>

          <div className="article-meta-row">
            <div className="article-meta-item">
              <Trophy size={14} style={{ color: '#d97706' }} />
              <span>{lang === 'ar' ? article.authorRank : article.authorRankEn}</span>
            </div>
            <div className="article-meta-item">
              <Clock size={14} />
              <span>{lang === 'ar' ? article.readTime : article.readTimeEn}</span>
            </div>
            <div className="article-meta-item">
              <span>{article.date}</span>
            </div>
          </div>
        </header>

        {/* Top Ad Banner */}
        <AdBanner slotId="7890123456" format="auto" />

        {/* Article Body */}
        <article className="article-body">
          {content.map((section, index) => renderSection(section, index))}
        </article>

        {/* Author Card */}
        <div className="article-author-card">
          <div className="article-author-avatar">
            <Award size={24} style={{ color: '#ffffff' }} />
          </div>
          <div className="article-author-info">
            <div className="article-author-name">{article.author}</div>
            <div className="article-author-rank">
              {lang === 'ar' ? article.authorRank : article.authorRankEn}
            </div>
          </div>
          <Link to="/tips" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
            {lang === 'ar' ? 'جميع المقالات' : 'More articles'}
          </Link>
        </div>

        {/* RELATED ARTICLES SECTION */}
        {relatedArticles.length > 0 && (
          <div style={{ marginTop: '40px', marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--fpl-purple)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={20} style={{ color: '#0284c7' }} />
              <span>{lang === 'ar' ? 'تحليلات ومقالات ننصح بقراءتها' : 'Recommended Tactical Reads'}</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/tips/${rel.slug}`}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)';
                  }}
                >
                  <div>
                    <span
                      style={{
                        background: `${rel.categoryColor || '#3b82f6'}18`,
                        color: rel.categoryColor || '#3b82f6',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        display: 'inline-block',
                        marginBottom: '8px',
                      }}
                    >
                      {lang === 'ar' ? rel.category : rel.categoryEn}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--fpl-purple)', lineHeight: 1.4, margin: '0 0 8px 0' }}>
                      {lang === 'ar' ? rel.title : rel.titleEn}
                    </h4>
                  </div>

                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0284c7', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '12px' }}>
                    <span>{lang === 'ar' ? 'قراءة التحليل' : 'Read Article'}</span>
                    <ForwardArrow size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Clean Professional CTA Box */}
        <div className="article-cta-box">
          <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <TrendingUp size={20} style={{ color: '#10b981' }} />
            <span>{lang === 'ar' ? 'تابع أحدث التحليلات التكتيكية' : 'Follow upcoming tactical analysis'}</span>
          </h3>
          <p>
            {lang === 'ar'
              ? 'نصائح الكابتن الأسبوعي، خيارات الحراسة والدفاع، وثنائي الهجوم تُحدّث دورياً قبل الموعد النهائي للجولة.'
              : 'Captaincy picks, defensive strategies, and forward setups are published weekly before the deadline.'}
          </p>
          <Link to="/tips" className="btn-primary" style={{ display: 'inline-flex', padding: '10px 24px' }}>
            {lang === 'ar' ? 'تصفح جميع المقالات' : 'Browse All Articles'}
          </Link>
        </div>

        {/* Bottom Ad Banner */}
        <AdBanner slotId="9876543210" format="rectangle" />
      </div>
    </div>
  );
};
