import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { registerRoutes } from '@server/routes';

// Mock the storage
vi.mock('@server/storage', () => ({
  storage: {
    getBlogPosts: vi.fn().mockResolvedValue([
      {
        id: 1,
        title: 'Test Post',
        slug: 'test-post',
        content: 'Test content',
        isPublished: true,
        createdAt: new Date(),
      },
    ]),
    getBlogPost: vi.fn().mockImplementation((slug) => {
      if (slug === 'test-post') {
        return Promise.resolve({
          id: 1,
          title: 'Test Post',
          slug: 'test-post',
          content: 'Test content',
          isPublished: true,
        });
      }
      return Promise.resolve(undefined);
    }),
    createBlogPost: vi.fn().mockResolvedValue({
      id: 2,
      title: 'New Post',
      slug: 'new-post',
      content: 'New content',
    }),
  },
}));

describe('Blog API', () => {
  let app: express.Application;
  let server: any;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    server = await registerRoutes(app);
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
  });

  describe('GET /api/blog-posts', () => {
    it('should return blog posts', async () => {
      const response = await request(app)
        .get('/api/blog-posts')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('slug');
    });

    it('should handle pagination parameters', async () => {
      await request(app)
        .get('/api/blog-posts?limit=5&offset=10')
        .expect(200);
    });

    it('should handle category filter', async () => {
      await request(app)
        .get('/api/blog-posts?category=fitness')
        .expect(200);
    });
  });

  describe('GET /api/blog-posts/:slug', () => {
    it('should return specific blog post', async () => {
      const response = await request(app)
        .get('/api/blog-posts/test-post')
        .expect(200);

      expect(response.body).toHaveProperty('title', 'Test Post');
      expect(response.body).toHaveProperty('slug', 'test-post');
    });

    it('should return 404 for non-existent post', async () => {
      const response = await request(app)
        .get('/api/blog-posts/non-existent')
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Blog post not found');
    });
  });
});