export type User = {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  isPremium?: boolean;
  wellnessGoals?: any[];
  wellnessProfile?: any;
};

export type BlogPost = {
  id?: number;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  tags?: string[];
  isPremium?: boolean;
  isPublished?: boolean;
  readTime?: number;
  authorId?: string;
  createdAt?: string | Date;
};

export type Product = {
  id?: number;
  name?: string;
  description?: string;
  price?: string | number;
  category?: string;
  affiliateUrl?: string;
};

export type Challenge = {
  id?: number;
  name?: string;
  description?: string;
  isCompleted?: boolean;
  challengeId?: number;
};

export type DailyLog = {
  mood?: number;
  energy?: number;
  sleep?: number;
  exercise?: boolean;
  meditation?: boolean;
  notes?: string;
};
