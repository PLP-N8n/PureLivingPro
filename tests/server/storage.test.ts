import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DatabaseStorage } from '@server/storage';

// Mock the database
vi.mock('@server/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('DatabaseStorage', () => {
  let storage: DatabaseStorage;

  beforeEach(() => {
    storage = new DatabaseStorage();
    vi.clearAllMocks();
  });

  describe('User Operations', () => {
    it('should get user by id', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      // Mock the database response
      const mockDb = await import('@server/db');
      const selectMock = vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([mockUser]),
        }),
      });
      mockDb.db.select = selectMock;

      const result = await storage.getUser('123');
      
      expect(result).toEqual(mockUser);
      expect(selectMock).toHaveBeenCalled();
    });

    it('should return undefined for non-existent user', async () => {
      const mockDb = await import('@server/db');
      const selectMock = vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });
      mockDb.db.select = selectMock;

      const result = await storage.getUser('nonexistent');
      
      expect(result).toBeUndefined();
    });

    it('should upsert user correctly', async () => {
      const userData = {
        id: '123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      const mockDb = await import('@server/db');
      const insertMock = vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          onConflictDoUpdate: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([userData]),
          }),
        }),
      });
      mockDb.db.insert = insertMock;

      const result = await storage.upsertUser(userData);
      
      expect(result).toEqual(userData);
      expect(insertMock).toHaveBeenCalled();
    });
  });

  describe('Blog Operations', () => {
    it('should get blog posts with pagination', async () => {
      const mockPosts = [
        { id: 1, title: 'Post 1', content: 'Content 1' },
        { id: 2, title: 'Post 2', content: 'Content 2' },
      ];

      const mockDb = await import('@server/db');
      const selectMock = vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            offset: vi.fn().mockResolvedValue(mockPosts),
          }),
        }),
      });
      mockDb.db.select = selectMock;

      const result = await storage.getBlogPosts(10, 0);
      
      expect(result).toEqual(mockPosts);
    });

    it('should create blog post', async () => {
      const postData = {
        title: 'Test Post',
        content: 'Test Content',
        slug: 'test-post',
        authorId: '123',
      };

      const mockDb = await import('@server/db');
      const insertMock = vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ id: 1, ...postData }]),
        }),
      });
      mockDb.db.insert = insertMock;

      const result = await storage.createBlogPost(postData);
      
      expect(result).toEqual({ id: 1, ...postData });
      expect(insertMock).toHaveBeenCalled();
    });
  });

  describe('Product Operations', () => {
    it('should search products by query', async () => {
      const mockProducts = [
        { id: 1, name: 'Vitamin D', description: 'Essential vitamin' },
      ];

      const mockDb = await import('@server/db');
      const selectMock = vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(mockProducts),
        }),
      });
      mockDb.db.select = selectMock;

      const result = await storage.searchProducts('vitamin');
      
      expect(result).toEqual(mockProducts);
    });
  });
});