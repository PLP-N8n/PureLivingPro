import {
  users,
  blogPosts,
  products,
  challenges,
  userChallenges,
  dailyLogs,
  wellnessPlans,
  wellnessAssessments,
  coachingSessions,
  wellnessGoals,
  fitnessData,
  type User,
  type UpsertUser,
  type BlogPost,
  type Product,
  type Challenge,
  type UserChallenge,
  type DailyLog,
  type WellnessPlan,
  type WellnessAssessment,
  type CoachingSession,
  type WellnessGoal,
  type FitnessData,
  type InsertBlogPost,
  type InsertProduct,
  type InsertChallenge,
  type InsertUserChallenge,
  type InsertDailyLog,
  type InsertWellnessPlan,
  type InsertWellnessAssessment,
  type InsertCoachingSession,
  type InsertWellnessGoal,
  type InsertFitnessData
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserPremiumStatus(userId: string, isPremium: boolean): Promise<void>;
  updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<void>;
  
  // Blog operations
  getBlogPosts(limit?: number, offset?: number, category?: string): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;
  
  // Product operations
  getProducts(limit?: number, offset?: number, category?: string): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  searchProducts(query: string): Promise<Product[]>;
  
  // Optimized paginated operations
  getBlogPostsPaginated(offset: number, limit: number, filters?: any): Promise<BlogPost[]>;
  getBlogPostsCount(filters?: any): Promise<number>;
  getProductsPaginated(offset: number, limit: number, filters?: any): Promise<Product[]>;
  getProductsCount(filters?: any): Promise<number>;
  
  // Challenge operations
  getChallenges(limit?: number, offset?: number): Promise<Challenge[]>;
  getChallenge(id: number): Promise<Challenge | undefined>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  updateChallenge(id: number, challenge: Partial<InsertChallenge>): Promise<Challenge>;
  deleteChallenge(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
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

  async updateUserPremiumStatus(userId: string, isPremium: boolean): Promise<void> {
    await db
      .update(users)
      .set({ isPremium, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        stripeCustomerId, 
        stripeSubscriptionId, 
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId));
  }

  // Blog operations
  async getBlogPosts(limit = 10, offset = 0, category?: string): Promise<BlogPost[]> {
    let query = db.select().from(blogPosts);
    
    if (category) {
      query = query.where(eq(blogPosts.category, category));
    }
    
    return await query
      .orderBy(desc(blogPosts.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost> {
    const [updatedPost] = await db
      .update(blogPosts)
      .set({ ...post, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  // Product operations
  async getProducts(limit = 10, offset = 0, category?: string): Promise<Product[]> {
    let query = db.select().from(products);
    
    if (category) {
      query = query.where(eq(products.category, category));
    }
    
    return await query
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product> {
    const [updatedProduct] = await db
      .update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async searchProducts(query: string): Promise<Product[]> {
    // Simplified search - just return all products for now
    return await db.select().from(products).limit(20);
  }

  // Optimized paginated operations
  async getBlogPostsPaginated(offset: number, limit: number, filters: any = {}): Promise<BlogPost[]> {
    return await db.select().from(blogPosts)
      .orderBy(desc(blogPosts.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getBlogPostsCount(filters: any = {}): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(blogPosts);
    return result[0]?.count || 0;
  }

  async getProductsPaginated(offset: number, limit: number, filters: any = {}): Promise<Product[]> {
    return await db.select().from(products)
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getProductsCount(filters: any = {}): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(products);
    return result[0]?.count || 0;
  }

  // Challenge operations
  async getChallenges(limit = 10, offset = 0): Promise<Challenge[]> {
    return await db.select().from(challenges)
      .orderBy(desc(challenges.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getChallenge(id: number): Promise<Challenge | undefined> {
    const [challenge] = await db.select().from(challenges).where(eq(challenges.id, id));
    return challenge;
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const [newChallenge] = await db.insert(challenges).values(challenge).returning();
    return newChallenge;
  }

  async updateChallenge(id: number, challenge: Partial<InsertChallenge>): Promise<Challenge> {
    const [updatedChallenge] = await db
      .update(challenges)
      .set({ ...challenge, updatedAt: new Date() })
      .where(eq(challenges.id, id))
      .returning();
    return updatedChallenge;
  }

  async deleteChallenge(id: number): Promise<void> {
    await db.delete(challenges).where(eq(challenges.id, id));
  }
}

export const storage = new DatabaseStorage();