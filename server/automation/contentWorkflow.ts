import { storage } from '../storage';
import { generateWellnessBlogPostDeepSeek, generateProductDescriptionDeepSeek } from '../deepseek';
import { db } from '../db';
import { products, blogPosts, affiliateLinks } from '@shared/schema';
import { eq, isNull } from 'drizzle-orm';

export interface AutomationWorkflowResult {
  productsCreated: number;
  blogsCreated: number;
  errors: string[];
  success: boolean;
}

export class ContentWorkflowAutomation {
  
  /**
   * Main automation workflow: Affiliate Links → Products → Blog Content
   */
  async runCompleteWorkflow(options: {
    processUnprocessedLinks?: boolean;
    createProducts?: boolean;
    createBlogs?: boolean;
    maxLinksToProcess?: number;
  } = {}): Promise<AutomationWorkflowResult> {
    
    const {
      processUnprocessedLinks = true,
      createProducts = true,
      createBlogs = true,
      maxLinksToProcess = 10
    } = options;

    const result: AutomationWorkflowResult = {
      productsCreated: 0,
      blogsCreated: 0,
      errors: [],
      success: false
    };

    try {
      console.log('🚀 Starting Content Workflow Automation...');

      // Step 1: Get unprocessed affiliate links
      if (processUnprocessedLinks) {
        const unprocessedLinks = await this.getUnprocessedAffiliateLinks(maxLinksToProcess);
        console.log(`📋 Found ${unprocessedLinks.length} unprocessed affiliate links`);

        // Step 2: Create products from affiliate links
        if (createProducts) {
          for (const link of unprocessedLinks) {
            try {
              await this.createProductFromAffiliateLink(link);
              result.productsCreated++;
              console.log(`✅ Created product: ${link.productName}`);
            } catch (error: any) {
              result.errors.push(`Failed to create product for ${link.productName}: ${error.message}`);
              console.error(`❌ Product creation failed:`, error);
            }
          }
        }
      }

      // Step 3: Generate blog content based on product categories
      if (createBlogs) {
        const productCategories = await this.getProductCategoriesForBlogCreation();
        console.log(`📝 Creating blogs for ${productCategories.length} categories`);

        for (const category of productCategories) {
          try {
            await this.createBlogContentForCategory(category as { name: string; count: number });
            result.blogsCreated++;
            console.log(`✅ Created blog for category: ${category.name}`);
          } catch (error: any) {
            result.errors.push(`Failed to create blog for category ${category.name}: ${error.message}`);
            console.error(`❌ Blog creation failed:`, error);
          }
        }
      }

      result.success = result.errors.length === 0;
      console.log(`🎉 Workflow completed: ${result.productsCreated} products, ${result.blogsCreated} blogs created`);
      
      return result;

    } catch (error: any) {
      result.errors.push(`Workflow failed: ${error.message}`);
      console.error('❌ Content workflow automation failed:', error);
      return result;
    }
  }

  /**
   * Get affiliate links that haven't been converted to products yet
   */
  private async getUnprocessedAffiliateLinks(limit: number = 10) {
    console.log('🔍 Searching for unprocessed affiliate links...');
    
    const links = await db
      .select({
        id: affiliateLinks.id,
        url: affiliateLinks.url,
        merchant: affiliateLinks.merchant,
        productName: affiliateLinks.productName,
        category: affiliateLinks.category,
        commission: affiliateLinks.commission,
        description: affiliateLinks.description,
        imageUrl: affiliateLinks.imageUrl,
        status: affiliateLinks.status,
        isActive: affiliateLinks.isActive,
        createdAt: affiliateLinks.createdAt,
        updatedAt: affiliateLinks.updatedAt
      })
      .from(affiliateLinks)
      .leftJoin(products, eq(affiliateLinks.id, products.affiliateLinkId))
      .where(isNull(products.affiliateLinkId))
      .limit(limit);

    console.log(`🔍 Found ${links.length} unprocessed links`);
    links.forEach(link => console.log(`   - ${link.id}: ${link.productName}`));
    
    return links;
  }

  /**
   * Create a product listing from affiliate link data
   */
  private async createProductFromAffiliateLink(link: any) {
    try {
      // Generate enhanced product description using AI
      const enhancedDescription = await (generateProductDescriptionDeepSeek as any)(
        link.productName,
        link.category,
        link.description || '',
        link.price || '',
        ['wellness', 'health', 'natural', 'organic']
      );

      // Extract price from string (remove currency symbols)
      const priceValue = this.extractPrice(link.price);

      // Create product record
      const [newProduct] = await db
        .insert(products)
        .values({
          name: link.productName,
          description: enhancedDescription,
          category: this.categorizeProduct(link.category),
          price: priceValue,
          imageUrl: link.imageUrl && link.imageUrl !== 'Not provided in content' ? link.imageUrl : null,
          affiliateLink: link.url,
          rating: this.estimateRating(link.commission, link.merchant),
          isRecommended: link.commission > 5, // Mark high-commission items as recommended
          affiliateLinkId: link.id,
          autoGenerated: true
        })
        .returning();

      console.log(`✅ Created product: ${newProduct.name} in category: ${newProduct.category}`);
      return newProduct;

    } catch (error: any) {
      console.error(`❌ Failed to create product from affiliate link:`, error);
      throw error;
    }
  }

