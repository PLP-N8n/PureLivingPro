import {
  users,
  blogPosts,
  products,
  challenges,
  userChallenges,
  dailyLogs,
  type User,
  type UpsertUser,
  type BlogPost,
  type Product,
  type Challenge,
  type UserChallenge,
  type DailyLog,
  type InsertBlogPost,
  type InsertProduct,
  type InsertChallenge,
  type InsertUserChallenge,
  type InsertDailyLog,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, ilike, or } from "drizzle-orm";

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
  
  // Challenge operations
  getChallenges(limit?: number, offset?: number): Promise<Challenge[]>;
  getChallenge(id: number): Promise<Challenge | undefined>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  updateChallenge(id: number, challenge: Partial<InsertChallenge>): Promise<Challenge>;
  deleteChallenge(id: number): Promise<void>;
  
  // User challenge operations
  getUserChallenges(userId: string): Promise<UserChallenge[]>;
  getUserChallenge(userId: string, challengeId: number): Promise<UserChallenge | undefined>;
  createUserChallenge(userChallenge: InsertUserChallenge): Promise<UserChallenge>;
  updateUserChallenge(id: number, userChallenge: Partial<InsertUserChallenge>): Promise<UserChallenge>;
  
  // Daily log operations
  getDailyLogs(userId: string, startDate?: Date, endDate?: Date): Promise<DailyLog[]>;
  getDailyLog(userId: string, date: Date): Promise<DailyLog | undefined>;
  createDailyLog(dailyLog: InsertDailyLog): Promise<DailyLog>;
  updateDailyLog(id: number, dailyLog: Partial<InsertDailyLog>): Promise<DailyLog>;
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
      .set({ stripeCustomerId, stripeSubscriptionId, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  // Blog operations
  async getBlogPosts(limit = 10, offset = 0, category?: string): Promise<BlogPost[]> {
    const whereCondition = category ? eq(blogPosts.category, category) : undefined;
    
    return await db
      .select()
      .from(blogPosts)
      .where(whereCondition)
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
    const [newPost] = await db
      .insert(blogPosts)
      .values(post)
      .returning();
    return newPost;
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost> {
    const [updatedPost] = await db
      .update(blogPosts)
      .set({ 
        ...post,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  // Product operations
  async getProducts(limit = 10, offset = 0, category?: string): Promise<Product[]> {
    const whereCondition = category ? eq(products.category, category) : undefined;
    
    return await db
      .select()
      .from(products)
      .where(whereCondition)
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product> {
    const [updatedProduct] = await db
      .update(products)
      .set({ 
        ...product,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async searchProducts(query: string): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(
        or(
          ilike(products.name, `%${query}%`),
          ilike(products.description, `%${query}%`)
        )
      )
      .orderBy(desc(products.createdAt));
  }

  // Challenge operations
  async getChallenges(limit = 10, offset = 0): Promise<Challenge[]> {
    return await db
      .select()
      .from(challenges)
      .where(eq(challenges.isActive, true))
      .orderBy(desc(challenges.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getChallenge(id: number): Promise<Challenge | undefined> {
    const [challenge] = await db.select().from(challenges).where(eq(challenges.id, id));
    return challenge;
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const [newChallenge] = await db
      .insert(challenges)
      .values(challenge)
      .returning();
    return newChallenge;
  }

  async updateChallenge(id: number, challenge: Partial<InsertChallenge>): Promise<Challenge> {
    const [updatedChallenge] = await db
      .update(challenges)
      .set({ 
        ...challenge,
        updatedAt: new Date(),
      })
      .where(eq(challenges.id, id))
      .returning();
    return updatedChallenge;
  }

  async deleteChallenge(id: number): Promise<void> {
    await db.delete(challenges).where(eq(challenges.id, id));
  }

  // User challenge operations
  async getUserChallenges(userId: string): Promise<UserChallenge[]> {
    return await db
      .select()
      .from(userChallenges)
      .where(eq(userChallenges.userId, userId))
      .orderBy(desc(userChallenges.createdAt));
  }

  async getUserChallenge(userId: string, challengeId: number): Promise<UserChallenge | undefined> {
    const [userChallenge] = await db
      .select()
      .from(userChallenges)
      .where(
        and(
          eq(userChallenges.userId, userId),
          eq(userChallenges.challengeId, challengeId)
        )
      );
    return userChallenge;
  }

  async createUserChallenge(userChallenge: InsertUserChallenge): Promise<UserChallenge> {
    const [newUserChallenge] = await db
      .insert(userChallenges)
      .values(userChallenge)
      .returning();
    return newUserChallenge;
  }

  async updateUserChallenge(id: number, userChallenge: Partial<InsertUserChallenge>): Promise<UserChallenge> {
    const [updatedUserChallenge] = await db
      .update(userChallenges)
      .set({ 
        ...userChallenge,
        updatedAt: new Date(),
      })
      .where(eq(userChallenges.id, id))
      .returning();
    return updatedUserChallenge;
  }

  // Daily log operations
  async getDailyLogs(userId: string, startDate?: Date, endDate?: Date): Promise<DailyLog[]> {
    const whereCondition = startDate && endDate
      ? and(
          eq(dailyLogs.userId, userId),
          gte(dailyLogs.date, startDate),
          lte(dailyLogs.date, endDate)
        )
      : eq(dailyLogs.userId, userId);

    return await db
      .select()
      .from(dailyLogs)
      .where(whereCondition)
      .orderBy(desc(dailyLogs.date));
  }

  async getDailyLog(userId: string, date: Date): Promise<DailyLog | undefined> {
    const [log] = await db
      .select()
      .from(dailyLogs)
      .where(
        and(
          eq(dailyLogs.userId, userId),
          eq(dailyLogs.date, date)
        )
      );
    return log;
  }

  async createDailyLog(dailyLog: InsertDailyLog): Promise<DailyLog> {
    const [newLog] = await db
      .insert(dailyLogs)
      .values(dailyLog)
      .returning();
    return newLog;
  }

  async updateDailyLog(id: number, dailyLog: Partial<InsertDailyLog>): Promise<DailyLog> {
    const [updatedLog] = await db
      .update(dailyLogs)
      .set(dailyLog)
      .where(eq(dailyLogs.id, id))
      .returning();
    return updatedLog;
  }
}

export const storage = new DatabaseStorage();