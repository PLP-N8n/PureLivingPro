import { storage } from '../storage';
import { generateWellnessBlogPostDeepSeek } from '../deepseek';
import { generateWellnessBlogPost } from '../openai';
import type { InsertContentPipeline, InsertBlogPost } from '@shared/schema';

/**
 * AI Content Creation Pipeline
 * Creates wellness content using multiple AI providers
 * Automatically inserts affiliate links and optimizes for engagement
 */
export class ContentCreator {
  private readonly aiProviders = {
    deepseek: generateWellnessBlogPostDeepSeek,
    openai: generateWellnessBlogPost,
    // openrouter: this.generateWithOpenRouter.bind(this),
    // elevenlabs: this.generateAudioContent.bind(this),
    // veo3: this.generateVideoContent.bind(this)
  };

  async createContentFromPipeline(pipelineId: number): Promise<void> {
    const pipeline = await storage.getContentPipeline(pipelineId);
    if (!pipeline) throw new Error('Pipeline not found');

    console.log(`🎯 Creating content: ${pipeline.title}`);

    try {
      await storage.updateContentPipeline(pipelineId, { status: 'generating' });

      let generatedContent;
      
      switch (pipeline.contentType) {
        case 'blog':
          generatedContent = await this.createBlogContent(pipeline);
          break;
        case 'social':
          generatedContent = await this.createSocialContent(pipeline);
          break;
        case 'video':
          generatedContent = await this.createVideoContent(pipeline);
          break;
        case 'audio':
          generatedContent = await this.createAudioContent(pipeline);
          break;
        default:
          throw new Error(`Unsupported content type: ${pipeline.contentType}`);
      }

      // Insert affiliate links automatically
      const enhancedContent = await this.insertAffiliateLinks(generatedContent, pipeline);

      await storage.updateContentPipeline(pipelineId, {
        status: 'completed',
        generatedContent: enhancedContent
      });

      // Auto-publish if scheduled
      if (pipeline.scheduledFor && new Date(pipeline.scheduledFor) <= new Date()) {
        await this.publishContent(pipeline, enhancedContent);
      }

      console.log(`✅ Content created successfully: ${pipeline.title}`);
    } catch (error) {
      console.error(`❌ Content creation failed:`, error);
      await storage.updateContentPipeline(pipelineId, { status: 'failed' });
    }
  }

  private async createBlogContent(pipeline: any): Promise<any> {
    const aiProvider = (this.aiProviders as any)[pipeline.aiProvider] || this.aiProviders.deepseek;
    
    // Extract category from pipeline or prompt
    const category = this.extractCategoryFromPrompt(pipeline.prompt);
    
    const content = await aiProvider(
      pipeline.title,
      category,
      {
        tone: 'professional',
        length: 'detailed',
        includeActionables: true,
        seoOptimized: true
      }
    );

    return {
      text: content.content,
      title: content.title || pipeline.title,
      excerpt: content.excerpt,
      category: category,
      tags: content.tags || [],
      seoKeywords: content.seoKeywords || []
    };
  }

  private async createSocialContent(pipeline: any): Promise<any> {
    const platforms = {
      instagram: { maxLength: 2200, hashtags: 30 },
      x: { maxLength: 280, hashtags: 2 },
      tiktok: { maxLength: 150, hashtags: 5 }
    };

    const platform = (pipeline.targetPlatform || 'instagram') as keyof typeof platforms;
    const limits = platforms[platform];

    // Use DeepSeek for cost-effective social content
    const prompt = `Create a ${platform} post about ${pipeline.title}. 
    Make it engaging, wellness-focused, and include relevant hashtags.
    Max length: ${limits.maxLength} characters.
    Target audience: Health-conscious individuals aged 25-45.`;

    const content = await (generateWellnessBlogPostDeepSeek as any)(
      pipeline.title,
      'social-media',
      { tone: 'engaging', length: 'short', platform }
    );

    // Generate hashtags
    const hashtags = this.generateHashtags(pipeline.title, platform as string, limits.hashtags);

    return {
      text: content.content,
      hashtags,
      platform,
      estimatedReach: this.calculateEstimatedReach(platform, hashtags.length)
    };
  }

  private async createVideoContent(pipeline: any): Promise<any> {
    // Placeholder for video content creation
    // Would integrate with services like Veo3, RunwayML, or similar
    console.log('📹 Video content creation - implementing with budget-friendly solutions');
    
    return {
      script: `Video script for: ${pipeline.title}`,
      duration: '60 seconds',
      style: 'wellness-focused',
      callToAction: 'Visit our blog for more wellness tips'
    };
  }

  private async createAudioContent(pipeline: any): Promise<any> {
    // Placeholder for audio content creation
    // Would integrate with ElevenLabs or similar TTS services
    console.log('🎵 Audio content creation - implementing with TTS solutions');
    
    return {
      script: `Audio script for: ${pipeline.title}`,
      voice: 'calm-female',
      duration: '5 minutes',
      format: 'meditation-guide'
    };
  }

