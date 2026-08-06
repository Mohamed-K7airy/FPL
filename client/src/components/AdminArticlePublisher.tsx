import React, { useState, useRef } from 'react';
import { Article, ArticleSection } from '../data/articles';
import { saveArticle, deleteArticle } from '../services/articleService';
import { compressImageFile, compressBase64String } from '../utils/imageCompressor';
import { FileText, Plus, Trash2, Edit3, Upload, Image as ImageIcon, X } from 'lucide-react';

interface SectionEditorProps {
  sec: ArticleSection;
  idx: number;
  onUpdate: (index: number, fields: Partial<ArticleSection>) => void;
  onRemove: (index: number) => void;
}

const SectionEditorItem: React.FC<SectionEditorProps> = ({ sec, idx, onUpdate, onRemove }) => {
  const itemsText = (sec.items || []).join('\n');
  const playerFileInputRef = useRef<HTMLInputElement>(null);

  const handleItemsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(idx, { items: e.target.value.split('\n') });
  };

  const handlePlayerFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedBase64 = await compressImageFile(file, 400, 400, 0.85);
      onUpdate(idx, { playerImage: compressedBase64 });
    } catch (err) {
      console.error('Error compressing player image:', err);
    }
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

          {/* Player Image Section with Link OR Upload */}
          <div style={{ gridColumn: '1 / -1', background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', color: 'var(--fpl-purple)' }}>
              🖼️ صورة اللاعب (رابط أونلاين أو رفع من الجهاز)
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="أدخل رابط الصورة أو ارفع ملف..."
                value={sec.playerImage || ''}
                onChange={(e) => onUpdate(idx, { playerImage: e.target.value })}
                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
              />

              <input
                type="file"
                accept="image/*"
                ref={playerFileInputRef}
                onChange={handlePlayerFileUpload}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => playerFileInputRef.current?.click()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--fpl-purple)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <Upload size={14} />
                <span>رفع صورة</span>
              </button>
            </div>

            {sec.playerImage && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1', background: '#fff' }}>
                  <img src={sec.playerImage} alt="Player preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>تم اختيار صورة اللاعب</span>
                <button
                  type="button"
                  onClick={() => onUpdate(idx, { playerImage: '' })}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem', padding: '2px 6px' }}
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDate, setEditingDate] = useState<string | undefined>(undefined);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('بناء التشكيلة');
  const [readTime, setReadTime] = useState('3 دقائق قراءة');
  const [excerpt, setExcerpt] = useState('');
  const [coverIcon, setCoverIcon] = useState<'Shield' | 'Award' | 'TrendingUp' | 'BookOpen'>('Shield');
  const [coverImage, setCoverImage] = useState('');
  const [coverPosition, setCoverPosition] = useState('center 50%');
  const [coverHeight, setCoverHeight] = useState(360);
  const [coverZoom, setCoverZoom] = useState(100);
  const [coverFit, setCoverFit] = useState<'cover' | 'contain' | 'auto'>('auto');
  const [sections, setSections] = useState<ArticleSection[]>([
    { type: 'heading', text: 'عنوان الفقرة الأولى' },
    { type: 'paragraph', text: 'اكتب تفاصيل النصيحة هنا...' },
  ]);

  const formRef = useRef<HTMLFormElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setTitle('');
    setExcerpt('');
    setCoverImage('');
    setCoverPosition('center 50%');
    setCoverHeight(360);
    setCoverZoom(100);
    setCoverFit('auto');
    setCategory('بناء التشكيلة');
    setReadTime('3 دقائق قراءة');
    setCoverIcon('Shield');
    setEditingId(null);
    setEditingDate(undefined);
    setSections([
      { type: 'heading', text: 'عنوان الفقرة الأولى' },
      { type: 'paragraph', text: 'اكتب تفاصيل النصيحة هنا...' },
    ]);
  };

  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedBase64 = await compressImageFile(file, 1200, 1200, 0.75);
      setCoverImage(compressedBase64);
    } catch (err) {
      console.error('Error compressing cover image:', err);
    }
  };

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

  const handleEditArticle = (art: Article) => {
    setEditingId(art.id);
    setEditingDate(art.date);
    setTitle(art.title);
    setCategory(art.category);
    setReadTime(art.readTime);
    setExcerpt(art.excerpt);
    setCoverIcon(art.coverIcon || 'Shield');
    setCoverImage(art.coverImage || '');
    setCoverPosition(art.coverPosition || 'center 50%');
    setCoverHeight(art.coverHeight || 360);
    setCoverZoom(art.coverZoom || 100);
    setCoverFit(art.coverFit || 'auto');
    setSections(art.content || []);
    setShowForm(true);

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handlePublish = async (e: React.FormEvent) => {
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

    // Compress cover image if it's a large Base64
    let finalCoverImage = coverImage.trim();
    if (finalCoverImage.startsWith('data:image/')) {
      finalCoverImage = await compressBase64String(finalCoverImage, 1200, 1200, 0.75);
    }

    const newArticleData = {
      id: editingId || undefined,
      date: editingDate || undefined,
      slug,
      title,
      titleEn: title,
      excerpt,
      excerptEn: excerpt,
      category,
      categoryEn: category === 'بناء التشكيلة' ? 'Squad Building' : category === 'الانتقالات والتغييرات' ? 'Transfers' : category,
      categoryColor: '#10b981',
      author: 'مدير المنصة',
      authorRank: 'المركز ~9,000 عالمياً 24/25',
      authorRankEn: 'Top ~9,000 in 24/25',
      readTime,
      readTimeEn: readTime,
      coverIcon,
      coverImage: finalCoverImage || undefined,
      coverPosition: finalCoverImage ? coverPosition : undefined,
      coverHeight: finalCoverImage ? coverHeight : undefined,
      coverZoom: finalCoverImage ? coverZoom : undefined,
      coverFit: finalCoverImage ? coverFit : undefined,
      content: sections,
      contentEn: sections,
    };

    saveArticle(newArticleData);
    resetForm();
    setShowForm(false);
    onArticleAdded();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المقال؟')) {
      deleteArticle(id);
      if (editingId === id) {
        resetForm();
        setShowForm(false);
      }
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
            أضف وعدّل المقالات التحليليلة التي تظهر للمستخدمين بكل سهولة
          </p>
        </div>

        <button
          onClick={() => {
            if (showForm && editingId) {
              resetForm();
            }
            setShowForm(!showForm);
          }}
          className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
        >
          {editingId ? <Edit3 size={18} /> : <Plus size={18} />}
          <span>{showForm ? (editingId ? 'إلغاء التعديل' : 'إغلاق النموذج') : 'كتابة مقال جديد'}</span>
        </button>
      </div>

      {showForm && (
        <form
          ref={formRef}
          onSubmit={handlePublish}
          style={{
            background: '#f8fafc',
            border: '2px solid var(--fpl-purple)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '28px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--fpl-purple)' }}>
              {editingId ? '✏️ تعديل المقال المحدد' : '➕ نموذج إنشاء مقال تكتيكي جديد'}
            </h4>
            {editingId && (
              <span style={{ fontSize: '0.78rem', background: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: '20px', fontWeight: 800 }}>
                جاري التعديل على مقال حالي
              </span>
            )}
          </div>

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

            {/* Article Cover Image with Link or Direct File Upload */}
            <div style={{ gridColumn: '1 / -1', background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, marginBottom: '8px', color: 'var(--fpl-purple)' }}>
                🖼️ صورة الغلاف الخاصة بالمقال (رابط أونلاين أو رفع مباشر من الجهاز)
              </label>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                <input
                  type="text"
                  placeholder="أدخل رابط صورة أونلاين أو اختر ملفاً من الجهاز..."
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                />

                <input
                  type="file"
                  accept="image/*"
                  ref={coverFileInputRef}
                  onChange={handleCoverFileUpload}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => coverFileInputRef.current?.click()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'var(--fpl-purple)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 16px',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Upload size={16} />
                  <span>رفع صورة الغلاف</span>
                </button>
              </div>

              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                إذا تركت هذا الحقل فارغاً، سيتم عرض تصميم الأيقونة الملونة الافتراضي كغلاف للمقال.
              </span>

              {coverImage && (
                <div style={{ marginTop: '14px', background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  {/* COVER FIT MODE SELECTOR */}
                  <div style={{ marginBottom: '14px', background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--fpl-purple)', marginBottom: '8px' }}>
                      📐 نمط عرض الصورة في المقال:
                    </label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => setCoverFit('auto')}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '8px',
                          border: coverFit === 'auto' ? '2px solid var(--fpl-purple)' : '1px solid #cbd5e1',
                          background: coverFit === 'auto' ? 'var(--fpl-purple)' : '#ffffff',
                          color: coverFit === 'auto' ? '#ffffff' : 'var(--text-main)',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        📱 بوستر كامل بدون قص (Original Poster)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCoverFit('cover')}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '8px',
                          border: coverFit === 'cover' ? '2px solid var(--fpl-purple)' : '1px solid #cbd5e1',
                          background: coverFit === 'cover' ? 'var(--fpl-purple)' : '#ffffff',
                          color: coverFit === 'cover' ? '#ffffff' : 'var(--text-main)',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        🖼️ هيدر عريض مقتص (Landscape Banner)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCoverFit('contain')}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '8px',
                          border: coverFit === 'contain' ? '2px solid var(--fpl-purple)' : '1px solid #cbd5e1',
                          background: coverFit === 'contain' ? 'var(--fpl-purple)' : '#ffffff',
                          color: coverFit === 'contain' ? '#ffffff' : 'var(--text-main)',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        📦 إطار احتوايي (Contain)
                      </button>
                    </div>
                  </div>

                  {coverFit !== 'auto' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--fpl-purple)' }}>
                            📏 الارتفاع:
                          </label>
                          <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#10b981' }}>
                            {coverHeight}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min={240}
                          max={550}
                          step={10}
                          value={coverHeight}
                          onChange={(e) => setCoverHeight(parseInt(e.target.value, 10))}
                          style={{ width: '100%', cursor: 'pointer' }}
                        />
                        <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                          {[260, 360, 450].map((h) => (
                            <button
                              key={h}
                              type="button"
                              onClick={() => setCoverHeight(h)}
                              style={{
                                padding: '2px 6px',
                                borderRadius: '4px',
                                border: coverHeight === h ? '1px solid var(--fpl-purple)' : '1px solid #cbd5e1',
                                background: coverHeight === h ? 'var(--fpl-purple)' : '#fff',
                                color: coverHeight === h ? '#fff' : '#334155',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              {h}px
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--fpl-purple)' }}>
                            🎯 المحاذاة:
                          </label>
                          <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#10b981' }}>
                            {(() => {
                              if (coverPosition.includes('top') || coverPosition === 'center 0%') return '0%';
                              if (coverPosition.includes('bottom') || coverPosition === 'center 100%') return '100%';
                              const match = coverPosition.match(/(\d+)%/);
                              return match ? `${match[1]}%` : '50%';
                            })()}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={5}
                          value={(() => {
                            if (coverPosition.includes('top')) return 0;
                            if (coverPosition.includes('bottom')) return 100;
                            const match = coverPosition.match(/(\d+)%/);
                            return match ? parseInt(match[1], 10) : 50;
                          })()}
                          onChange={(e) => setCoverPosition(`center ${e.target.value}%`)}
                          style={{ width: '100%', cursor: 'pointer' }}
                        />
                        <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                          <button
                            type="button"
                            onClick={() => setCoverPosition('center 0%')}
                            style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              border: '1px solid #cbd5e1',
                              background: coverPosition.includes('0%') || coverPosition.includes('top') ? 'var(--fpl-purple)' : '#fff',
                              color: coverPosition.includes('0%') || coverPosition.includes('top') ? '#fff' : '#334155',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            أعلى
                          </button>
                          <button
                            type="button"
                            onClick={() => setCoverPosition('center 50%')}
                            style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              border: '1px solid #cbd5e1',
                              background: coverPosition.includes('50%') ? 'var(--fpl-purple)' : '#fff',
                              color: coverPosition.includes('50%') ? '#fff' : '#334155',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            وسط
                          </button>
                          <button
                            type="button"
                            onClick={() => setCoverPosition('center 100%')}
                            style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              border: '1px solid #cbd5e1',
                              background: coverPosition.includes('100%') || coverPosition.includes('bottom') ? 'var(--fpl-purple)' : '#fff',
                              color: coverPosition.includes('100%') || coverPosition.includes('bottom') ? '#fff' : '#334155',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            أسفل
                          </button>
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--fpl-purple)' }}>
                            🔍 الزوم (Zoom):
                          </label>
                          <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#10b981' }}>
                            {coverZoom}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={60}
                          max={250}
                          step={5}
                          value={coverZoom}
                          onChange={(e) => setCoverZoom(parseInt(e.target.value, 10))}
                          style={{ width: '100%', cursor: 'pointer' }}
                        />
                        <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                          {[100, 125, 150, 180, 220].map((z) => (
                            <button
                              key={z}
                              type="button"
                              onClick={() => setCoverZoom(z)}
                              style={{
                                padding: '2px 6px',
                                borderRadius: '4px',
                                border: coverZoom === z ? '1px solid var(--fpl-purple)' : '1px solid #cbd5e1',
                                background: coverZoom === z ? 'var(--fpl-purple)' : '#fff',
                                color: coverZoom === z ? '#fff' : '#334155',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              {z}%
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PREVIEW CONTAINER */}
                  <div
                    style={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                      height: coverFit === 'auto' ? 'auto' : `${Math.min(coverHeight, 260)}px`,
                      maxHeight: coverFit === 'auto' ? '380px' : undefined,
                      maxWidth: coverFit === 'auto' ? '340px' : '100%',
                      margin: coverFit === 'auto' ? '0 auto' : '0',
                      border: '1px solid var(--border-color)',
                      position: 'relative',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                      background: coverFit === 'contain' ? '#0d001f' : '#f8fafc',
                    }}
                  >
                    <img
                      src={coverImage}
                      alt="معاينة الغلاف"
                      style={{
                        width: '100%',
                        height: coverFit === 'auto' ? 'auto' : '100%',
                        display: 'block',
                        objectFit: coverFit === 'contain' ? 'contain' : coverFit === 'auto' ? 'contain' : 'cover',
                        objectPosition: coverPosition,
                        transform: `scale(${coverZoom / 100})`,
                        transformOrigin: coverPosition,
                        transition: 'transform 0.2s ease',
                      }}
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                    <div style={{ position: 'absolute', bottom: '8px', right: '8px', display: 'flex', gap: '6px' }}>
                      <span style={{ background: 'rgba(0,0,0,0.75)', color: '#fff', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                        {coverFit === 'auto' ? 'معاينة بوستر كامل بدون قص' : coverFit === 'contain' ? 'معاينة إطار احتوايي' : 'معاينة هيدر عريض'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCoverImage('')}
                        style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        إزالة الصورة
                      </button>
                    </div>
                  </div>
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

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn-primary" style={{ flex: 1, padding: '12px', fontSize: '1rem', fontWeight: 800 }}>
              {editingId ? 'حفظ التعديلات على المقال' : 'نشر المقال الآن'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="btn-secondary"
                style={{ padding: '12px 20px', fontSize: '0.9rem' }}
              >
                إلغاء
              </button>
            )}
          </div>
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
                border: editingId === art.id ? '2px solid var(--fpl-purple)' : '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '14px 18px',
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--fpl-purple)' }}>
                  {art.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <span>{'التصنيف: ' + art.category}</span>
                  <span>{'التاريخ: ' + art.date}</span>
                  <span>{art.readTime}</span>
                  {art.isCustom ? (
                    <span style={{ color: '#10b981', fontWeight: 800 }}>{' (تم إنشاؤه بواسطة الإدارة)'}</span>
                  ) : (
                    <span style={{ color: '#6366f1', fontWeight: 700 }}>{' (افتراضي)'}</span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => handleEditArticle(art)}
                  style={{
                    background: 'rgba(79, 70, 229, 0.1)',
                    color: 'var(--fpl-purple)',
                    border: '1px solid rgba(79, 70, 229, 0.3)',
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
                  <Edit3 size={14} />
                  <span>تعديل</span>
                </button>

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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
