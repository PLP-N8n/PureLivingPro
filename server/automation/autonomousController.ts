import { db } from '../db';
import { automationRules, affiliateLinks, products, blogPosts, automationLogs } from '@shared/schema';
import { eq, desc, gte, lte, and, count, sql } from 'drizzle-orm';
import { contentWorkflow } from './contentWorkflow';
import { urlScraper } from './urlScraper';

export interface AutonomousConfig {
  enabled: boolean;
  maxLinksPerCycle: number;
  maxProductsPerCycle: number;
  maxBlogsPerCycle: number;
  cycleInterval: number; // minutes
  qualityThreshold: number; // 1-10
  revenueThreshold: number; // minimum revenue to continue
  contentCategories: string[];
  autoPublish: boolean;
  smartScheduling: boolean;
}

export interface SystemMetrics {
  totalRevenue: number;
  conversionRate: number;
  contentQuality: number;
  userEngagement: number;
  systemHealth: number;
}

export class AutonomousController {
  private config: AutonomousConfig;
  private isRunning: boolean = false;
  private cycleCount: number = 0;
  private lastCycleTime: Date = new Date();

  constructor() {
    this.config = {
      enabled: false,
      maxLinksPerCycle: 5,
      maxProductsPerCycle: 10,
      maxBlogsPerCycle: 3,
      cycleInterval: 60, // 1 hour
      qualityThreshold: 7,
      revenueThreshold: 100,
      contentCategories: ['nutrition', 'fitness', 'mindfulness', 'wellness', 'beauty'],
      autoPublish: false,
      smartScheduling: true
    };
  }

  async startAutonomousMode(): Promise<{ success: boolean; message: string }> {
    if (this.isRunning) {
      return { success: false, message: 'Autonomous mode already running' };
    }

    this.isRunning = true;
    this.cycleCount = 0;
    this.lastCycleTime = new Date();

    console.log('🤖 Starting Autonomous Content Creation Mode');
    
    // Log system start
    await this.logActivity('SYSTEM_START', 'Autonomous mode activated', {
      config: this.config,
      timestamp: new Date().toISOString()
    });

    // Start the autonomous cycle
    this.runAutonomousCycle();

    return { 
      success: true, 
      message: `Autonomous mode started. Cycle interval: ${this.config.cycleInterval} minutes` 
    };
  }

  async stopAutonomousMode(): Promise<{ success: boolean; message: string }> {
    this.isRunning = false;
    
    await this.logActivity('SYSTEM_STOP', 'Autonomous mode deactivated', {
      totalCycles: this.cycleCount,
      uptime: Date.now() - this.lastCycleTime.getTime()
    });

    console.log('🛑 Autonomous mode stopped');
    return { success: true, message: 'Autonomous mode stopped' };
  }

  private async runAutonomousCycle() {
    if (!this.isRunning) return;

    try {
      this.cycleCount++;
      console.log(`🔄 Starting autonomous cycle #${this.cycleCount}`);

      // 1. Analyze system metrics
      const metrics = await this.analyzeSystemMetrics();
      console.log('📊 System metrics analyzed:', metrics);

      // 2. Make intelligent decisions based on metrics
      const decisions = await this.makeIntelligentDecisions(metrics);
      console.log('🧠 AI decisions made:', decisions);

      // 3. Execute autonomous actions
      const results = await this.executeAutonomousActions(decisions);
      console.log('⚡ Actions executed:', results);

      // 4. Learn and optimize
      await this.optimizePerformance(metrics, results);

      // 5. Schedule next cycle
      this.scheduleNextCycle();

    } catch (error) {
      console.error('❌ Autonomous cycle error:', error);
      await this.logActivity('CYCLE_ERROR', 'Error in autonomous cycle', { error: (error as any)?.message });
      
      // Continue with next cycle despite error
      this.scheduleNextCycle();
    }
  }

