import { db } from "./server/db.js";
import { affiliateProducts } from "./shared/schema.js";

const sampleAffiliateProducts = [
  {
    title: "Organic Turmeric Curcumin Supplement",
    description: "Premium organic turmeric with 95% curcumin and black pepper extract for maximum absorption. Supports joint health and inflammation reduction.",
    price: "29.99",
    originalPrice: "39.99",
    rating: "4.7",
    reviewCount: 1285,
    category: "supplements",
    platform: "amazon",
    affiliateLink: "https://amazon.com/turmeric-curcumin-supplement",
    imageUrl: "/api/placeholder/300/300",
    features: ["95% Curcumin Extract", "With BioPerine for Enhanced Absorption", "Non-GMO & Gluten-Free", "Third-Party Tested"],
    benefits: ["Supports Joint Health", "Reduces Inflammation", "Antioxidant Properties", "Supports Immune Function"],
    tags: ["anti-inflammatory", "joint-health", "organic", "supplements"],
    isTopPick: true,
    isPremium: false,
    commission: "8.5",
    isActive: true
  },
  {
    title: "Himalayan Sea Salt Lamp",
    description: "Authentic Himalayan crystal salt lamp that purifies air and creates a calming ambiance. Perfect for meditation and relaxation.",
    price: "24.99",
    originalPrice: "34.99",
    rating: "4.5",
    reviewCount: 892,
    category: "wellness",
    platform: "amazon",
    affiliateLink: "https://amazon.com/himalayan-salt-lamp",
    imageUrl: "/api/placeholder/300/300",
    features: ["Authentic Himalayan Crystal", "Wooden Base", "Dimmer Switch", "UL Listed Cord"],
    benefits: ["Air Purification", "Calming Ambiance", "Stress Relief", "Better Sleep"],
    tags: ["meditation", "relaxation", "air-purifier", "wellness"],
    isTopPick: false,
    isPremium: false,
    commission: "6.0",
    isActive: true
  },
  {
    title: "Complete Nutrition Guide & Meal Plans",
    description: "Comprehensive digital nutrition guide with 200+ healthy recipes and personalized meal plans. Instant download.",
    price: "47.00",
    originalPrice: "97.00",
    rating: "4.9",
    reviewCount: 587,
    category: "nutrition",
    platform: "clickbank",
    affiliateLink: "https://clickbank.com/nutrition-guide",
    imageUrl: "/api/placeholder/300/300",
    features: ["200+ Healthy Recipes", "Personalized Meal Plans", "Nutritional Analysis", "Shopping Lists"],
    benefits: ["Weight Management", "Improved Energy", "Better Digestion", "Long-term Health"],
    tags: ["nutrition", "meal-planning", "recipes", "health"],
    isTopPick: true,
    isPremium: true,
    commission: "50.0",
    isActive: true
  },
  {
    title: "Yoga Mat Premium Non-Slip",
    description: "Professional-grade yoga mat with superior grip and cushioning. Made from eco-friendly TPE material.",
    price: "45.99",
    originalPrice: "59.99",
    rating: "4.8",
    reviewCount: 2156,
    category: "fitness",
    platform: "amazon",
    affiliateLink: "https://amazon.com/yoga-mat-premium",
    imageUrl: "/api/placeholder/300/300",
    features: ["6mm Thickness", "Non-Slip Surface", "Eco-Friendly TPE", "Carrying Strap Included"],
    benefits: ["Superior Grip", "Joint Protection", "Lightweight & Portable", "Easy to Clean"],
    tags: ["yoga", "fitness", "exercise", "eco-friendly"],
    isTopPick: true,
    isPremium: false,
    commission: "7.5",
    isActive: true
  },
  {
    title: "Essential Oil Diffuser Ultrasonic",
    description: "Whisper-quiet ultrasonic aromatherapy diffuser with 7-color LED lights and timer settings. Creates a spa-like atmosphere.",
    price: "32.99",
    originalPrice: "49.99",
    rating: "4.6",
    reviewCount: 1743,
    category: "wellness",
    platform: "amazon",
    affiliateLink: "https://amazon.com/essential-oil-diffuser",
    imageUrl: "/api/placeholder/300/300",
    features: ["300ml Capacity", "7-Color LED Lights", "Timer Settings", "Auto Shut-off"],
    benefits: ["Aromatherapy Benefits", "Stress Relief", "Air Humidification", "Better Sleep"],
    tags: ["aromatherapy", "essential-oils", "relaxation", "wellness"],
    isTopPick: false,
    isPremium: false,
    commission: "9.0",
    isActive: true
  },
  {
    title: "Stress Relief Bundle - Digital Course",
    description: "Complete stress management system with guided meditations, breathing exercises, and anxiety-reduction techniques.",
    price: "67.00",
    originalPrice: "147.00",
    rating: "4.8",
    reviewCount: 1234,
    category: "stress-relief",
    platform: "clickbank",
    affiliateLink: "https://clickbank.com/stress-relief-bundle",
    imageUrl: "/api/placeholder/300/300",
    features: ["Guided Meditations", "Breathing Exercises", "Anxiety Reduction Techniques", "Progress Tracking"],
    benefits: ["Stress Reduction", "Better Sleep", "Improved Focus", "Emotional Balance"],
    tags: ["stress-relief", "meditation", "anxiety", "mental-health"],
    isTopPick: true,
    isPremium: true,
    commission: "60.0",
    isActive: true
  }
];

async function seedAffiliateProducts() {
  try {
    console.log("Seeding affiliate products...");
    
    for (const product of sampleAffiliateProducts) {
      await db.insert(affiliateProducts).values(product);
    }
    
    console.log("Successfully seeded", sampleAffiliateProducts.length, "affiliate products");
  } catch (error) {
    console.error("Error seeding affiliate products:", error);
  }
}

seedAffiliateProducts();