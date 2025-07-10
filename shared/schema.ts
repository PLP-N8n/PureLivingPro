import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  boolean,
  decimal,
  serial,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user"), // user, editor, admin
  isPremium: boolean("is_premium").default(false),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  wellnessProfile: jsonb("wellness_profile").$type<{
    goals: string[];
    experienceLevel: string;
    lifestyle: string;
    preferences: string[];
  }>(),
  wellnessGoals: text("wellness_goals").array(),
  fitnessLevel: varchar("fitness_level"),
  preferredExercises: text("preferred_exercises").array(),
  stressLevel: integer("stress_level"),
  sleepQuality: varchar("sleep_quality"),
  nutritionHabits: varchar("nutrition_habits"),
  timeAvailability: varchar("time_availability"),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  // Wearable device integrations
  fitbitAccessToken: varchar("fitbit_access_token"),
  fitbitRefreshToken: varchar("fitbit_refresh_token"),
  fitbitUserId: varchar("fitbit_user_id"),
  appleHealthConnected: boolean("apple_health_connected").default(false),
  lastSyncAt: timestamp("last_sync_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog posts
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }),
  tags: jsonb("tags").$type<string[]>(),
  isPremium: boolean("is_premium").default(false),
  isPublished: boolean("is_published").default(false),
  readTime: integer("read_time"), // in minutes
  authorId: varchar("author_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category", { length: 100 }),
  tags: jsonb("tags").$type<string[]>(),
  imageUrl: varchar("image_url"),
  affiliateLink: varchar("affiliate_link"),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  isRecommended: boolean("is_recommended").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Wellness challenges
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  duration: integer("duration"), // in days
  category: varchar("category", { length: 100 }),
  difficulty: varchar("difficulty", { length: 50 }),
  goals: jsonb("goals").$type<string[]>(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User challenge progress
export const userChallenges = pgTable("user_challenges", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  challengeId: integer("challenge_id").references(() => challenges.id).notNull(),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  isCompleted: boolean("is_completed").default(false),
  progress: jsonb("progress").$type<{
    completedDays: number[];
    notes: string[];
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Daily wellness logs
export const dailyLogs = pgTable("daily_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  date: timestamp("date").defaultNow(),
  mood: integer("mood"), // 1-5 scale
  energy: integer("energy"), // 1-5 scale
  sleep: integer("sleep"), // hours
  exercise: boolean("exercise").default(false),
  meditation: boolean("meditation").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Wellness Plans - AI generated personalized plans
export const wellnessPlans = pgTable("wellness_plans", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }), // fitness, nutrition, mindfulness, overall
  difficulty: varchar("difficulty", { length: 50 }), // beginner, intermediate, advanced
  duration: integer("duration"), // duration in days
  goals: jsonb("goals").$type<string[]>(),
  dailyTasks: jsonb("daily_tasks").$type<{
    day: number;
    tasks: {
      type: string; // workout, meal, meditation, habit
      title: string;
      description: string;
      duration?: number;
      completed?: boolean;
    }[];
  }[]>(),
  weeklyMilestones: jsonb("weekly_milestones").$type<{
    week: number;
    milestone: string;
    description: string;
  }[]>(),
  aiInsights: text("ai_insights"),
  isActive: boolean("is_active").default(true),
  completionPercentage: integer("completion_percentage").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Wellness Assessments - Regular check-ins and progress tracking
export const wellnessAssessments = pgTable("wellness_assessments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  planId: integer("plan_id").references(() => wellnessPlans.id),
  assessmentType: varchar("assessment_type", { length: 50 }).notNull(), // initial, weekly, monthly, final
  responses: jsonb("responses").$type<{
    question: string;
    answer: string | number;
    category: string;
  }[]>(),
  scores: jsonb("scores").$type<{
    overall: number;
    fitness: number;
    nutrition: number;
    mental: number;
    sleep: number;
  }>(),
  aiAnalysis: text("ai_analysis"),
  recommendations: jsonb("recommendations").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Wellness Coaching Sessions - AI coaching interactions
export const coachingSessions = pgTable("coaching_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  planId: integer("plan_id").references(() => wellnessPlans.id),
  sessionType: varchar("session_type", { length: 50 }).notNull(), // check_in, guidance, motivation, crisis
  conversation: jsonb("conversation").$type<{
    timestamp: string;
    role: 'user' | 'coach';
    message: string;
  }[]>(),
  mood: integer("mood"), // 1-10 scale
  energy: integer("energy"), // 1-10 scale
  motivation: integer("motivation"), // 1-10 scale
  challenges: text("challenges"),
  successes: text("successes"),
  aiRecommendations: jsonb("ai_recommendations").$type<{
    type: string;
    priority: string;
    action: string;
    reasoning: string;
  }[]>(),
  followUpDate: timestamp("follow_up_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Fitness Data from Wearable Devices
export const fitnessData = pgTable("fitness_data", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  deviceType: varchar("device_type", { length: 50 }).notNull(), // fitbit, apple_health, manual
  dataType: varchar("data_type", { length: 50 }).notNull(), // steps, heart_rate, sleep, calories, distance, weight
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  unit: varchar("unit", { length: 20 }).notNull(), // steps, bpm, hours, kcal, miles, lbs
  recordedAt: timestamp("recorded_at").notNull(),
  metadata: jsonb("metadata").$type<{
    deviceModel?: string;
    workoutType?: string;
    sleepStage?: string;
    confidence?: number;
    [key: string]: any;
  }>(),
  syncedAt: timestamp("synced_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Wellness Goals - User-defined and AI-suggested goals
export const wellnessGoals = pgTable("wellness_goals", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  planId: integer("plan_id").references(() => wellnessPlans.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }), // fitness, nutrition, mental_health, sleep, habits
  targetValue: decimal("target_value", { precision: 10, scale: 2 }),
  currentValue: decimal("current_value", { precision: 10, scale: 2 }).default('0'),
  unit: varchar("unit", { length: 50 }), // lbs, minutes, hours, count, etc.
  targetDate: timestamp("target_date"),
  priority: varchar("priority", { length: 20 }).default('medium'), // low, medium, high
  isCompleted: boolean("is_completed").default(false),
  milestones: jsonb("milestones").$type<{
    value: number;
    date: string;
    note?: string;
  }[]>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  blogPosts: many(blogPosts),
  userChallenges: many(userChallenges),
  dailyLogs: many(dailyLogs),
  wellnessPlans: many(wellnessPlans),
  wellnessAssessments: many(wellnessAssessments),
  coachingSessions: many(coachingSessions),
  wellnessGoals: many(wellnessGoals),
  fitnessData: many(fitnessData),
}));

export const fitnessDataRelations = relations(fitnessData, ({ one }) => ({
  user: one(users, {
    fields: [fitnessData.userId],
    references: [users.id],
  }),
}));

export const wellnessPlansRelations = relations(wellnessPlans, ({ one, many }) => ({
  user: one(users, {
    fields: [wellnessPlans.userId],
    references: [users.id],
  }),
  assessments: many(wellnessAssessments),
  coachingSessions: many(coachingSessions),
  goals: many(wellnessGoals),
}));

export const wellnessAssessmentsRelations = relations(wellnessAssessments, ({ one }) => ({
  user: one(users, {
    fields: [wellnessAssessments.userId],
    references: [users.id],
  }),
  plan: one(wellnessPlans, {
    fields: [wellnessAssessments.planId],
    references: [wellnessPlans.id],
  }),
}));

export const coachingSessionsRelations = relations(coachingSessions, ({ one }) => ({
  user: one(users, {
    fields: [coachingSessions.userId],
    references: [users.id],
  }),
  plan: one(wellnessPlans, {
    fields: [coachingSessions.planId],
    references: [wellnessPlans.id],
  }),
}));

export const wellnessGoalsRelations = relations(wellnessGoals, ({ one }) => ({
  user: one(users, {
    fields: [wellnessGoals.userId],
    references: [users.id],
  }),
  plan: one(wellnessPlans, {
    fields: [wellnessGoals.planId],
    references: [wellnessPlans.id],
  }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
}));

export const challengesRelations = relations(challenges, ({ many }) => ({
  userChallenges: many(userChallenges),
}));

export const userChallengesRelations = relations(userChallenges, ({ one }) => ({
  user: one(users, {
    fields: [userChallenges.userId],
    references: [users.id],
  }),
  challenge: one(challenges, {
    fields: [userChallenges.challengeId],
    references: [challenges.id],
  }),
}));

export const dailyLogsRelations = relations(dailyLogs, ({ one }) => ({
  user: one(users, {
    fields: [dailyLogs.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserChallengeSchema = createInsertSchema(userChallenges).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDailyLogSchema = createInsertSchema(dailyLogs).omit({
  id: true,
  createdAt: true,
});

export const insertWellnessPlanSchema = createInsertSchema(wellnessPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWellnessAssessmentSchema = createInsertSchema(wellnessAssessments).omit({
  id: true,
  createdAt: true,
});

export const insertCoachingSessionSchema = createInsertSchema(coachingSessions).omit({
  id: true,
  createdAt: true,
});

export const insertWellnessGoalSchema = createInsertSchema(wellnessGoals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFitnessDataSchema = createInsertSchema(fitnessData).omit({
  id: true,
  syncedAt: true,
  createdAt: true,
});

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;

// Wellness Quiz Responses
export const wellnessQuizResponses = pgTable("wellness_quiz_responses", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  questionId: varchar("question_id").notNull(),
  answer: jsonb("answer").$type<string | string[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Coaching Sessions
export const aiCoachingSessions = pgTable("ai_coaching_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  title: varchar("title", { length: 255 }),
  messages: jsonb("messages").$type<Array<{
    id: string;
    type: "user" | "ai";
    content: string;
    timestamp: string;
    suggestions?: string[];
    insights?: Array<{
      type: "progress" | "recommendation" | "motivation";
      title: string;
      description: string;
      icon: string;
    }>;
  }>>().notNull(),
  mood: varchar("mood", { length: 50 }),
  context: jsonb("context").$type<{
    userGoals: string[];
    currentMood: string;
    recentActivity: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Affiliate Products
export const affiliateProducts = pgTable("affiliate_products", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  reviewCount: integer("review_count").default(0),
  category: varchar("category", { length: 100 }),
  platform: varchar("platform", { length: 50 }), // amazon, clickbank, other
  affiliateLink: varchar("affiliate_link").notNull(),
  imageUrl: varchar("image_url"),
  features: text("features").array(),
  benefits: text("benefits").array(),
  tags: text("tags").array(),
  isTopPick: boolean("is_top_pick").default(false),
  isPremium: boolean("is_premium").default(false),
  commission: decimal("commission", { precision: 5, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type WellnessQuizResponse = typeof wellnessQuizResponses.$inferSelect;
export type InsertWellnessQuizResponse = typeof wellnessQuizResponses.$inferInsert;
export type AiCoachingSession = typeof aiCoachingSessions.$inferSelect;
export type InsertAiCoachingSession = typeof aiCoachingSessions.$inferInsert;
// Automation & Revenue System Tables

// Enhanced Affiliate Links Management
export const affiliateLinks = pgTable("affiliate_links", {
  id: serial("id").primaryKey(),
  url: varchar("url", { length: 500 }).notNull(),
  merchant: varchar("merchant", { length: 100 }),
  productName: varchar("product_name", { length: 255 }),
  category: varchar("category", { length: 100 }),
  description: text("description"),
  imageUrl: varchar("image_url", { length: 1000 }),
  price: varchar("price", { length: 50 }),
  commission: decimal("commission", { precision: 5, scale: 2 }),
  isActive: boolean("is_active").default(true),
  lastChecked: timestamp("last_checked"),
  status: varchar("status", { length: 50 }).default("pending"), // pending, approved, rejected, expired
  scrapedData: jsonb("scraped_data").$type<{
    price?: number;
    rating?: number;
    availability?: boolean;
    description?: string;
    images?: string[];
  }>(),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Content Automation Pipeline
export const contentPipeline = pgTable("content_pipeline", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  contentType: varchar("content_type", { length: 50 }).notNull(), // blog, social, video, audio
  targetPlatform: varchar("target_platform", { length: 50 }), // x, instagram, tiktok, blog
  status: varchar("status", { length: 50 }).default("scheduled"), // scheduled, generating, completed, failed, published
  aiProvider: varchar("ai_provider", { length: 50 }), // openai, openrouter, elevenlabs, veo3
  prompt: text("prompt"),
  generatedContent: jsonb("generated_content").$type<{
    text?: string;
    mediaUrl?: string;
    hashtags?: string[];
    affiliateLinks?: number[]; // Reference to affiliate_links.id
  }>(),
  scheduledFor: timestamp("scheduled_for"),
  publishedAt: timestamp("published_at"),
  engagement: jsonb("engagement").$type<{
    likes?: number;
    shares?: number;
    comments?: number;
    clicks?: number;
    revenue?: number;
  }>(),
  affiliateLinksUsed: integer("affiliate_links_used").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Social Media Accounts
export const socialAccounts = pgTable("social_accounts", {
  id: serial("id").primaryKey(),
  platform: varchar("platform", { length: 50 }).notNull(), // x, instagram, tiktok
  username: varchar("username", { length: 100 }),
  accessToken: varchar("access_token", { length: 500 }),
  refreshToken: varchar("refresh_token", { length: 500 }),
  isActive: boolean("is_active").default(true),
  lastPosted: timestamp("last_posted"),
  dailyPostLimit: integer("daily_post_limit").default(5),
  postsToday: integer("posts_today").default(0),
  accountMetrics: jsonb("account_metrics").$type<{
    followers?: number;
    following?: number;
    totalPosts?: number;
    engagementRate?: number;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Automation Rules Engine
export const automationRules = pgTable("automation_rules", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // content_creation, affiliate_insertion, social_posting
  isActive: boolean("is_active").default(true),
  triggers: jsonb("triggers").$type<{
    schedule?: string; // cron expression
    keywords?: string[];
    categories?: string[];
    events?: string[];
  }>(),
  actions: jsonb("actions").$type<{
    createContent?: boolean;
    insertAffiliateLinks?: boolean;
    postToSocial?: boolean;
    platforms?: string[];
    aiProvider?: string;
  }>(),
  conditions: jsonb("conditions").$type<{
    minEngagement?: number;
    maxDailyPosts?: number;
    categoryFilters?: string[];
  }>(),
  lastExecuted: timestamp("last_executed"),
  executionCount: integer("execution_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Revenue Tracking
export const revenueTracking = pgTable("revenue_tracking", {
  id: serial("id").primaryKey(),
  source: varchar("source", { length: 100 }).notNull(), // affiliate, subscription, ads
  affiliateLinkId: integer("affiliate_link_id").references(() => affiliateLinks.id),
  contentId: integer("content_id"), // Reference to blog post or social content
  platform: varchar("platform", { length: 50 }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  status: varchar("status", { length: 50 }).default("pending"), // pending, confirmed, disputed
  commission: decimal("commission", { precision: 10, scale: 2 }),
  clickCount: integer("click_count").default(0),
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 4 }),
  metadata: jsonb("metadata").$type<{
    orderId?: string;
    customerEmail?: string;
    productDetails?: any;
  }>(),
  recordedAt: timestamp("recorded_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas for automation tables
export const insertAffiliateLinkSchema = createInsertSchema(affiliateLinks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContentPipelineSchema = createInsertSchema(contentPipeline).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSocialAccountSchema = createInsertSchema(socialAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAutomationRuleSchema = createInsertSchema(automationRules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRevenueTrackingSchema = createInsertSchema(revenueTracking).omit({
  id: true,
  recordedAt: true,
  createdAt: true,
});

// All Types Export
export type AffiliateProduct = typeof affiliateProducts.$inferSelect;
export type InsertAffiliateProduct = typeof affiliateProducts.$inferInsert;
export type AffiliateLink = typeof affiliateLinks.$inferSelect;
export type InsertAffiliateLink = typeof affiliateLinks.$inferInsert;
export type ContentPipeline = typeof contentPipeline.$inferSelect;
export type InsertContentPipeline = typeof contentPipeline.$inferInsert;
export type SocialAccount = typeof socialAccounts.$inferSelect;
export type InsertSocialAccount = typeof socialAccounts.$inferInsert;
export type AutomationRule = typeof automationRules.$inferSelect;
export type InsertAutomationRule = typeof automationRules.$inferInsert;
export type RevenueTracking = typeof revenueTracking.$inferSelect;
export type InsertRevenueTracking = typeof revenueTracking.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Challenge = typeof challenges.$inferSelect;
export type UserChallenge = typeof userChallenges.$inferSelect;
export type DailyLog = typeof dailyLogs.$inferSelect;
export type WellnessPlan = typeof wellnessPlans.$inferSelect;
export type WellnessAssessment = typeof wellnessAssessments.$inferSelect;
export type CoachingSession = typeof coachingSessions.$inferSelect;
export type WellnessGoal = typeof wellnessGoals.$inferSelect;
export type FitnessData = typeof fitnessData.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type InsertUserChallenge = z.infer<typeof insertUserChallengeSchema>;
export type InsertDailyLog = z.infer<typeof insertDailyLogSchema>;
export type InsertWellnessPlan = z.infer<typeof insertWellnessPlanSchema>;
export type InsertWellnessAssessment = z.infer<typeof insertWellnessAssessmentSchema>;
export type InsertCoachingSession = z.infer<typeof insertCoachingSessionSchema>;
export type InsertWellnessGoal = z.infer<typeof insertWellnessGoalSchema>;
export type InsertFitnessData = z.infer<typeof insertFitnessDataSchema>;
