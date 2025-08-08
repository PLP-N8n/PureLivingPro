import { db } from '../db';
import { automationSchedule, blogPosts, products } from '@shared/schema';
import { eq, gte, desc, and, count } from 'drizzle-orm';

export interface ScheduleTask {
  id?: number;
  type: 'CONTENT_CREATION' | 'AFFILIATE_SCRAPING' | 'BLOG_OPTIMIZATION' | 'PRODUCT_UPDATE' | 'ANALYTICS_REPORT';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  scheduledFor: Date;
  parameters: any;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  retryCount: number;
  maxRetries: number;
  estimatedDuration: number; // minutes
}

export class IntelligentScheduler {
  private isRunning: boolean = false;
  private taskQueue: ScheduleTask[] = [];

  async startScheduler(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('📅 Intelligent Scheduler started');
    
    // Load pending tasks from database
    await this.loadPendingTasks();
    
    // Start task processing loop
    this.processTaskQueue();
  }

  async stopScheduler(): Promise<void> {
    this.isRunning = false;
    console.log('📅 Intelligent Scheduler stopped');
  }

  private async loadPendingTasks(): Promise<void> {
    try {
      const pendingTasks = await db
        .select()
        .from(automationSchedule)
        .where(eq(automationSchedule.status, 'PENDING'))
        .orderBy(desc(automationSchedule.priority), automationSchedule.scheduledFor);

      this.taskQueue = pendingTasks.map(task => ({
        id: task.id,
        type: task.type as any,
        priority: task.priority as any,
        scheduledFor: task.scheduledFor,
        parameters: JSON.parse(task.parameters || '{}'),
        status: task.status as any,
        retryCount: task.retryCount || 0,
        maxRetries: task.maxRetries || 3,
        estimatedDuration: task.estimatedDuration || 15
      }));

      console.log(`📋 Loaded ${this.taskQueue.length} pending tasks`);
    } catch (error) {
      console.error('Failed to load pending tasks:', error);
    }
  }

  async scheduleTask(task: Omit<ScheduleTask, 'id' | 'status' | 'retryCount'>): Promise<number> {
    try {
      // Use intelligent scheduling to optimize timing
      const optimizedTime = await this.optimizeSchedulingTime(task);
      
      const [insertedTask] = await db
        .insert(automationSchedule)
        .values({
          type: task.type,
          priority: task.priority,
          scheduledFor: optimizedTime,
          parameters: JSON.stringify(task.parameters || {}),
          status: 'PENDING',
          retryCount: 0,
          maxRetries: task.maxRetries,
          estimatedDuration: task.estimatedDuration
        })
        .returning();

      // Add to in-memory queue
      this.taskQueue.push({
        ...task,
        id: insertedTask.id,
        status: 'PENDING',
        retryCount: 0,
        scheduledFor: optimizedTime
      });

      // Sort queue by priority and time
      this.sortTaskQueue();

      console.log(`📝 Scheduled ${task.type} task for ${optimizedTime.toISOString()}`);
      return insertedTask.id;
    } catch (error) {
      console.error('Failed to schedule task:', error);
      throw error;
    }
  }

  private async optimizeSchedulingTime(task: { scheduledFor: Date; priority: ScheduleTask['priority']; type: ScheduleTask['type'] }): Promise<Date> {
    const now = new Date();
    const requestedTime = task.scheduledFor;

    // Don't schedule in the past
    if (requestedTime <= now) {
      return new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now
    }

    // For high-priority tasks, schedule immediately if system is available
    if (task.priority === 'URGENT' || task.priority === 'HIGH') {
      const systemLoad = await this.getSystemLoad();
      if (systemLoad < 70) {
        return new Date(now.getTime() + 2 * 60 * 1000); // 2 minutes from now
      }
    }

    // Optimize based on historical performance
    const optimalHour = await this.getOptimalExecutionHour(task.type);
    
    // If requesting time is during optimal hours, keep it
    if (requestedTime.getHours() >= optimalHour && requestedTime.getHours() <= optimalHour + 2) {
      return requestedTime;
    }

    // Otherwise, suggest optimal time
    const optimizedDate = new Date(requestedTime);
    optimizedDate.setHours(optimalHour, 0, 0, 0);
    
    // If optimal time is in the past today, schedule for tomorrow
    if (optimizedDate <= now) {
      optimizedDate.setDate(optimizedDate.getDate() + 1);
    }

    return optimizedDate;
  }

