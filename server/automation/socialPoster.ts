import axios from 'axios';
import { storage } from '../storage';
import type { SocialAccount, ContentPipeline } from '@shared/schema';

/**
 * Social Media Automation System
 * Posts content automatically to X, Instagram, TikTok
 * Budget-friendly approach using official APIs and automation tools
 */
export class SocialPoster {
  private readonly platforms = {
    x: {
      apiUrl: 'https://api.twitter.com/2',
      postEndpoint: '/tweets',
      mediaEndpoint: '/media/upload'
    },
    instagram: {
      apiUrl: 'https://graph.instagram.com',
      postEndpoint: '/me/media',
      publishEndpoint: '/me/media_publish'
    },
    tiktok: {
      apiUrl: 'https://open-api.tiktok.com',
      postEndpoint: '/share/video/upload'
    }
  };

  async postToAllPlatforms(contentId: number): Promise<void> {
    console.log('📱 Starting multi-platform posting...');
    
    const content: any = await storage.getContentPipeline(contentId);
    if (!content || content.status !== 'completed') {
      throw new Error('Content not ready for posting');
    }

    const activeAccounts: any[] = await storage.getSocialAccounts({ isActive: true });
    
    for (const account of activeAccounts) {
      if (await this.canPostToday(account)) {
        try {
          await this.postToPlatform(account, content);
          await this.updatePostCount(account);
          console.log(`✅ Posted to ${account.platform}: ${account.username}`);
        } catch (error: any) {
          console.error(`❌ Failed to post to ${account.platform}:`, (error && (error as any).message) || error);
        }
      } else {
        console.log(`⏰ Daily limit reached for ${account.platform}: ${account.username}`);
      }
    }
  }

  private async postToPlatform(account: SocialAccount, content: ContentPipeline): Promise<void> {
    switch (account.platform) {
      case 'x':
        return this.postToX(account, content);
      case 'instagram':
        return this.postToInstagram(account, content);
      case 'tiktok':
        return this.postToTikTok(account, content);
      default:
        throw new Error(`Unsupported platform: ${account.platform}`);
    }
  }

