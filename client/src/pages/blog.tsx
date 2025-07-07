import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Clock, User, Calendar, BookOpen, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  readTime: number | null;
  createdAt: string;
  isPublished: boolean;
  isPremium: boolean | null;
  tags?: string[] | null;
}

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  const categories = [
    { id: "all", name: "All", icon: "📚", description: "All wellness content" },
    { id: "nutrition", name: "Nutrition", icon: "🥗", description: "Healthy eating and dietary guidance" },
    { id: "mindfulness", name: "Mindfulness", icon: "🧘", description: "Meditation and mental wellness" },
    { id: "fitness", name: "Fitness", icon: "💪", description: "Physical activity and movement" },
    { id: "natural-remedies", name: "Natural Remedies", icon: "🌿", description: "Herbal and natural healing" },
    { id: "recipes", name: "Healthy Recipes", icon: "🍽️", description: "Nourishing meal ideas" },
    { id: "skincare", name: "Skin & Self-care", icon: "✨", description: "Beauty and self-care routines" }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory && post.isPublished;
  });

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
              <BookOpen className="w-4 h-4 mr-2" />
              Wellness Blog
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-sage-800 mb-6 leading-tight">
              Wellness{" "}
              <span className="text-transparent bg-gradient-to-r from-sage-600 to-green-500 bg-clip-text">
                Blog
              </span>
            </h1>
            <p className="text-xl text-sage-600 mb-8">
              Discover insights, tips, and guidance for your wellness journey from our team of experts and practitioners.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg border-sage-200 focus:border-sage-400 rounded-xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 bg-white border-b border-sage-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-sage-800 mb-2">Explore by Category</h2>
            <p className="text-sage-600">Choose a category to find content that interests you most</p>
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
      </section>

      {/* Blog Grid */}
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

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-semibold text-sage-800 mb-2">No articles found</h3>
              <p className="text-sage-600 mb-6">
                {searchQuery 
                  ? "Try adjusting your search terms or explore different categories." 
                  : "We're working on adding content to this category. Check back soon!"
                }
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="border-sage-600 text-sage-600 hover:bg-sage-50"
              >
                View All Articles
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-sage-600">
                  Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
                {(searchQuery || selectedCategory !== "all") && (
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    className="text-sage-600 hover:bg-sage-50"
                  >
                    Clear filters
                  </Button>
                )}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group border-sage-100 hover:border-sage-200">
                      <div className="relative">
                        <div className="aspect-video bg-gradient-to-br from-sage-100 to-green-100 rounded-t-lg flex items-center justify-center">
                          <span className="text-4xl">
                            {categories.find(cat => cat.id === post.category)?.icon || "📄"}
                          </span>
                        </div>
                        {post.isPremium && (
                          <Badge className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-3">
                          {post.category && (
                            <Badge variant="secondary" className="bg-sage-100 text-sage-700">
                              {categories.find(cat => cat.id === post.category)?.name || post.category}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl group-hover:text-sage-600 transition-colors leading-tight">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent>
                        <CardDescription className="text-sage-600 mb-4 line-clamp-3">
                          {post.excerpt || "Discover evidence-based wellness insights and practical tips for healthy living."}
                        </CardDescription>
                        
                        <div className="flex items-center justify-between text-sm text-sage-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{post.readTime || 5} min read</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 3).map((tag, tagIndex) => (
                              <Badge 
                                key={tagIndex} 
                                variant="outline" 
                                className="text-xs border-sage-200 text-sage-600"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {post.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs border-sage-200 text-sage-600">
                                +{post.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}