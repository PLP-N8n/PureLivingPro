import { db } from './server/db.js';

async function seedAutonomousSystem() {
  console.log('🤖 Seeding Autonomous System Data...');

  try {
    // Create automation logs entries
    const { automationLogs } = await import('./shared/schema.js');
    
    await db.insert(automationLogs).values([
      {
        action: 'SYSTEM_INIT',
        description: 'Autonomous system initialized',
        metadata: JSON.stringify({version: "1.0", features: ["ai_content", "smart_scheduling"]}),
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        action: 'CONTENT_CREATION',
        description: 'AI blog post generated',
        metadata: JSON.stringify({title: "10 Natural Wellness Tips", category: "wellness", ai_provider: "deepseek"}),
        createdAt: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
      },
      {
        action: 'AFFILIATE_SCRAPING',
        description: 'Product links discovered',
        metadata: JSON.stringify({products_found: 5, new_categories: ["supplements", "yoga"]}),
        createdAt: new Date(Date.now() - 45 * 60 * 1000) // 45 minutes ago
      },
      {
        action: 'OPTIMIZATION',
        description: 'System performance optimized',
        metadata: JSON.stringify({cpu_usage: "reduced by 15%", memory: "optimized"}),
        createdAt: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
      },
      {
        action: 'REVENUE_TRACKING',
        description: 'Affiliate commission recorded',
        metadata: JSON.stringify({amount: 25.50, source: "amazon", product: "wellness supplements"}),
        createdAt: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
      }
    ]).onConflictDoNothing();

    // Create automation schedule entries
    const { automationSchedule } = await import('./shared/schema.js');
    
    await db.insert(automationSchedule).values([
      {
        type: 'CONTENT_CREATION',
        priority: 'HIGH',
        scheduledFor: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
        status: 'PENDING',
        parameters: JSON.stringify({max_posts: 3, categories: ["nutrition", "fitness"]}),
        retryCount: 0,
        maxRetries: 3,
        estimatedDuration: 30
      },
      {
        type: 'AFFILIATE_SCRAPING',
        priority: 'MEDIUM',
        scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        status: 'PENDING',
        parameters: JSON.stringify({max_links: 10, focus: "wellness"}),
        retryCount: 0,
        maxRetries: 3,
        estimatedDuration: 15
      }
    ]).onConflictDoNothing();

    // Create autonomous config entries
    const { autonomousConfig } = await import('./shared/schema.js');
    
    await db.insert(autonomousConfig).values([
      {
        key: 'enabled',
        value: 'false',
        dataType: 'boolean',
        description: 'Enable autonomous mode',
        category: 'system',
        isActive: true
      },
      {
        key: 'max_links_per_cycle',
        value: '5',
        dataType: 'integer',
        description: 'Maximum affiliate links to process per cycle',
        category: 'automation',
        isActive: true
      },
      {
        key: 'cycle_interval',
        value: '60',
        dataType: 'integer',
        description: 'Minutes between autonomous cycles',
        category: 'timing',
        isActive: true
      }
    ]).onConflictDoUpdate({
      target: autonomousConfig.key,
      set: {
        value: 'excluded.value',
        lastModified: new Date()
      }
    });

    // Create performance metrics entries
    const { performanceMetrics } = await import('./shared/schema.js');
    
    await db.insert(performanceMetrics).values([
      {
        metricType: 'system_uptime',
        value: '99.8',
        unit: 'percentage',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        metadata: {total_hours: 168, downtime_minutes: 20},
        category: 'system'
      },
      {
        metricType: 'content_generation_rate',
        value: '85.5',
        unit: 'percentage',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        metadata: {posts_created: 17, posts_attempted: 20},
        category: 'content'
      }
    ]).onConflictDoNothing();

    // Create system learning entries
    const { systemLearning } = await import('./shared/schema.js');
    
    await db.insert(systemLearning).values([
      {
        actionType: 'content_optimization',
        context: {category: "nutrition", time_of_day: "morning", audience: "fitness_enthusiasts"},
        outcome: 'SUCCESS',
        successRate: '87.5',
        learningData: {engagement_increase: 23, reading_time_increase: 45},
        confidenceScore: '0.89',
        createdAt: new Date(Date.now() - 60 * 60 * 1000)
      },
      {
        actionType: 'ai_provider_selection',
        context: {task: "blog_generation", deepseek_performance: 8.9, openai_performance: 9.1},
        outcome: 'SUCCESS',
        successRate: '91.0',
        learningData: {cost_savings: 90, quality_maintained: true},
        confidenceScore: '0.88',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
      }
    ]).onConflictDoNothing();

    console.log('✅ Autonomous System Data seeded successfully!');
    console.log('🎯 Key Features Activated:');
    console.log('   • Intelligent Task Scheduling');
    console.log('   • Performance Metrics Tracking');
    console.log('   • AI Learning System');
    console.log('   • Autonomous Configuration Management');
    console.log('   • System Health Monitoring');

  } catch (error) {
    console.error('❌ Error seeding autonomous system:', error);
    throw error;
  }
}

// Run the seeder
seedAutonomousSystem()
  .then(() => {
    console.log('🚀 Autonomous System ready for operation!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Failed to seed autonomous system:', error);
    process.exit(1);
  });