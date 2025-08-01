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
  type InsertFitnessData,
  wellnessQuizResponses,
  type WellnessQuizResponse,
  type InsertWellnessQuizResponse,
  aiCoachingSessions,
  type AiCoachingSession,
  type InsertAiCoachingSession,
  affiliateProducts,
  type AffiliateProduct,
  type InsertAffiliateProduct,
  affiliateLinks,
  type AffiliateLink,
  type InsertAffiliateLink,
  contentPipeline,
  type ContentPipeline,
  type InsertContentPipeline,
  socialAccounts,
  type SocialAccount,
  type InsertSocialAccount,
  automationRules,
  type AutomationRule,
  type InsertAutomationRule,
  revenueTracking,
  type RevenueTracking,
  type InsertRevenueTracking
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, ilike, or, sum, avg, like, sql } from "drizzle-orm";

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
  
  // Wellness coaching operations
  getWellnessPlans(userId: string): Promise<WellnessPlan[]>;
  getWellnessPlan(id: number): Promise<WellnessPlan | undefined>;
  createWellnessPlan(plan: InsertWellnessPlan): Promise<WellnessPlan>;
  updateWellnessPlan(id: number, plan: Partial<InsertWellnessPlan>): Promise<WellnessPlan>;
  deleteWellnessPlan(id: number): Promise<void>;
  
  // Wellness assessments
  getWellnessAssessments(userId: string, planId?: number): Promise<WellnessAssessment[]>;
  getWellnessAssessment(id: number): Promise<WellnessAssessment | undefined>;
  createWellnessAssessment(assessment: InsertWellnessAssessment): Promise<WellnessAssessment>;
  
  // Coaching sessions
  getCoachingSessions(userId: string, planId?: number): Promise<CoachingSession[]>;
  getCoachingSession(id: number): Promise<CoachingSession | undefined>;
  createCoachingSession(session: InsertCoachingSession): Promise<CoachingSession>;
  updateCoachingSession(id: number, session: Partial<InsertCoachingSession>): Promise<CoachingSession>;
  
  // Wellness goals
  getWellnessGoals(userId: string, planId?: number): Promise<WellnessGoal[]>;
  getWellnessGoal(id: number): Promise<WellnessGoal | undefined>;
  createWellnessGoal(goal: InsertWellnessGoal): Promise<WellnessGoal>;
  updateWellnessGoal(id: number, goal: Partial<InsertWellnessGoal>): Promise<WellnessGoal>;
  deleteWellnessGoal(id: number): Promise<void>;
  
  // Fitness data from wearable devices
  getFitnessData(userId: string, dataType?: string, startDate?: Date, endDate?: Date): Promise<FitnessData[]>;
  createFitnessData(data: InsertFitnessData): Promise<FitnessData>;
  bulkCreateFitnessData(data: InsertFitnessData[]): Promise<FitnessData[]>;
  updateUserDeviceTokens(userId: string, deviceType: string, tokens: { accessToken?: string; refreshToken?: string; userId?: string }): Promise<void>;
  
  // Wellness quiz operations
  createWellnessQuizResponse(response: InsertWellnessQuizResponse): Promise<WellnessQuizResponse>;
  updateUserWellnessProfile(userId: string, profile: {
    wellnessGoals: string[];
    fitnessLevel: string;
    preferredExercises: string[];
    stressLevel: number;
    sleepQuality: string;
    nutritionHabits: string;
    timeAvailability: string;
    onboardingCompleted: boolean;
  }): Promise<void>;
  
  // AI coaching operations
  createAiCoachingSession(session: InsertAiCoachingSession): Promise<AiCoachingSession>;
  getAiCoachingSessions(userId: string): Promise<AiCoachingSession[]>;
  updateAiCoachingSession(sessionId: number, updates: Partial<InsertAiCoachingSession>): Promise<AiCoachingSession>;
  
  // Affiliate products operations
  getAffiliateProducts(filters: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<AffiliateProduct[]>;
  createAffiliateProduct(product: InsertAffiliateProduct): Promise<AffiliateProduct>;
  updateAffiliateProduct(id: number, updates: Partial<InsertAffiliateProduct>): Promise<AffiliateProduct>;
  
  // Automation system operations
  getAffiliateLinks(filters: {
    category?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<AffiliateLink[]>;
  createAffiliateLink(link: InsertAffiliateLink): Promise<AffiliateLink>;
  updateAffiliateLink(id: number, updates: Partial<InsertAffiliateLink>): Promise<AffiliateLink>;
  
  getContentPipeline(filters: {
    status?: string;
    contentType?: string;
    targetPlatform?: string;
    dueBefore?: Date;
    limit?: number;
  }): Promise<ContentPipeline[]>;
  createContentPipeline(pipeline: InsertContentPipeline): Promise<ContentPipeline>;
  updateContentPipeline(id: number, updates: Partial<InsertContentPipeline>): Promise<ContentPipeline>;
  
  getSocialAccounts(filters: {
    platform?: string;
    isActive?: boolean;
  }): Promise<SocialAccount[]>;
  createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount>;
  updateSocialAccount(id: number, updates: Partial<InsertSocialAccount>): Promise<SocialAccount>;
  
  getAutomationRules(filters: {
    type?: string;
    isActive?: boolean;
    limit?: number;
  }): Promise<AutomationRule[]>;
  createAutomationRule(rule: InsertAutomationRule): Promise<AutomationRule>;
  updateAutomationRule(id: number, updates: Partial<InsertAutomationRule>): Promise<AutomationRule>;
  
  createRevenueTracking(revenue: InsertRevenueTracking): Promise<RevenueTracking>;
  getRevenueStats(): Promise<any>;
  getContentEngagementStats(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  
  // Optimized stats methods for admin dashboard
  async getBlogPostStats() {
    const [totalResult, publishedResult, premiumResult] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(blogPosts),
      db.select({ count: sql<number>`count(*)` }).from(blogPosts).where(eq(blogPosts.isPublished, true)),
      db.select({ count: sql<number>`count(*)` }).from(blogPosts).where(eq(blogPosts.isPremium, true))
    ]);
    
    const total = totalResult[0]?.count || 0;
    const published = publishedResult[0]?.count || 0;
    const premium = premiumResult[0]?.count || 0;
    
    return {
      total,
      published,
      drafts: total - published,
      premium
    };
  }

  async getProductStats() {
    const [totalResult, recommendedResult] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(products),
      db.select({ count: sql<number>`count(*)` }).from(products).where(eq(products.isRecommended, true))
    ]);
    
    return {
      total: totalResult[0]?.count || 0,
      recommended: recommendedResult[0]?.count || 0
    };
  }

  async getChallengeStats() {
    const [totalResult, activeResult] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(challenges),
      db.select({ count: sql<number>`count(*)` }).from(challenges).where(eq(challenges.isActive, true))
    ]);
    
    return {
      total: totalResult[0]?.count || 0,
      active: activeResult[0]?.count || 0
    };
  }

  // Optimized paginated blog posts
  async getBlogPostsPaginated(offset: number, limit: number, filters: any = {}) {
    let query = db.select().from(blogPosts);
    
    if (filters.search) {
      query = query.where(
        or(
          like(blogPosts.title, `%${filters.search}%`),
          like(blogPosts.content, `%${filters.search}%`),
          like(blogPosts.excerpt, `%${filters.search}%`)
        )
      );
    }
    
    if (filters.category) {
      query = query.where(eq(blogPosts.category, filters.category));
    }
    
    if (typeof filters.isPublished === 'boolean') {
      query = query.where(eq(blogPosts.isPublished, filters.isPublished));
    }
    
    if (typeof filters.isPremium === 'boolean') {
      query = query.where(eq(blogPosts.isPremium, filters.isPremium));
    }
    
    const posts = await query
      .orderBy(desc(blogPosts.createdAt))
      .limit(limit)
      .offset(offset);
      
    return posts;
  }

  async getBlogPostsCount(filters: any = {}) {
    let query = db.select({ count: sql<number>`count(*)` }).from(blogPosts);
    
    if (filters.search) {
      query = query.where(
        or(
          like(blogPosts.title, `%${filters.search}%`),
          like(blogPosts.content, `%${filters.search}%`),
          like(blogPosts.excerpt, `%${filters.search}%`)
        )
      );
    }
    
    if (filters.category) {
      query = query.where(eq(blogPosts.category, filters.category));
    }
    
    if (typeof filters.isPublished === 'boolean') {
      query = query.where(eq(blogPosts.isPublished, filters.isPublished));
    }
    
    if (typeof filters.isPremium === 'boolean') {
      query = query.where(eq(blogPosts.isPremium, filters.isPremium));
    }
    
    const result = await query;
    return result[0]?.count || 0;
  }

  // Optimized paginated products
  async getProductsPaginated(offset: number, limit: number, filters: any = {}): Promise<Product[]> {
    let query = db.select().from(products);
    
    if (filters.search) {
      query = query.where(
        or(
          like(products.name, `%${filters.search}%`),
          like(products.description, `%${filters.search}%`)
        )
      ) as any;
    }
    
    if (filters.category) {
      query = query.where(eq(products.category, filters.category)) as any;
    }
    
    const productList = await query
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);
      
    return productList;
  }

  async getProductsCount(filters: any = {}): Promise<number> {
    let query = db.select({ count: sql<number>`count(*)` }).from(products);
    
    if (filters.search) {
      query = query.where(
        or(
          like(products.name, `%${filters.search}%`),
          like(products.description, `%${filters.search}%`)
        )
      ) as any;
    }
    
    if (filters.category) {
      query = query.where(eq(products.category, filters.category)) as any;
    }
    
    const result = await query;
    return result[0]?.count || 0;
  }

  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const cleanUserData = {
      ...userData,
      wellnessProfile: userData.wellnessProfile ? {
        goals: Array.from(userData.wellnessProfile.goals || []) as string[],
        experienceLevel: userData.wellnessProfile.experienceLevel || '',
        lifestyle: userData.wellnessProfile.lifestyle || '',
        preferences: Array.from(userData.wellnessProfile.preferences || []) as string[]
      } : null
    };
    
    const [user] = await db
      .insert(users)
      .values(cleanUserData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...cleanUserData,
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
    const cleanPost = {
      ...post,
      tags: post.tags ? Array.from(post.tags) as string[] : null
    };
    
    const [newPost] = await db
      .insert(blogPosts)
      .values(cleanPost)
      .returning();
    return newPost;
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost> {
    const cleanPost = {
      ...post,
      tags: post.tags ? Array.from(post.tags) as string[] : undefined,
      updatedAt: new Date(),
    };
    
    const [updatedPost] = await db
      .update(blogPosts)
      .set(cleanPost)
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
    const cleanProduct = {
      ...product,
      tags: product.tags ? Array.from(product.tags) as string[] : null
    };
    
    const [newProduct] = await db
      .insert(products)
      .values(cleanProduct)
      .returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product> {
    const cleanProduct = {
      ...product,
      tags: product.tags ? Array.from(product.tags) as string[] : undefined,
      updatedAt: new Date(),
    };
    
    const [updatedProduct] = await db
      .update(products)
      .set(cleanProduct)
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
    const cleanChallenge = {
      ...challenge,
      goals: challenge.goals ? Array.from(challenge.goals) as string[] : null
    };
    
    const [newChallenge] = await db
      .insert(challenges)
      .values(cleanChallenge)
      .returning();
    return newChallenge;
  }

  async updateChallenge(id: number, challenge: Partial<InsertChallenge>): Promise<Challenge> {
    const cleanChallenge = {
      ...challenge,
      goals: challenge.goals ? Array.from(challenge.goals) as string[] : undefined,
      updatedAt: new Date(),
    };
    
    const [updatedChallenge] = await db
      .update(challenges)
      .set(cleanChallenge)
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
    const cleanUserChallenge = {
      ...userChallenge,
      progress: userChallenge.progress ? {
        completedDays: Array.from(userChallenge.progress.completedDays || []) as number[],
        notes: Array.from(userChallenge.progress.notes || []) as string[]
      } : null
    };
    
    const [newUserChallenge] = await db
      .insert(userChallenges)
      .values(cleanUserChallenge)
      .returning();
    return newUserChallenge;
  }

  async updateUserChallenge(id: number, userChallenge: Partial<InsertUserChallenge>): Promise<UserChallenge> {
    const cleanUserChallenge = {
      ...userChallenge,
      progress: userChallenge.progress ? {
        completedDays: Array.from(userChallenge.progress.completedDays || []) as number[],
        notes: Array.from(userChallenge.progress.notes || []) as string[]
      } : undefined,
      updatedAt: new Date(),
    };
    
    const [updatedUserChallenge] = await db
      .update(userChallenges)
      .set(cleanUserChallenge)
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

  // Wellness coaching operations
  async getWellnessPlans(userId: string): Promise<WellnessPlan[]> {
    return await db
      .select()
      .from(wellnessPlans)
      .where(eq(wellnessPlans.userId, userId))
      .orderBy(desc(wellnessPlans.createdAt));
  }

  async getWellnessPlan(id: number): Promise<WellnessPlan | undefined> {
    const [plan] = await db
      .select()
      .from(wellnessPlans)
      .where(eq(wellnessPlans.id, id));
    return plan;
  }

  async createWellnessPlan(plan: InsertWellnessPlan): Promise<WellnessPlan> {
    const [newPlan] = await db
      .insert(wellnessPlans)
      .values(plan)
      .returning();
    return newPlan;
  }

  async updateWellnessPlan(id: number, plan: Partial<InsertWellnessPlan>): Promise<WellnessPlan> {
    const updateData: any = { ...plan, updatedAt: new Date() };
    const [updatedPlan] = await db
      .update(wellnessPlans)
      .set(updateData)
      .where(eq(wellnessPlans.id, id))
      .returning();
    return updatedPlan;
  }

  async deleteWellnessPlan(id: number): Promise<void> {
    await db.delete(wellnessPlans).where(eq(wellnessPlans.id, id));
  }

  // Wellness assessments
  async getWellnessAssessments(userId: string, planId?: number): Promise<WellnessAssessment[]> {
    const conditions = [eq(wellnessAssessments.userId, userId)];
    if (planId) {
      conditions.push(eq(wellnessAssessments.planId, planId));
    }
    
    return await db
      .select()
      .from(wellnessAssessments)
      .where(and(...conditions))
      .orderBy(desc(wellnessAssessments.createdAt));
  }

  async getWellnessAssessment(id: number): Promise<WellnessAssessment | undefined> {
    const [assessment] = await db
      .select()
      .from(wellnessAssessments)
      .where(eq(wellnessAssessments.id, id));
    return assessment;
  }

  async createWellnessAssessment(assessment: InsertWellnessAssessment): Promise<WellnessAssessment> {
    const [newAssessment] = await db
      .insert(wellnessAssessments)
      .values(assessment)
      .returning();
    return newAssessment;
  }

  // Coaching sessions
  async getCoachingSessions(userId: string, planId?: number): Promise<CoachingSession[]> {
    const conditions = [eq(coachingSessions.userId, userId)];
    if (planId) {
      conditions.push(eq(coachingSessions.planId, planId));
    }
    
    return await db
      .select()
      .from(coachingSessions)
      .where(and(...conditions))
      .orderBy(desc(coachingSessions.createdAt));
  }

  async getCoachingSession(id: number): Promise<CoachingSession | undefined> {
    const [session] = await db
      .select()
      .from(coachingSessions)
      .where(eq(coachingSessions.id, id));
    return session;
  }

  async createCoachingSession(session: InsertCoachingSession): Promise<CoachingSession> {
    const [newSession] = await db
      .insert(coachingSessions)
      .values(session)
      .returning();
    return newSession;
  }

  async updateCoachingSession(id: number, session: Partial<InsertCoachingSession>): Promise<CoachingSession> {
    const updateData: any = { ...session, updatedAt: new Date() };
    const [updatedSession] = await db
      .update(coachingSessions)
      .set(updateData)
      .where(eq(coachingSessions.id, id))
      .returning();
    return updatedSession;
  }

  // Wellness goals
  async getWellnessGoals(userId: string, planId?: number): Promise<WellnessGoal[]> {
    const conditions = [eq(wellnessGoals.userId, userId)];
    if (planId) {
      conditions.push(eq(wellnessGoals.planId, planId));
    }
    
    return await db
      .select()
      .from(wellnessGoals)
      .where(and(...conditions))
      .orderBy(desc(wellnessGoals.createdAt));
  }

  async getWellnessGoal(id: number): Promise<WellnessGoal | undefined> {
    const [goal] = await db
      .select()
      .from(wellnessGoals)
      .where(eq(wellnessGoals.id, id));
    return goal;
  }

  async createWellnessGoal(goal: InsertWellnessGoal): Promise<WellnessGoal> {
    const [newGoal] = await db
      .insert(wellnessGoals)
      .values(goal)
      .returning();
    return newGoal;
  }

  async updateWellnessGoal(id: number, goal: Partial<InsertWellnessGoal>): Promise<WellnessGoal> {
    const updateData: any = { ...goal, updatedAt: new Date() };
    const [updatedGoal] = await db
      .update(wellnessGoals)
      .set(updateData)
      .where(eq(wellnessGoals.id, id))
      .returning();
    return updatedGoal;
  }

  async deleteWellnessGoal(id: number): Promise<void> {
    await db.delete(wellnessGoals).where(eq(wellnessGoals.id, id));
  }

  // Fitness data methods
  async getFitnessData(userId: string, dataType?: string, startDate?: Date, endDate?: Date): Promise<FitnessData[]> {
    let conditions = [eq(fitnessData.userId, userId)];
    
    if (dataType) {
      conditions.push(eq(fitnessData.dataType, dataType));
    }
    
    if (startDate) {
      conditions.push(gte(fitnessData.recordedAt, startDate));
    }
    
    if (endDate) {
      conditions.push(lte(fitnessData.recordedAt, endDate));
    }
    
    return db.select().from(fitnessData)
      .where(and(...conditions))
      .orderBy(desc(fitnessData.recordedAt))
      .limit(100);
  }

  async createFitnessData(data: InsertFitnessData): Promise<FitnessData> {
    const [result] = await db.insert(fitnessData).values(data).returning();
    return result;
  }

  async bulkCreateFitnessData(data: InsertFitnessData[]): Promise<FitnessData[]> {
    return await db.insert(fitnessData).values(data).returning();
  }

  async updateUserDeviceTokens(userId: string, deviceType: string, tokens: { accessToken?: string; refreshToken?: string; userId?: string }): Promise<void> {
    const updateData: any = { lastSyncAt: new Date() };
    
    if (deviceType === 'fitbit') {
      if (tokens.accessToken) updateData.fitbitAccessToken = tokens.accessToken;
      if (tokens.refreshToken) updateData.fitbitRefreshToken = tokens.refreshToken;
      if (tokens.userId) updateData.fitbitUserId = tokens.userId;
    } else if (deviceType === 'apple_health') {
      updateData.appleHealthConnected = true;
    }

    await db.update(users).set(updateData).where(eq(users.id, userId));
  }

  // Wellness quiz operations
  async createWellnessQuizResponse(response: InsertWellnessQuizResponse): Promise<WellnessQuizResponse> {
    const [quizResponse] = await db
      .insert(wellnessQuizResponses)
      .values(response)
      .returning();
    return quizResponse;
  }

  async updateUserWellnessProfile(userId: string, profile: {
    wellnessGoals: string[];
    fitnessLevel: string;
    preferredExercises: string[];
    stressLevel: number;
    sleepQuality: string;
    nutritionHabits: string;
    timeAvailability: string;
    onboardingCompleted: boolean;
  }): Promise<void> {
    await db
      .update(users)
      .set({
        wellnessGoals: profile.wellnessGoals,
        fitnessLevel: profile.fitnessLevel,
        preferredExercises: profile.preferredExercises,
        stressLevel: profile.stressLevel,
        sleepQuality: profile.sleepQuality,
        nutritionHabits: profile.nutritionHabits,
        timeAvailability: profile.timeAvailability,
        onboardingCompleted: profile.onboardingCompleted,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  // AI coaching operations
  async createAiCoachingSession(session: InsertAiCoachingSession): Promise<AiCoachingSession> {
    const [coachingSession] = await db
      .insert(aiCoachingSessions)
      .values(session)
      .returning();
    return coachingSession;
  }

  async getAiCoachingSessions(userId: string): Promise<AiCoachingSession[]> {
    return await db
      .select()
      .from(aiCoachingSessions)
      .where(eq(aiCoachingSessions.userId, userId))
      .orderBy(desc(aiCoachingSessions.updatedAt));
  }

  async updateAiCoachingSession(sessionId: number, updates: Partial<InsertAiCoachingSession>): Promise<AiCoachingSession> {
    const [session] = await db
      .update(aiCoachingSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(aiCoachingSessions.id, sessionId))
      .returning();
    return session;
  }

  // Affiliate products operations
  async getAffiliateProducts(filters: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<AffiliateProduct[]> {
    let query = db.select().from(affiliateProducts).where(eq(affiliateProducts.isActive, true));

    if (filters.category) {
      query = query.where(eq(affiliateProducts.category, filters.category));
    }

    if (filters.search) {
      query = query.where(
        or(
          ilike(affiliateProducts.title, `%${filters.search}%`),
          ilike(affiliateProducts.description, `%${filters.search}%`)
        )
      );
    }

    return await query
      .limit(filters.limit || 20)
      .offset(filters.offset || 0)
      .orderBy(desc(affiliateProducts.isTopPick), desc(affiliateProducts.rating));
  }

  async createAffiliateProduct(product: InsertAffiliateProduct): Promise<AffiliateProduct> {
    const [newProduct] = await db
      .insert(affiliateProducts)
      .values(product)
      .returning();
    return newProduct;
  }

  async updateAffiliateProduct(id: number, updates: Partial<InsertAffiliateProduct>): Promise<AffiliateProduct> {
    const [product] = await db
      .update(affiliateProducts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(affiliateProducts.id, id))
      .returning();
    return product;
  }

  // Automation system implementations
  async getAffiliateLinks(filters: {
    category?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<AffiliateLink[]> {
    let query = db.select().from(affiliateLinks);

    if (filters.category) {
      query = query.where(eq(affiliateLinks.category, filters.category));
    }
    if (filters.status) {
      query = query.where(eq(affiliateLinks.status, filters.status));
    }

    query = query
      .orderBy(desc(affiliateLinks.createdAt))
      .limit(filters.limit || 10);

    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    return await query;
  }

  async createAffiliateLink(link: InsertAffiliateLink): Promise<AffiliateLink> {
    const [savedLink] = await db
      .insert(affiliateLinks)
      .values(link)
      .returning();
    return savedLink;
  }

  async updateAffiliateLink(id: number, updates: Partial<InsertAffiliateLink>): Promise<AffiliateLink> {
    const [link] = await db
      .update(affiliateLinks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(affiliateLinks.id, id))
      .returning();
    return link;
  }

  async getContentPipeline(filters: {
    status?: string;
    contentType?: string;
    targetPlatform?: string;
    dueBefore?: Date;
    limit?: number;
  }): Promise<ContentPipeline[]> {
    let query = db.select().from(contentPipeline);
    const conditions = [];

    if (filters.status) {
      conditions.push(eq(contentPipeline.status, filters.status));
    }
    if (filters.contentType) {
      conditions.push(eq(contentPipeline.contentType, filters.contentType));
    }
    if (filters.targetPlatform) {
      conditions.push(eq(contentPipeline.targetPlatform, filters.targetPlatform));
    }
    if (filters.dueBefore) {
      conditions.push(lte(contentPipeline.scheduledFor, filters.dueBefore));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query
      .orderBy(desc(contentPipeline.createdAt))
      .limit(filters.limit || 10);
  }

  async createContentPipeline(pipeline: InsertContentPipeline): Promise<ContentPipeline> {
    const [savedPipeline] = await db
      .insert(contentPipeline)
      .values(pipeline)
      .returning();
    return savedPipeline;
  }

  async updateContentPipeline(id: number, updates: Partial<InsertContentPipeline>): Promise<ContentPipeline> {
    const [pipeline] = await db
      .update(contentPipeline)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(contentPipeline.id, id))
      .returning();
    return pipeline;
  }

  async getSocialAccounts(filters: {
    platform?: string;
    isActive?: boolean;
  }): Promise<SocialAccount[]> {
    let query = db.select().from(socialAccounts);
    const conditions = [];

    if (filters.platform) {
      conditions.push(eq(socialAccounts.platform, filters.platform));
    }
    if (filters.isActive !== undefined) {
      conditions.push(eq(socialAccounts.isActive, filters.isActive));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(socialAccounts.createdAt));
  }

  async createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount> {
    const [savedAccount] = await db
      .insert(socialAccounts)
      .values(account)
      .returning();
    return savedAccount;
  }

  async updateSocialAccount(id: number, updates: Partial<InsertSocialAccount>): Promise<SocialAccount> {
    const [account] = await db
      .update(socialAccounts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(socialAccounts.id, id))
      .returning();
    return account;
  }

  async getAutomationRules(filters: {
    type?: string;
    isActive?: boolean;
    limit?: number;
  }): Promise<AutomationRule[]> {
    let query = db.select().from(automationRules);
    const conditions = [];

    if (filters.type) {
      conditions.push(eq(automationRules.type, filters.type));
    }
    if (filters.isActive !== undefined) {
      conditions.push(eq(automationRules.isActive, filters.isActive));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query
      .orderBy(desc(automationRules.createdAt))
      .limit(filters.limit || 10);
  }

  async createAutomationRule(rule: InsertAutomationRule): Promise<AutomationRule> {
    const [savedRule] = await db
      .insert(automationRules)
      .values(rule)
      .returning();
    return savedRule;
  }

  async updateAutomationRule(id: number, updates: Partial<InsertAutomationRule>): Promise<AutomationRule> {
    const [rule] = await db
      .update(automationRules)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(automationRules.id, id))
      .returning();
    return rule;
  }

  async createRevenueTracking(revenue: InsertRevenueTracking): Promise<RevenueTracking> {
    const [savedRevenue] = await db
      .insert(revenueTracking)
      .values(revenue)
      .returning();
    return savedRevenue;
  }

  async getRevenueStats(): Promise<any> {
    // Get revenue statistics for optimization
    const stats = await db
      .select({
        totalRevenue: sum(revenueTracking.amount),
        totalClicks: sum(revenueTracking.clickCount),
        avgConversion: avg(revenueTracking.conversionRate)
      })
      .from(revenueTracking)
      .where(eq(revenueTracking.status, 'confirmed'));

    return stats[0] || { totalRevenue: 0, totalClicks: 0, avgConversion: 0 };
  }

  async getContentEngagementStats(): Promise<any> {
    // Get content engagement statistics
    const recentContent = await db
      .select()
      .from(contentPipeline)
      .where(eq(contentPipeline.status, 'published'))
      .orderBy(desc(contentPipeline.publishedAt))
      .limit(50);

    const totalEngagement = recentContent.reduce((sum, content) => {
      const engagement = content.engagement || {};
      return sum + (engagement.likes || 0) + (engagement.shares || 0) + (engagement.comments || 0);
    }, 0);

    return {
      avgEngagement: totalEngagement / Math.max(recentContent.length, 1),
      totalPosts: recentContent.length,
      totalRevenue: recentContent.reduce((sum, content) => 
        sum + ((content.engagement?.revenue || 0) as number), 0
      )
    };
  }
}

export const storage = new DatabaseStorage();