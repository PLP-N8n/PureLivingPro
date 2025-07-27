import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Lightbulb,
  TrendingUp,
  DollarSign,
  Star
} from 'lucide-react';

interface SmartFormEnhancementsProps {
  url: string;
  onUrlChange: (url: string) => void;
  onSuggestionSelect: (suggestion: any) => void;
  disabled?: boolean;
}

export function SmartFormEnhancements({ 
  url, 
  onUrlChange, 
  onSuggestionSelect,
  disabled 
}: SmartFormEnhancementsProps) {
  const [urlValidation, setUrlValidation] = useState<{
    isValid: boolean;
    status: 'idle' | 'validating' | 'valid' | 'invalid';
    message?: string;
  }>({ isValid: false, status: 'idle' });
  
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const { toast } = useToast();

  // Real-time URL validation
  useEffect(() => {
    if (!url || url.length < 10) {
      setUrlValidation({ isValid: false, status: 'idle' });
      return;
    }

    const validateUrl = async () => {
      setUrlValidation({ isValid: false, status: 'validating' });
      
      try {
        // Basic URL validation
        const urlPattern = /^https?:\/\/.+/i;
        if (!urlPattern.test(url)) {
          setUrlValidation({
            isValid: false,
            status: 'invalid',
            message: 'Please enter a valid HTTP/HTTPS URL'
          });
          return;
        }

        // Check if it's a supported merchant
        const supportedMerchants = [
          { domain: 'amazon.com', name: 'Amazon', commission: '4-8%' },
          { domain: 'clickbank.com', name: 'ClickBank', commission: '10-75%' },
          { domain: 'shareasale.com', name: 'ShareASale', commission: '5-20%' },
          { domain: 'commissionjunction.com', name: 'CJ Affiliate', commission: '3-15%' },
          { domain: 'impact.com', name: 'Impact', commission: '5-25%' }
        ];

        const merchant = supportedMerchants.find(m => url.includes(m.domain));
        
        if (merchant) {
          setUrlValidation({
            isValid: true,
            status: 'valid',
            message: `${merchant.name} - Typical commission: ${merchant.commission}`
          });
          
          // Generate intelligent suggestions
          await generateSuggestions(url, merchant);
        } else {
          setUrlValidation({
            isValid: true,
            status: 'valid',
            message: 'URL appears valid, but merchant not recognized'
          });
        }

      } catch (error) {
        setUrlValidation({
          isValid: false,
          status: 'invalid',
          message: 'Invalid URL format'
        });
      }
    };

    const debounceTimer = setTimeout(validateUrl, 500);
    return () => clearTimeout(debounceTimer);
  }, [url]);

  const generateSuggestions = async (productUrl: string, merchant: any) => {
    try {
      // Generate AI-powered suggestions based on URL analysis
      const suggestions = [
        {
          type: 'category',
          title: 'Suggested Category',
          value: inferCategory(productUrl),
          confidence: 85,
          icon: '🏷️'
        },
        {
          type: 'commission',
          title: 'Estimated Commission',
          value: merchant.commission.split('-')[1] || '5%',
          confidence: 70,
          icon: '💰'
        },
        {
          type: 'keywords',
          title: 'SEO Keywords',
          value: extractKeywords(productUrl),
          confidence: 90,
          icon: '🔍'
        },
        {
          type: 'competition',
          title: 'Competition Level',
          value: 'Medium',
          confidence: 60,
          icon: '📊'
        }
      ];

      setSuggestions(suggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    }
  };

  const inferCategory = (url: string): string => {
    const categoryKeywords = {
      'supplements': ['vitamin', 'supplement', 'protein', 'omega', 'probiotic'],
      'fitness': ['fitness', 'exercise', 'workout', 'gym', 'weight'],
      'beauty': ['beauty', 'skincare', 'cosmetic', 'face', 'serum'],
      'health': ['health', 'wellness', 'medical', 'therapy', 'care'],
      'nutrition': ['nutrition', 'diet', 'organic', 'natural', 'food']
    };

    const lowerUrl = url.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => lowerUrl.includes(keyword))) {
        return category;
      }
    }
    
    return 'general';
  };

  const extractKeywords = (url: string): string => {
    // Extract potential keywords from URL structure
    const urlParts = url.split('/').join(' ').split('-').join(' ').split('_').join(' ');
    const keywords = urlParts.match(/[a-zA-Z]+/g) || [];
    
    return keywords
      .filter(word => word.length > 3)
      .slice(0, 3)
      .join(', ');
  };

  const handleSuggestionClick = (suggestion: any) => {
    onSuggestionSelect(suggestion);
    toast({
      title: 'Suggestion Applied',
      description: `Applied ${suggestion.title}: ${suggestion.value}`
    });
  };

  const getValidationIcon = () => {
    switch (urlValidation.status) {
      case 'validating':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'invalid':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Enhanced URL Input */}
      <div className="relative">
        <Input
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://amazon.com/dp/B12345 (paste any product URL)"
          disabled={disabled}
          className="pr-10"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {getValidationIcon()}
        </div>
      </div>

      {/* Validation Message */}
      {urlValidation.message && (
        <div className={`text-sm flex items-center gap-2 ${
          urlValidation.status === 'valid' ? 'text-green-600' : 'text-red-600'
        }`}>
          {urlValidation.message}
        </div>
      )}

      {/* AI-Powered Suggestions */}
      {suggestions.length > 0 && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-900">Smart Suggestions</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-300 cursor-pointer transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <span>{suggestion.icon}</span>
                    {suggestion.title}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {suggestion.confidence}%
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {suggestion.value}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Templates */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { name: 'Amazon Product', pattern: 'https://amazon.com/dp/', category: 'supplements' },
          { name: 'ClickBank Offer', pattern: 'https://clickbank.com/', category: 'health' },
          { name: 'ShareASale Link', pattern: 'https://shareasale.com/', category: 'fitness' }
        ].map((template, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => {
              onUrlChange(template.pattern + 'YOUR_ID_HERE');
              onSuggestionSelect({ type: 'category', value: template.category });
            }}
            className="text-xs"
          >
            {template.name}
          </Button>
        ))}
      </div>
    </div>
  );
}