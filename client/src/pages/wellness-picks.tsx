import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, Search, Star, ExternalLink, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function WellnessPicks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products"],
    retry: false,
  });

  const categories = [
    "All",
    "Supplements",
    "Skincare",
    "Fitness",
    "Meditation",
    "Nutrition",
    "Sleep",
    "Aromatherapy"
  ];

  const filteredProducts = products?.filter((product: any) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "" || selectedCategory === "All" || 
                           product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sage-25">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-8 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage-25">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 wellness-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center bg-amber-100 text-amber-700 px-4 py-2 rounded-full mb-6">
                <Heart className="w-5 h-5 mr-2" />
                Wellness Picks
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-sage-800 mb-6">
                Curated Wellness Products
              </h1>
              <p className="text-xl text-sage-600 max-w-3xl mx-auto mb-8">
                Hand-picked products that align with your wellness goals, thoroughly researched and recommended by our experts.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-400" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-sage-200 focus:border-sage-500 focus:ring-sage-500"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category || (selectedCategory === "" && category === "All") ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category === "All" ? "" : category)}
                  className={selectedCategory === category || (selectedCategory === "" && category === "All") 
                    ? "bg-sage-600 hover:bg-sage-700 text-white" 
                    : "border-sage-200 text-sage-600 hover:bg-sage-50"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-sage-25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 text-sage-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-sage-700 mb-2">No products found</h3>
              <p className="text-sage-600">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product: any, index: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 card-hover organic-border overflow-hidden">
                    <div className="aspect-video bg-gradient-to-r from-sage-100 to-sage-200 flex items-center justify-center">
                      <img
                        src={product.imageUrl || `https://images.unsplash.com/photo-1584017911766-d451b3d0e843?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-sage-100 text-sage-700">
                            {product.category}
                          </Badge>
                          {product.isRecommended && (
                            <Badge className="bg-green-100 text-green-700">
                              Editor's Pick
                            </Badge>
                          )}
                        </div>
                        {product.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-amber-400 fill-current" />
                            <span className="text-sm text-sage-600">{product.rating}</span>
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-sage-800">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="text-sage-600">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-sage-800">
                          £{product.price}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {product.affiliateLink ? (
                          <Button 
                            className="w-full bg-sage-600 hover:bg-sage-700 text-white"
                            onClick={() => window.open(product.affiliateLink, '_blank')}
                          >
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Shop Now
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </Button>
                        ) : (
                          <Button 
                            className="w-full bg-sage-600 hover:bg-sage-700 text-white"
                            disabled
                          >
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Coming Soon
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          className="w-full border-sage-200 text-sage-600 hover:bg-sage-50"
                        >
                          Learn More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
