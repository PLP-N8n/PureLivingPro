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
  isPremium: boolean("is_premium").default(false),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  wellnessProfile: jsonb("wellness_profile").$type<{
    goals: string[];
    experienceLevel: string;
    lifestyle: string;
    preferences: string[];
  }>(),
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
