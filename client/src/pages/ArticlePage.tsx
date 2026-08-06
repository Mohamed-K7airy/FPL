import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { AdBanner } from '../components/AdBanner';
import { getArticleBySlug } from '../services/articleService';
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
} from 'lucide-react';

export const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang, isRtl } = useLanguage();
  const [article, setArticle] = useState<Article | undefined>(undefined);
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  useEffect(() => {
    if (slug) {
      setArticle(getArticleBySlug(slug));
    }
  }, [slug]);

  if (!article) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--text-muted)' }}>
        <BookOpen size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
        <h2 style={{ marginBottom: '12px', color: 'var(--fpl-purple)' }}>
          {lang === 'ar' ? 'المقال غير موجود' : 'Article not found'}
        </h2>
        <Link to="/tips" className="btn-primary" style={{ display: 'inline-flex', padding: '10px 24px' }}>
          {lang === 'ar' ? 'العودة للمقالات' : 'Back to articles'}
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
        alert(lang === 'ar' ? 'تم نسخ رابط المقال' : 'Article link copied');
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
    <div className="article-page-container">
      {/* Back Link */}
      <div className="article-back-row">
        <Link to="/tips" className="article-back-link">
          <BackArrow size={16} />
          <span>{lang === 'ar' ? 'العودة للمقالات' : 'Back to articles'}</span>
        </Link>

        <button className="article-share-btn" onClick={handleShare}>
          <Share2 size={14} />
          <span>{lang === 'ar' ? 'مشاركة' : 'Share'}</span>
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
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
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
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
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
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
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
            <Trophy size={14} style={{ color: '#fbbf24' }} />
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

      {/* Ad Banner */}
      <AdBanner slotId="article-top" format="auto" />

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

      {/* Clean Professional CTA Box */}
      <div className="article-cta-box">
        <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <TrendingUp size={20} style={{ color: '#10b981' }} />
          <span>{lang === 'ar' ? 'تابع التحليلات القادمة' : 'Follow upcoming tactical analysis'}</span>
        </h3>
        <p>
          {lang === 'ar'
            ? 'نصائح اختيار المدافعين، خط الوسط، وثنائي الهجوم سيتم نشرها تباعاً قبل بداية الموسم.'
            : 'Defenders, midfield, and forward selection guides will be published prior to deadline.'}
        </p>
        <Link to="/tips" className="btn-primary" style={{ display: 'inline-flex', padding: '10px 24px' }}>
          {lang === 'ar' ? 'جميع المقالات' : 'All Articles'}
        </Link>
      </div>

      {/* Ad Banner */}
      <AdBanner slotId="article-bottom" format="rectangle" />
    </div>
  );
};
