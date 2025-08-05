/**
 * Advanced Wellness Analytics Engine
 * Provides comprehensive insights for user wellness journey and platform performance
 */

import { db } from '../db';
import { 
  users, 
  dailyLogs, 
  userChallenges, 
  challenges,
  wellnessPlans,
  wellnessAssessments,
  fitnessData,
  coachingSessions,
  blogPosts,
  products,
  revenueTracking
} from '@shared/schema';
import { eq, gte, lte, and, count, avg, sum, desc, sql } from 'drizzle-orm';

export interface UserWellnessInsights {
  userId: string;
  overallScore: number;
  trends: {
    mood: { current: number; trend: 'up' | 'down' | 'stable'; change: number };
    energy: { current: number; trend: 'up' | 'down' | 'stable'; change: number };
    sleep: { current: number; trend: 'up' | 'down' | 'stable'; change: number };
    exercise: { frequency: number; trend: 'up' | 'down' | 'stable' };
  };
  achievements: {
    challengesCompleted: number;
    streakDays: number;
    totalLoggingDays: number;
    improvementAreas: string[];
  };
  recommendations: string[];
  nextMilestones: string[];
}

export interface PlatformAnalytics {
  userEngagement: {
    activeUsers: number;
    retentionRate: number;
    averageSessionTime: number;
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
  };
  contentPerformance: {
    topBlogPosts: Array<{ id: number; title: string; views: number; engagement: number }>;
    topProducts: Array<{ id: number; name: string; clicks: number; conversions: number }>;
    contentCategories: Array<{ category: string; performance: number }>;
  };
  wellnessMetrics: {
    averageWellnessScore: number;
    moodDistribution: Record<number, number>;
    energyTrends: Array<{ date: string; average: number }>;
    challengeCompletionRate: number;
    mostPopularChallenges: Array<{ id: number; title: string; participants: number }>;
  };
  revenueInsights: {
    totalRevenue: number;
    monthlyRecurringRevenue: number;
    conversionRate: number;
    topPerformingProducts: Array<{ id: number; name: string; revenue: number }>;
    revenueByCategory: Record<string, number>;
  };
}

export class WellnessAnalytics {
  
  /**
   * Generate comprehensive wellness insights for a specific user
   */
  async getUserWellnessInsights(userId: string, timeframe: number = 30): Promise<UserWellnessInsights> {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - timeframe * 24 * 60 * 60 * 1000);

    // Get user's daily logs for analysis
    const logs = await db
      .select()
      .from(dailyLogs)
      .where(and(
        eq(dailyLogs.userId, userId),
        gte(dailyLogs.date, startDate)
      ))
      .orderBy(desc(dailyLogs.date));

    // Get user's completed challenges
    const completedChallenges = await db
      .select()
      .from(userChallenges)
      .where(and(
        eq(userChallenges.userId, userId),
        eq(userChallenges.isCompleted, true)
      ));

    // Calculate trends and insights
    const moodTrend = this.calculateTrend(logs.map(l => l.mood || 0));
    const energyTrend = this.calculateTrend(logs.map(l => l.energy || 0));
    const sleepTrend = this.calculateTrend(logs.map(l => l.sleep || 0));
    
    const exerciseFreq = logs.filter(l => l.exercise).length / logs.length;
    const meditationFreq = logs.filter(l => l.meditation).length / logs.length;

    // Calculate overall wellness score (1-100)
    const overallScore = this.calculateWellnessScore({
      mood: moodTrend.current,
      energy: energyTrend.current,
      sleep: sleepTrend.current,
      exerciseFreq,
      meditationFreq,
      challengesCompleted: completedChallenges.length
    });

    // Generate personalized recommendations
    const recommendations = this.generateRecommendations({
      moodTrend,
      energyTrend,
      sleepTrend,
      exerciseFreq,
      meditationFreq,
      overallScore
    });

