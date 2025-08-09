import { SimpleStorage } from "./storage-simple";
import { db } from "./db";
import { blogPosts, products } from "@shared/schema";
import { ilike, or } from "drizzle-orm";

export class DatabaseStorage {
  private impl: SimpleStorage;

  constructor() {
    this.impl = new SimpleStorage();
  }

  async getUser(id: string) {
    return this.impl.getUser(id);
  }

  async upsertUser(userData: any) {
    return this.impl.upsertUser(userData);
  }

  async getBlogPosts(filtersOrLimit?: any, offset?: number) {
    if (typeof filtersOrLimit === 'number') {
      const limit = filtersOrLimit as number;
      return await (db.select() as any)
        .from(blogPosts)
        .limit(limit)
        .offset(offset ?? 0);
    }
    return this.impl.getBlogPosts(filtersOrLimit);
  }

  async getBlogPostsPaginated(page: number, pageSize: number, filters?: any) {
    return this.impl.getBlogPostsPaginated(page, pageSize, filters);
  }

  async createBlogPost(post: any) {
    return this.impl.createBlogPost(post);
  }

  async updateBlogPost(id: number, updates: any) {
    return this.impl.updateBlogPost(id, updates);
  }

  async deleteBlogPost(id: number) {
    return this.impl.deleteBlogPost(id);
  }

  async getBlogPost(slug: string) {
    return this.impl.getBlogPost(slug);
  }

  async getBlogPostStats() {
    return this.impl.getBlogPostStats();
  }

  async getProducts(filters?: any) {
    return this.impl.getProducts(filters);
  }

  async getProductsPaginated(page: number, pageSize: number, filters?: any) {
    return this.impl.getProductsPaginated(page, pageSize, filters);
  }

  async createProduct(product: any) {
    return this.impl.createProduct(product);
  }

  async updateProduct(id: number, updates: any) {
    return this.impl.updateProduct(id, updates);
  }

  async deleteProduct(id: number) {
    return this.impl.deleteProduct(id);
  }

  async searchProducts(query: string) {
    const whereClause = or(
      ilike(products.name, `%${query}%`),
      ilike(products.description, `%${query}%`)
    );
    return await (db.select() as any)
      .from(products)
      .where(whereClause as any);
  }

  async getProduct(id: number) {
    return this.impl.getProduct(id);
  }

  async getProductStats() {
    return this.impl.getProductStats();
  }

  async getChallenges(limit?: number, offset?: number) {
    return this.impl.getChallenges(limit, offset);
  }

  async getChallenge(id: number) {
    return this.impl.getChallenge(id);
  }

  async createChallenge(challenge: any) {
    return this.impl.createChallenge(challenge);
  }

  async updateChallenge(id: number, updates: any) {
    return this.impl.updateChallenge(id, updates);
  }

  async deleteChallenge(id: number) {
    return this.impl.deleteChallenge(id);
  }

  async getChallengeStats() {
    return this.impl.getChallengeStats();
  }

  async getUserChallenges(userId: string) {
    return this.impl.getUserChallenges(userId);
  }

  async createUserChallenge(userChallenge: any) {
    return this.impl.createUserChallenge(userChallenge);
  }

  async getDailyLogs(userId: string, startDate?: Date, endDate?: Date) {
    return this.impl.getDailyLogs(userId, startDate, endDate);
  }

  async createDailyLog(dailyLog: any) {
    return this.impl.createDailyLog(dailyLog);
  }

  async getWellnessPlans(userId: string) {
    return this.impl.getWellnessPlans(userId);
  }

  async createWellnessPlan(plan: any) {
    return this.impl.createWellnessPlan(plan);
  }

  async getUserFitnessData(userId: string, limit?: number) {
    return this.impl.getUserFitnessData(userId, limit);
  }

  async createWellnessAssessment(a: any) {
    return this.impl.createWellnessAssessment(a);
  }

  async getWellnessAssessments(userId: string, planId?: number) {
    return this.impl.getWellnessAssessments(userId, planId);
  }

  async createCoachingSession(s: any) {
    return this.impl.createCoachingSession(s);
  }

