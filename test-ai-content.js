// Quick test to generate initial content for Pure Living Pro
const fetch = require('node-fetch');

async function createInitialContent() {
  try {
    console.log('Creating wellness blog posts...');
    
    // Create sample blog posts
    const blogPosts = [
      { title: "5 Morning Rituals for Natural Energy", category: "Wellness" },
      { title: "Mindful Eating: Transform Your Relationship with Food", category: "Nutrition" },
      { title: "The Science of Sleep: Natural Ways to Improve Rest", category: "Health" },
      { title: "DIY Natural Skincare Recipes for Glowing Skin", category: "Self-care" },
      { title: "Building Mental Resilience Through Daily Practices", category: "Mindfulness" }
    ];

    for (const post of blogPosts) {
      const response = await fetch('http://localhost:5000/api/blog/auto-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      });
      
      if (response.ok) {
        console.log(`✓ Created: ${post.title}`);
      } else {
        console.log(`✗ Failed: ${post.title}`);
      }
    }

    console.log('\nCreating wellness products...');
    
    // Create sample products
    const products = [
      {
        name: "Organic Ashwagandha Capsules",
        category: "Supplements",
        price: "29.99",
        description: "Premium stress-relief supplement for natural calm and energy"
      },
      {
        name: "Bamboo Meditation Cushion",
        category: "Meditation",
        price: "45.00",
        description: "Eco-friendly meditation cushion for comfortable practice"
      },
      {
        name: "Essential Oil Diffuser Set",
        category: "Aromatherapy", 
        price: "79.99",
        description: "Complete aromatherapy set with 6 organic essential oils"
      }
    ];

    for (const product of products) {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      
      if (response.ok) {
        console.log(`✓ Created product: ${product.name}`);
      } else {
        console.log(`✗ Failed product: ${product.name}`);
      }
    }

    console.log('\nContent creation complete!');
    
  } catch (error) {
    console.error('Error creating content:', error);
  }
}

createInitialContent();