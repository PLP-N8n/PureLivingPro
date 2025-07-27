import { z } from 'zod';

// Blog post validation schema
export const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(100, 'Content must be at least 100 characters'),
  excerpt: z.string().max(300, 'Excerpt too long').optional(),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().optional(),
  published: z.boolean(),
  featured: z.boolean(),
  metaDescription: z.string().max(160, 'Meta description too long').optional(),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
});

// Product validation schema
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(100, 'Name too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Price must be a valid positive number'),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().optional(),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  affiliateLink: z.string().url('Invalid affiliate link'),
  rating: z.string().refine(val => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 5), 'Rating must be between 0 and 5').optional(),
  isRecommended: z.boolean()
});

export type BlogPostFormData = z.infer<typeof blogPostSchema>;
export type ProductFormData = z.infer<typeof productSchema>;