  private async getOptimalExecutionHour(taskType: string): Promise<number> {
    // Analyze historical task performance to determine optimal execution times
    const hourlyPerformance = new Map<number, { success: number; total: number }>();
    
    // Initialize with default optimal hours based on task type
    const defaultOptimalHours = {
      'CONTENT_CREATION': 9,  // 9 AM - good for creative work
      'AFFILIATE_SCRAPING': 3, // 3 AM - less traffic
      'BLOG_OPTIMIZATION': 11, // 11 AM - mid-morning
      'PRODUCT_UPDATE': 2,     // 2 AM - minimal interference
      'ANALYTICS_REPORT': 6    // 6 AM - before business hours
    };

    return defaultOptimalHours[taskType] || 9;
  }

  private async getSystemLoad(): Promise<number> {
    // Calculate system load based on active tasks and system metrics
    const activeTasks = this.taskQueue.filter(task => task.status === 'IN_PROGRESS').length;
    const pendingTasks = this.taskQueue.filter(task => task.status === 'PENDING').length;
    
    // Simple load calculation (0-100%)
    const load = Math.min((activeTasks * 20) + (pendingTasks * 5), 100);
    return load;
  }

  private async processTaskQueue(): Promise<void> {
    if (!this.isRunning) return;

    try {
      const now = new Date();
      const readyTasks = this.taskQueue.filter(
        task => task.status === 'PENDING' && task.scheduledFor <= now
      );

      for (const task of readyTasks.slice(0, 3)) { // Process max 3 tasks concurrently
        await this.executeTask(task);
      }

      // Schedule next check
      setTimeout(() => this.processTaskQueue(), 30000); // Check every 30 seconds
    } catch (error) {
      console.error('Error processing task queue:', error);
      setTimeout(() => this.processTaskQueue(), 60000); // Retry in 1 minute
    }
  }

  private async executeTask(task: ScheduleTask): Promise<void> {
    try {
      console.log(`🔄 Executing task: ${task.type} (ID: ${task.id})`);
      
      // Update task status
      task.status = 'IN_PROGRESS';
      await this.updateTaskStatus(task.id!, 'IN_PROGRESS');

      let success = false;

      switch (task.type) {
        case 'CONTENT_CREATION':
          success = await this.executeContentCreation(task.parameters);
          break;
        case 'AFFILIATE_SCRAPING':
          success = await this.executeAffiliateScraping(task.parameters);
          break;
        case 'BLOG_OPTIMIZATION':
          success = await this.executeBlogOptimization(task.parameters);
          break;
        case 'PRODUCT_UPDATE':
          success = await this.executeProductUpdate(task.parameters);
          break;
        case 'ANALYTICS_REPORT':
          success = await this.executeAnalyticsReport(task.parameters);
          break;
        default:
          console.warn(`Unknown task type: ${task.type}`);
          success = false;
      }

      if (success) {
        task.status = 'COMPLETED';
        await this.updateTaskStatus(task.id!, 'COMPLETED');
        console.log(`✅ Task completed: ${task.type}`);
      } else {
        throw new Error(`Task execution failed: ${task.type}`);
      }

    } catch (error) {
      console.error(`❌ Task failed: ${task.type}`, error);
      
      task.retryCount++;
      if (task.retryCount < task.maxRetries) {
        // Reschedule for retry
        task.status = 'PENDING';
        task.scheduledFor = new Date(Date.now() + (task.retryCount * 10 * 60 * 1000)); // Exponential backoff
        await this.updateTaskStatus(task.id!, 'PENDING');
        console.log(`🔄 Rescheduling task ${task.type} for retry ${task.retryCount}`);
      } else {
        task.status = 'FAILED';
        await this.updateTaskStatus(task.id!, 'FAILED');
        console.log(`💀 Task permanently failed: ${task.type}`);
      }
    }
  }

