export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishedAt: string;
  tags: string[];
  category: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'devops' | 'general';
  readTime: number;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
}

export interface ArticleSummary {
  id: string;
  title: string;
  summary: string;
  author: string;
  publishedAt: string;
  tags: string[];
  category: Article['category'];
  readTime: number;
  slug: string;
  featured?: boolean;
}
