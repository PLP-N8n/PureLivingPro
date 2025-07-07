import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Heart, ShoppingBag, AlertCircle } from "lucide-react";
import ProductCard from "@/components/shared/ProductCard";
import LoadingCard from "@/components/shared/LoadingCard";
import ProductSEO from "@/components/seo/ProductSEO";
import { useWellnessPicks } from "@/components/hooks/useWellnessPicks";

const categories = [
  { name: "All Products", slug: "all" },
  { name: "Supplements", slug: "supplements" },
  { name: "Skincare", slug: "skincare" },
  { name: "Fitness Equipment", slug: "fitness-equipment" },
  { name: "Meditation Tools", slug: "meditation-tools" },
  { name: "Kitchen Wellness", slug: "kitchen-wellness" },
  { name: "Aromatherapy", slug: "aromatherapy" },
  { name: "Natural Remedies", slug: "natural-remedies" }
];

const badges = [
  { name: "All Badges", slug: "all" },
  { name: "Editor's Pick", slug: "editors-pick" },
  { name: "Best Seller", slug: "best-seller" },
  { name: "Trending", slug: "trending" },
  { name: "Budget Buy", slug: "budget-buy" }
];

export default function WellnessPicks() {
  const {
    filteredProducts,
    filters,
    searchQuery,
    isLoading,
    hasError,
    updateFilters,
    setSearchQuery,
    totalProducts,
    filteredCount,
    loadProducts
  } = useWellnessPicks({
    initialFilters: { category: 'all', badge: 'all' },
    autoFetch: true
  });

  // Generate current URL for SEO
  const currentUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : 'https://pureliving.pro/wellness-picks';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <ProductSEO 
          products={[]}
          category={filters.category}
          currentUrl={currentUrl}
        />
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">Wellness Picks</h1>
              <p className="text-xl text-muted-foreground">Curated products for your wellness journey</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <LoadingCard key={i} type="product" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ProductSEO 
          products={[]}
          category={filters.category}
          currentUrl={currentUrl}
        />
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Unable to Load Products</h2>
          <p className="text-muted-foreground mb-6">There was an issue loading the product catalog.</p>
          <Button onClick={() => loadProducts()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced SEO Meta Tags */}
      <ProductSEO 
        products={filteredProducts}
        category={filters.category}
        currentUrl={currentUrl}
      />

      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-primary mr-3" />
              <span className="text-primary font-medium uppercase tracking-wider">Wellness Picks</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Curated Wellness Products
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hand-picked products that align with your wellness goals, 
              thoroughly researched and recommended by our wellness experts.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="mb-12">
          {/* Search */}
          <div className="relative mb-8 max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-3 rounded-xl border-border focus:border-ring"
            />
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3 text-center">Filter by Category</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.slug}
                  variant={filters.category === cat.slug ? "default" : "outline"}
                  onClick={() => updateFilters({ category: cat.slug })}
                  className="rounded-full"
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Badge Filter */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3 text-center">Filter by Badge</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {badges.map((badge) => (
                <Button
                  key={badge.slug}
                  variant={filters.badge === badge.slug ? "default" : "outline"}
                  onClick={() => updateFilters({ badge: badge.slug })}
                  className="rounded-full"
                >
                  {badge.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          {(searchQuery || filters.category !== 'all' || filters.badge !== 'all') && (
            <div className="text-center mb-8">
              <p className="text-muted-foreground">
                {filteredCount === 0 
                  ? 'No products found' 
                  : `Showing ${filteredCount} of ${totalProducts} products`
                }
                {searchQuery && ` for "${searchQuery}"`}
                {filters.category !== 'all' && ` in ${filters.category.replace('-', ' ')}`}
                {filters.badge !== 'all' && ` with ${filters.badge.replace('-', ' ')} badge`}
              </p>
            </div>
          )}
        </div>

        {/* Results */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">
              {totalProducts === 0 
                ? "No products are currently available. Please check back later."
                : "Try adjusting your search or filter criteria."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product?.id || Math.random()} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}