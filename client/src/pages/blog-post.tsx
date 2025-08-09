import { useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Clock, 
  Calendar, 
  User, 
  ArrowLeft, 
  Share2, 
  Bookmark,
  Star,
  Crown
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function BlogPost() {
  const { slug } = useParams();
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  const { data: post, isLoading: postLoading, error } = useQuery<import("@/types/models").BlogPost | null>({
    queryKey: [`/api/blog/posts/${slug}`],
    retry: false,
  });

  const { data: relatedPosts = [] } = useQuery<import("@/types/models").BlogPost[]>({
    queryKey: ["/api/blog/posts?limit=3"],
    retry: false,
  });

  // Handle unauthorized errors for premium content
  useEffect(() => {
    if (error && isUnauthorizedError(error)) {
      toast({
        title: "Premium Content",
        description: "This article requires a premium subscription.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (!isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-sage-25">
        <Navbar />
        <div className="pt-24 pb-16 flex items-center justify-center">
          <Card className="max-w-md mx-4">
            <CardContent className="pt-6 text-center">
              <h2 className="text-xl font-bold text-sage-800 mb-2">Sign In Required</h2>
              <p className="text-sage-600 mb-4">Please sign in to read our wellness articles.</p>
              <Button onClick={() => window.location.href = "/api/login"}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (postLoading) {
    return (
      <div className="min-h-screen bg-sage-25">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-12 w-full mb-6" />
            <Skeleton className="h-64 w-full mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-sage-25">
        <Navbar />
        <div className="pt-24 pb-16 flex items-center justify-center">
          <Card className="max-w-md mx-4">
            <CardContent className="pt-6 text-center">
              <h2 className="text-xl font-bold text-sage-800 mb-2">Article Not Found</h2>
              <p className="text-sage-600 mb-4">The article you're looking for doesn't exist.</p>
              <Link href="/blog">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage-25">
      <Navbar />
      
      {/* Article Header */}
      <section className="pt-24 pb-8 wellness-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog">
            <Button variant="ghost" className="mb-6 text-sage-600 hover:text-sage-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <Badge className="bg-sage-100 text-sage-700">
                {post.category}
              </Badge>
              {post.isPremium && (
                <Badge className="bg-amber-100 text-amber-700">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-sage-800 mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
              <div className="flex items-center space-x-6 text-sage-600">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>Pure Living Pro</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date((post.createdAt as any) ?? Date.now()).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{post.readTime || 5} min read</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-lg max-w-none prose-sage"
          >
            {/* Featured Image */}
            <div className="mb-8">
              <img
                src="https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>
            
            {/* Article Content */}
            <div className="text-sage-700 leading-relaxed">
              {post.content ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <div className="space-y-6">
                  <p>
                    Welcome to this comprehensive guide on wellness and healthy living. 
                    In today's fast-paced world, maintaining our physical and mental well-being 
                    has become more important than ever.
                  </p>
                  
                  <h2 className="text-2xl font-bold text-sage-800 mt-8 mb-4">
                    Understanding Holistic Wellness
                  </h2>
                  
                  <p>
                    Holistic wellness encompasses multiple dimensions of health, including physical, 
                    mental, emotional, and spiritual well-being. It's about creating balance and 
                    harmony in all aspects of your life.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-sage-800 mt-6 mb-3">
                    Key Principles
                  </h3>
                  
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Regular physical activity and movement</li>
                    <li>Balanced nutrition and mindful eating</li>
                    <li>Quality sleep and rest</li>
                    <li>Stress management and relaxation</li>
                    <li>Social connections and relationships</li>
                    <li>Purpose and meaning in life</li>
                  </ul>
                  
                  <p>
                    By focusing on these foundational elements, you can create a sustainable 
                    approach to wellness that supports your long-term health and happiness.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 wellness-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-sage-800 mb-8 text-center">
            Related Articles
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {relatedPosts?.slice(0, 3).map((relatedPost: any) => (
              <motion.div
                key={relatedPost.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 card-hover organic-border">
                  <div className="aspect-video bg-gradient-to-r from-sage-100 to-sage-200 rounded-t-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
                      alt={relatedPost.title}
                      className="w-full h-full object-cover rounded-t-2xl"
                    />
                  </div>
                  <CardContent className="p-6">
                    <Badge className="bg-sage-100 text-sage-700 mb-3">
                      {relatedPost.category}
                    </Badge>
                    <h3 className="text-lg font-semibold text-sage-800 mb-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sage-600 text-sm mb-4">
                      {relatedPost.excerpt}
                    </p>
                    <Link href={`/blog/${relatedPost.slug}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Read Article
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
