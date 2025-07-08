import axios from 'axios';

const wellnessContent = [
  {
    title: "5 Morning Rituals for Natural Energy",
    category: "Wellness"
  },
  {
    title: "Mindful Eating: Transform Your Relationship with Food",
    category: "Nutrition"
  },
  {
    title: "The Science of Sleep: Natural Ways to Improve Rest",
    category: "Health"
  },
  {
    title: "Herbal Remedies for Stress Relief",
    category: "Natural Remedies"
  },
  {
    title: "Building a Sustainable Exercise Routine",
    category: "Fitness"
  },
  {
    title: "Meditation for Beginners: A Practical Guide",
    category: "Mindfulness"
  },
  {
    title: "The Power of Breathwork for Anxiety",
    category: "Mental Health"
  },
  {
    title: "Creating a Toxin-Free Home Environment",
    category: "Wellness"
  }
];

const wellnessProducts = [
  {
    name: "Organic Ashwagandha Capsules",
    category: "Supplements",
    price: "29.99",
    description: "Premium stress-relief supplement for natural calm and energy",
    affiliateUrl: "https://example.com/ashwagandha"
  },
  {
    name: "Bamboo Meditation Cushion",
    category: "Meditation",
    price: "45.00",
    description: "Eco-friendly meditation cushion for comfortable practice",
    affiliateUrl: "https://example.com/meditation-cushion"
  },
  {
    name: "Essential Oil Diffuser Set",
    category: "Aromatherapy",
    price: "79.99",
    description: "Complete aromatherapy set with 6 organic essential oils",
    affiliateUrl: "https://example.com/diffuser-set"
  },
  {
    name: "Organic Turmeric Complex",
    category: "Supplements",
    price: "34.99",
    description: "Anti-inflammatory support with black pepper for enhanced absorption",
    affiliateUrl: "https://example.com/turmeric"
  },
  {
    name: "Glass Water Bottle with Crystals",
    category: "Wellness",
    price: "28.99",
    description: "Enhance your hydration with natural crystal energy",
    affiliateUrl: "https://example.com/crystal-bottle"
  },
  {
    name: "Yoga Block Set",
    category: "Fitness",
    price: "22.99",
    description: "High-density foam blocks for proper alignment and support",
    affiliateUrl: "https://example.com/yoga-blocks"
  }
];

async function createInitialContent() {
  console.log('Starting to create initial wellness content...');
  
  try {
    // Create blog posts using AI
    console.log('Creating blog posts...');
    for (const post of wellnessContent) {
      try {
        const response = await axios.post('http://localhost:5000/api/blog/auto-create', {
          title: post.title,
          category: post.category,
          autoPublish: true
        });
        console.log(`✓ Created blog post: ${post.title}`);
      } catch (error) {
        console.log(`✗ Failed to create blog post: ${post.title} - ${error.response?.data?.message || error.message}`);
      }
      
      // Add delay to avoid API rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('\nBlog content creation completed!');
    console.log('\nNote: Products will need to be created through the admin panel as they require authentication.');
    console.log('Product suggestions for admin panel:');
    wellnessProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.category}) - $${product.price}`);
    });
    
  } catch (error) {
    console.error('Error creating content:', error);
  }
}

// Run the content creation
createInitialContent();