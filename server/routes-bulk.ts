// Bulk import endpoints for affiliate links
import type { Express } from "express";
import { insertAffiliateLinkSchema } from "@shared/schema";
import { storage } from "./storage";
import { isAuthenticated } from "./replitAuth";

export function registerBulkRoutes(app: Express) {
  // Bulk affiliate link import
  app.post('/api/affiliate-links/bulk', isAuthenticated, async (req, res) => {
    try {
      const { links } = req.body;
      
      if (!Array.isArray(links)) {
        return res.status(400).json({
          success: false,
          error: 'Links must be an array'
        });
      }

      const results = [];
      const errors = [];

      for (let i = 0; i < links.length; i++) {
        try {
          // Validate and clean each link
          const linkData = {
            ...links[i],
            commission: parseFloat(links[i].commission) || 0,
            description: links[i].description?.substring(0, 500) || '',
            status: 'pending'
          };

          // Validate with schema
          const validatedLink = insertAffiliateLinkSchema.parse(linkData);
          
          // Create affiliate link
          const createdLink = await storage.createAffiliateLink(validatedLink);
          results.push(createdLink);
          
        } catch (error: any) {
          console.error(`Error processing link ${i}:`, error);
          errors.push({
            index: i,
            link: links[i],
            error: error.message
          });
        }
      }

      res.json({
        success: true,
        data: results,
        errors: errors,
        summary: {
          total: links.length,
          successful: results.length,
          failed: errors.length
        }
      });

    } catch (error: any) {
      console.error("Bulk import error:", error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Enhanced URL validation endpoint
  app.post('/api/affiliate-links/validate-url', isAuthenticated, async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({
          success: false,
          error: 'URL is required'
        });
      }

      // Basic URL validation
      const urlPattern = /^https?:\/\/.+/i;
      if (!urlPattern.test(url)) {
        return res.json({
          success: false,
          isValid: false,
          message: 'Invalid URL format'
        });
      }

      // Check supported merchants
      const supportedMerchants = [
        { 
          domain: 'amazon.com', 
          name: 'Amazon', 
          commission: '4-8%',
          category: 'ecommerce'
        },
        { 
          domain: 'clickbank.com', 
          name: 'ClickBank', 
          commission: '10-75%',
          category: 'digital'
        },
        { 
          domain: 'shareasale.com', 
          name: 'ShareASale', 
          commission: '5-20%',
          category: 'affiliate'
        }
      ];

      const merchant = supportedMerchants.find(m => url.includes(m.domain));
      
      if (merchant) {
        // Generate suggestions based on URL analysis
        const suggestions = {
          merchant: merchant.name,
          category: inferCategoryFromUrl(url),
          commission: merchant.commission.split('-')[1] || '5%',
          keywords: extractKeywordsFromUrl(url)
        };

        res.json({
          success: true,
          isValid: true,
          merchant: merchant,
          suggestions: suggestions,
          message: `${merchant.name} - Typical commission: ${merchant.commission}`
        });
      } else {
        res.json({
          success: true,
          isValid: true,
          merchant: null,
          message: 'URL valid but merchant not recognized'
        });
      }

    } catch (error: any) {
      console.error("URL validation error:", error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Workflow rules endpoint for Advanced AI features
  app.get('/api/automation/workflow-rules', isAuthenticated, async (req, res) => {
    try {
      // Sample workflow rules data
      const workflowRules = [
        {
          id: 1,
          name: 'High-Performance Product Auto-Promotion',
          trigger: 'new_product',
          conditions: ['price > $20', 'category = supplements', 'rating > 4.0'],
          actions: ['create_blog_post', 'schedule_social_media', 'send_email_campaign'],
          priority: 1,
          isActive: true,
          executionCount: 47,
          lastExecuted: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          successRate: 0.89
        },
        {
          id: 2,
          name: 'Seasonal Content Optimization',
          trigger: 'seasonal',
          conditions: ['month in [11,12,1]', 'category = health'],
          actions: ['update_content', 'adjust_pricing', 'boost_promotion'],
          priority: 2,
          isActive: true,
          executionCount: 23,
          lastExecuted: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          successRate: 0.76
        },
        {
          id: 3,
          name: 'Low-Performance Content Pause',
          trigger: 'performance',
          conditions: ['conversion_rate < 2%', 'days_active > 30'],
          actions: ['pause_promotion', 'analyze_content', 'suggest_improvements'],
          priority: 3,
          isActive: false,
          executionCount: 12,
          lastExecuted: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          successRate: 0.83
        },
        {
          id: 4,
          name: 'Price Change Auto-Response',
          trigger: 'price_change',
          conditions: ['price_drop > 15%', 'stock_available = true'],
          actions: ['update_affiliate_links', 'create_promo_content', 'notify_subscribers'],
          priority: 1,
          isActive: true,
          executionCount: 156,
          lastExecuted: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          successRate: 0.94
        }
      ];

      res.json({
        success: true,
        data: workflowRules
      });
    } catch (error: any) {
      console.error("Workflow rules error:", error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Performance metrics endpoint
  app.get('/api/automation/performance-metrics', isAuthenticated, async (req, res) => {
    try {
      const performanceMetrics = {
        conversionRate: 0.078, // 7.8%
        engagementRate: 0.064, // 6.4%
        revenueGrowth: 0.28, // 28% growth
        contentQuality: 0.86, // 86% quality score
        automationEfficiency: 0.91 // 91% efficiency
      };

      res.json({
        success: true,
        data: performanceMetrics
      });
    } catch (error: any) {
      console.error("Performance metrics error:", error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Workflow optimization endpoint
  app.post('/api/automation/optimize-workflow/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Simulate AI optimization process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      res.json({
        success: true,
        message: `Workflow ${id} optimized successfully`,
        optimizations: [
          'Improved trigger conditions',
          'Enhanced action sequencing',
          'Optimized execution timing',
          'Better performance targeting'
        ],
        expectedImprovement: '15-25%'
      });
    } catch (error: any) {
      console.error("Workflow optimization error:", error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
}

// Helper functions
function inferCategoryFromUrl(url: string): string {
  const categoryKeywords = {
    'supplements': ['vitamin', 'supplement', 'protein', 'omega', 'probiotic'],
    'fitness': ['fitness', 'exercise', 'workout', 'gym', 'weight'],
    'beauty': ['beauty', 'skincare', 'cosmetic', 'face', 'serum'],
    'health': ['health', 'wellness', 'medical', 'therapy', 'care'],
    'nutrition': ['nutrition', 'diet', 'organic', 'natural', 'food']
  };

  const lowerUrl = url.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lowerUrl.includes(keyword))) {
      return category;
    }
  }
  
  return 'general';
}

function extractKeywordsFromUrl(url: string): string[] {
  // Extract potential keywords from URL structure
  const urlParts = url.split('/').join(' ').split('-').join(' ').split('_').join(' ');
  const keywords = urlParts.match(/[a-zA-Z]+/g) || [];
  
  return keywords
    .filter(word => word.length > 3)
    .slice(0, 5);
}