import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Sparkles,
  Heart,
  BookOpen,
  Leaf,
  Star,
  Clock,
  TrendingUp,
  ExternalLink
} from "lucide-react";
import OptimizedImage from "@/components/shared/OptimizedImage";
import SEOHead from "@/components/seo/SEOHead";
import BlogCardEnhanced from "@/components/blog/BlogCardEnhanced";
import BaseCard from "@/components/shared/BaseCard";
import { useBlogPosts } from "@/components/hooks/useBlogPosts";
import { useWellnessPicks } from "@/components/hooks/useWellnessPicks";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [usesFallback, setUsesFallback] = useState(false);

  // Use our new custom hooks
  const {
    posts: featuredPosts,
    isLoading: postsLoading,
    hasError: postsError
  } = useBlogPosts({
    initialFilters: { published: true },
    limit: 6,
    autoFetch: true
  });

  const {
    products: featuredProducts,
    isLoading: productsLoading,
    hasError: productsError
  } = useWellnessPicks({
    initialFilters: { featured: true },
    limit: 4,
    autoFetch: true
  });

  useEffect(() => {
    // Set loading state based on both hooks
    setIsLoading(postsLoading || productsLoading);
    
    // Set fallback state if either hook has errors
    setUsesFallback(postsError || productsError);
  }, [postsLoading, productsLoading, postsError, productsError]);

  // Generate structured data for homepage
  const homepageSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Pure Living Pro",
    "description": "Holistic wellness platform offering evidence-based insights, natural remedies, and curated wellness products for modern living.",
    "url": "https://pureliving.pro",
    "publisher": {
      "@type": "Organization",
      "name": "Pure Living Pro",
      "logo": {
        "@type": "ImageObject",
        "url": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/7922d7bf4_LogoFinal.jpg",
        "width": 400,
        "height": 400
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://pureliving.pro/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://www.instagram.com/pure.living.pro/",
      "https://www.tiktok.com/@pure.living.pro",
      "https://x.com/pure_living_pro",
      "https://medium.com/@cvchaudhary",
      "https://www.threads.com/@pure.living.pro",
      "https://uk.pinterest.com/cvchaudhary/"
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced SEO Meta Tags */}
      <SEOHead
        title="Pure Living Pro - Holistic Wellness & Natural Living"
        description="Discover evidence-based wellness insights, natural remedies, and curated products for holistic health. Transform your wellness journey with Pure Living Pro."
        keywords={[
          'holistic wellness',
          'natural living',
          'wellness blog',
          'natural remedies',
          'meditation',
          'nutrition',
          'fitness',
          'wellness products',
          'pure living pro'
        ]}
        canonicalUrl="https://pureliving.pro"
        ogTitle="Pure Living Pro - Transform Your Wellness Journey"
        ogDescription="Discover evidence-based wellness insights, natural remedies, and curated products for holistic health and mindful living."
        ogImage="https://pureliving.pro/images/homepage-og.jpg"
        twitterCard="summary_large_image"
        schema={homepageSchema}
        customMeta={[
          { name: "google-site-verification", content: "your-google-verification-code" },
          { name: "msvalidate.01", content: "your-bing-verification-code" },
          { name: "content-type", content: "homepage" }
        ]}
      />

      {/* Demo Mode Notice */}
      {usesFallback && (
        <div className="bg-amber-50 border-b border-amber-200 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center text-amber-800">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Demo Mode: Showing sample content</span>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              <Badge className="bg-sage-100 text-sage-700 border-sage-200 px-4 py-2 text-sm font-medium rounded-full mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Ancient Wisdom Meets Modern Wellness
              </Badge>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
                Holistic Wellness for
                <span className="block text-transparent bg-gradient-to-r from-sage-600 via-emerald-600 to-amber-600 bg-clip-text">
                  Modern Living
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Discover the perfect balance of mind, body, and spirit through our curated wellness insights,
                natural remedies, and mindful living practices designed for today's conscious lifestyle.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/blog">
                  <Button className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg group">
                    Explore Insights
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/wellness-picks">
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-lg rounded-xl">
                    <Heart className="w-5 h-5 mr-2" />
                    Our Picks
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Wellness Articles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-600">Community Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">1000+</div>
                  <div className="text-sm text-gray-600">Product Reviews</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative z-10 shadow-2xl rounded-2xl overflow-hidden">
                <OptimizedImage
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Woman in a yoga pose outdoors, embodying holistic wellness."
                  className="w-full h-96 md:h-[500px] object-cover"
                  width={800}
                  height={500}
                  crop="fill"
                  gravity="auto"
                  loading="eager"
                  quality="auto:best"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  enableModernFormats={true}
                  breakpoints={[400, 600, 800, 1000]}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sage-900/20 to-transparent"></div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">4.9</div>
                  <div className="flex justify-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xs">★</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-sage-100 rounded-2xl shadow-lg flex items-center justify-center">
                <div className="text-center">
                  <Heart className="w-6 h-6 text-sage-600 mx-auto mb-1" />
                  <div className="text-xs text-sage-600 font-medium">Trusted</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-sage-600 mr-2" />
              <span className="text-sage-600 font-medium uppercase tracking-wider text-sm">
                Wellness Categories
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Your Wellness Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dive deep into our comprehensive wellness categories, each crafted to support
              your unique path to holistic health and mindful living.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Nutrition", href: "/blog?category=nutrition", icon: Leaf, color: "bg-green-500" },
              { name: "Mindfulness", href: "/blog?category=meditation-mindfulness", icon: Sparkles, color: "bg-purple-500" },
              { name: "Fitness", href: "/blog?category=fitness", icon: Heart, color: "bg-orange-500" },
              { name: "Natural Remedies", href: "/blog?category=natural-remedies", icon: Leaf, color: "bg-sage-500" },
              { name: "Healthy Recipes", href: "/blog?category=healthy-recipes", icon: Heart, color: "bg-amber-500" },
              { name: "Supplements", href: "/blog?category=supplements", icon: Sparkles, color: "bg-blue-500" }
            ].map((category) => (
              <Link key={category.name} to={category.href} className="group">
                <Card className="shadow-lg border-0 bg-white group-hover:scale-105 transition-all duration-300 rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-sage-700 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Discover expert insights and practical tips for {category.name.toLowerCase()}.
                    </p>
                    <div className="flex items-center justify-end">
                      <ArrowRight className="w-5 h-5 text-sage-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - Updated to use hook data */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-sage-600 mr-2" />
                <span className="text-sage-600 font-medium uppercase tracking-wider text-sm">
                  Trending Picks
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Curated Wellness Essentials
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Hand-picked products that align with your wellness goals,
                thoroughly researched and recommended by our wellness experts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {featuredProducts.slice(0, 4).map((product) => (
                <BaseCard
                  key={product.id}
                  title={product.name}
                  description={product.description}
                  image={product.image_url}
                  imageAlt={product.name}
                  href={product.affiliate_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  imageHeight="h-48"
                  badgeText={product.badge?.replace('-', ' ')}
                  badgeColor="bg-primary text-primary-foreground"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-card-foreground">
                      £{product.discounted_price || product.original_price}
                    </span>
                    {product.rating > 0 && (
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < product.rating ? "text-accent fill-current" : "text-muted-foreground/30"}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </BaseCard>
              ))}
            </div>

            <div className="text-center">
              <Link to="/wellness-picks">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-xl">
                  View All Products
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts - Updated to use hook data */}
      {featuredPosts && featuredPosts.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-sage-600 mr-2" />
                <span className="text-sage-600 font-medium uppercase tracking-wider text-sm">
                  Latest Insights
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Fresh Wellness Wisdom
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Stay updated with our latest research-backed articles, practical guides,
                and inspiring stories from the world of holistic wellness.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredPosts.slice(0, 6).map((post) => (
                <BlogCardEnhanced key={post.id} post={post} />
              ))}
            </div>

            <div className="text-center">
              <Link to="/blog">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-xl">
                  Read All Articles
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl rounded-2xl border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center mb-4">
                    <Sparkles className="w-6 h-6 text-sage-600 mr-2" />
                    <span className="text-sage-600 font-medium uppercase tracking-wider text-sm">
                      Newsletter
                    </span>
                  </div>

                  <h3 className="text-3xl lg:text-4xl font-bold text-card-foreground mb-4">
                    Join Our Wellness Circle
                  </h3>

                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    Get weekly wellness insights, exclusive content, and curated product
                    recommendations delivered straight to your inbox.
                  </p>

                  <div className="space-y-4">
                    <div className="flex">
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        className="flex-1 px-4 py-3 border border-border rounded-l-xl focus:outline-none focus:border-sage-400"
                      />
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-r-xl">
                        Subscribe
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mt-4">
                    ✨ No spam, just pure wellness wisdom • Unsubscribe anytime
                  </p>
                </div>

                <div className="relative h-64 lg:h-auto">
                  <OptimizedImage
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/7922d7bf4_LogoFinal.jpg"
                    alt="Pure Living Pro - Your wellness journey starts here"
                    className="w-full h-full object-contain p-8 lg:p-12"
                    width={300}
                    height={300}
                    crop="fit"
                    gravity="center"
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    enableModernFormats={true}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-sage-600/5 to-transparent"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}