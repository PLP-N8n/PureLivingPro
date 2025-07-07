import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  ShoppingBag, 
  ExternalLink,
  Heart,
  Info
} from "lucide-react";
import { motion } from "framer-motion";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  tags?: string[];
  imageUrl?: string;
  affiliateLink?: string;
  rating?: string;
  isRecommended: boolean;
}

interface ProductCardProps {
  product: Product;
  onViewDetails?: () => void;
  onAddToWishlist?: () => void;
  showWishlist?: boolean;
}

export default function ProductCard({ 
  product, 
  onViewDetails,
  onAddToWishlist,
  showWishlist = true 
}: ProductCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "supplements":
        return "bg-green-100 text-green-700";
      case "skincare":
        return "bg-pink-100 text-pink-700";
      case "fitness":
        return "bg-blue-100 text-blue-700";
      case "meditation":
        return "bg-purple-100 text-purple-700";
      case "nutrition":
        return "bg-orange-100 text-orange-700";
      case "sleep":
        return "bg-indigo-100 text-indigo-700";
      case "aromatherapy":
        return "bg-teal-100 text-teal-700";
      default:
        return "bg-sage-100 text-sage-700";
    }
  };

  const getPlaceholderImage = (category: string) => {
    switch (category.toLowerCase()) {
      case "supplements":
        return "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300";
      case "skincare":
        return "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300";
      case "fitness":
        return "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300";
      case "meditation":
        return "https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300";
      case "nutrition":
        return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300";
      default:
        return "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300";
    }
  };

  const handlePurchaseClick = () => {
    if (product.affiliateLink) {
      window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full organic-border premium-shadow overflow-hidden bg-white hover:shadow-lg transition-all duration-300">
        {/* Product Image */}
        <div className="relative aspect-video bg-gradient-to-r from-sage-100 to-sage-200">
          <img
            src={product.imageUrl || getPlaceholderImage(product.category)}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = getPlaceholderImage(product.category);
            }}
          />
          
          {/* Wishlist Button */}
          {showWishlist && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
              onClick={onAddToWishlist}
            >
              <Heart className="w-4 h-4 text-sage-600" />
            </Button>
          )}
          
          {/* Recommended Badge */}
          {product.isRecommended && (
            <Badge className="absolute top-2 left-2 bg-amber-500 text-white">
              Editor's Pick
            </Badge>
          )}
        </div>

        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge className={getCategoryColor(product.category)}>
              {product.category}
            </Badge>
            {product.rating && (
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-amber-400 fill-current" />
                <span className="text-sm text-sage-600">{product.rating}</span>
              </div>
            )}
          </div>
          
          <CardTitle className="text-sage-800 leading-tight line-clamp-2">
            {product.name}
          </CardTitle>
          <CardDescription className="text-sage-600 line-clamp-3">
            {product.description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {product.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {product.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{product.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Price */}
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-sage-800">
                £{product.price}
              </span>
              <div className="text-right">
                <div className="text-xs text-sage-500">Starting from</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {product.affiliateLink ? (
                <Button 
                  className="w-full bg-sage-600 hover:bg-sage-700 text-white"
                  onClick={handlePurchaseClick}
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
                onClick={onViewDetails}
              >
                <Info className="w-4 h-4 mr-2" />
                Learn More
              </Button>
            </div>

            {/* Additional Info */}
            <div className="pt-2 border-t border-sage-100">
              <div className="flex items-center justify-between text-xs text-sage-500">
                <span>Free shipping on orders over £50</span>
                <span>30-day return policy</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
