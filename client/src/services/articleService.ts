import { Article, defaultArticles } from '../data/articles';

const STORAGE_KEY = 'fpl_custom_articles_v1';

export const getArticles = (): Article[] => {
  try {
    const customJson = localStorage.getItem(STORAGE_KEY);
    const customArticles: Article[] = customJson ? JSON.parse(customJson) : [];
    // Combine custom articles (newest first) with default articles
    return [...customArticles, ...defaultArticles];
  } catch (err) {
    console.error('Error reading custom articles from localStorage', err);
    return defaultArticles;
  }
};

export const getArticleBySlug = (slug: string): Article | undefined => {
  const allArticles = getArticles();
  return allArticles.find((a) => a.slug === slug);
};

export const saveArticle = (newArticle: Omit<Article, 'id' | 'date'> & { id?: string }): Article => {
  const customJson = localStorage.getItem(STORAGE_KEY);
  const customArticles: Article[] = customJson ? JSON.parse(customJson) : [];

  const articleToSave: Article = {
    ...newArticle,
    id: newArticle.id || `custom-article-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    isCustom: true,
  };

  // If existing, update, else prepend
  const index = customArticles.findIndex((a) => a.id === articleToSave.id);
  if (index >= 0) {
    customArticles[index] = articleToSave;
  } else {
    customArticles.unshift(articleToSave);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(customArticles));
  return articleToSave;
};

export const deleteArticle = (id: string): void => {
  const customJson = localStorage.getItem(STORAGE_KEY);
  if (!customJson) return;

  const customArticles: Article[] = JSON.parse(customJson);
  const filtered = customArticles.filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};
