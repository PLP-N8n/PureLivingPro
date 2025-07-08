import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingCart, 
  Star, 
  ExternalLink, 
  Heart, 
  Filter, 
  Search,
  TrendingUp,
  Award,
  Zap,
  Leaf,
  Activity,
  Brain,
  Moon,
  Utensils,
  Dumbbell,
  Target,
  Crown,
  Shield
} from "lucide-react";

interface AffiliateProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  platform: "amazon" | "clickbank" | "other";
  affiliateLink: string;
  imageUrl: string;
  features: string[];
  benefits: string[];
  isTopPick: boolean;
  isPremium: boolean;
  commission: number;
  tags: string[];
}

const categories = [
  { id: "all", name: "All Categories", icon: Target },
  { id: "supplements", name: "Supplements", icon: Leaf },
  { id: "fitness", name: "Fitness Equipment", icon: Dumbbell },
  { id: "nutrition", name: "Nutrition", icon: Utensils },
  { id: "mental_health", name: "Mental Health", icon: Brain },
  { id: "sleep", name: "Sleep & Recovery", icon: Moon },
  { id: "wellness_tech", name: "Wellness Tech", icon: Activity },
  { id: "books", name: "Books & Courses", icon: Award }
];

// Mock data - in production, this would come from your API
const mockProducts: AffiliateProduct[] = [
  {
    id: "1",
    title: "Premium Organic Ashwagandha Capsules",
    description: "High-potency ashwagandha root extract for stress relief and improved sleep quality. Third-party tested for purity and potency.",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.6,
    reviewCount: 2847,
    category: "supplements",
    platform: "amazon",
    affiliateLink: "https://amazon.com/dp/example-ashwagandha",
    imageUrl: "/api/placeholder/300/300",
    features: ["600mg per capsule", "90-day supply", "Third-party tested", "Organic certified"],
    benefits: ["Reduces stress", "Improves sleep", "Supports immune system", "Enhances focus"],
    isTopPick: true,
    isPremium: false,
    commission: 8.5,
    tags: ["stress-relief", "sleep", "organic", "bestseller"]
  },
  {
    id: "2",
    title: "Smart Fitness Tracker with Heart Rate Monitor",
    description: "Advanced fitness tracking with 24/7 heart rate monitoring, sleep tracking, and wellness insights. Compatible with iOS and Android.",
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.4,
    reviewCount: 1563,
    category: "wellness_tech",
    platform: "amazon",
    affiliateLink: "https://amazon.com/dp/example-fitness-tracker",
    imageUrl: "/api/placeholder/300/300",
    features: ["Heart rate monitoring", "Sleep tracking", "Water resistant", "7-day battery"],
    benefits: ["Track progress", "Monitor health", "Improve sleep", "Stay motivated"],
    isTopPick: false,
    isPremium: true,
    commission: 12.0,
    tags: ["fitness", "tracking", "health", "technology"]
  },
  {
    id: "3",
    title: "Complete Mindfulness Meditation Course",
    description: "Comprehensive 8-week mindfulness program with guided meditations, practical exercises, and stress reduction techniques.",
    price: 97.00,
    originalPrice: 147.00,
    rating: 4.8,
    reviewCount: 892,
    category: "mental_health",
    platform: "clickbank",
    affiliateLink: "https://clickbank.com/example-meditation-course",
    imageUrl: "/api/placeholder/300/300",
    features: ["8-week program", "50+ guided meditations", "Workbook included", "Lifetime access"],
    benefits: ["Reduce anxiety", "Improve focus", "Better sleep", "Emotional balance"],
    isTopPick: true,
    isPremium: true,
    commission: 50.0,
    tags: ["meditation", "mindfulness", "stress", "course"]
  },
  {
    id: "4",
    title: "Adjustable Resistance Bands Set",
    description: "Professional-grade resistance bands set with multiple resistance levels. Perfect for home workouts and strength training.",
    price: 39.99,
    originalPrice: 59.99,
    rating: 4.5,
    reviewCount: 3421,
    category: "fitness",
    platform: "amazon",
    affiliateLink: "https://amazon.com/dp/example-resistance-bands",
    imageUrl: "/api/placeholder/300/300",
    features: ["5 resistance levels", "Handles and door anchor", "Portable design", "Exercise guide"],
    benefits: ["Full-body workout", "Portable fitness", "Build strength", "Improve flexibility"],
    isTopPick: false,
    isPremium: false,
    commission: 10.0,
    tags: ["fitness", "home-workout", "strength", "portable"]
  },
  {
    id: "5",
    title: "Premium Collagen Peptides Powder",
    description: "Hydrolyzed collagen peptides for skin health, joint support, and overall wellness. Unflavored and easily mixable.",
    price: 34.99,
    originalPrice: 44.99,
    rating: 4.7,
    reviewCount: 1876,
    category: "supplements",
    platform: "amazon",
    affiliateLink: "https://amazon.com/dp/example-collagen",
    imageUrl: "/api/placeholder/300/300",
    features: ["Type I & III collagen", "20g protein per serving", "Unflavored", "Grass-fed sourced"],
    benefits: ["Skin health", "Joint support", "Hair & nail strength", "Muscle recovery"],
    isTopPick: true,
    isPremium: false,
    commission: 9.0,
    tags: ["collagen", "skin", "joints", "protein"]
  },
  {
    id: "6",
    title: "Blue Light Blocking Glasses",
    description: "Stylish blue light blocking glasses to reduce eye strain and improve sleep quality. Perfect for screen time.",
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.3,
    reviewCount: 967,
    category: "sleep",
    platform: "amazon",
    affiliateLink: "https://amazon.com/dp/example-blue-light-glasses",
    imageUrl: "/api/placeholder/300/300",
    features: ["Blue light filtering", "Anti-glare coating", "Comfortable fit", "Multiple styles"],
    benefits: ["Reduce eye strain", "Better sleep", "Improved focus", "Screen protection"],
    isTopPick: false,
    isPremium: false,
    commission: 7.5,
    tags: ["sleep", "eye-health", "screen-time", "blue-light"]
  }
];

