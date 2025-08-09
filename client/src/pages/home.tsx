import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Heart, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Target,
  TrendingUp,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: recentPosts } = useQuery<any>({
    queryKey: ["/api/blog/posts?limit=3"],
    retry: false,
  });

  const { data: featuredProducts } = useQuery<any>({
    queryKey: ["/api/products?limit=3"],
    retry: false,
  });

  const { data: userChallenges } = useQuery<any>({
    queryKey: ["/api/user/challenges"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sage-25 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-sage-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-sage-25">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 wellness-gradient hero-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-sage-800 mb-4">
                Welcome back, {user?.firstName || "Wellness Warrior"}!
              </h1>
              <p className="text-xl text-sage-600 mb-8">
                Your personalized wellness journey continues here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3">
                    <Target className="w-5 h-5 mr-2" />
                    View Dashboard
                  </Button>
                </Link>
                <Link href="/challenges">
                  <Button variant="outline" className="border-sage-600 text-sage-600 hover:bg-sage-50 px-8 py-3">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Browse Challenges
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-sage-600" />
                </div>
                <div className="text-2xl font-bold text-sage-800">7</div>
                <p className="text-sage-600">Days Active</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-sage-800">
                  {userChallenges?.length || 0}
                </div>
                <p className="text-sage-600">Active Challenges</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-sage-800">85%</div>
                <p className="text-sage-600">Wellness Score</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-sage-800">12</div>
                <p className="text-sage-600">Day Streak</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Personalized Recommendations */}
      <section className="py-16 wellness-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-sage-800 mb-4">
              Personalized for You
            </h2>
            <p className="text-lg text-sage-600">
              AI-powered recommendations based on your wellness profile
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Today's Focus */}
            <Card className="organic-border premium-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-sage-600" />
                  Today's Focus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-sage-800 mb-2">Mindful Movement</h3>
                <p className="text-sage-600 text-sm mb-4">
                  Start your day with gentle stretching and breathing exercises to center your mind and body.
                </p>
                <Link href="/meditation-timer">
                  <Button variant="outline" size="sm" className="w-full">
                    Start Session
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recommended Article */}
            <Card className="organic-border premium-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-sage-600" />
                  Recommended Read
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-sage-800 mb-2">
                  The Science of Sleep
                </h3>
                <p className="text-sage-600 text-sm mb-4">
                  Discover how quality sleep impacts your wellness journey and learn practical tips for better rest.
                </p>
                <Link href="/blog">
                  <Button variant="outline" size="sm" className="w-full">
                    Read Article
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Featured Product */}
            <Card className="organic-border premium-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-sage-600" />
                  Featured Product
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-sage-800 mb-2">
                  Organic Sleep Tea
                </h3>
                <p className="text-sage-600 text-sm mb-4">
                  A calming blend of chamomile and lavender to support your evening routine.
                </p>
                <Link href="/wellness-picks">
                  <Button variant="outline" size="sm" className="w-full">
                    View Product
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Latest Articles */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-sage-800">Latest Articles</h2>
                <Link href="/blog">
                  <Button variant="ghost" className="text-sage-600 hover:text-sage-800">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-6">
                {recentPosts?.slice(0, 3).map((post: any) => (
                  <Card key={post.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-1">
                          <Badge className="bg-sage-100 text-sage-700 mb-2">
                            {post.category}
                          </Badge>
                          <h3 className="font-semibold text-sage-800 mb-2">
                            {post.title}
                          </h3>
                          <p className="text-sage-600 text-sm mb-3">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sage-500 text-xs">
                              {post.readTime} min read
                            </span>
                            <Link href={`/blog/${post.slug}`}>
                              <Button variant="ghost" size="sm">
                                Read More
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Featured Products */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-sage-800">Wellness Picks</h2>
                <Link href="/wellness-picks">
                  <Button variant="ghost" className="text-sage-600 hover:text-sage-800">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-6">
                {featuredProducts?.slice(0, 3).map((product: any) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-1">
                          <Badge className="bg-green-100 text-green-700 mb-2">
                            {product.category}
                          </Badge>
                          <h3 className="font-semibold text-sage-800 mb-2">
                            {product.name}
                          </h3>
                          <p className="text-sage-600 text-sm mb-3">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sage-800 font-bold">
                              £{product.price}
                            </span>
                            <Link href="/wellness-picks">
                              <Button variant="ghost" size="sm">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
