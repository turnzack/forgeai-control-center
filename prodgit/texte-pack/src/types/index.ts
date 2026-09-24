export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  status: "published" | "draft" | "archived";
  publishedAt: string;
  readTimeMinutes: number;
  metrics: { views: number; rating: number; commentsCount: number };
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}
