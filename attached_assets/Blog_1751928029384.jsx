import React from "react";
import { Input } from "@/components/ui/input";
import { Search, AlertCircle } from "lucide-react";
import BlogCardEnhanced from "@/components/blog/BlogCardEnhanced";
import BlogHeaderEnhanced from "@/components/blog/BlogHeaderEnhanced";
import CategoryFilterEnhanced from "@/components/blog/CategoryFilterEnhanced";
import { useBlogPosts } from "@/components/hooks/useBlogPosts";
import LoadingCard from "@/components/shared/LoadingCard";
import BlogListSEO from "@/components/seo/BlogListSEO";

export default function Blog() {
  const {
    filteredPosts,
    filters,
    searchQuery,
    isLoading,
    hasError,
    updateFilters,
    setSearchQuery,
    totalPosts,
    filteredCount
  } = useBlogPosts({
    initialFilters: { category: 'all' },
    autoFetch: true
  });

  // Generate current URL for SEO
  const currentUrl = typeof window !== 'undefined'
    ? window.location.href
    : 'https://pureliving.pro/blog';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <BlogListSEO
          category={filters.category}
          searchQuery={searchQuery}
          currentUrl={currentUrl}
          posts={[]}
        />
        <BlogHeaderEnhanced />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <LoadingCard key={i} type="blog" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-background">
        <BlogListSEO
          category={filters.category}
          searchQuery={searchQuery}
          currentUrl={currentUrl}
          posts={[]}
        />
        <BlogHeaderEnhanced />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Unable to Load Articles</h3>
            <p className="text-muted-foreground">
              There was an issue loading the blog articles. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced SEO Meta Tags */}
      <BlogListSEO
        category={filters.category}
        searchQuery={searchQuery}
        currentUrl={currentUrl}
        posts={filteredPosts}
      />

      <BlogHeaderEnhanced />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="mb-12">
          {/* Search */}
          <div className="relative mb-8 max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-3 rounded-xl border-border focus:border-ring"
            />
          </div>

          {/* Category Filter */}
          <CategoryFilterEnhanced
            selectedCategory={filters.category}
            onCategoryChange={(category) => updateFilters({ category })}
          />

          {/* Results Summary */}
          {(searchQuery || filters.category !== 'all') && (
            <div className="text-center mb-8">
              <p className="text-muted-foreground">
                {filteredCount === 0 
                  ? 'No articles found' 
                  : `Showing ${filteredCount} of ${totalPosts} articles`
                }
                {searchQuery && ` for "${searchQuery}"`}
                {filters.category !== 'all' && ` in ${filters.category.replace('-', ' ')}`}
              </p>
            </div>
          )}
        </div>

        {/* Results */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No articles found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCardEnhanced key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}