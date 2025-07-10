import { db } from './server/db.js';
import { affiliateLinks } from './shared/schema.js';

async function seedDemoAffiliateLinks() {
  console.log('🌱 Seeding demo affiliate links...');

  const demoLinks = [
    {
      url: 'https://www.amazon.com/dp/B08H8YZPXT',
      merchant: 'Amazon',
      productName: 'Ashwagandha 1300mg - Premium Root Powder with Black Pepper',
      category: 'Herbal Supplements',
      commission: 4,
      description: 'Organic Ashwagandha root powder supplement with black pepper for enhanced absorption. Supports stress management and overall wellness.',
      imageUrl: 'https://m.media-amazon.com/images/I/61mj0BqL+5L._AC_SL1500_.jpg',
      status: 'approved',
      isActive: true
    },
    {
      url: 'https://www.amazon.com/dp/B07P8DDNCZ',
      merchant: 'Amazon',
      productName: 'Turmeric Curcumin with BioPerine - Joint & Heart Health',
      category: 'Herbal Supplements',
      commission: 4,
      description: 'High-potency turmeric curcumin supplement with BioPerine for enhanced absorption. Supports joint health and reduces inflammation.',
      imageUrl: 'https://m.media-amazon.com/images/I/71xG+oOLYML._AC_SL1500_.jpg',
      status: 'approved',
      isActive: true
    },
    {
      url: 'https://www.amazon.com/dp/B085MFVQVW',
      merchant: 'Amazon',
      productName: 'Organic Spirulina Powder - Complete Superfood Nutrition',
      category: 'Superfoods',
      commission: 4,
      description: 'Pure organic spirulina powder packed with protein, vitamins, and minerals. Perfect for smoothies and healthy nutrition.',
      imageUrl: 'https://m.media-amazon.com/images/I/61rBhDhNF3L._AC_SL1000_.jpg',
      status: 'approved',
      isActive: true
    },
    {
      url: 'https://www.amazon.com/dp/B01AXDKGTQ',
      merchant: 'Amazon',
      productName: 'Premium Yoga Mat - Non-Slip Exercise Mat',
      category: 'Fitness Equipment',
      commission: 4,
      description: 'High-quality yoga mat with superior grip and cushioning. Perfect for yoga, pilates, and home workouts.',
      imageUrl: 'https://m.media-amazon.com/images/I/71Lfl+RrT7L._AC_SL1500_.jpg',
      status: 'approved',
      isActive: true
    },
    {
      url: 'https://www.amazon.com/dp/B07XBQP1ZM',
      merchant: 'Amazon',
      productName: 'Essential Oils Aromatherapy Set - Pure & Natural',
      category: 'Aromatherapy',
      commission: 4,
      description: 'Complete set of therapeutic-grade essential oils for aromatherapy, relaxation, and wellness practices.',
      imageUrl: 'https://m.media-amazon.com/images/I/71gVbKqI6hL._AC_SL1500_.jpg',
      status: 'approved',
      isActive: true
    }
  ];

  try {
    for (const link of demoLinks) {
      await db.insert(affiliateLinks).values(link).onConflictDoNothing();
      console.log(`✅ Added: ${link.productName}`);
    }
    
    console.log('🎉 Demo affiliate links seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding demo links:', error);
  } finally {
    process.exit(0);
  }
}

// Run the seeding
seedDemoAffiliateLinks();