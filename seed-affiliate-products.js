// Seed affiliate products data
const affiliateProducts = [
  {
    title: "Organic Turmeric Curcumin Supplement",
    description: "Premium organic turmeric with 95% curcumin and black pepper extract for maximum absorption. Supports joint health and inflammation reduction.",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.7,
    reviewCount: 1285,
    category: "supplements",
    platform: "amazon",
    affiliateLink: "https://amazon.com/turmeric-curcumin-supplement",
    imageUrl: "/api/placeholder/300/300",
    features: [
      "95% Curcumin Extract",
      "With BioPerine for Enhanced Absorption",
      "Non-GMO & Gluten-Free",
      "Third-Party Tested"
    ],
    benefits: [
      "Supports Joint Health",
      "Reduces Inflammation",
      "Antioxidant Properties",
      "Supports Immune Function"
    ],
    tags: ["anti-inflammatory", "joint-health", "organic", "supplements"],
    isTopPick: true,
    isPremium: false,
    commission: 8.5,
    isActive: true
  },
  {
    title: "Himalayan Sea Salt Lamp",
    description: "Authentic Himalayan crystal salt lamp that purifies air and creates a calming ambiance. Perfect for meditation and relaxation.",
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.5,
    reviewCount: 892,
    category: "wellness",
    platform: "amazon",
    affiliateLink: "https://amazon.com/himalayan-salt-lamp",
    imageUrl: "/api/placeholder/300/300",
    features: [
      "Authentic Himalayan Crystal",
      "Wooden Base",
      "Dimmer Switch",
      "UL Listed Cord"
    ],
    benefits: [
      "Air Purification",
      "Calming Ambiance",
      "Stress Relief",
      "Better Sleep"
    ],
    tags: ["meditation", "relaxation", "air-purifier", "wellness"],
    isTopPick: false,
    isPremium: false,
    commission: 6.0,
    isActive: true
  },
  {
    title: "Yoga Mat Premium Non-Slip",
    description: "Professional-grade yoga mat with superior grip and cushioning. Made from eco-friendly TPE material.",
    price: 45.99,
    originalPrice: 59.99,
    rating: 4.8,
    reviewCount: 2156,
    category: "fitness",
    platform: "amazon",
    affiliateLink: "https://amazon.com/yoga-mat-premium",
    imageUrl: "/api/placeholder/300/300",
    features: [
      "6mm Thickness",
      "Non-Slip Surface",
      "Eco-Friendly TPE",
      "Carrying Strap Included"
    ],
    benefits: [
      "Superior Grip",
      "Joint Protection",
      "Lightweight & Portable",
      "Easy to Clean"
    ],
    tags: ["yoga", "fitness", "exercise", "eco-friendly"],
    isTopPick: true,
    isPremium: false,
    commission: 7.5,
    isActive: true
  },
  {
    title: "Essential Oil Diffuser Ultrasonic",
    description: "Whisper-quiet ultrasonic aromatherapy diffuser with 7-color LED lights and timer settings. Creates a spa-like atmosphere.",
    price: 32.99,
    originalPrice: 49.99,
    rating: 4.6,
    reviewCount: 1743,
    category: "wellness",
    platform: "amazon",
    affiliateLink: "https://amazon.com/essential-oil-diffuser",
    imageUrl: "/api/placeholder/300/300",
    features: [
      "300ml Capacity",
      "7-Color LED Lights",
      "Timer Settings",
      "Auto Shut-off"
    ],
    benefits: [
      "Aromatherapy Benefits",
      "Stress Relief",
      "Air Humidification",
      "Better Sleep"
    ],
    tags: ["aromatherapy", "essential-oils", "relaxation", "wellness"],
    isTopPick: false,
    isPremium: false,
    commission: 9.0,
    isActive: true
  },
  {
    title: "Complete Nutrition Guide & Meal Plans",
    description: "Comprehensive digital nutrition guide with 200+ healthy recipes and personalized meal plans. Instant download.",
    price: 47.00,
    originalPrice: 97.00,
    rating: 4.9,
    reviewCount: 587,
    category: "nutrition",
    platform: "clickbank",
    affiliateLink: "https://clickbank.com/nutrition-guide",
    imageUrl: "/api/placeholder/300/300",
    features: [
      "200+ Healthy Recipes",
      "Personalized Meal Plans",
      "Nutritional Analysis",
      "Shopping Lists"
    ],
    benefits: [
      "Weight Management",
      "Improved Energy",
      "Better Digestion",
      "Long-term Health"
    ],
    tags: ["nutrition", "meal-planning", "recipes", "health"],
    isTopPick: true,
    isPremium: true,
    commission: 50.0,
    isActive: true
  },
  {
    title: "Meditation Cushion Zafu",
    description: "Traditional zafu meditation cushion filled with organic buckwheat hulls. Promotes proper posture during meditation.",
    price: 38.99,
    originalPrice: 54.99,
    rating: 4.4,
    reviewCount: 426,
    category: "meditation",
    platform: "amazon",
    affiliateLink: "https://amazon.com/meditation-cushion-zafu",
    imageUrl: "/api/placeholder/300/300",
    features: [
      "Organic Buckwheat Hull Fill",
      "Removable Cover",
      "Traditional Design",
      "Multiple Colors"
    ],
    benefits: [
      "Proper Posture",
      "Comfort During Meditation",
      "Spinal Alignment",
      "Deeper Focus"
    ],
    tags: ["meditation", "mindfulness", "posture", "comfort"],
    isTopPick: false,
    isPremium: false,
    commission: 8.0,
    isActive: true
  },
  {
    title: "Stress Relief Bundle - Digital Course",
    description: "Complete stress management system with guided meditations, breathing exercises, and anxiety-reduction techniques.",
    price: 67.00,
    originalPrice: 147.00,
    rating: 4.8,
    reviewCount: 1234,
    category: "stress-relief",
    platform: "clickbank",
    affiliateLink: "https://clickbank.com/stress-relief-bundle",
    imageUrl: "/api/placeholder/300/300",
    features: [
      "Guided Meditations",
      "Breathing Exercises",
      "Anxiety Reduction Techniques",
      "Progress Tracking"
    ],
    benefits: [
      "Stress Reduction",
      "Better Sleep",
      "Improved Focus",
      "Emotional Balance"
    ],
    tags: ["stress-relief", "meditation", "anxiety", "mental-health"],
    isTopPick: true,
    isPremium: true,
    commission: 60.0,
    isActive: true
  },
  {
    title: "Resistance Bands Set Premium",
    description: "Professional resistance bands set with 5 resistance levels, door anchor, and exercise guide. Perfect for home workouts.",
    price: 27.99,
    originalPrice: 39.99,
    rating: 4.7,
    reviewCount: 1856,
    category: "fitness",
    platform: "amazon",
    affiliateLink: "https://amazon.com/resistance-bands-set",
    imageUrl: "/api/placeholder/300/300",
    features: [
      "5 Resistance Levels",
      "Door Anchor Included",
      "Exercise Guide",
      "Protective Sleeves"
    ],
    benefits: [
      "Full Body Workout",
      "Portable Exercise",
      "Strength Building",
      "Rehabilitation Support"
    ],
    tags: ["fitness", "strength-training", "home-workout", "resistance"],
    isTopPick: false,
    isPremium: false,
    commission: 7.0,
    isActive: true
  }
];

console.log("Affiliate products data ready for seeding:", affiliateProducts.length, "products");