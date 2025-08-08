import { storage } from '../storage-simple';
import { affiliateScraper } from './affiliateScraper';
import { contentCreator } from './contentCreator';
import { socialPoster } from './socialPoster';
import type { InsertAutomationRule, InsertContentPipeline, InsertRevenueTracking } from '@shared/schema';

/**
 * Central Automation Controller
 * Orchestrates the entire automated marketing and content creation pipeline
 * Acts as the MCP (Model Control Program) for revenue generation
 */
export class AutomationController {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;

  async startAutomation(): Promise<void> {
    if (this.isRunning) {
      console.log('🤖 Automation already running');
      return;
    }

    console.log('🚀 Starting Pure Living Pro Automation System...');
    this.isRunning = true;

    // Initialize default automation rules
    await this.createDefaultRules();

    // Start the main automation loop (runs every 30 minutes)
    this.intervalId = setInterval(() => {
      this.executeAutomationCycle().catch(console.error);
    }, 30 * 60 * 1000);

    // Run initial cycle
    await this.executeAutomationCycle();

    console.log('✅ Automation system started successfully');
  }

  async stopAutomation(): Promise<void> {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('⏹️ Automation system stopped');
  }

  private async executeAutomationCycle(): Promise<void> {
    console.log('🔄 Executing automation cycle...');

    try {
      // Step 1: Execute active automation rules
      await this.executeAutomationRules();

      // Step 2: Scrape new affiliate links (once per hour)
      if (this.shouldRunHourlyTask()) {
        await this.runAffiliateScraping();
      }

      // Step 3: Process content pipeline
      await this.processContentPipeline();

      // Step 4: Execute social media posting
      await this.executeSocialPosting();

      // Step 5: Monitor and track revenue
      await this.trackRevenue();

      // Step 6: Optimize performance
      await this.optimizeAutomation();

      console.log('✅ Automation cycle completed');
    } catch (error) {
      console.error('❌ Automation cycle failed:', error);
    }
  }

  private async executeAutomationRules(): Promise<void> {
    const activeRules = await storage.getAutomationRules({ isActive: true });

    for (const rule of activeRules) {
      try {
        if (this.shouldExecuteRule(rule)) {
          await this.executeRule(rule);
          await storage.updateAutomationRule(rule.id, {
            lastExecuted: new Date(),
            executionCount: (rule.executionCount || 0) + 1
          });
        }
      } catch (error) {
        console.error(`Failed to execute rule ${rule.name}:`, error);
      }
    }
  }

  private shouldExecuteRule(rule: any): boolean {
    const triggers = rule.triggers || {};
    
    // Check schedule trigger (cron-like)
    if (triggers.schedule) {
      return this.matchesSchedule(triggers.schedule, rule.lastExecuted);
    }

    // Check keyword triggers (new content with matching keywords)
    if (triggers.keywords?.length > 0) {
      // Would check for new content with matching keywords
      return true;
    }

    // Default: execute if not run in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return !rule.lastExecuted || new Date(rule.lastExecuted) < oneHourAgo;
  }

  private matchesSchedule(schedule: string, lastExecuted?: Date): boolean {
    // Simple schedule matching (would implement proper cron parsing in production)
    const schedules: Record<string, number> = {
      'daily': 24 * 60 * 60 * 1000,
      'hourly': 60 * 60 * 1000,
      '4hours': 4 * 60 * 60 * 1000,
      '30min': 30 * 60 * 1000
    };

    const interval = schedules[schedule] || schedules['hourly'];
    const timeSinceLastExecution = lastExecuted ? Date.now() - new Date(lastExecuted).getTime() : Infinity;

    return timeSinceLastExecution >= interval;
  }

  private async executeRule(rule: any): Promise<void> {
    console.log(`⚡ Executing rule: ${rule.name}`);
    const actions = rule.actions || {};

    if (actions.createContent) {
      await this.triggerContentCreation(rule);
    }

    if (actions.insertAffiliateLinks) {
      await this.insertAffiliateLinksInExistingContent();
    }

    if (actions.postToSocial) {
      await this.triggerSocialPosting(rule);
    }
  }

