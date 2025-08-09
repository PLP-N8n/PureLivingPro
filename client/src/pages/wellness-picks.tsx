import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Star, ExternalLink, Heart, Filter, ShoppingBag, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

// Import wellness category images for visual enhancement
import fitnessImg from "@assets/Fitness_1751936986685.jpeg";
import fitness2Img from "@assets/fitness2_1751936986686.jpeg";
import healthyRecipesImg from "@assets/Healthy Recipies_1751936986687.jpeg";
import mindfulnessImg from "@assets/Mindfulness & Meditation_1751936986688.jpeg";
import naturalRemediesImg from "@assets/Natural Remidies_1751936986688.jpeg";
import nutritionImg from "@assets/Nutrition_1751936986688.jpeg";
import premiumSupplementsImg from "@assets/Premium Suppliments_1751936986689.jpeg";
import skinCareImg from "@assets/Skin Care_1751936986689.jpeg";

interface Product {
  id: number;
  name: string;
  price: string;
  description: string | null;
  category: string | null;
  rating: string | null;
  imageUrl: string | null;
  affiliateLink: string | null;
  isRecommended: boolean | null;
  tags?: string[] | null;
}

export default function WellnessPicks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const categories = [
    { id: "all", name: "All Products", icon: "🛍️", description: "All curated wellness products", image: null },
    { id: "supplements", name: "Supplements", icon: "💊", description: "Vitamins and nutritional supplements", image: premiumSupplementsImg },
    { id: "skincare", name: "Skincare", icon: "✨", description: "Natural skincare and beauty products", image: skinCareImg },
    { id: "fitness", name: "Fitness", icon: "🏋️", description: "Exercise equipment and accessories", image: fitnessImg },
    { id: "nutrition", name: "Nutrition", icon: "🥗", description: "Healthy food and nutrition products", image: nutritionImg },
    { id: "wellness-tools", name: "Wellness Tools", icon: "🧘", description: "Meditation and wellness accessories", image: mindfulnessImg },
    { id: "home", name: "Home & Living", icon: "🏡", description: "Healthy home and lifestyle products", image: naturalRemediesImg }
  ];

  const priceRanges = [
    { id: "all", name: "All Prices", range: [0, Infinity] },
    { id: "under-25", name: "Under $25", range: [0, 25] },
    { id: "25-50", name: "$25 - $50", range: [25, 50] },
    { id: "50-100", name: "$50 - $100", range: [50, 100] },
    { id: "over-100", name: "Over $100", range: [100, Infinity] }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    
    const productPrice = parseFloat(product.price.replace(/[^0-9.]/g, ''));
    const selectedRange = priceRanges.find(range => range.id === priceRange);
    const matchesPrice = !selectedRange || 
                        (productPrice >= selectedRange.range[0] && productPrice <= selectedRange.range[1]);
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const recommendedProducts = filteredProducts.filter(product => product.isRecommended);
  const otherProducts = filteredProducts.filter(product => !product.isRecommended);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sage-25 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-sage-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage-25 pt-16">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-sage-50 to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="bg-sage-100 text-sage-700 mb-6">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Wellness Picks
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-sage-800 mb-6 leading-tight">
              Curated{" "}
              <span className="text-transparent bg-gradient-to-r from-sage-600 to-green-500 bg-clip-text">
                Wellness Products
              </span>
            </h1>
            <p className="text-xl text-sage-600 mb-8">
              Thoughtfully selected products to support your wellness journey. Each item is tested, 
              reviewed, and recommended by our team of wellness experts.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg border-sage-200 focus:border-sage-400 rounded-xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-12 bg-white border-b border-sage-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-sage-800 mb-2">Shop by Category</h2>
              <p className="text-sage-600">Browse our curated selection by product type</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Button
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className={`h-auto p-4 flex flex-col items-center text-center w-full ${
                      selectedCategory === category.id
                        ? "bg-sage-600 hover:bg-sage-700 text-white"
                        : "border-sage-200 text-sage-700 hover:bg-sage-50"
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span className="text-2xl mb-2">{category.icon}</span>
                    <span className="font-medium text-sm">{category.name}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-sage-600" />
              <span className="text-sage-700 font-medium mr-3">Price Range:</span>
              <div className="flex flex-wrap gap-2">
                {priceRanges.map((range) => (
                  <Button
                    key={range.id}
                    variant={priceRange === range.id ? "default" : "outline"}
                    size="sm"
                    className={priceRange === range.id
                      ? "bg-sage-600 hover:bg-sage-700 text-white"
                      : "border-sage-200 text-sage-600 hover:bg-sage-50"
                    }
                    onClick={() => setPriceRange(range.id)}
                  >
                    {range.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {selectedCategory !== "all" && (
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-sage-800 mb-2">
                {categories.find(cat => cat.id === selectedCategory)?.icon}{" "}
                {categories.find(cat => cat.id === selectedCategory)?.name}
              </h2>
              <p className="text-sage-600">
                {categories.find(cat => cat.id === selectedCategory)?.description}
              </p>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛍️</div>
              <h3 className="text-2xl font-semibold text-sage-800 mb-2">No products found</h3>
              <p className="text-sage-600 mb-6">
                {searchQuery 
                  ? "Try adjusting your search terms or filters." 
                  : "We're working on adding products to this category. Check back soon!"
                }
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setPriceRange("all");
                }}
                className="border-sage-600 text-sage-600 hover:bg-sage-50"
              >
                View All Products
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-sage-600">
                  Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
                {(searchQuery || selectedCategory !== "all" || priceRange !== "all") && (
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setPriceRange("all");
                    }}
                    className="text-sage-600 hover:bg-sage-50"
                  >
                    Clear filters
                  </Button>
                )}
              </div>

              {/* Recommended Products */}
              {recommendedProducts.length > 0 && (
                <div className="mb-16">
                  <div className="flex items-center gap-2 mb-8">
                    <Sparkles className="w-6 h-6 text-amber-500" />
                    <h2 className="text-3xl font-bold text-sage-800">Staff Picks</h2>
                    <Badge className="bg-amber-100 text-amber-700">Recommended</Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recommendedProducts.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} isRecommended={true} />
                    ))}
                  </div>
                </div>
              )}

              {/* Other Products */}
              {otherProducts.length > 0 && (
                <div>
                  {recommendedProducts.length > 0 && (
                    <h2 className="text-3xl font-bold text-sage-800 mb-8">More Products</h2>
                  )}
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherProducts.map((product, index) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        index={index + recommendedProducts.length} 
                        isRecommended={false} 
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product, index, isRecommended }: { 
  product: Product; 
  index: number; 
  isRecommended: boolean; 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group border-sage-100 hover:border-sage-200">
        <div className="relative">
          <div className="aspect-square bg-gradient-to-br from-sage-100 to-green-100 rounded-t-lg flex items-center justify-center">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-cover rounded-t-lg"
              />
            ) : (
              <span className="text-4xl">🌿</span>
            )}
          </div>
          {isRecommended && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              Staff Pick
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 bg-white/80 hover:bg-white text-sage-600 rounded-full p-2"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>
        
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="bg-sage-100 text-sage-700">
              {product.category || "Wellness"}
            </Badge>
            {product.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-sage-600">{product.rating}</span>
              </div>
            )}
          </div>
          <CardTitle className="text-xl group-hover:text-sage-600 transition-colors leading-tight">
            {product.name}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <CardDescription className="text-sage-600 mb-4 line-clamp-2">
            {product.description || "High-quality wellness product carefully selected by our team."}
          </CardDescription>
          
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl font-bold text-sage-800">
              {product.price}
            </div>
            {product.affiliateLink && (
              <Button
                size="sm"
                className="bg-sage-600 hover:bg-sage-700 text-white"
                onClick={() => {
                  import('@/lib/affiliate').then(({ buildAffiliateUrl }) => {
                    const href = buildAffiliateUrl({
                      affiliateId: (product as any)?.affiliateId ?? null,
                      url: product.affiliateLink!,
                    });
                    window.open(href, '_blank', 'noopener,noreferrer');
                  }).catch(() => {
                    window.open(product.affiliateLink!, '_blank', 'noopener,noreferrer');
                  });
                }}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Shop Now
              </Button>
            )}
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map((tag, tagIndex) => (
                <Badge 
                  key={tagIndex} 
                  variant="outline" 
                  className="text-xs border-sage-200 text-sage-600"
                >
                  {tag}
                </Badge>
              ))}
              {product.tags.length > 3 && (
                <Badge variant="outline" className="text-xs border-sage-200 text-sage-600">
                  +{product.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