  async getCoachingSessions(userId: string, planId?: number) {
    return this.impl.getCoachingSessions(userId, planId);
  }

  async createWellnessGoal(g: any) {
    return this.impl.createWellnessGoal(g);
  }

  async getWellnessGoals(userId: string, planId?: number) {
    return this.impl.getWellnessGoals(userId, planId);
  }

  async updateWellnessGoal(id: number, updates: any) {
    return this.impl.updateWellnessGoal(id, updates);
  }

  async bulkCreateFitnessData(items: any[]) {
    return this.impl.bulkCreateFitnessData(items);
  }

  async updateUserDeviceTokens(userId: string, device: string, tokens: any) {
    return this.impl.updateUserDeviceTokens(userId, device, tokens);
  }

  async getFitnessData(userId: string, dataType?: string, start?: Date, end?: Date) {
    return this.impl.getFitnessData(userId, dataType, start, end);
  }

  async createWellnessQuizResponse(data: any) {
    return this.impl.createWellnessQuizResponse(data);
  }

  async updateUserWellnessProfile(userId: string, updates: any) {
    return this.impl.updateUserWellnessProfile(userId, updates);
  }

  async getAffiliateProducts(filters?: any) {
    return this.impl.getAffiliateProducts(filters);
  }

  async createAffiliateProduct(product: any) {
    return this.impl.createAffiliateProduct(product);
  }

  async createAffiliateLink(link: any) {
    return this.impl.createAffiliateLink(link);
  }

  async updateAffiliateLink(id: number, updates: any) {
    return this.impl.updateAffiliateLink(id, updates);
  }

  async getAffiliateLinks(filters?: any) {
    return this.impl.getAffiliateLinks(filters);
  }

  async createRevenueTracking(tracking: any) {
    return this.impl.createRevenueTracking(tracking);
  }

  async getRevenueStats() {
    return this.impl.getRevenueStats();
  }

  async getContentEngagementStats() {
    return this.impl.getContentEngagementStats();
  }

  async createContentPipeline(p: any) {
    return this.impl.createContentPipeline(p);
  }

  async updateContentPipeline(id: number, updates: any) {
    return this.impl.updateContentPipeline(id, updates);
  }

  async getContentPipeline(filtersOrId?: any) {
    return this.impl.getContentPipeline(filtersOrId);
  }

  async getSocialAccounts(filters?: any) {
    return this.impl.getSocialAccounts(filters);
  }

  async createSocialAccount(data: any) {
    return this.impl.createSocialAccount(data);
  }

  async updateSocialAccount(id: number, updates: any) {
    return this.impl.updateSocialAccount(id, updates);
  }

  async createAgentTask(task: any) {
    return this.impl.createAgentTask(task);
  }

  async getAgentTasks(status?: string) {
    return this.impl.getAgentTasks(status);
  }

  async updateAgentTask(id: number, updates: any) {
    return this.impl.updateAgentTask(id, updates);
  }

  async getAgentStats() {
    return this.impl.getAgentStats();
  }

  async getSystemMetrics() {
    return this.impl.getSystemMetrics();
  }

  async getAutomationRules(filters?: any) {
    return this.impl.getAutomationRules(filters);
  }

  async createAutomationRule(rule: any) {
    return this.impl.createAutomationRule(rule);
  }

  async updateAutomationRule(id: number, updates: any) {
    return this.impl.updateAutomationRule(id, updates);
  }

  async createAiCoachingSession(session: any) {
    return this.impl.createAiCoachingSession?.(session);
  }

  async getAiCoachingSessions(userId: string) {
    return this.impl.getAiCoachingSessions?.(userId);
  }

  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string) {
    return (this.impl as any).updateUserStripeInfo(userId, stripeCustomerId, stripeSubscriptionId);
  }

  async bulkUpdateBlogPosts(action: string, ids: number[]) {
    return this.impl.bulkUpdateBlogPosts(action, ids);
  }

  async bulkUpdateProducts(action: string, ids: number[]) {
    return this.impl.bulkUpdateProducts(action, ids);
  }
}

export const storage = new DatabaseStorage();