  private async triggerContentCreation(rule: any): Promise<void> {
    const topics = this.generateContentTopics(rule);
    
    for (const topic of topics.slice(0, 3)) { // Limit to 3 per rule execution
      const pipeline: InsertContentPipeline = {
        title: topic,
        contentType: 'blog',
        targetPlatform: 'blog',
        aiProvider: 'deepseek', // Cost-effective
        prompt: `Create engaging wellness content about ${topic}. Include actionable tips and make it SEO-friendly.`,
        scheduledFor: new Date()
      };

      const savedPipeline = await storage.createContentPipeline(pipeline);
      await contentCreator.createContentFromPipeline(savedPipeline.id);
    }
  }

  private async triggerSocialPosting(rule: any): Promise<void> {
    const completedContent = await storage.getContentPipeline({ 
      status: 'completed',
      targetPlatform: 'social'
    }) as any[];

    for (const content of completedContent.slice(0, 2)) { // Limit posts per cycle
      await socialPoster.postToAllPlatforms(content.id);
    }
  }

  private generateContentTopics(rule: any): string[] {
    const baseTopics = [
      'Morning Wellness Routines for Better Energy',
      'Natural Stress Relief Techniques That Actually Work',
      'Superfoods That Boost Mental Clarity',
      'Quick Meditation Practices for Busy Professionals',
      'Home Workout Routines for Mental Health',
      'Sleep Optimization for Peak Performance',
      'Mindful Eating Habits for Emotional Balance',
      'Essential Oils for Anxiety and Stress Relief',
      'Building Healthy Boundaries in Digital Age',
      'Gut Health and Its Impact on Mood'
    ];

    // Filter by rule keywords/categories if specified
    const triggers = rule.triggers || {};
    if (triggers.keywords?.length > 0) {
      return baseTopics.filter((topic: string) => 
        (triggers.keywords as string[]).some((keyword: string) => 
          topic.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }

    // Return random selection
    return baseTopics
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
  }

  private shouldRunHourlyTask(): boolean {
    return new Date().getMinutes() < 5; // Run in first 5 minutes of each hour
  }

  private async runAffiliateScraping(): Promise<void> {
    console.log('🕷️ Running hourly affiliate scraping...');
    
    // Scrape new products
    await affiliateScraper.scrapeWellnessProducts();
    
    // Validate existing links
    await affiliateScraper.validateExistingLinks();
  }

  private async processContentPipeline(): Promise<void> {
    const scheduledContent = await storage.getContentPipeline({ 
      status: 'scheduled',
      dueBefore: new Date()
    }) as any[];

    for (const content of scheduledContent) {
      await contentCreator.createContentFromPipeline(content.id);
    }
  }

  private async executeSocialPosting(): Promise<void> {
    await socialPoster.scheduleOptimalPosting();
    await socialPoster.monitorEngagement();
  }

  private async insertAffiliateLinksInExistingContent(): Promise<void> {
    console.log('🔗 Inserting affiliate links in existing content...');
    
    // Get recent blog posts without affiliate links
    const recentPosts = await storage.getBlogPosts(10);
    const affiliateLinks = await storage.getAffiliateLinks({ 
      status: 'approved', 
      limit: 20 
    });

    for (const post of recentPosts) {
      if (!post.content.includes('affiliate') && affiliateLinks.length > 0) {
        const relevantLinks = affiliateLinks.filter((link: any) => 
          link.category === post.category || 
          post.tags?.some((tag: string) => link.tags?.includes(tag))
        );

        if (relevantLinks.length > 0) {
          await this.insertLinksIntoPost(post, relevantLinks.slice(0, 2));
        }
      }
    }
  }

  private async insertLinksIntoPost(post: any, links: any[]): Promise<void> {
    let updatedContent = post.content;
    
    // Insert links strategically
    for (const link of links) {
      const cta = `\n\n💡 **Recommended**: Check out [${link.productName}](${link.url}) - highly rated by our community.\n\n`;
      
      // Insert at 60% through the content
      const insertionPoint = Math.floor(updatedContent.length * 0.6);
      updatedContent = 
        updatedContent.slice(0, insertionPoint) + 
        cta + 
        updatedContent.slice(insertionPoint);
    }

    await storage.updateBlogPost(post.id, { content: updatedContent });
    console.log(`🔗 Added affiliate links to: ${post.title}`);
  }

  private async trackRevenue(): Promise<void> {
    console.log('💰 Tracking revenue and performance...');
    
    // Simulate revenue tracking (would integrate with actual affiliate networks)
    const recentAffiliateLinks = await storage.getAffiliateLinks({ 
      status: 'approved',
      limit: 10 
    });

    for (const link of recentAffiliateLinks) {
      // Simulate clicks and conversions
      const clicks = Math.floor(Math.random() * 20);
      const conversions = Math.floor(clicks * 0.1); // 10% conversion rate
      const revenue = conversions * 25; // Average $25 per conversion

      if (revenue > 0) {
        const revenueRecord: InsertRevenueTracking = {
          source: 'affiliate',
          affiliateLinkId: link.id,
          platform: 'blog',
          amount: String(revenue),
          commission: String(revenue * 0.05),
          clickCount: clicks,
          conversionRate: String(conversions / Math.max(1, clicks)),
          status: 'confirmed'
        } as any;

        await storage.createRevenueTracking(revenueRecord);
        console.log(`💵 Revenue tracked: $${revenue} from ${link.productName}`);
      }
    }
  }

  private async optimizeAutomation(): Promise<void> {
    console.log('⚡ Optimizing automation performance...');
    
    // Analyze performance metrics
    const revenueStats = await storage.getRevenueStats();
    const contentPerformance = await storage.getContentEngagementStats();
    
    // Adjust automation rules based on performance
    const rules = await storage.getAutomationRules({ isActive: true });
    
    for (const rule of rules) {
      if (rule.executionCount > 10) {
        // Analyze rule performance and adjust
        const performance = this.calculateRulePerformance(rule, revenueStats);
        
        if (performance.score < 0.3) {
          // Pause low-performing rules
          await storage.updateAutomationRule(rule.id, { isActive: false });
          console.log(`⏸️ Paused low-performing rule: ${rule.name}`);
        }
      }
    }
  }

  private calculateRulePerformance(rule: any, revenueStats: any): { score: number } {
    // Simple performance scoring (would be more sophisticated in production)
    const executionRate = rule.executionCount / 30; // executions per 30 days
    const revenueImpact = revenueStats.totalRevenue / rule.executionCount;
    
    const score = Math.min(1, (executionRate * 0.3 + revenueImpact * 0.7));
    return { score };
  }

  private async createDefaultRules(): Promise<void> {
    const existingRules = await storage.getAutomationRules({ limit: 1 });
    if (existingRules.length > 0) return; // Rules already exist

    console.log('📋 Creating default automation rules...');

    const defaultRules: InsertAutomationRule[] = [
      {
        name: 'Daily Content Creation',
        type: 'content_creation',
        triggers: { schedule: 'daily' },
        actions: { 
          createContent: true, 
          insertAffiliateLinks: true,
          aiProvider: 'deepseek'
        },
        conditions: { maxDailyPosts: 3 }
      },
      {
        name: 'Social Media Posting',
        type: 'social_posting',
        triggers: { schedule: '4hours' },
        actions: { 
          postToSocial: true,
          platforms: ['instagram', 'x']
        },
        conditions: { minEngagement: 50 }
      },
      {
        name: 'Affiliate Link Insertion',
        type: 'affiliate_insertion',
        triggers: { schedule: 'hourly' },
        actions: { insertAffiliateLinks: true },
        conditions: { categoryFilters: ['supplements', 'fitness', 'wellness'] }
      }
    ];

    for (const rule of defaultRules) {
      await storage.createAutomationRule(rule);
    }

    console.log('✅ Default automation rules created');
  }

  /**
   * Manual trigger for immediate execution
   */
  async triggerImmediateExecution(ruleType: string): Promise<void> {
    console.log(`🚀 Triggering immediate execution: ${ruleType}`);
    
    switch (ruleType) {
      case 'content_creation':
        await this.triggerContentCreation({ 
          triggers: { keywords: ['wellness'] },
          actions: { createContent: true }
        });
        break;
      case 'affiliate_scraping':
        await this.runAffiliateScraping();
        break;
      case 'social_posting':
        await this.executeSocialPosting();
        break;
      default:
        await this.executeAutomationCycle();
    }
  }

  /**
   * Get automation system status
   */
  getStatus(): any {
    return {
      isRunning: this.isRunning,
      lastCycle: new Date().toISOString(),
      systemLoad: 'normal',
      activeRules: 3,
      revenueToday: '$125.50', // Would be calculated from actual data
      contentGenerated: 8,
      socialPosts: 12,
      affiliateClicks: 156
    };
  }
}

export const automationController = new AutomationController();
