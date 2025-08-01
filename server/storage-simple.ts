/**
 * Simplified Storage Implementation
 * Resolves complex Drizzle ORM TypeScript compatibility issues
 * Uses basic queries with type assertions for enterprise-grade performance
 */

import { db } from "./db";
import { 
  users, 
  blogPosts, 
  products, 
  challenges, 
  userChallenges,
  dailyLogs,
  affiliateLinks,
  contentPipeline,
  socialAccounts,
  automationRules,
  wellnessPlans,
  wellnessAssessments,
  fitnessData,
  coachingSessions,
  aiCoachingSessions,
  autonomousConfig,
  performanceMetrics,
  systemLearning,
  automationSchedule,
  revenueTracking,
  affiliateProducts,
  wellnessQuizResponses,
  wellnessGoals
} from "@shared/schema";
import { eq, desc, asc, like, and, or, sql, count, ilike } from "drizzle-orm";

// Simple interface to avoid complex Drizzle types
interface ISimpleStorage {
  // User operations
  getUser(id: string): Promise<any>;
  upsertUser(user: any): Promise<any>;
  
  // Blog operations
  getBlogPosts(filters?: any): Promise<any[]>;
  getBlogPostsPaginated(page: number, pageSize: number, filters?: any): Promise<any>;
  createBlogPost(post: any): Promise<any>;
  updateBlogPost(id: number, updates: any): Promise<any>;
  deleteBlogPost(id: number): Promise<boolean>;
  getBlogPostStats(): Promise<any>;
  
  // Product operations
  getProducts(filters?: any): Promise<any[]>;
  getProductsPaginated(page: number, pageSize: number, filters?: any): Promise<any>;
  createProduct(product: any): Promise<any>;
  updateProduct(id: number, updates: any): Promise<any>;
  deleteProduct(id: number): Promise<boolean>;
  getProductStats(): Promise<any>;
  
  // Challenge operations
  getChallenges(): Promise<any[]>;
  createChallenge(challenge: any): Promise<any>;
  updateChallenge(id: number, updates: any): Promise<any>;
  deleteChallenge(id: number): Promise<boolean>;
  getChallengeStats(): Promise<any>;
  
  // Bulk operations
  bulkUpdateBlogPosts(action: string, ids: number[]): Promise<boolean>;
  bulkUpdateProducts(action: string, ids: number[]): Promise<boolean>;
}

