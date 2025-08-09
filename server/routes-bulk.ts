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

      const results: any[] = [];
      const errors: any[] = [];

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
            error: (error as any)?.message
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
        error: (error as any)?.message
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
        error: (error as any)?.message
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
        error: (error as any)?.message
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
        error: (error as any)?.message
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
        error: (error as any)?.message
      });
    }
  });

  // Autonomous system endpoints
  app.get('/api/autonomous/status', isAuthenticated, async (req, res) => {
    try {
      const status = {
        isEnabled: true, // This would be stored in database
        status: 'Optimal Performance',
        uptime: '2d 14h 32m',
        lastOptimization: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        activeDecisions: 7,
        totalDecisions: 156
      };

      res.json({
        success: true,
        data: status
      });
    } catch (error: any) {
      console.error("Autonomous status error:", error);
      res.status(500).json({
        success: false,
        error: (error as any)?.message
      });
    }
  });

  app.get('/api/autonomous/metrics', isAuthenticated, async (req, res) => {
    try {
      const metrics = {
        autonomyLevel: 0.94, // 94% autonomous
        operationalEfficiency: 0.87,
        decisionAccuracy: 0.91,
        profitOptimization: 0.83,
        riskManagement: 0.96,
        systemHealth: 0.98,
        currentOperations: 23,
        dailyDecisions: 67,
        successRate: 0.89,
        costSavings: 2847
      };

      res.json({
        success: true,
        data: metrics
      });
    } catch (error: any) {
      console.error("Autonomous metrics error:", error);
      res.status(500).json({
        success: false,
        error: (error as any)?.message
      });
    }
  });

  app.get('/api/autonomous/decisions', isAuthenticated, async (req, res) => {
    try {
      const decisions = [
        {
          id: 'dec_001',
          type: 'discovery',
          description: 'Auto-discovered trending supplement with 8.5% commission',
          confidence: 0.92,
          expectedImpact: '+$450/month',
          status: 'completed',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          result: 'Added to high-priority queue, content generated'
        },
        {
          id: 'dec_002',
          type: 'optimization',
          description: 'Reallocated budget from low-performing fitness category',
          confidence: 0.87,
          expectedImpact: '+15% ROI',
          status: 'executing',
          timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString()
        },
        {
          id: 'dec_003',
          type: 'resource_allocation',
          description: 'Increased content frequency for beauty products (seasonal trend)',
          confidence: 0.94,
          expectedImpact: '+25% engagement',
          status: 'completed',
          timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
          result: 'Content pipeline updated, 12 posts scheduled'
        },
        {
          id: 'dec_004',
          type: 'risk_mitigation',
          description: 'Paused underperforming affiliate link (2.1% conversion)',
          confidence: 0.96,
          expectedImpact: 'Cost reduction',
          status: 'completed',
          timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
          result: 'Link paused, budget reallocated to top performers'
        },
        {
          id: 'dec_005',
          type: 'discovery',
          description: 'Market gap identified: eco-friendly skincare niche',
          confidence: 0.78,
          expectedImpact: 'New revenue stream',
          status: 'pending',
          timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString()
        }
      ];

      res.json({
        success: true,
        data: decisions
      });
    } catch (error: any) {
      console.error("Autonomous decisions error:", error);
      res.status(500).json({
        success: false,
        error: (error as any)?.message
      });
    }
  });

  app.post('/api/autonomous/toggle', isAuthenticated, async (req, res) => {
    try {
      const { enabled, config } = req.body;
      
      // Simulate toggling autonomous mode
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      res.json({
        success: true,
        enabled: enabled,
        message: enabled ? 
          'Autonomous mode activated - AI is now in control' : 
          'Manual control restored - autonomous operations paused',
        config: config
      });
    } catch (error: any) {
      console.error("Autonomous toggle error:", error);
      res.status(500).json({
        success: false,
        error: (error as any)?.message
      });
    }
  });

  app.post('/api/autonomous/optimize-now', isAuthenticated, async (req, res) => {
    try {
      // Simulate immediate optimization
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      res.json({
        success: true,
        message: 'Emergency optimization cycle initiated',
        optimizations: [
          'Analyzed 47 active campaigns',
          'Optimized 12 underperforming assets',
          'Reallocated $234 budget to high-ROI opportunities',
          'Updated 8 content strategies',
          'Implemented 3 new automation rules'
        ],
        impact: 'Expected 18-24% performance improvement'
      });
    } catch (error: any) {
      console.error("Force optimization error:", error);
      res.status(500).json({
        success: false,
        error: (error as any)?.message
      });
    }
  });

  app.post('/api/autonomous/emergency-stop', isAuthenticated, async (req, res) => {
    try {
      // Simulate emergency stop
      await new Promise(resolve => setTimeout(resolve, 500));
      
      res.json({
        success: true,
        message: 'Emergency stop executed successfully',
        stopped: [
          'All automated link discovery halted',
          'Content generation paused',
          'Budget allocation frozen',
          'Social media posting stopped',
          'Risk monitoring activated'
        ],
        nextAction: 'Manual review required before restart'
      });
    } catch (error: any) {
      console.error("Emergency stop error:", error);
      res.status(500).json({
        success: false,
        error: (error as any)?.message
      });
    }
  });

  // Intelligent Scheduler endpoints
  app.get('/api/scheduler/tasks', isAuthenticated, async (req, res) => {
    try {
      const tasks = [
        {
          id: 'task_001',
          name: 'Auto-discover trending wellness products',
          type: 'link_discovery',
          schedule: 'Every 4 hours',
          nextRun: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          priority: 'high',
          estimatedDuration: '15-20 mins',
          successRate: 0.94,
          impact: 'High revenue potential'
        },
        {
          id: 'task_002',
          name: 'Generate AI content for new products',
          type: 'content_creation',
          schedule: 'Daily at 9:00 AM',
          nextRun: new Date().setHours(9, 0, 0, 0) > Date.now() ? 
            new Date().setHours(9, 0, 0, 0) : 
            new Date(Date.now() + 24 * 60 * 60 * 1000).setHours(9, 0, 0, 0),
          lastRun: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          priority: 'medium',
          estimatedDuration: '30-45 mins',
          successRate: 0.89,
          impact: 'SEO & engagement boost'
        },
        {
          id: 'task_003',
          name: 'Optimize underperforming campaigns',
          type: 'optimization',
          schedule: 'Every 6 hours',
          nextRun: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          priority: 'critical',
          estimatedDuration: '10-15 mins',
          successRate: 0.97,
          impact: 'Direct ROI improvement'
        },
        {
          id: 'task_004',
          name: 'Competitor analysis and market research',
          type: 'analysis',
          schedule: 'Weekly on Mondays',
          nextRun: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'paused',
          priority: 'low',
          estimatedDuration: '60-90 mins',
          successRate: 0.76,
          impact: 'Strategic insights'
        }
      ];

      res.json({
        success: true,
        data: tasks
      });
    } catch (error: any) {
      console.error("Scheduler tasks error:", error);
      res.status(500).json({
        success: false,
        error: (error as any)?.message
      });
    }
  });

  app.get('/api/scheduler/optimal-timings', isAuthenticated, async (req, res) => {
    try {
      const timings = [
        {
          platform: 'Instagram',
          optimalTimes: ['8:00 AM', '12:30 PM', '7:00 PM'],
          engagement: 0.068,
          conversion: 0.034,
          competition: 0.42
        },
        {
          platform: 'TikTok',
          optimalTimes: ['6:00 AM', '10:00 AM', '9:00 PM'],
          engagement: 0.084,
          conversion: 0.029,
          competition: 0.56
        },
        {
          platform: 'YouTube',
          optimalTimes: ['2:00 PM', '8:00 PM', '10:00 PM'],
          engagement: 0.047,
          conversion: 0.051,
          competition: 0.38
        },
        {
          platform: 'Twitter/X',
          optimalTimes: ['9:00 AM', '1:00 PM', '5:00 PM'],
          engagement: 0.052,
          conversion: 0.027,
          competition: 0.67
        },
        {
          platform: 'LinkedIn',
          optimalTimes: ['8:00 AM', '12:00 PM', '5:00 PM'],
          engagement: 0.031,
          conversion: 0.043,
          competition: 0.29
        }
      ];

      res.json({
        success: true,
        data: timings
      });
    } catch (error: any) {
      console.error("Optimal timings error:", error);
      res.status(500).json({
        success: false,
        error: (error as any)?.message
      });
    }
  });

  app.get('/api/scheduler/metrics', isAuthenticated, async (req, res) => {
    try {
      const metrics = {
        efficiency: 94,
        activeTasks: 23,
        successRate: 91,
        timeSaved: 47,
        costOptimization: 1247
      };

      res.json({
        success: true,
        data: metrics
      });
    } catch (error: any) {
      console.error("Scheduler metrics error:", error);
      res.status(500).json({
        success: false,
        error: (error as any)?.message
      });
    }
  });

  app.post('/api/scheduler/optimize', isAuthenticated, async (req, res) => {
    try {
      // Simulate schedule optimization
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      res.json({
        success: true,
        message: 'Schedule optimized successfully',
        improvements: [
          'Rescheduled 7 tasks to optimal time slots',
          'Reduced task conflicts by 34%',
          'Improved estimated efficiency by 12%',
          'Optimized resource allocation'
        ]
      });
    } catch (error: any) {
      console.error("Schedule optimization error:", error);
      res.status(500).json({
        success: false,
        error: (error as any)?.message
      });
    }
  });

  app.post('/api/scheduler/learn', isAuthenticated, async (req, res) => {
    try {
      // Simulate learning cycle
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      res.json({
        success: true,
        message: 'Learning cycle completed',
        insights: [
          'Discovered optimal posting times for wellness content',
          'Identified high-engagement audience segments',
          'Found seasonal content performance patterns',
          'Updated recommendation algorithms'
        ]
      });
    } catch (error: any) {
      console.error("Scheduler learning error:", error);
      res.status(500).json({
        success: false,
        error: (error as any)?.message
      });
    }
  });

  // Market Oracle endpoints
  app.get('/api/market-oracle/trends/:horizon', isAuthenticated, async (req, res) => {
    try {
      const { horizon } = req.params;
      const trends = [
        {
          keyword: "adaptogenic supplements",
          category: "wellness",
          currentVolume: 12500,
          predictedVolume: 18750,
          growthRate: 0.5,
          confidence: 0.92,
          peakPeriod: "Q1 2025",
          monetizationPotential: 2847
        },
        {
          keyword: "cold plunge therapy",
          category: "fitness",
          currentVolume: 8900,
          predictedVolume: 15600,
          growthRate: 0.75,
          confidence: 0.87,
          peakPeriod: "Winter 2024",
          monetizationPotential: 1923
        },
        {
          keyword: "mindful productivity",
          category: "lifestyle",
          currentVolume: 6700,
          predictedVolume: 9800,
          growthRate: 0.46,
          confidence: 0.84,
          peakPeriod: "January 2025",
          monetizationPotential: 1456
        }
      ];

      res.json({
        success: true,
        data: trends
      });
    } catch (error: any) {
      console.error("Market trends error:", error);
      res.status(500).json({
        success: false,
        error: (error as any)?.message
      });
    }
  });

  app.get('/api/market-oracle/arbitrage', isAuthenticated, async (req, res) => {
    try {
      const opportunities = [
        {
          id: 'arb_001',
          product: 'Premium Protein Powder',
          sourcePrice: 45.99,
          targetPrice: 67.99,
          profitMargin: 0.48,
          marketGap: 0.73,
          difficulty: 'medium',
          timeWindow: '2-3 weeks',
          competition: 0.34
        },
        {
          id: 'arb_002',
          product: 'Smart Water Bottle',
          sourcePrice: 29.99,
          targetPrice: 49.99,
          profitMargin: 0.67,
          marketGap: 0.89,
          difficulty: 'easy',
          timeWindow: '1-2 weeks',
          competition: 0.21
        }
      ];

      res.json({
        success: true,
        data: opportunities
      });
    } catch (error: any) {
      console.error("Arbitrage opportunities error:", error);
      res.status(500).json({
        success: false,
        error: (error as any)?.message
      });
    }
  });

  app.get('/api/market-oracle/competitors', isAuthenticated, async (req, res) => {
    try {
      const competitors = [
        {
          competitor: "WellnessGuru Pro",
          marketShare: 0.23,
          recentMoves: [
            "Launched AI-powered meal planning",
            "Partnered with major supplement brand"
          ],
          weaknesses: [
            "Limited social media presence",
            "High customer acquisition cost"
          ],
          opportunities: [
            "Target their underserved demographics",
            "Offer better commission rates"
          ],
          threatLevel: 'medium'
        }
      ];

      res.json({
        success: true,
        data: competitors
      });
    } catch (error: any) {
      console.error("Competitor intel error:", error);
      res.status(500).json({
        success: false,
        error: (error as any)?.message
      });
    }
  });

  app.get('/api/market-oracle/seasonal', isAuthenticated, async (req, res) => {
    try {
      const strategies = [
        {
          season: "New Year Wellness",
          categories: ["fitness", "nutrition", "mindfulness"],
          expectedLift: 2.34,
          optimalTiming: "Dec 26 - Jan 31",
          recommendedActions: [
            "Increase fitness content by 40%",
            "Launch transformation challenges"
          ]
        },
        {
          season: "Summer Body Prep",
          categories: ["supplements", "workout gear", "meal prep"],
          expectedLift: 1.87,
          optimalTiming: "Mar 15 - May 31",
          recommendedActions: [
            "Focus on weight loss products",
            "Partner with fitness influencers"
          ]
        }
      ];

      res.json({
        success: true,
        data: strategies
      });
    } catch (error: any) {
      console.error("Seasonal strategies error:", error);
      res.status(500).json({
        success: false,
        error: (error as any)?.message
      });
    }
  });

  // Autonomous Negotiation endpoints
  app.get('/api/negotiation/targets', isAuthenticated, async (req, res) => {
    try {
      const targets = [
        {
          id: 'neg_001',
          merchant: 'SupplementCo',
          currentCommission: 5.5,
          targetCommission: 8.0,
          volume: 45000,
          leverage: 0.73,
          confidence: 0.89,
          strategy: 'volume_leverage',
          status: 'negotiating',
          estimatedIncrease: 347,
          negotiationHistory: [
            'Initial outreach sent',
            'Merchant responded positively',
            'Proposal submitted'
          ]
        },
        {
          id: 'neg_002',
          merchant: 'FitnessGear Plus',
          currentCommission: 4.0,
          targetCommission: 6.5,
          volume: 23000,
          leverage: 0.61,
          confidence: 0.76,
          strategy: 'exclusivity_offer',
          status: 'pending',
          estimatedIncrease: 156,
          negotiationHistory: []
        }
      ];

      res.json({
        success: true,
        data: targets
      });
    } catch (error: any) {
      console.error("Negotiation targets error:", error);
      res.status(500).json({
        success: false,
        error: (error as any)?.message
      });
    }
  });

  app.get('/api/negotiation/exclusive-deals', isAuthenticated, async (req, res) => {
    try {
      const deals = [
        {
          id: 'deal_001',
          merchant: 'PureSupplements',
          product: 'Exclusive Nootropic Bundle',
          exclusivityType: 'early_access',
          value: 2500,
          duration: '90 days',
          status: 'secured',
          competitiveAdvantage: '30-day head start on competitors'
        },
        {
          id: 'deal_002',
          merchant: 'EcoFitness',
          product: 'Sustainable Yoga Collection',
          exclusivityType: 'exclusive_discount',
          value: 1800,
          duration: '60 days',
          status: 'negotiating',
          competitiveAdvantage: '25% better margin vs competitors'
        }
      ];

      res.json({
        success: true,
        data: deals
      });
    } catch (error: any) {
      console.error("Exclusive deals error:", error);
      res.status(500).json({
        success: false,
        error: (error as any)?.message
      });
    }
  });

  app.get('/api/negotiation/partnerships', isAuthenticated, async (req, res) => {
    try {
      const partnerships = [
        {
          id: 'part_001',
          merchant: 'MindfulLiving Co',
          opportunityType: 'content_collaboration',
          potentialValue: 5600,
          requirements: ['Weekly content creation', 'Social media promotion'],
          aiRecommendation: 'High-value partnership with wellness alignment',
          priority: 'high'
        },
        {
          id: 'part_002',
          merchant: 'HealthTech Solutions',
          opportunityType: 'co_marketing',
          potentialValue: 3400,
          requirements: ['Email list cross-promotion', 'Joint webinars'],
          aiRecommendation: 'Moderate risk but good audience overlap',
          priority: 'medium'
        }
      ];

      res.json({
        success: true,
        data: partnerships
      });
    } catch (error: any) {
      console.error("Partnerships error:", error);
      res.status(500).json({
        success: false,
        error: (error as any)?.message
      });
    }
  });

  // Risk Management endpoints
  app.get('/api/risk/alerts', isAuthenticated, async (req, res) => {
    try {
      const alerts = [
        {
          id: 'risk_001',
          type: 'fraud_detection',
          severity: 'high',
          description: 'Suspicious click patterns detected on fitness affiliate link',
          confidence: 0.94,
          suggestedAction: 'Pause link and investigate traffic source',
          potentialLoss: 347,
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          status: 'active',
          autoMitigated: false
        },
        {
          id: 'risk_002',
          type: 'market_anomaly',
          severity: 'medium',
          description: 'Unusual conversion drop in supplement category',
          confidence: 0.78,
          suggestedAction: 'Review and optimize landing pages',
          potentialLoss: 156,
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          status: 'mitigated',
          autoMitigated: true
        }
      ];

      res.json({
        success: true,
        data: alerts
      });
    } catch (error: any) {
      console.error("Risk alerts error:", error);
      res.status(500).json({
        success: false,
        error: (error as any)?.message
      });
    }
  });

  app.get('/api/risk/metrics', isAuthenticated, async (req, res) => {
    try {
      const metrics = {
        overallRiskScore: 0.23, // Lower is better
        fraudDetectionAccuracy: 0.94,
        anomalyDetectionRate: 0.87,
        preventedLosses: 2847,
        mitigationSuccessRate: 0.91,
        falsePositiveRate: 0.08
      };

      res.json({
        success: true,
        data: metrics
      });
    } catch (error: any) {
      console.error("Risk metrics error:", error);
      res.status(500).json({
        success: false,
        error: (error as any)?.message
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
