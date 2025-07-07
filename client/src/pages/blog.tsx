import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Search, Clock, User, Calendar, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: posts, isLoading } = useQuery({
    queryKey: ["/api/blog/posts"],
    retry: false,
  });

  const categories = [
    "All",
    "Nutrition",
    "Fitness",
    "Mindfulness",
    "Sleep",
    "Mental Health",
    "Natural Remedies",
    "Recipes"
  ];

  const filteredPosts = posts?.filter((post: any) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "" || selectedCategory === "All" || 
                           post.category === selectedCategory;
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
                    <Skeleton className="h-4 w-24" />
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
              <div className="inline-flex items-center bg-sage-100 text-sage-700 px-4 py-2 rounded-full mb-6">
                <BookOpen className="w-5 h-5 mr-2" />
                Wellness Blog
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-sage-800 mb-6">
                Expert Wellness Insights
              </h1>
              <p className="text-xl text-sage-600 max-w-3xl mx-auto mb-8">
                Evidence-based articles, practical tips, and inspiring stories to support your wellness journey.
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
                placeholder="Search articles..."
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

      {/* Blog Posts */}
      <section className="py-16 bg-sage-25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-sage-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-sage-700 mb-2">No articles found</h3>
              <p className="text-sage-600">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post: any, index: number) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 card-hover organic-border">
                    <div className="aspect-video bg-gradient-to-r from-sage-100 to-sage-200 rounded-t-2xl flex items-center justify-center">
                      <img
                        src={`https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250`}
                        alt={post.title}
                        className="w-full h-full object-cover rounded-t-2xl"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge className="bg-sage-100 text-sage-700">
                          {post.category}
                        </Badge>
                        {post.isPremium && (
                          <Badge className="bg-amber-100 text-amber-700">
                            <Star className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-sage-800 hover:text-sage-600 transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-sage-600">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-sage-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {post.readTime || 5} min read
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <Button className="w-full bg-sage-600 hover:bg-sage-700 text-white">
                          Read Article
                        </Button>
                      </Link>
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
