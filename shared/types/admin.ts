// Admin interface types for better type safety
export interface BlogPostForm {
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  tags: string;
  published: boolean;
  featured: boolean;
  metaDescription?: string;
  slug: string;
}

export interface ProductForm {
  name: string;
  description: string;
  price: string;
  category: string;
  tags: string;
  imageUrl?: string;
  affiliateLink: string;
  rating?: string;
  isRecommended: boolean;
}

export interface AdminFilters {
  searchTerm: string;
  categoryFilter: string;
  statusFilter: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface BulkOperation {
  action: 'publish' | 'unpublish' | 'delete' | 'export';
  selectedIds: number[];
}

export interface ContentAnalytics {
  views: number;
  clicks: number;
  conversionRate: number;
  revenue: number;
  engagement: number;
}