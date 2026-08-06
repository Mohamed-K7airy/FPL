import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { AdBanner } from '../components/AdBanner';
import { getArticles } from '../services/articleService';
import { Article } from '../data/articles';
import {
  BookOpen,
  Clock,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Sparkles,
  TrendingUp,
  Shield,
  Award,
  ArrowRight,
  ArrowLeft,
  FileText,
} from 'lucide-react';

const renderCoverIcon = (iconName: string) => {
  switch (iconName) {
    case 'Award':
      return <Award size={36} style={{ color: '#ffffff' }} />;
    case 'TrendingUp':
      return <TrendingUp size={36} style={{ color: '#ffffff' }} />;
    case 'BookOpen':
      return <BookOpen size={36} style={{ color: '#ffffff' }} />;
    case 'Shield':
    default:
      return <Shield size={36} style={{ color: '#ffffff' }} />;
  }
};

export const TipsPage: React.FC = () => {
  const { lang, isRtl } = useLanguage();
  const [articlesList, setArticlesList] = useState<Article[]>([]);
  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;

  useEffect(() => {
    setArticlesList(getArticles());
  }, []);

  return (
    <div className="tips-page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      {/* Hero Header */}
      <header className="tips-hero">
        <div className="tips-hero-badge">
          <BookOpen size={16} />
          <span>{lang === 'ar' ? 'مقالات ونصائح الفانتازي' : 'Fantasy Tips & Articles'}</span>
        </div>

        <h1 className="tips-hero-title">
          {lang === 'ar'
            ? 'نصائح واستراتيجيات بناء الفريق'
            : 'Team Building Tips & Strategies'}
        </h1>

        <p className="tips-hero-subtitle">
          {lang === 'ar'
            ? 'مقالات تحليليلة احترافية لمساعدتك في بناء تشكيلة متوازنة وتحقيق أفضل النتائج في دوريك.'
            : 'Professional analysis articles to help you build a balanced squad and achieve top rankings.'}
        </p>

        <div className="tips-hero-stats">
          <div className="tips-hero-stat">
            <Trophy size={18} style={{ color: '#fbbf24' }} />
            <div>
              <div className="tips-stat-number">~9,000</div>
              <div className="tips-stat-label">{lang === 'ar' ? 'ترتيب عالمي 24/25' : 'Global rank 24/25'}</div>
            </div>
          </div>
          <div className="tips-hero-stat">
            <FileText size={18} style={{ color: '#a78bfa' }} />
            <div>
              <div className="tips-stat-number">{articlesList.length}</div>
              <div className="tips-stat-label">{lang === 'ar' ? 'مقالات نشرت' : 'Published articles'}</div>
            </div>
          </div>
          <div className="tips-hero-stat">
            <TrendingUp size={18} style={{ color: '#34d399' }} />
            <div>
              <div className="tips-stat-number">{lang === 'ar' ? 'محتوى حصري' : 'Exclusive'}</div>
              <div className="tips-stat-label">{lang === 'ar' ? 'تحليلات تكتيكية' : 'Tactical Analysis'}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Ad Banner */}
      <AdBanner slotId="tips-top-banner" format="auto" />

      {/* Articles Grid */}
      <section className="tips-articles-section">
        <div className="tips-section-header">
          <h2 className="tips-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={22} style={{ color: 'var(--fpl-purple)' }} />
            <span>{lang === 'ar' ? 'آخر المقالات والنصائح' : 'Latest Tips & Articles'}</span>
          </h2>
        </div>

        <div className="tips-articles-grid">
          {articlesList.map((article, index) => (
            <Link
              key={article.id}
              to={`/tips/${article.slug}`}
              className="tips-article-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Card Cover */}
              <div className="tips-card-cover">
                {article.coverImage ? (
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: article.coverFit === 'contain' ? 'contain' : 'cover',
                      objectPosition: article.coverPosition || 'center top',
                      transform: article.coverZoom ? `scale(${article.coverZoom / 100})` : 'scale(1)',
                      transformOrigin: article.coverPosition || 'center top',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                ) : (
                  <div className="tips-card-cover-icon">
                    {renderCoverIcon(article.coverIcon)}
                  </div>
                )}
                <div className="tips-card-category" style={{ background: article.categoryColor }}>
                  {lang === 'ar' ? article.category : article.categoryEn}
                </div>
              </div>

              {/* Card Body */}
              <div className="tips-card-body">
                <h3 className="tips-card-title">
                  {lang === 'ar' ? article.title : article.titleEn}
                </h3>
                <p className="tips-card-excerpt">
                  {lang === 'ar' ? article.excerpt : article.excerptEn}
                </p>

                <div className="tips-card-meta">
                  <div className="tips-card-meta-left">
                    <Clock size={13} />
                    <span>{lang === 'ar' ? article.readTime : article.readTimeEn}</span>
                  </div>
                  <div className="tips-card-read-more">
                    <span>{lang === 'ar' ? 'قراءة المقال' : 'Read Article'}</span>
                    <ArrowIcon size={14} />
                  </div>
                </div>
              </div>

              {/* Rank Badge */}
              <div className="tips-card-rank-badge">
                <Trophy size={12} />
                <span>Top 9K</span>
              </div>
            </Link>
          ))}

          {/* Clean Professional Coming Soon Card */}
          <div className="tips-coming-soon-card">
            <div className="tips-coming-icon">
              <Sparkles size={32} style={{ color: 'var(--fpl-purple)' }} />
            </div>
            <h3>{lang === 'ar' ? 'مقالات تحليليلة قادمة' : 'Upcoming Tactical Articles'}</h3>
            <p>
              {lang === 'ar'
                ? 'نصائح خط الدفاع، خط الوسط، وثنائي الهجوم سيتم نشرها قريباً.'
                : 'Defense, midfield, and forward tips will be published soon.'}
            </p>
            <div className="tips-coming-positions">
              <span className="tips-pos-chip def">DEF</span>
              <span className="tips-pos-chip mid">MID</span>
              <span className="tips-pos-chip fwd">FWD</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <AdBanner slotId="tips-bottom-banner" format="rectangle" />
    </div>
  );
};