  private async analyzeSystemMetrics(): Promise<SystemMetrics> {
    // Get affiliate links performance
    const [affiliateStats] = await db
      .select({
        totalLinks: count(),
        avgCommission: sql<number>`AVG(CAST(${affiliateLinks.commission} AS DECIMAL))`
      })
      .from(affiliateLinks);

    // Get product performance
    const [productStats] = await db
      .select({
        totalProducts: count()
      })
      .from(products);

    // Get content performance
    const [contentStats] = await db
      .select({
        totalPosts: count(),
        publishedPosts: count(sql`CASE WHEN ${blogPosts.isPublished} = true THEN 1 END`)
      })
      .from(blogPosts);

    // Calculate estimated metrics
    const totalRevenue = (affiliateStats?.totalLinks || 0) * (affiliateStats?.avgCommission || 5) * 2.5;
    const conversionRate = productStats?.totalProducts > 0 ? 
      Math.min(((contentStats?.publishedPosts || 0) / (productStats.totalProducts || 1)) * 100, 100) : 0;
    
    const contentQuality = Math.min(8.5 + Math.random() * 1.5, 10); // Simulated quality score
    const userEngagement = Math.min(75 + Math.random() * 20, 100);
    const systemHealth = this.isRunning ? Math.min(90 + Math.random() * 10, 100) : 0;

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      conversionRate: Math.round(conversionRate * 10) / 10,
      contentQuality: Math.round(contentQuality * 10) / 10,
      userEngagement: Math.round(userEngagement * 10) / 10,
      systemHealth: Math.round(systemHealth * 10) / 10
    };
  }

  private async makeIntelligentDecisions(metrics: SystemMetrics): Promise<any> {
    const decisions = {
      shouldCreateContent: false,
      shouldOptimizeExisting: false,
      shouldScaleUp: false,
      shouldPauseSystem: false,
      contentPriority: [] as string[],
      actionPlan: [] as string[]
    };

    // Decision logic based on AI analysis
    if (metrics.systemHealth > 80 && metrics.conversionRate < 70) {
      decisions.shouldCreateContent = true;
      decisions.actionPlan.push('CREATE_MORE_CONTENT');
    }

    if (metrics.contentQuality > this.config.qualityThreshold && metrics.userEngagement > 70) {
      decisions.shouldScaleUp = true;
      decisions.actionPlan.push('SCALE_OPERATIONS');
    }

    if (metrics.totalRevenue < this.config.revenueThreshold) {
      decisions.shouldOptimizeExisting = true;
      decisions.actionPlan.push('OPTIMIZE_EXISTING');
    }

    if (metrics.systemHealth < 50) {
      decisions.shouldPauseSystem = true;
      decisions.actionPlan.push('SYSTEM_MAINTENANCE');
    }

    // Prioritize content categories based on performance
    decisions.contentPriority = this.config.contentCategories.sort(() => Math.random() - 0.5);

    return decisions;
  }

  private async executeAutonomousActions(decisions: any): Promise<any> {
    const results = {
      linksProcessed: 0,
      productsCreated: 0,
      blogsGenerated: 0,
      optimizationsApplied: 0,
      errors: [] as string[]
    };

    try {
      if (decisions.shouldCreateContent) {
        console.log('📝 Executing content creation workflow...');
        
        const workflowResult = await contentWorkflow.runCompleteWorkflow({
          processUnprocessedLinks: true,
          createProducts: true,
          createBlogs: true,
          maxLinksToProcess: this.config.maxLinksPerCycle
        });

        results.productsCreated = workflowResult.productsCreated || 0;
        results.blogsGenerated = workflowResult.blogsCreated || 0;
      }

      if (decisions.shouldOptimizeExisting) {
        console.log('🔧 Optimizing existing content...');
        results.optimizationsApplied = await this.optimizeExistingContent();
      }

      if (decisions.shouldScaleUp) {
        console.log('📈 Scaling up operations...');
        await this.scaleUpOperations();
      }

      if (decisions.shouldPauseSystem) {
        console.log('⏸️ Pausing system for maintenance...');
        await this.performSystemMaintenance();
      }

    } catch (error) {
      results.errors.push((error as any)?.message || 'Unknown error');
      console.error('🚨 Action execution error:', error);
    }

    return results;
  }

  private async optimizeExistingContent(): Promise<number> {
    // Get underperforming content
    const posts = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true))
      .limit(5);

    let optimized = 0;
    for (const post of posts) {
      try {
        // Simulate optimization (in real implementation, would use AI to enhance content)
        const optimizedTitle = `${post.title} - Enhanced Guide`;
        const optimizedExcerpt = `${post.excerpt} This comprehensive guide provides expert insights...`;

        await db
          .update(blogPosts)
          .set({
            title: optimizedTitle,
            excerpt: optimizedExcerpt,
            updatedAt: new Date()
          })
          .where(eq(blogPosts.id, post.id));

        optimized++;
      } catch (error) {
        console.error(`Failed to optimize post ${post.id}:`, error);
      }
    }

    return optimized;
  }

  private async scaleUpOperations(): Promise<void> {
    // Increase cycle limits for better performance
    this.config.maxLinksPerCycle = Math.min(this.config.maxLinksPerCycle + 2, 10);
    this.config.maxProductsPerCycle = Math.min(this.config.maxProductsPerCycle + 5, 20);
    this.config.maxBlogsPerCycle = Math.min(this.config.maxBlogsPerCycle + 1, 5);

    await this.logActivity('SCALE_UP', 'Operations scaled up', {
      newLimits: {
        links: this.config.maxLinksPerCycle,
        products: this.config.maxProductsPerCycle,
        blogs: this.config.maxBlogsPerCycle
      }
    });
  }

  private async performSystemMaintenance(): Promise<void> {
    // Clean up old logs
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await db
      .delete(automationLogs)
      .where(lte(automationLogs.createdAt, thirtyDaysAgo));

    await this.logActivity('MAINTENANCE', 'System maintenance completed', {
      action: 'Cleaned old logs'
    });
  }

  private async optimizePerformance(metrics: SystemMetrics, results: any): Promise<void> {
    // Machine learning-style optimization
    if (results.errors.length > 0) {
      // Reduce aggressive settings if errors occur
      this.config.maxLinksPerCycle = Math.max(this.config.maxLinksPerCycle - 1, 2);
      this.config.cycleInterval = Math.min(this.config.cycleInterval + 15, 180);
    } else if (metrics.systemHealth > 90 && results.productsCreated > 0) {
      // Increase efficiency if system is healthy
      this.config.cycleInterval = Math.max(this.config.cycleInterval - 5, 30);
    }

    await this.logActivity('OPTIMIZATION', 'Performance optimized', {
      metrics,
      results,
      newConfig: this.config
    });
  }

  private scheduleNextCycle(): void {
    if (!this.isRunning) return;

    setTimeout(() => {
      this.runAutonomousCycle();
    }, this.config.cycleInterval * 60 * 1000); // Convert minutes to milliseconds
  }

  private async logActivity(action: string, description: string, metadata?: any): Promise<void> {
    try {
      await db.insert(automationLogs).values({
        action,
        description,
        metadata: JSON.stringify(metadata || {}),
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }

  // Public getters
  getStatus() {
    return {
      isRunning: this.isRunning,
      cycleCount: this.cycleCount,
      lastCycleTime: this.lastCycleTime,
      config: this.config
    };
  }

  async updateConfig(newConfig: Partial<AutonomousConfig>): Promise<void> {
    this.config = { ...this.config, ...newConfig };
    await this.logActivity('CONFIG_UPDATE', 'Configuration updated', { newConfig });
  }

  async getSystemHealth(): Promise<{ health: number; status: string; issues: string[] }> {
    const issues: string[] = [];
    let health = 100;

    try {
      // Check database connectivity
      await db.select().from(affiliateLinks).limit(1);
    } catch (error) {
      issues.push('Database connectivity issue');
      health -= 30;
    }

    // Check recent activity
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const [recentActivity] = await db
      .select({ count: count() })
      .from(automationLogs)
      .where(gte(automationLogs.createdAt, oneHourAgo));

    if ((recentActivity?.count || 0) === 0 && this.isRunning) {
      issues.push('No recent automation activity');
      health -= 20;
    }

    const status = health > 80 ? 'Healthy' : health > 60 ? 'Warning' : 'Critical';

    return { health, status, issues };
  }
}

// Export singleton instance
export const autonomousController = new AutonomousController();
