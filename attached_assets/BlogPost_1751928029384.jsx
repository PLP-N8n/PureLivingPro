import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { BlogPost } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import PremiumPaywall from "@/components/premium/PremiumPaywall";
import BlogSEO from "@/components/seo/BlogSEO";
import {
  Clock,
  ArrowLeft,
  BookOpen,
  Calendar,
  User as UserIcon
} from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

const categoryColors = {
  "nutrition": "bg-green-100 text-green-800",
  "meditation-mindfulness": "bg-purple-100 text-purple-800",
  "fitness": "bg-orange-100 text-orange-800",
  "natural-remedies": "bg-sage-100 text-sage-800",
  "healthy-recipes": "bg-amber-100 text-amber-800",
  "supplements": "bg-blue-100 text-blue-800",
  "skin-selfcare": "bg-pink-100 text-pink-800"
};

function SafeDate({ dateString, format: dateFormat = "MMMM d, yyyy" }) {
  try {
    if (!dateString) return <span>Date unavailable</span>;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return <span>Date unavailable</span>;
    return <span>{format(date, dateFormat)}</span>;
  } catch {
    return <span>Date unavailable</span>;
  }
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Generate current URL for SEO
  const currentUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : `https://pureliving.pro/blog/${slug}`;

  useEffect(() => {
    if (slug) {
      loadPost();
      loadCurrentUser();
    }
  }, [slug]);

  const loadCurrentUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      console.log("User not logged in");
      setCurrentUser(null);
    }
  };

  const loadPost = async () => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      let posts = [];
      
      // First, try finding by slug
      try {
        posts = await BlogPost.filter({ slug: slug }, "-created_date", 1);
      } catch (error) {
        console.warn("Error filtering by slug:", error);
        posts = [];
      }
      
      // If not found by slug, try by ID
      if (!posts || posts.length === 0) {
        try {
          posts = await BlogPost.filter({ id: slug }, "-created_date", 1);
        } catch (error) {
          console.warn("Error filtering by ID:", error);
          posts = [];
        }
      }

      // If still not found, try loading all and finding manually
      if (!posts || posts.length === 0) {
        try {
          const allPosts = await BlogPost.list("-created_date", 200);
          const foundPost = (allPosts || []).find(p => p?.slug === slug || p?.id === slug);
          if (foundPost) {
            posts = [foundPost];
          }
        } catch (error) {
          console.warn("Error loading all posts:", error);
        }
      }

      if (posts && posts.length > 0) {
        const currentPost = posts[0];
        
        // Check if post has required fields
        if (!currentPost.title || !currentPost.content) {
          throw new Error("Post missing required fields");
        }
        
        // Check if post is published or if user is admin
        if (!currentPost.published) {
          const user = await User.me().catch(() => null);
          if (user?.role !== 'admin') {
            throw new Error("Post is not published");
          }
        }
        
        setPost(currentPost);
      } else {
        setHasError(true);
      }
    } catch (error) {
      console.error("Error loading post:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Basic SEO for loading state */}
        <BlogSEO 
          post={{ title: "Loading Article...", excerpt: "Article is loading" }} 
          currentUrl={currentUrl} 
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-8 w-24 mb-6" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <div className="flex gap-4 mb-8">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-28" />
          </div>
          <Skeleton className="h-64 w-full mb-8 rounded-2xl" />
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (hasError || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* SEO for error state */}
        <BlogSEO 
          post={{ 
            title: "Article Not Found", 
            excerpt: "The requested article could not be found." 
          }} 
          currentUrl={currentUrl} 
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">
            The article you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/blog">
            <Button className="bg-sage-600 hover:bg-sage-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const hasAccessToPremium = currentUser?.membership_level === 'pro';
  const showPaywall = post.is_premium && !hasAccessToPremium;

  const safePost = {
    title: post.title || "Untitled Article",
    content: post.content || "Content not available.",
    excerpt: post.excerpt || "",
    category: post.category || "general",
    read_time: post.read_time || 5,
    created_date: post.created_date,
    featured_image: post.featured_image,
    tags: post.tags || []
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced SEO Meta Tags */}
      <BlogSEO post={post} currentUrl={currentUrl} />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/blog">
          <Button variant="outline" className="mb-8 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            {safePost.category && (
              <Badge className={`${categoryColors[safePost.category] || 'bg-gray-100 text-gray-800'} rounded-full`}>
                {safePost.category.replace('-', ' ')}
              </Badge>
            )}
            <div className="flex items-center text-gray-600 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              <SafeDate dateString={safePost.created_date} />
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {safePost.read_time} min read
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {safePost.title}
          </h1>

          {safePost.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              {safePost.excerpt}
            </p>
          )}

          <div className="flex items-center">
            <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mr-4">
              <UserIcon className="w-6 h-6 text-sage-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Pure Living Pro</p>
              <p className="text-sm text-gray-600">Wellness Expert</p>
            </div>
          </div>
        </header>

        {safePost.featured_image && (
          <div className="mb-12">
            <img
              src={safePost.featured_image}
              alt={safePost.title}
              className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none mb-12">
          <div className="text-gray-700 leading-relaxed">
            {showPaywall ? (
              <PremiumPaywall article={post} />
            ) : (
              <ReactMarkdown
                components={{
                  h1: ({children}) => <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8">{children}</h1>,
                  h2: ({children}) => <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{children}</h2>,
                  h3: ({children}) => <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">{children}</h3>,
                  p: ({children}) => <p className="mb-4 text-gray-600 leading-relaxed">{children}</p>,
                  ul: ({children}) => <ul className="mb-4 ml-6 space-y-2 list-disc">{children}</ul>,
                  ol: ({children}) => <ol className="mb-4 ml-6 space-y-2 list-decimal">{children}</ol>,
                  li: ({children}) => <li className="text-gray-600">{children}</li>,
                  strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                  em: ({children}) => <em className="italic text-gray-600">{children}</em>,
                  blockquote: ({children}) => (
                    <blockquote className="border-l-4 border-sage-300 pl-6 py-2 my-6 bg-sage-50 rounded-r-xl">
                      {children}
                    </blockquote>
                  ),
                  img: ({src, alt}) => (
                    <img 
                      src={src} 
                      alt={alt || ''} 
                      className="w-full h-auto rounded-xl my-6"
                      loading="lazy"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )
                }}
              >
                {safePost.content}
              </ReactMarkdown>
            )}
          </div>
        </div>

        {safePost.tags.length > 0 && (
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {safePost.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}