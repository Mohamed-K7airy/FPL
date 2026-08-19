import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { AdBanner } from '../components/AdBanner';
import { getArticles } from '../services/articleService';
import { Article } from '../data/articles';
import {
  BookOpen,
  Clock,
  Search,
  Sparkles,
  TrendingUp,
  Shield,
  Award,
  ArrowRight,
  ArrowLeft,
  Filter,
  Flame,
  FileText,
  Calendar,
  X,
  Compass,
  CheckCircle2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export const TipsPage: React.FC = () => {
  const { lang, isRtl } = useLanguage();
  const [articlesList, setArticlesList] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  useEffect(() => {
    setArticlesList(getArticles());
  }, []);

  // Reset page to 1 whenever category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const categories = [
    { id: 'all', labelAr: 'جميع التحليلات (30)', labelEn: 'All Articles (30)', icon: <Compass size={15} /> },
    { id: 'اختيارات الكابتن', labelAr: 'اختيارات الكابتن', labelEn: 'Captaincy Picks', icon: <Flame size={15} /> },
    { id: 'التكتيك والتخطيط', labelAr: 'التكتيك والتخطيط', labelEn: 'Tactics & Planning', icon: <TrendingUp size={15} /> },
    { id: 'بناء التشكيلة', labelAr: 'بناء التشكيلة والمراكز', labelEn: 'Squad Building', icon: <Shield size={15} /> },
    { id: 'إدارة الخواص', labelAr: 'إدارة الخواص (Chips)', labelEn: 'Chips Strategy', icon: <Sparkles size={15} /> },
    { id: 'سوق الانتقالات', labelAr: 'سوق الانتقالات والأسعار', labelEn: 'Market & Prices', icon: <Award size={15} /> },
  ];

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    return articlesList.filter((article) => {
      const matchCategory =
        selectedCategory === 'all' ||
        article.category === selectedCategory ||
        article.categoryEn === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.titleEn.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.excerptEn.toLowerCase().includes(q);

      return matchCategory && matchSearch;
    });
  }, [articlesList, selectedCategory, searchQuery]);

  // Paginated articles
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage) || 1;
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredArticles.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredArticles, currentPage, itemsPerPage]);

  // Spotlight Article (First one when on page 1 with all filters default)
  const spotlightArticle = currentPage === 1 && selectedCategory === 'all' && !searchQuery && articlesList.length > 0 ? articlesList[0] : null;

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: "'Cairo', 'Inter', sans-serif" }}>
      
      {/* 1. ELEGANT, SOFT EYE-COMFORT HERO SECTION */}
      <section
        style={{
          width: '100%',
          background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 60%, #311042 100%)',
          color: '#ffffff',
          padding: '60px 24px 70px 24px',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Soft Ambient Background Glows */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '700px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(0, 255, 133, 0.08) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          {/* Subtle Top Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 18px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#38bdf8',
              fontSize: '0.82rem',
              fontWeight: 700,
              marginBottom: '18px',
              backdropFilter: 'blur(8px)',
            }}
          >
            <BookOpen size={15} style={{ color: '#00ff85' }} />
            <span>{isRtl ? 'الموسوعة التحليليّة الرسمية | MINI FPL' : 'Official Tactical Encyclopedia | MINI FPL'}</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 3.8vw, 3rem)',
              fontWeight: 900,
              lineHeight: 1.3,
              marginBottom: '14px',
              color: '#ffffff',
              letterSpacing: '-0.5px',
            }}
          >
            {isRtl ? 'أدلة وتحليلات واستراتيجيات الفانتازي' : 'FPL Strategy Guides & Winning Insights'}
          </h1>

          <p
            style={{
              fontSize: 'clamp(0.95rem, 1.6vw, 1.08rem)',
              color: '#cbd5e1',
              maxWidth: '680px',
              margin: '0 auto 32px auto',
              lineHeight: 1.8,
              fontWeight: 400,
            }}
          >
            {isRtl
              ? 'مكتبة شاملة تضم 30 دراسة معمقة تشمل حوكمة الميزانية، اختيارات الكابتن، إدارة الخواص، وتحليلات الأهداف المتوقعة (xG).'
              : 'Comprehensive library of 30 in-depth studies covering budget allocations, captaincy picks, chip timing, and xG data.'}
          </p>

          {/* Clean Modern Search Bar */}
          <div style={{ maxWidth: '580px', margin: '0 auto', position: 'relative' }}>
            <Search
              size={19}
              style={{
                position: 'absolute',
                top: '50%',
                [isRtl ? 'right' : 'left']: '18px',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? 'ابحث في الموسوعة (مثلاً: الكابتن، الحارس، الوايلد كارد، xG)...' : 'Search 30 articles (e.g. Captain, Goalkeeper, Wildcard, xG)...'}
              style={{
                width: '100%',
                height: '52px',
                padding: isRtl ? '0 52px 0 44px' : '0 44px 0 52px',
                borderRadius: '16px',
                border: '1.5px solid rgba(255, 255, 255, 0.18)',
                background: 'rgba(15, 23, 42, 0.65)',
                color: '#ffffff',
                fontSize: '0.92rem',
                outline: 'none',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#38bdf8';
                e.target.style.boxShadow = '0 8px 30px rgba(56, 189, 248, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.18)';
                e.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.25)';
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  top: '50%',
                  [isRtl ? 'left' : 'right']: '14px',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. REFINED CATEGORY FILTER TABS */}
      <nav
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '12px 20px',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            padding: '2px 0',
          }}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 16px',
                  borderRadius: '10px',
                  border: isSelected ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                  background: isSelected ? '#0284c7' : '#f8fafc',
                  color: isSelected ? '#ffffff' : '#475569',
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: '0.82rem',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 2px 8px rgba(2, 132, 199, 0.25)' : 'none',
                }}
              >
                <span style={{ color: isSelected ? '#ffffff' : '#64748b' }}>{cat.icon}</span>
                <span>{isRtl ? cat.labelAr : cat.labelEn}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. MAIN CONTENT CONTAINER */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '36px 20px 60px 20px' }}>
        
        {/* SPOTLIGHT ARTICLE (Only on Page 1 when no search is active) */}
        {spotlightArticle && (
          <section style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: '#0284c7', fontWeight: 800, fontSize: '0.85rem' }}>
              <Flame size={18} style={{ color: '#f59e0b' }} />
              <span>{isRtl ? 'دراسة الأسبوع المميزة' : 'Featured Tactical Spotlight'}</span>
            </div>

            <Link
              to={`/tips/${spotlightArticle.slug}`}
              style={{
                display: 'block',
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 6px 24px rgba(0, 0, 0, 0.04)',
                textDecoration: 'none',
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = '#0284c7';
                e.currentTarget.style.boxShadow = '0 12px 36px rgba(2, 132, 199, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.04)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    background: '#e0f2fe',
                    color: '#0369a1',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                  }}
                >
                  {lang === 'ar' ? spotlightArticle.category : spotlightArticle.categoryEn}
                </span>

                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '0.78rem', fontWeight: 600 }}>
                  <Clock size={13} />
                  <span>{lang === 'ar' ? spotlightArticle.readTime : spotlightArticle.readTimeEn}</span>
                </span>

                <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>• {spotlightArticle.date}</span>
              </div>

              <h2
                style={{
                  fontSize: 'clamp(1.3rem, 2.4vw, 1.8rem)',
                  fontWeight: 900,
                  color: '#0f172a',
                  lineHeight: 1.4,
                  marginBottom: '12px',
                }}
              >
                {lang === 'ar' ? spotlightArticle.title : spotlightArticle.titleEn}
              </h2>

              <p
                style={{
                  color: '#475569',
                  fontSize: '0.98rem',
                  lineHeight: 1.75,
                  marginBottom: '20px',
                  maxWidth: '900px',
                }}
              >
                {lang === 'ar' ? spotlightArticle.excerpt : spotlightArticle.excerptEn}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>
                    FPL
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#1e293b' }}>{spotlightArticle.author}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{lang === 'ar' ? spotlightArticle.authorRank : spotlightArticle.authorRankEn}</div>
                  </div>
                </div>

                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#0284c7',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                  }}
                >
                  <span>{isRtl ? 'قراءة التحليل الكامل' : 'Read Full Study'}</span>
                  <ArrowIcon size={16} />
                </span>
              </div>
            </Link>
          </section>
        )}

        {/* ARTICLES GRID SECTION HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              {selectedCategory === 'all'
                ? (isRtl ? 'دليل التحليلات الشاملة' : 'Comprehensive Analytics Grid')
                : (isRtl ? `مقالات تصنيف: ${selectedCategory}` : `Category: ${selectedCategory}`)}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '4px 0 0 0' }}>
              {isRtl
                ? `عرض الصفحة ${currentPage} من أصل ${totalPages} (${filteredArticles.length} مقال متاح)`
                : `Showing Page ${currentPage} of ${totalPages} (${filteredArticles.length} articles available)`}
            </p>
          </div>
        </div>

        {/* ARTICLES GRID */}
        {filteredArticles.length === 0 ? (
          <div
            style={{
              background: '#ffffff',
              border: '1.5px dashed #cbd5e1',
              borderRadius: '20px',
              padding: '60px 20px',
              textAlign: 'center',
            }}
          >
            <FileText size={44} style={{ color: '#94a3b8', margin: '0 auto 14px auto' }} />
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
              {isRtl ? 'لم يتم العثور على مقالات مطابقة' : 'No matching articles found'}
            </h4>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
              {isRtl ? 'جرّب البحث بكلمة أخرى أو اختر تصنيفاً مختلفاً من شريط الفلاتر.' : 'Try searching with different terms or select another category.'}
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
              gap: '22px',
            }}
          >
            {paginatedArticles.map((article) => (
              <Link
                key={article.id}
                to={`/tips/${article.slug}`}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '18px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  textDecoration: 'none',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = '#0284c7';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(2, 132, 199, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.02)';
                }}
              >
                <div>
                  {/* Category Badge & Read Time */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span
                      style={{
                        background: '#f1f5f9',
                        color: '#0f172a',
                        border: '1px solid #e2e8f0',
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                      }}
                    >
                      {lang === 'ar' ? article.category : article.categoryEn}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '0.74rem', fontWeight: 600 }}>
                      <Clock size={12} />
                      <span>{lang === 'ar' ? article.readTime : article.readTimeEn}</span>
                    </div>
                  </div>

                  <h4
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 900,
                      color: '#0f172a',
                      lineHeight: 1.45,
                      marginBottom: '10px',
                    }}
                  >
                    {lang === 'ar' ? article.title : article.titleEn}
                  </h4>

                  <p
                    style={{
                      color: '#64748b',
                      fontSize: '0.86rem',
                      lineHeight: 1.65,
                      marginBottom: '18px',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {lang === 'ar' ? article.excerpt : article.excerptEn}
                  </p>
                </div>

                {/* Footer of Card */}
                <div
                  style={{
                    borderTop: '1px solid #f8fafc',
                    paddingTop: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {article.date}
                  </div>

                  <span
                    style={{
                      color: '#0284c7',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>{isRtl ? 'قراءة التحليل' : 'Read Study'}</span>
                    <ArrowIcon size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div
            style={{
              marginTop: '45px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => {
                setCurrentPage((prev) => Math.max(1, prev - 1));
                window.scrollTo({ top: 350, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 14px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                background: currentPage === 1 ? '#f8fafc' : '#ffffff',
                color: currentPage === 1 ? '#cbd5e1' : '#334155',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontWeight: 700,
                fontSize: '0.82rem',
              }}
            >
              <PrevIcon size={16} />
              <span>{isRtl ? 'السابق' : 'Previous'}</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              const isCurrent = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => {
                    setCurrentPage(pageNum);
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    border: isCurrent ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                    background: isCurrent ? '#0284c7' : '#ffffff',
                    color: isCurrent ? '#ffffff' : '#334155',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => {
                setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                window.scrollTo({ top: 350, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 14px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                background: currentPage === totalPages ? '#f8fafc' : '#ffffff',
                color: currentPage === totalPages ? '#cbd5e1' : '#334155',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontWeight: 700,
                fontSize: '0.82rem',
              }}
            >
              <span>{isRtl ? 'التالي' : 'Next'}</span>
              <NextIcon size={16} />
            </button>
          </div>
        )}

      </main>
    </div>
  );
};