export default function AffiliateProducts() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [priceRange, setPriceRange] = useState("all");
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPremium = !showPremiumOnly || product.isPremium;
    
    let matchesPrice = true;
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      matchesPrice = product.price >= min && product.price <= max;
    }
    
    return matchesCategory && matchesSearch && matchesPremium && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "reviews":
        return b.reviewCount - a.reviewCount;
      default:
        return 0;
    }
  });

  const handleProductClick = (product: AffiliateProduct) => {
    // Track click for analytics
    window.gtag?.('event', 'affiliate_click', {
      product_id: product.id,
      product_name: product.title,
      category: product.category,
      platform: product.platform,
      price: product.price
    });
    
    // Open affiliate link in new tab
    window.open(product.affiliateLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-sage-800 mb-4">Wellness Product Recommendations</h1>
          <p className="text-sage-600 text-lg max-w-2xl mx-auto">
            Carefully curated wellness products to support your health journey. Each product is personally tested and recommended.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-sage-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">Price Range</label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-25">$0 - $25</SelectItem>
                  <SelectItem value="25-50">$25 - $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="100-999">$100+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-sage-50">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="flex items-center gap-2 text-xs data-[state=active]:bg-sage-200"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200 border-sage-200">
              <CardHeader className="pb-3">
                <div className="relative">
                  <img 
                    src={product.imageUrl} 
                    alt={product.title}
                    className="w-full h-48 object-cover rounded-lg bg-sage-100"
                  />
                  <div className="absolute top-2 left-2 flex gap-1">
                    {product.isTopPick && (
                      <Badge className="bg-amber-500 text-white">
                        <Crown className="w-3 h-3 mr-1" />
                        Top Pick
                      </Badge>
                    )}
                    {product.isPremium && (
                      <Badge className="bg-purple-500 text-white">
                        <Shield className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="bg-white">
                      {product.platform}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="mb-3">
                  <h3 className="font-semibold text-sage-800 mb-2 line-clamp-2">{product.title}</h3>
                  <p className="text-sm text-sage-600 line-clamp-3">{product.description}</p>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="text-sm text-sage-500">({product.reviewCount} reviews)</span>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-sage-800">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-sage-500 line-through">${product.originalPrice}</span>
                  )}
                  {product.originalPrice && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2 mb-4">
                  <div>
                    <p className="text-xs font-medium text-sage-700 mb-1">Key Benefits:</p>
                    <div className="flex flex-wrap gap-1">
                      {product.benefits.slice(0, 3).map((benefit, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-sage-100 text-sage-700">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleProductClick(product)}
                  className="w-full bg-sage-600 hover:bg-sage-700 group-hover:bg-sage-700 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  View Product
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
                
                <div className="mt-2 text-center">
                  <p className="text-xs text-sage-500">
                    Earn {product.commission}% commission • Trusted platform
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No results */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-sage-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-sage-800 mb-2">No products found</h3>
            <p className="text-sage-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-sage-50 rounded-lg border border-sage-200">
          <h3 className="font-semibold text-sage-800 mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Important Disclosure
          </h3>
          <p className="text-sm text-sage-600 leading-relaxed">
            Pure Living Pro participates in affiliate programs with Amazon, ClickBank, and other partners. 
            We may earn a commission when you purchase through our links, at no extra cost to you. 
            All products are personally tested and recommended based on their quality and effectiveness. 
            Our reviews are honest and unbiased, helping you make informed decisions for your wellness journey.
          </p>
        </div>
      </div>
    </div>
  );
}