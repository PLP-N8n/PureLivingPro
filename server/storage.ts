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
  type InsertBlogPost,
  type InsertProduct,
  type InsertChallenge,
  type InsertUserChallenge,
  type InsertDailyLog,
  type InsertWellnessPlan,
  type InsertWellnessAssessment,
  type InsertCoachingSession,
  type InsertWellnessGoal,
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
}

export class DatabaseStorage implements IStorage {
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
}

export const storage = new DatabaseStorage();