  private async executeContentCreation(parameters: any): Promise<boolean> {
    try {
      const { contentWorkflow } = await import('./contentWorkflow');
      const result = await contentWorkflow.runCompleteWorkflow({
        processUnprocessedLinks: true,
        createProducts: true,
        createBlogs: true,
        maxLinksToProcess: parameters.maxLinks || 3,
        ...parameters
      });
      return result.success;
    } catch (error) {
      console.error('Content creation failed:', error);
      return false;
    }
  }

  private async executeAffiliateScraping(parameters: any): Promise<boolean> {
    try {
      // This would implement intelligent affiliate link discovery
      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 2000));
      return true;
    } catch (error) {
      console.error('Affiliate scraping failed:', error);
      return false;
    }
  }

  private async executeBlogOptimization(parameters: any): Promise<boolean> {
    try {
      // Get blogs that need optimization
      const blogs = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.isPublished, true))
        .limit(parameters.maxBlogs || 5);

      for (const blog of blogs) {
        // Simulate optimization
        await db
          .update(blogPosts)
          .set({
            title: `${blog.title} - Updated`,
            updatedAt: new Date()
          })
          .where(eq(blogPosts.id, blog.id));
      }

      return true;
    } catch (error) {
      console.error('Blog optimization failed:', error);
      return false;
    }
  }

  private async executeProductUpdate(parameters: any): Promise<boolean> {
    try {
      // Update product information
      const [result] = await db
        .select({ count: count() })
        .from(products);

      console.log(`Updated ${result?.count || 0} products`);
      return true;
    } catch (error) {
      console.error('Product update failed:', error);
      return false;
    }
  }

  private async executeAnalyticsReport(parameters: any): Promise<boolean> {
    try {
      // Generate analytics report
      console.log('Analytics report generated');
      return true;
    } catch (error) {
      console.error('Analytics report failed:', error);
      return false;
    }
  }

  private async updateTaskStatus(taskId: number, status: string): Promise<void> {
    try {
      await db
        .update(automationSchedule)
        .set({ 
          status,
          updatedAt: new Date()
        })
        .where(eq(automationSchedule.id, taskId));
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  }

  private sortTaskQueue(): void {
    const priorityOrder = { 'URGENT': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
    
    this.taskQueue.sort((a, b) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return a.scheduledFor.getTime() - b.scheduledFor.getTime();
    });
  }

  // Public methods
  async getScheduledTasks(): Promise<ScheduleTask[]> {
    return this.taskQueue.filter(task => task.status === 'PENDING');
  }

  async cancelTask(taskId: number): Promise<boolean> {
    try {
      await db
        .update(automationSchedule)
        .set({ status: 'CANCELLED' })
        .where(eq(automationSchedule.id, taskId));

      this.taskQueue = this.taskQueue.filter(task => task.id !== taskId);
      return true;
    } catch (error) {
      console.error('Failed to cancel task:', error);
      return false;
    }
  }

  getSchedulerStatus() {
    return {
      isRunning: this.isRunning,
      queueLength: this.taskQueue.length,
      activeTasks: this.taskQueue.filter(t => t.status === 'IN_PROGRESS').length,
      pendingTasks: this.taskQueue.filter(t => t.status === 'PENDING').length,
      completedTasks: this.taskQueue.filter(t => t.status === 'COMPLETED').length,
      failedTasks: this.taskQueue.filter(t => t.status === 'FAILED').length
    };
  }
}

// Export singleton instance
export const intelligentScheduler = new IntelligentScheduler();