    return {
      userId,
      overallScore,
      trends: {
        mood: moodTrend,
        energy: energyTrend,
        sleep: sleepTrend,
        exercise: { 
          frequency: exerciseFreq, 
          trend: exerciseFreq > 0.7 ? 'up' : exerciseFreq > 0.3 ? 'stable' : 'down' 
        }
      },
      achievements: {
        challengesCompleted: completedChallenges.length,
        streakDays: this.calculateStreak(logs),
        totalLoggingDays: logs.length,
        improvementAreas: this.identifyImprovementAreas(moodTrend, energyTrend, sleepTrend, exerciseFreq)
      },
      recommendations,
      nextMilestones: this.generateMilestones(overallScore, completedChallenges.length)
    };
  }

  /**
   * Generate platform-wide analytics dashboard
   */
  async getPlatformAnalytics(timeframe: number = 30): Promise<PlatformAnalytics> {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - timeframe * 24 * 60 * 60 * 1000);

    // User engagement metrics
    const totalUsers = await db.select({ count: count() }).from(users);
    const activeUsers = await db
      .select({ count: count() })
      .from(dailyLogs)
      .where(gte(dailyLogs.date, startDate));

    // Content performance
    const topBlogPosts = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true))
      .orderBy(desc(blogPosts.createdAt))
      .limit(10);

    const topProducts = await db
      .select()
      .from(products)
      .orderBy(desc(products.rating))
      .limit(10);

    // Wellness metrics
    const moodData = await db
      .select({
        avgMood: avg(dailyLogs.mood),
        avgEnergy: avg(dailyLogs.energy),
        avgSleep: avg(dailyLogs.sleep)
      })
      .from(dailyLogs)
      .where(gte(dailyLogs.date, startDate));

    const challengeStats = await db
      .select({
        challenge: challenges,
        participantCount: count(userChallenges.id)
      })
      .from(challenges)
      .leftJoin(userChallenges, eq(challenges.id, userChallenges.challengeId))
      .groupBy(challenges.id)
      .orderBy(desc(count(userChallenges.id)))
      .limit(5);

    // Revenue insights
    const revenueData = await db
      .select({
        total: sum(revenueTracking.amount)
      })
      .from(revenueTracking)
      .where(gte(revenueTracking.createdAt, startDate));

    return {
      userEngagement: {
        activeUsers: activeUsers[0]?.count || 0,
        retentionRate: this.calculateRetentionRate(totalUsers[0]?.count || 0, activeUsers[0]?.count || 0),
        averageSessionTime: 0, // Placeholder - implement session tracking
        dailyActiveUsers: activeUsers[0]?.count || 0,
        weeklyActiveUsers: activeUsers[0]?.count || 0,
        monthlyActiveUsers: activeUsers[0]?.count || 0
      },
      contentPerformance: {
        topBlogPosts: topBlogPosts.map(post => ({
          id: post.id,
          title: post.title,
          views: 0, // Placeholder - implement view tracking
          engagement: 0
        })),
        topProducts: topProducts.map(product => ({
          id: product.id,
          name: product.name,
          clicks: 0, // Placeholder - implement click tracking
          conversions: 0
        })),
        contentCategories: []
      },
      wellnessMetrics: {
        averageWellnessScore: this.calculatePlatformWellnessScore(moodData[0]),
        moodDistribution: {}, // Implement mood distribution calculation
        energyTrends: [], // Implement energy trends
        challengeCompletionRate: this.calculateChallengeCompletionRate(),
        mostPopularChallenges: challengeStats.map(stat => ({
          id: stat.challenge.id,
          title: stat.challenge.title,
          participants: stat.participantCount
        }))
      },
      revenueInsights: {
        totalRevenue: parseFloat(revenueData[0]?.total?.toString() || '0'),
        monthlyRecurringRevenue: 0, // Implement MRR calculation
        conversionRate: 0, // Implement conversion tracking
        topPerformingProducts: [],
        revenueByCategory: {}
      }
    };
  }

  /**
   * Calculate trend analysis for a metric
   */
  private calculateTrend(values: number[]): { current: number; trend: 'up' | 'down' | 'stable'; change: number } {
    if (values.length < 2) {
      return { current: values[0] || 0, trend: 'stable', change: 0 };
    }

    const recent = values.slice(0, Math.min(7, values.length));
    const older = values.slice(7, Math.min(14, values.length));

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.length ? older.reduce((a, b) => a + b, 0) / older.length : recentAvg;

    const change = recentAvg - olderAvg;
    const trend = Math.abs(change) < 0.1 ? 'stable' : change > 0 ? 'up' : 'down';

    return {
      current: recentAvg,
      trend,
      change: Math.round(change * 100) / 100
    };
  }

  /**
   * Calculate overall wellness score
   */
  private calculateWellnessScore(data: {
    mood: number;
    energy: number;
    sleep: number;
    exerciseFreq: number;
    meditationFreq: number;
    challengesCompleted: number;
  }): number {
    const moodScore = (data.mood / 5) * 25; // 25% weight
    const energyScore = (data.energy / 5) * 20; // 20% weight
    const sleepScore = Math.min(data.sleep / 8, 1) * 20; // 20% weight (8 hours optimal)
    const exerciseScore = data.exerciseFreq * 15; // 15% weight
    const meditationScore = data.meditationFreq * 10; // 10% weight
    const challengeScore = Math.min(data.challengesCompleted / 5, 1) * 10; // 10% weight

    return Math.round(moodScore + energyScore + sleepScore + exerciseScore + meditationScore + challengeScore);
  }

  /**
   * Generate personalized recommendations
   */
  private generateRecommendations(data: any): string[] {
    const recommendations: string[] = [];

    if (data.moodTrend.trend === 'down') {
      recommendations.push('Consider practicing mindfulness or reaching out to a friend for support');
    }
    if (data.energyTrend.trend === 'down') {
      recommendations.push('Focus on consistent sleep schedule and light morning exercise');
    }
    if (data.sleepTrend.current < 7) {
      recommendations.push('Aim for 7-9 hours of sleep nightly for optimal wellness');
    }
    if (data.exerciseFreq < 0.3) {
      recommendations.push('Try incorporating 15-20 minutes of daily movement or exercise');
    }
    if (data.overallScore > 80) {
      recommendations.push('Great progress! Consider mentoring others or taking on advanced challenges');
    }

    return recommendations.slice(0, 3); // Limit to top 3 recommendations
  }

  /**
   * Calculate consecutive logging streak
   */
  private calculateStreak(logs: any[]): number {
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const log of logs) {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);

      if (logDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Identify areas for improvement
   */
  private identifyImprovementAreas(moodTrend: any, energyTrend: any, sleepTrend: any, exerciseFreq: number): string[] {
    const areas: string[] = [];

    if (moodTrend.current < 3.5) areas.push('Mood Management');
    if (energyTrend.current < 3.5) areas.push('Energy Levels');
    if (sleepTrend.current < 7) areas.push('Sleep Quality');
    if (exerciseFreq < 0.5) areas.push('Physical Activity');

    return areas;
  }

  /**
   * Generate next milestones
   */
  private generateMilestones(score: number, challengesCompleted: number): string[] {
    const milestones: string[] = [];

    if (score < 50) {
      milestones.push('Reach 50% wellness score');
    } else if (score < 75) {
      milestones.push('Achieve 75% wellness score');
    } else {
      milestones.push('Maintain excellent wellness above 80%');
    }

    if (challengesCompleted < 3) {
      milestones.push('Complete your first 3 wellness challenges');
    } else if (challengesCompleted < 10) {
      milestones.push('Complete 10 wellness challenges');
    }

    milestones.push('Maintain a 30-day logging streak');

    return milestones.slice(0, 3);
  }

  /**
   * Calculate retention rate
   */
  private calculateRetentionRate(totalUsers: number, activeUsers: number): number {
    if (totalUsers === 0) return 0;
    return Math.round((activeUsers / totalUsers) * 100);
  }

  /**
   * Calculate platform wellness score
   */
  private calculatePlatformWellnessScore(data: any): number {
    if (!data || !data.avgMood) return 0;
    
    const moodScore = (parseFloat(data.avgMood) / 5) * 40;
    const energyScore = (parseFloat(data.avgEnergy || 0) / 5) * 35;
    const sleepScore = Math.min(parseFloat(data.avgSleep || 0) / 8, 1) * 25;
    
    return Math.round(moodScore + energyScore + sleepScore);
  }

  /**
   * Calculate challenge completion rate
   */
  private async calculateChallengeCompletionRate(): Promise<number> {
    const totalChallenges = await db.select({ count: count() }).from(userChallenges);
    const completedChallenges = await db
      .select({ count: count() })
      .from(userChallenges)
      .where(eq(userChallenges.isCompleted, true));

    const total = totalChallenges[0]?.count || 0;
    const completed = completedChallenges[0]?.count || 0;

    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }
}

export const wellnessAnalytics = new WellnessAnalytics();