import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL
});

async function seedAutomationData() {
  console.log('🌱 Seeding automation data...');

  try {
    // Seed affiliate links (only if they don't exist)
    const existingLinks = await pool.query('SELECT COUNT(*) FROM affiliate_links');
    if (parseInt(existingLinks.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO affiliate_links (url, merchant, product_name, category, commission, status) VALUES
        ('https://amazon.com/dp/B08XYZ123', 'Amazon', 'Premium Omega-3 Fish Oil', 'supplements', 8.5, 'approved'),
        ('https://amazon.com/dp/B09ABC456', 'Amazon', 'Organic Protein Powder', 'supplements', 6.0, 'approved'),
        ('https://clickbank.com/wellness-guide', 'ClickBank', 'Complete Wellness Guide', 'wellness', 50.0, 'approved'),
        ('https://amazon.com/dp/B07DEF789', 'Amazon', 'Meditation Cushion Set', 'meditation', 7.5, 'approved'),
        ('https://amazon.com/dp/B06GHI012', 'Amazon', 'Essential Oil Diffuser', 'wellness', 5.5, 'approved');
      `);
    }

    // Seed content pipeline (only if empty)
    const existingContent = await pool.query('SELECT COUNT(*) FROM content_pipeline');
    if (parseInt(existingContent.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO content_pipeline (title, content_type, target_platform, ai_provider, prompt, status, scheduled_for) VALUES
        ('5 Morning Rituals for Better Energy', 'blog', 'blog', 'deepseek', 'Create a comprehensive guide about morning wellness rituals', 'completed', NOW() - INTERVAL '2 hours'),
        ('Quick Meditation for Busy People', 'social', 'instagram', 'deepseek', 'Create an engaging Instagram post about quick meditation', 'completed', NOW() - INTERVAL '1 hour'),
        ('Superfoods That Boost Brain Power', 'blog', 'blog', 'openai', 'Write about brain-boosting superfoods with scientific backing', 'generating', NOW() + INTERVAL '30 minutes'),
        ('Stress Relief in 60 Seconds', 'social', 'x', 'deepseek', 'Create a tweet thread about quick stress relief techniques', 'scheduled', NOW() + INTERVAL '2 hours'),
        ('Natural Sleep Solutions Guide', 'blog', 'blog', 'deepseek', 'Comprehensive guide to natural sleep improvement methods', 'pending', NOW() + INTERVAL '4 hours');
      `);
    }

    // Seed social accounts
    await pool.query(`
      INSERT INTO social_accounts (platform, username, is_active, daily_post_limit, posts_today, account_metrics) VALUES
      ('instagram', 'purelivingpro', true, 3, 1, '{"followers": 2847, "following": 156, "totalPosts": 89, "engagementRate": 4.2}'),
      ('x', 'purelivingpro', true, 5, 2, '{"followers": 1523, "following": 245, "totalPosts": 156, "engagementRate": 3.8}'),
      ('tiktok', 'purelivingpro', true, 2, 0, '{"followers": 892, "following": 78, "totalPosts": 34, "engagementRate": 5.1}')
      ON CONFLICT (platform, username) DO NOTHING;
    `);

    // Seed automation rules
    await pool.query(`
      INSERT INTO automation_rules (name, type, triggers, actions, conditions, is_active) VALUES
      ('Daily Content Creation', 'content_creation', '{"schedule": "daily", "time": "09:00"}', '{"createContent": true, "insertAffiliateLinks": true, "aiProvider": "deepseek"}', '{"maxDailyPosts": 3, "categories": ["wellness", "fitness", "nutrition"]}', true),
      ('Social Media Posting', 'social_posting', '{"schedule": "4hours", "platforms": ["instagram", "x"]}', '{"postToSocial": true, "autoHashtags": true}', '{"minEngagement": 50, "maxDailyPosts": 5}', true),
      ('Affiliate Link Optimization', 'affiliate_insertion', '{"schedule": "hourly", "contentType": "blog"}', '{"insertAffiliateLinks": true, "trackPerformance": true}', '{"categoryFilters": ["supplements", "fitness", "wellness"], "maxLinksPerPost": 3}', true),
      ('Weekend Batch Content', 'content_creation', '{"schedule": "weekly", "day": "saturday"}', '{"createContent": true, "bulkGeneration": true}', '{"batchSize": 5, "aiProvider": "deepseek"}', true)
      ON CONFLICT (name) DO NOTHING;
    `);

    // Seed revenue tracking data
    await pool.query(`
      INSERT INTO revenue_tracking (source, platform, amount, commission, click_count, conversion_rate, status) VALUES
      ('affiliate', 'blog', 125.50, 6.28, 89, 0.12, 'confirmed'),
      ('affiliate', 'instagram', 78.25, 3.91, 156, 0.08, 'confirmed'),
      ('affiliate', 'blog', 203.75, 10.19, 67, 0.15, 'confirmed'),
      ('affiliate', 'x', 45.80, 2.29, 234, 0.05, 'pending'),
      ('affiliate', 'blog', 167.30, 8.37, 45, 0.18, 'confirmed')
      ON CONFLICT DO NOTHING;
    `);

    console.log('✅ Automation data seeded successfully!');
    console.log('📊 Seeded:');
    console.log('   - 5 affiliate links');
    console.log('   - 5 content pipeline items');
    console.log('   - 3 social media accounts');
    console.log('   - 4 automation rules');
    console.log('   - 5 revenue tracking records');

  } catch (error) {
    console.error('❌ Error seeding automation data:', error);
  } finally {
    await pool.end();
  }
}

seedAutomationData();