export class SimpleStorage implements ISimpleStorage {
  // User operations
  async getUser(id: string): Promise<any> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: any): Promise<any> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Blog operations
  async getBlogPosts(filters?: any): Promise<any[]> {
    let query = db.select().from(blogPosts);
    
    if (filters?.category) {
      query = query.where(eq(blogPosts.category, filters.category)) as any;
    }
    if (filters?.isPublished !== undefined) {
      query = query.where(eq(blogPosts.isPublished, filters.isPublished)) as any;
    }
    
    return await query.orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPostsPaginated(page: number, pageSize: number, filters?: any): Promise<any> {
    const offset = (page - 1) * pageSize;
    let whereConditions: any[] = [];
    
    if (filters?.search) {
      whereConditions.push(
        or(
          ilike(blogPosts.title, `%${filters.search}%`),
          ilike(blogPosts.content, `%${filters.search}%`)
        )
      );
    }
    
    if (filters?.category && filters.category !== 'all') {
      whereConditions.push(eq(blogPosts.category, filters.category));
    }
    
    if (filters?.isPublished !== undefined) {
      whereConditions.push(eq(blogPosts.isPublished, filters.isPublished));
    }
    
    if (filters?.isPremium !== undefined) {
      whereConditions.push(eq(blogPosts.isPremium, filters.isPremium));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;
    
    // Get data
    let dataQuery = db.select().from(blogPosts);
    if (whereClause) {
      dataQuery = dataQuery.where(whereClause) as any;
    }
    const data = await dataQuery
      .orderBy(desc(blogPosts.createdAt))
      .limit(pageSize)
      .offset(offset);

    // Get total count
    let countQuery = db.select({ count: count() }).from(blogPosts);
    if (whereClause) {
      countQuery = countQuery.where(whereClause) as any;
    }
    const [{ count: total }] = await countQuery;

    return {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  async createBlogPost(post: any): Promise<any> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }

  async updateBlogPost(id: number, updates: any): Promise<any> {
    const [updated] = await db
      .update(blogPosts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return updated;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return result.rowCount > 0;
  }

  async getBlogPostStats(): Promise<any> {
    const [stats] = await db
      .select({
        total: count(),
        published: sql<number>`count(*) filter (where ${blogPosts.isPublished} = true)`,
        premium: sql<number>`count(*) filter (where ${blogPosts.isPremium} = true)`,
      })
      .from(blogPosts);
    
    return {
      totalPosts: stats.total,
      publishedPosts: stats.published,
      premiumPosts: stats.premium,
      draftPosts: stats.total - stats.published
    };
  }

  // Product operations
  async getProducts(filters?: any): Promise<any[]> {
    let query = db.select().from(products);
    
    if (filters?.category) {
      query = query.where(eq(products.category, filters.category)) as any;
    }
    
    return await query.orderBy(desc(products.createdAt));
  }

  async getProductsPaginated(page: number, pageSize: number, filters?: any): Promise<any> {
    const offset = (page - 1) * pageSize;
    let whereConditions: any[] = [];
    
    if (filters?.search) {
      whereConditions.push(
        or(
          ilike(products.name, `%${filters.search}%`),
          ilike(products.description, `%${filters.search}%`)
        )
      );
    }
    
    if (filters?.category && filters.category !== 'all') {
      whereConditions.push(eq(products.category, filters.category));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;
    
    // Get data
    let dataQuery = db.select().from(products);
    if (whereClause) {
      dataQuery = dataQuery.where(whereClause) as any;
    }
    const data = await dataQuery
      .orderBy(desc(products.createdAt))
      .limit(pageSize)
      .offset(offset);

    // Get total count
    let countQuery = db.select({ count: count() }).from(products);
    if (whereClause) {
      countQuery = countQuery.where(whereClause) as any;
    }
    const [{ count: total }] = await countQuery;

    return {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  async createProduct(product: any): Promise<any> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, updates: any): Promise<any> {
    const [updated] = await db
      .update(products)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updated;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount > 0;
  }

  async getProductStats(): Promise<any> {
    const [stats] = await db
      .select({
        total: count(),
        recommended: sql<number>`count(*) filter (where ${products.isRecommended} = true)`,
      })
      .from(products);
    
    return {
      totalProducts: stats.total,
      recommendedProducts: stats.recommended,
    };
  }

  // Challenge operations
  async getChallenges(): Promise<any[]> {
    return await db.select().from(challenges).orderBy(desc(challenges.createdAt));
  }

  async createChallenge(challenge: any): Promise<any> {
    const [newChallenge] = await db.insert(challenges).values(challenge).returning();
    return newChallenge;
  }

  async updateChallenge(id: number, updates: any): Promise<any> {
    const [updated] = await db
      .update(challenges)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(challenges.id, id))
      .returning();
    return updated;
  }

  async deleteChallenge(id: number): Promise<boolean> {
    const result = await db.delete(challenges).where(eq(challenges.id, id));
    return result.rowCount > 0;
  }

  async getChallengeStats(): Promise<any> {
    const [stats] = await db
      .select({
        total: count(),
        active: sql<number>`count(*) filter (where ${challenges.isActive} = true)`,
      })
      .from(challenges);
    
    return {
      totalChallenges: stats.total,
      activeChallenges: stats.active,
    };
  }

  // Bulk operations
  async bulkUpdateBlogPosts(action: string, ids: number[]): Promise<boolean> {
    try {
      switch (action) {
        case 'publish':
          await db.update(blogPosts)
            .set({ isPublished: true, updatedAt: new Date() })
            .where(sql`${blogPosts.id} = ANY(${ids})`);
          break;
        case 'unpublish':
          await db.update(blogPosts)
            .set({ isPublished: false, updatedAt: new Date() })
            .where(sql`${blogPosts.id} = ANY(${ids})`);
          break;
        case 'delete':
          await db.delete(blogPosts).where(sql`${blogPosts.id} = ANY(${ids})`);
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }
      return true;
    } catch (error) {
      console.error('Bulk blog posts update failed:', error);
      return false;
    }
  }

  async bulkUpdateProducts(action: string, ids: number[]): Promise<boolean> {
    try {
      switch (action) {
        case 'recommend':
          await db.update(products)
            .set({ isRecommended: true, updatedAt: new Date() })
            .where(sql`${products.id} = ANY(${ids})`);
          break;
        case 'unrecommend':
          await db.update(products)
            .set({ isRecommended: false, updatedAt: new Date() })
            .where(sql`${products.id} = ANY(${ids})`);
          break;
        case 'delete':
          await db.delete(products).where(sql`${products.id} = ANY(${ids})`);
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }
      return true;
    } catch (error) {
      console.error('Bulk products update failed:', error);
      return false;
    }
  }
}

// Export storage instance
export const storage = new SimpleStorage();