  private async insertAffiliateLinks(content: any, pipeline: any): Promise<any> {
    console.log('🔗 Inserting affiliate links...');
    
    // Get relevant affiliate links based on content category
    const category = content.category || 'general';
    const affiliateLinks = await storage.getAffiliateLinks({
      category,
      status: 'approved',
      limit: 3
    }) as any[];

    if (affiliateLinks.length === 0) {
      console.log('No affiliate links found for category:', category);
      return content;
    }

    // Insert links strategically into content
    const enhancedContent = { ...content };
    
    if (content.text) {
      enhancedContent.text = this.insertLinksIntoText(
        content.text,
        affiliateLinks
      );
    }

    // Track which affiliate links were used
    enhancedContent.affiliateLinks = affiliateLinks.map(link => link.id);

    return enhancedContent;
  }

  private insertLinksIntoText(text: string, affiliateLinks: any[]): string {
    let enhancedText = text;
    
    // Strategic placement: middle and end of content
    const insertionPoints = [
      Math.floor(text.length * 0.4),
      Math.floor(text.length * 0.8)
    ];

    affiliateLinks.slice(0, 2).forEach((link, index) => {
      if (insertionPoints[index]) {
        const cta = this.generateCTA(link);
        const insertionPoint = insertionPoints[index];
        
        enhancedText = 
          enhancedText.slice(0, insertionPoint) + 
          `\n\n${cta}\n\n` + 
          enhancedText.slice(insertionPoint);
      }
    });

    return enhancedText;
  }

  private generateCTA(affiliateLink: any): string {
    const ctas = [
      `💡 **Recommended**: Try the [${affiliateLink.productName}](${affiliateLink.url}) for enhanced wellness results.`,
      `🌿 **Editor's Pick**: Check out this [${affiliateLink.productName}](${affiliateLink.url}) - our top recommendation.`,
      `✨ **Special Offer**: Don't miss this [${affiliateLink.productName}](${affiliateLink.url}) that our community loves.`
    ];
    
    return ctas[Math.floor(Math.random() * ctas.length)];
  }

  private generateHashtags(title: string, platform: string, maxCount: number): string[] {
    const baseHashtags = ['wellness', 'health', 'mindfulness', 'selfcare'];
    const titleWords = title.toLowerCase().split(' ')
      .filter(word => word.length > 3)
      .map(word => word.replace(/[^a-z]/g, ''));

    const combinedHashtags = [...baseHashtags, ...titleWords]
      .slice(0, maxCount)
      .map(tag => `#${tag}`);

    return combinedHashtags;
  }

  private calculateEstimatedReach(platform: string, hashtagCount: number): number {
    const baseReach = {
      instagram: 500,
      x: 200,
      tiktok: 1000
    };

    return Math.floor((baseReach as any)[platform] * (1 + hashtagCount * 0.1));
  }

  private extractCategoryFromPrompt(prompt: string): string {
    const categories = ['fitness', 'nutrition', 'meditation', 'skincare', 'supplements'];
    const promptLower = prompt.toLowerCase();
    
    for (const category of categories) {
      if (promptLower.includes(category)) {
        return category;
      }
    }
    
    return 'wellness';
  }

  private async publishContent(pipeline: any, content: any): Promise<void> {
    console.log(`📤 Publishing content to ${pipeline.targetPlatform}...`);
    
    if (pipeline.contentType === 'blog') {
      // Create blog post
      const blogPost: InsertBlogPost = {
        title: content.title,
        slug: this.generateSlug(content.title),
        content: content.text,
        excerpt: content.excerpt,
        category: content.category,
        tags: content.tags,
        isPublished: true,
        authorId: '1' // System author
      };
      
      await storage.createBlogPost(blogPost);
    } else if (pipeline.contentType === 'social') {
      // Would integrate with social media APIs here
      console.log('Publishing to social media...');
    }

    await storage.updateContentPipeline(pipeline.id, {
      status: 'published',
      publishedAt: new Date()
    });
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Batch content creation for efficiency
   */
  async createBatchContent(topics: string[], contentType: string = 'blog'): Promise<void> {
    console.log(`🔄 Creating batch content for ${topics.length} topics...`);
    
    for (const topic of topics) {
      try {
        const pipeline: InsertContentPipeline = {
          title: topic,
          contentType,
          targetPlatform: contentType === 'blog' ? 'blog' : 'instagram',
          aiProvider: 'deepseek', // Cost-effective choice
          prompt: `Create engaging wellness content about ${topic}`,
          scheduledFor: new Date()
        };

        const savedPipeline = await storage.createContentPipeline(pipeline);
        await this.createContentFromPipeline(savedPipeline.id);
        
        // Rate limiting to avoid overwhelming AI APIs
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to create content for topic: ${topic}`, error);
      }
    }
  }
}

export const contentCreator = new ContentCreator();