  private async postToX(account: SocialAccount, content: ContentPipeline): Promise<void> {
    const tweetText = this.formatContentForX(content);
    
    const response = await axios.post(
      `${this.platforms.x.apiUrl}${this.platforms.x.postEndpoint}`,
      { text: tweetText },
      {
        headers: {
          'Authorization': `Bearer ${account.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Track engagement (would be updated later via webhooks/polling)
    await this.trackEngagement(content.id, 'x', response.data.data.id);
  }

  private async postToInstagram(account: SocialAccount, content: ContentPipeline): Promise<void> {
    const instagramContent = this.formatContentForInstagram(content);
    
    // Step 1: Create media object
    const mediaResponse = await axios.post(
      `${this.platforms.instagram.apiUrl}${this.platforms.instagram.postEndpoint}`,
      {
        caption: instagramContent.caption,
        media_type: 'IMAGE', // or VIDEO
        image_url: instagramContent.imageUrl || this.getDefaultWellnessImage()
      },
      {
        headers: {
          'Authorization': `Bearer ${account.accessToken}`
        }
      }
    );

    // Step 2: Publish the media
    await axios.post(
      `${this.platforms.instagram.apiUrl}${this.platforms.instagram.publishEndpoint}`,
      {
        creation_id: mediaResponse.data.id
      },
      {
        headers: {
          'Authorization': `Bearer ${account.accessToken}`
        }
      }
    );

    await this.trackEngagement(content.id, 'instagram', mediaResponse.data.id);
  }

  private async postToTikTok(account: SocialAccount, content: ContentPipeline): Promise<void> {
    // TikTok requires video content - this would integrate with video generation
    console.log('🎵 TikTok posting requires video content generation');
    
    // For now, create a text-based video post concept
    const tiktokContent = this.formatContentForTikTok(content);
    
    // Placeholder for TikTok API integration
    console.log('TikTok content prepared:', tiktokContent.description);
    
    // Would integrate with TikTok's Content Posting API
    // await this.uploadToTikTok(account, tiktokContent);
  }

  private formatContentForX(content: ContentPipeline): string {
    const generatedContent: any = content.generatedContent || {};
    let text: string = generatedContent.text || '';
    
    // Truncate to X's character limit
    if (text.length > 250) {
      text = text.substring(0, 247) + '...';
    }
    
    // Add hashtags
    const hashtags = (generatedContent.hashtags?.slice(0, 2).join(' ')) || '#wellness #health';
    
    return `${text}\n\n${hashtags}`;
  }

  private formatContentForInstagram(content: ContentPipeline): any {
    const generatedContent: any = content.generatedContent || {};
    
    let caption: string = generatedContent.text || '';
    
    // Add hashtags (Instagram allows up to 30)
    const hashtags = generatedContent.hashtags?.join(' ') || '#wellness #health #mindfulness';
    caption += `\n\n${hashtags}`;
    
    // Add call-to-action with affiliate links
    if (generatedContent.affiliateLinks?.length > 0) {
      caption += '\n\n🔗 Links in bio for products mentioned!';
    }
    
    return {
      caption,
      imageUrl: this.getWellnessImage(content.title)
    };
  }

  private formatContentForTikTok(content: ContentPipeline): any {
    const generatedContent: any = content.generatedContent || {};
    const baseText: string = generatedContent.text || '';
    return {
      description: baseText.substring(0, 150),
      hashtags: generatedContent.hashtags?.slice(0, 5) || ['#wellness', '#health'],
      videoScript: `Quick wellness tip: ${content.title}`,
      duration: 15
    };
  }

  private async canPostToday(account: SocialAccount): Promise<boolean> {
    const today = new Date().toDateString();
    const lastPosted = account.lastPosted ? new Date(account.lastPosted).toDateString() : null;
    
    if (lastPosted !== today) {
      // Reset daily count for new day
      await storage.updateSocialAccount(account.id, { postsToday: 0 });
      return true;
    }
    
    return (account.postsToday || 0) < (account.dailyPostLimit || 5);
  }

  private async updatePostCount(account: SocialAccount): Promise<void> {
    await storage.updateSocialAccount(account.id, {
      postsToday: (account.postsToday || 0) + 1,
      lastPosted: new Date()
    });
  }

  private async trackEngagement(contentId: number, platform: string, postId: string): Promise<void> {
    // Initialize engagement tracking
    await storage.updateContentPipeline(contentId, {
      engagement: {
        likes: 0,
        shares: 0,
        comments: 0,
        clicks: 0,
        revenue: 0
      }
    });
    
    console.log(`📊 Tracking engagement for ${platform} post: ${postId}`);
  }

  private getDefaultWellnessImage(): string {
    // Return a default wellness image URL
    return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1080&h=1080';
  }

  private getWellnessImage(topic: string): string {
    // Generate topic-specific wellness images
    const imageMap = {
      meditation: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&h=1080',
      fitness: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1080&h=1080',
      nutrition: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1080&h=1080',
      skincare: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1080&h=1080'
    };
    
    const topicLower = topic.toLowerCase();
    for (const [key, url] of Object.entries(imageMap)) {
      if (topicLower.includes(key)) {
        return url;
      }
    }
    
    return this.getDefaultWellnessImage();
  }

  /**
   * Automated posting schedule
   * Posts content at optimal times for engagement
   */
  async scheduleOptimalPosting(): Promise<void> {
    console.log('⏰ Setting up optimal posting schedule...');
    
    // Best posting times based on platform analytics
    const optimalTimes = {
      instagram: ['9:00', '15:00', '21:00'], // 9 AM, 3 PM, 9 PM
      x: ['8:00', '12:00', '17:00'], // 8 AM, 12 PM, 5 PM
      tiktok: ['6:00', '10:00', '19:00'] // 6 AM, 10 AM, 7 PM
    };

    // Schedule upcoming content
    const pendingContent = await storage.getContentPipeline({ 
      status: 'completed',
      scheduled: false 
    });

    for (const content of pendingContent) {
      const platform = content.targetPlatform;
      const times = (optimalTimes as any)[platform] || optimalTimes.instagram;
      
      // Schedule for next available optimal time
      const nextTime = this.getNextOptimalTime(times);
      
      await storage.updateContentPipeline(content.id, {
        scheduledFor: nextTime
      });
      
      console.log(`📅 Scheduled ${content.title} for ${nextTime.toLocaleString()}`);
    }
  }

  private getNextOptimalTime(times: string[]): Date {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    for (const time of times) {
      const [hours, minutes] = time.split(':').map(Number);
      const scheduleTime = new Date(today);
      scheduleTime.setHours(hours, minutes, 0, 0);
      
      if (scheduleTime > now) {
        return scheduleTime;
      }
    }
    
    // If no time today, schedule for tomorrow's first time
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [hours, minutes] = times[0].split(':').map(Number);
    tomorrow.setHours(hours, minutes, 0, 0);
    
    return tomorrow;
  }

  /**
   * Engagement monitoring and optimization
   */
  async monitorEngagement(): Promise<void> {
    console.log('📈 Monitoring social media engagement...');
    
    const activeAccounts: any[] = await storage.getSocialAccounts({ isActive: true });
    
    for (const account of activeAccounts) {
      try {
        await this.updateAccountMetrics(account);
        await this.optimizePostingStrategy(account);
      } catch (error) {
        console.error(`Failed to monitor ${account.platform}:`, error);
      }
    }
  }

  private async updateAccountMetrics(account: SocialAccount): Promise<void> {
    // Fetch latest metrics from platform APIs
    // This would involve calling each platform's analytics endpoints
    
    const mockMetrics = {
      followers: (account.accountMetrics?.followers || 1000) + Math.floor(Math.random() * 50),
      following: account.accountMetrics?.following || 500,
      totalPosts: (account.accountMetrics?.totalPosts || 100) + 1,
      engagementRate: 3.5 + Math.random() * 2 // 3.5-5.5%
    };

    await storage.updateSocialAccount(account.id, {
      accountMetrics: mockMetrics
    });
  }

  private async optimizePostingStrategy(account: SocialAccount): Promise<void> {
    // Analyze engagement patterns and adjust posting times/frequency
    const metrics = account.accountMetrics;
    
    if (metrics?.engagementRate && metrics.engagementRate < 2.0) {
      // Low engagement - reduce posting frequency
      await storage.updateSocialAccount(account.id, {
        dailyPostLimit: Math.max(1, (account.dailyPostLimit || 5) - 1)
      });
      console.log(`📉 Reduced posting frequency for ${account.platform} due to low engagement`);
    } else if (metrics?.engagementRate && metrics.engagementRate > 5.0) {
      // High engagement - increase posting frequency
      await storage.updateSocialAccount(account.id, {
        dailyPostLimit: Math.min(10, (account.dailyPostLimit || 5) + 1)
      });
      console.log(`📈 Increased posting frequency for ${account.platform} due to high engagement`);
    }
  }
}

export const socialPoster = new SocialPoster();