  /**
   * Get product categories that need blog content
   */
  private async getProductCategoriesForBlogCreation() {
    const categories = await db
      .selectDistinct({ 
        name: products.category,
        count: products.id
      })
      .from(products)
      .where(eq(products.autoGenerated, true));

    return categories.map(cat => ({
      name: cat.name,
      count: 1 // Simplified for now
    })).filter(cat => cat.name);
  }

  /**
   * Create blog content focused on a product category
   */
  private async createBlogContentForCategory(category: { name: string; count: number }) {
    try {
      // Get products in this category
      const categoryProducts = await db
        .select()
        .from(products)
        .where(eq(products.category, category.name))
        .limit(5);

      if (categoryProducts.length === 0) return;

      // Generate blog title and content
      const blogTitle = this.generateBlogTitle(category.name, categoryProducts);
      const slug = this.generateSlug(blogTitle);

      // Check if blog already exists for this category
      const existingBlog = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, slug))
        .limit(1);

      if (existingBlog.length > 0) {
        console.log(`📝 Blog already exists for category: ${category.name}`);
        return;
      }

      // Generate comprehensive blog content
      const productNames = categoryProducts.map(p => p.name).join(', ');
      const categoryKeywords = this.getCategoryKeywords(category.name);
      
      const blogContentAny: any = await (generateWellnessBlogPostDeepSeek as any)(
        blogTitle,
        category.name,
        [
          `Product recommendations including: ${productNames}`,
          `Wellness benefits of ${categoryKeywords}`,
          `How to choose the right ${category.name.toLowerCase()} products`,
          `Expert tips and recommendations`
        ].join('\n'),
        categoryKeywords
      );

      // Create blog post
      const [newBlog] = await db
        .insert(blogPosts)
        .values({
          title: blogTitle,
          slug,
          excerpt: `Discover the best ${category.name.toLowerCase()} products and wellness tips from our expert recommendations.`,
          content: blogContentAny?.content ?? blogContentAny,
          category: category.name,
          tags: [category.name.toLowerCase(), 'product-review', 'wellness', 'recommendations'],
          isPremium: false,
          isPublished: true,
          readTime: Math.ceil(((typeof blogContentAny === 'string' ? blogContentAny.length : (blogContentAny?.content?.length || 0)) as number) / 1000),
          authorId: 'system' // System-generated content
        })
        .returning();

      console.log(`✅ Created blog: ${newBlog.title}`);
      return newBlog;

    } catch (error: any) {
      console.error(`❌ Failed to create blog for category:`, error);
      throw error;
    }
  }

  /**
   * Utility functions
   */
  private extractPrice(priceString: string): string {
    if (!priceString) return '0';
    
    // Extract numeric value from price string (e.g., "£7.99" -> "7.99")
    const match = priceString.match(/[\d.]+/);
    return match ? match[0] : '0';
  }

  private categorizeProduct(originalCategory: string): string {
    if (!originalCategory) return 'general';

    const categoryMap: Record<string, string> = {
      'supplements': 'nutrition',
      'vitamins': 'nutrition', 
      'protein': 'nutrition',
      'omega': 'nutrition',
      'fitness': 'fitness',
      'exercise': 'fitness',
      'meditation': 'mindfulness',
      'mindfulness': 'mindfulness',
      'sleep': 'wellness',
      'skincare': 'beauty',
      'essential oils': 'aromatherapy',
      'chia': 'nutrition',
      'superfoods': 'nutrition'
    };

    const lower = originalCategory.toLowerCase();
    for (const [key, value] of Object.entries(categoryMap)) {
      if (lower.includes(key)) {
        return value;
      }
    }

    return 'wellness';
  }

  private estimateRating(commission: number, merchant: string): string {
    // Higher commission and known merchants get better ratings
    let rating = 4.0;
    
    if (commission > 7) rating += 0.5;
    if (commission > 10) rating += 0.3;
    if (merchant.toLowerCase().includes('amazon')) rating += 0.2;
    
    return Math.min(rating, 5.0).toFixed(1);
  }

  private generateBlogTitle(category: string, products: any[]): string {
    const titles = [
      `The Ultimate Guide to ${category} Products for Wellness`,
      `Top ${category} Recommendations for a Healthier Lifestyle`,
      `Best ${category} Products: Expert Reviews and Recommendations`,
      `Transform Your Wellness Journey with These ${category} Essentials`,
      `${category} Products That Will Revolutionize Your Health Routine`
    ];

    return titles[Math.floor(Math.random() * titles.length)];
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private getCategoryKeywords(category: string): string[] {
    const keywordMap: Record<string, string[]> = {
      nutrition: ['supplements', 'vitamins', 'healthy eating', 'nutrients', 'wellness'],
      fitness: ['exercise', 'workout', 'training', 'fitness equipment', 'health'],
      mindfulness: ['meditation', 'mindfulness', 'mental health', 'stress relief', 'peace'],
      wellness: ['health', 'wellness', 'lifestyle', 'natural', 'holistic'],
      beauty: ['skincare', 'natural beauty', 'self-care', 'radiant skin'],
      aromatherapy: ['essential oils', 'aromatherapy', 'natural scents', 'relaxation']
    };

    return keywordMap[category.toLowerCase()] || ['wellness', 'health', 'lifestyle'];
  }
}

// Export singleton instance
export const contentWorkflow = new ContentWorkflowAutomation();
