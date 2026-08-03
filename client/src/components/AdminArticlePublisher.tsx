import React, { useState } from 'react';
import { Article, ArticleSection } from '../data/articles';
import { saveArticle, deleteArticle } from '../services/articleService';
import { FileText, Plus, Trash2 } from 'lucide-react';

interface SectionEditorProps {
  sec: ArticleSection;
  idx: number;
  onUpdate: (index: number, fields: Partial<ArticleSection>) => void;
  onRemove: (index: number) => void;
}

const SectionEditorItem: React.FC<SectionEditorProps> = ({ sec, idx, onUpdate, onRemove }) => {
  const itemsText = (sec.items || []).join('\n');

  const handleItemsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(idx, { items: e.target.value.split('\n') });
  };

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '14px',
        marginBottom: '12px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--fpl-purple)' }}>
          {'عنصر ' + (idx + 1) + ': ' + sec.type}
        </span>
        <button
          type="button"
          onClick={() => onRemove(idx)}
          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {sec.type === 'heading' && (
        <input
          type="text"
          placeholder="عنوان الفقرة..."
          value={sec.text || ''}
          onChange={(e) => onUpdate(idx, { text: e.target.value })}
          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontWeight: 800 }}
        />
      )}

      {sec.type === 'paragraph' && (
        <textarea
          placeholder="نص الفقرة..."
          value={sec.text || ''}
          onChange={(e) => onUpdate(idx, { text: e.target.value })}
          rows={3}
          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
        />
      )}

      {sec.type === 'warning' && (
        <input
          type="text"
          placeholder="نص التنبيه..."
          value={sec.text || ''}
          onChange={(e) => onUpdate(idx, { text: e.target.value })}
          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #f59e0b', background: '#fffbe3' }}
        />
      )}

      {sec.type === 'tip-card' && (
        <textarea
          placeholder="نص النصيحة..."
          value={sec.text || ''}
          onChange={(e) => onUpdate(idx, { text: e.target.value })}
          rows={2}
          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--fpl-purple)' }}
        />
      )}

      {sec.type === 'player-card' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input
            type="text"
            placeholder="اسم اللاعب"
            value={sec.playerName || ''}
            onChange={(e) => onUpdate(idx, { playerName: e.target.value })}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
          />
          <input
            type="text"
            placeholder="الفريق"
            value={sec.playerTeam || ''}
            onChange={(e) => onUpdate(idx, { playerTeam: e.target.value })}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
          />
          <input
            type="text"
            placeholder="السعر"
            value={sec.playerPrice || ''}
            onChange={(e) => onUpdate(idx, { playerPrice: e.target.value })}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
          />
          <input
            type="text"
            placeholder="الفئة"
            value={sec.tier || ''}
            onChange={(e) => onUpdate(idx, { tier: e.target.value })}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
          />
          <input
            type="text"
            placeholder="رابط صورة اللاعب (مثال: /players/Arsenal/b22b5eee4eb2-1-david-raya.png)"
            value={sec.playerImage || ''}
            onChange={(e) => onUpdate(idx, { playerImage: e.target.value })}
            style={{ gridColumn: '1 / -1', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
          />
          <textarea
            placeholder="مميزات اللاعب (ميزة في كل سطر)"
            value={itemsText}
            onChange={handleItemsChange}
            rows={2}
            style={{ gridColumn: '1 / -1', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
          />
        </div>
      )}
    </div>
  );
};

interface ArticlePublisherProps {
  articlesList: Article[];
  onArticleAdded: () => void;
  onArticleDeleted: () => void;
}

export const AdminArticlePublisher: React.FC<ArticlePublisherProps> = ({
  articlesList,
  onArticleAdded,
  onArticleDeleted,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('بناء التشكيلة');
  const [readTime, setReadTime] = useState('3 دقائق قراءة');
  const [excerpt, setExcerpt] = useState('');
  const [coverIcon, setCoverIcon] = useState<'Shield' | 'Award' | 'TrendingUp' | 'BookOpen'>('Shield');
  const [coverImage, setCoverImage] = useState('');
  const [sections, setSections] = useState<ArticleSection[]>([
    { type: 'heading', text: 'عنوان الفقرة الأولى' },
    { type: 'paragraph', text: 'اكتب تفاصيل النصيحة هنا...' },
  ]);

  const addSection = (type: ArticleSection['type']) => {
    if (type === 'heading') {
      setSections([...sections, { type: 'heading', text: '' }]);
    } else if (type === 'paragraph') {
      setSections([...sections, { type: 'paragraph', text: '' }]);
    } else if (type === 'warning') {
      setSections([...sections, { type: 'warning', text: 'تنبيه مهم: ' }]);
    } else if (type === 'tip-card') {
      setSections([...sections, { type: 'tip-card', text: 'نصيحة المدير: ' }]);
    } else if (type === 'player-card') {
      setSections([
        ...sections,
        {
          type: 'player-card',
          playerName: '',
          playerTeam: '',
          playerPrice: '5.0M',
          tier: 'فئة اللاعب',
          highlight: false,
          items: ['ميزة 1', 'ميزة 2'],
        },
      ]);
    } else if (type === 'divider') {
      setSections([...sections, { type: 'divider' }]);
    }
  };

  const updateSection = (index: number, updatedFields: Partial<ArticleSection>) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], ...updatedFields };
    setSections(newSections);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim()) {
      alert('يرجى ملء عنوان المقال والملخص على الأقل.');
      return;
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || `article-${Date.now()}`;

    const newArticleData = {
      slug,
      title,
      titleEn: title,
      excerpt,
      excerptEn: excerpt,
      category,
      categoryEn: category === 'بناء التشكيلة' ? 'Squad Building' : 'Transfers',
      categoryColor: '#10b981',
      author: 'مدير المنصة',
      authorRank: 'المركز ~9,000 عالمياً 24/25',
      authorRankEn: 'Top ~9,000 in 24/25',
      readTime,
      readTimeEn: readTime,
      coverIcon,
      coverImage: coverImage.trim() || undefined,
      content: sections,
      contentEn: sections,
    };

    saveArticle(newArticleData);
    setTitle('');
    setExcerpt('');
    setCoverImage('');
    setSections([
      { type: 'heading', text: 'عنوان الفقرة' },
      { type: 'paragraph', text: 'تفاصيل الفقرة...' },
    ]);
    setShowForm(false);
    onArticleAdded();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المقال؟')) {
      deleteArticle(id);
      onArticleDeleted();
    }
  };

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: '20px',
        padding: '28px',
        marginBottom: '36px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--fpl-purple)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={22} style={{ color: 'var(--fpl-purple)' }} />
            <span>نظام إدارة ونشر المقالات والنصائح</span>
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
            أضف مقالات تحليليلة جديدة تظهر في صفحة المقالات للمستخدمين بكل سهولة
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
        >
          <Plus size={18} />
          <span>{showForm ? 'إغلاق النموذج' : 'كتابة مقال جديد'}</span>
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handlePublish}
          style={{
            background: '#f8fafc',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '28px',
          }}
        >
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '16px' }}>
            نموذج إنشاء مقال تكتيكي
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                عنوان المقال *
              </label>
              <input
                type="text"
                placeholder="عنوان المقال..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                التصنيف الرئيسي
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.9rem', background: '#fff' }}
              >
                <option value="بناء التشكيلة">{'بناء التشكيلة'}</option>
                <option value="الانتقالات والتغييرات">{'الانتقالات والتغييرات'}</option>
                <option value="اختيار الكابتن">{'اختيار الكابتن'}</option>
                <option value="استراتيجيات الكروت">{'استراتيجيات الكروت'}</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                زمن القراءة المتوقع
              </label>
              <input
                type="text"
                placeholder="مثال: 3 دقائق قراءة"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                أيقونة الكارت الاحتياطية
              </label>
              <select
                value={coverIcon}
                onChange={(e) => setCoverIcon(e.target.value as 'Shield' | 'Award' | 'TrendingUp' | 'BookOpen')}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.9rem', background: '#fff' }}
              >
                <option value="Shield">{'درع تكتيكي - Shield'}</option>
                <option value="Award">{'جائزة وتميز - Award'}</option>
                <option value="TrendingUp">{'مؤشر صعود - TrendingUp'}</option>
                <option value="BookOpen">{'كتاب ودليل - BookOpen'}</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: 'var(--fpl-purple)' }}>
                🖼️ رابط صورة الغلاف الخاصة بالمقال (اختياري)
              </label>
              <input
                type="text"
                placeholder="أدخل رابط صورة (مثال: https://images.unsplash.com/... أو /players/...)"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                إذا تركت هذا الحقل فارغاً، سيتم عرض تصميم الأيقونة الملونة الافتراضي كغلاف للمقال.
              </span>
              {coverImage && (
                <div style={{ marginTop: '10px', borderRadius: '10px', overflow: 'hidden', height: '120px', width: '100%', border: '1px solid var(--border-color)', position: 'relative' }}>
                  <img src={coverImage} alt="معاينة الغلاف" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                  <span style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem' }}>
                    معاينة صورة الغلاف
                  </span>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
              ملخص قصير للمقال *
            </label>
            <textarea
              placeholder="اكتب نبذة مختصرة عن أهم النقاط المطروحة في المقال..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              required
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.9rem', resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--fpl-purple)' }}>
                {'فقرات ومحتويات المقال (' + sections.length + ')'}
              </label>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <button type="button" onClick={() => addSection('heading')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                + عنوان فرعي
              </button>
              <button type="button" onClick={() => addSection('paragraph')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                + فقرة نصية
              </button>
              <button type="button" onClick={() => addSection('player-card')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                + كارت لاعب
              </button>
              <button type="button" onClick={() => addSection('warning')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                + تنبيه هام
              </button>
              <button type="button" onClick={() => addSection('tip-card')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                + نصيحة ذهبية
              </button>
            </div>

            <div>
              {sections.map((sec, idx) => (
                <SectionEditorItem
                  key={idx}
                  sec={sec}
                  idx={idx}
                  onUpdate={updateSection}
                  onRemove={removeSection}
                />
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '1rem' }}>
            نشر المقال الآن
          </button>
        </form>
      )}

      <div>
        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '14px' }}>
          {'المقالات المنشورة حالياً (' + articlesList.length + ')'}
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {articlesList.map((art) => (
            <div
              key={art.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#f8fafc',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '14px 18px',
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--fpl-purple)' }}>
                  {art.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', gap: '12px' }}>
                  <span>{'التصنيف: ' + art.category}</span>
                  <span>{'التاريخ: ' + art.date}</span>
                  <span>{art.readTime}</span>
                  {art.isCustom && <span style={{ color: '#10b981', fontWeight: 800 }}>{' (تم إنشاؤه بواسطة الإدارة)'}</span>}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {art.isCustom && (
                  <button
                    type="button"
                    onClick={() => handleDelete(art.id)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Trash2 size={14} />
                    <span>حذف</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
