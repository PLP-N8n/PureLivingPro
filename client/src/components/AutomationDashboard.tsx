import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Bot, 
  BarChart3, 
  Play, 
  Pause, 
  Zap, 
  Link, 
  MessageSquare, 
  Target, 
  TrendingUp,
  DollarSign,
  RefreshCw,
  ExternalLink,
  Package,
  FileText,
  Plus,
  Upload,
  Sparkles,
  Settings
} from 'lucide-react';
import { BulkImportModal } from '@/components/admin/BulkImportModal';
import { SmartFormEnhancements } from '@/components/admin/SmartFormEnhancements';
import { AdvancedAutomationFeatures } from '@/components/admin/AdvancedAutomationFeatures';

interface AutomationStatus {
  isRunning: boolean;
  lastCycle: string;
  systemLoad: string;
  activeRules: number;
  revenueToday: string;
  contentGenerated: number;
  socialPosts: number;
  affiliateClicks: number;
}

interface AffiliateLink {
  id: number;
  url: string;
  merchant: string;
  productName: string;
  category: string;
  commission: number;
  status: string;
  isActive: boolean;
}

interface ContentPipeline {
  id: number;
  title: string;
  contentType: string;
  targetPlatform: string;
  status: string;
  aiProvider: string;
  createdAt: string;
}

export function AutomationDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showBulkImport, setShowBulkImport] = useState(false);

  // All state hooks at component level
  const [newLink, setNewLink] = useState({
    url: '',
    merchant: '',
    productName: '',
    category: '',
    commission: '',
    description: '',
    imageUrl: ''
  });

  const [isScrapingUrl, setIsScrapingUrl] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [newContent, setNewContent] = useState({
    title: '',
    contentType: 'blog',
    targetPlatform: 'blog',
    aiProvider: 'deepseek',
    prompt: ''
  });

  // All queries at component level
  const { data: statusResponse, refetch: refetchStatus } = useQuery({
    queryKey: ['/api/automation/status'],
    refetchInterval: 30000
  });

  // Extract data from response structure
  const status = (statusResponse as any)?.data;

  const { data: affiliateLinksResponse, refetch: refetchAffiliateLinks } = useQuery({
    queryKey: ['/api/affiliate-links'],
    enabled: selectedTab === 'affiliate',
    refetchInterval: selectedTab === 'affiliate' ? 30000 : false, // Refresh every 30 seconds when tab is active
    staleTime: 0, // Always consider data stale
    gcTime: 0 // Don't cache results (formerly cacheTime in v4)
  });

  const { data: contentPipelineResponse } = useQuery({
    queryKey: ['/api/content-pipeline'],
    enabled: selectedTab === 'content'
  });

  // Extract data from response structure
  const affiliateLinks = (affiliateLinksResponse as any)?.data || [];
  const contentPipeline = (contentPipelineResponse as any)?.data || [];

  const { data: revenueStatsResponse } = useQuery({
    queryKey: ['/api/revenue/stats'],
    enabled: selectedTab === 'revenue'
  });

  // Extract data from response structure
  const revenueStats = (revenueStatsResponse as any)?.data;

  // All mutations at component level
  const startAutomation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/automation/start'),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Automation started successfully' });
      refetchStatus();
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const stopAutomation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/automation/stop'),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Automation stopped successfully' });
      refetchStatus();
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const triggerAction = useMutation({
    mutationFn: (type: string) => apiRequest('POST', `/api/automation/trigger/${type}`),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Action triggered successfully' });
      refetchStatus();
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const createAffiliateLink = useMutation({
    mutationFn: async (linkData: any) => {
      const response = await apiRequest('POST', '/api/affiliate-links', linkData);
      return response.json();
    },
    onSuccess: (data) => {
      // Clear form
      setNewLink({ 
        url: '', 
        merchant: '', 
        productName: '', 
        category: '', 
        commission: '', 
        description: '', 
        imageUrl: '' 
      });
      
      // Force refresh affiliate links list
      queryClient.invalidateQueries({ queryKey: ['/api/affiliate-links'] });
      
      // Also trigger immediate refetch
      refetchAffiliateLinks();
      
      toast({ 
        title: 'Success', 
        description: `Affiliate link added: ${data?.data?.productName || 'Link added successfully'}` 
      });
    },
    onError: (error: any) => {
      console.error('Create affiliate link error:', error);
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to create affiliate link', 
        variant: 'destructive' 
      });
    }
  });

  const createContent = useMutation({
    mutationFn: (contentData: any) => apiRequest('POST', '/api/content-pipeline', contentData),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Content creation initiated successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/content-pipeline'] });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const handleCreateLink = () => {
    if (!newLink.url || !newLink.productName) {
      toast({ title: 'Error', description: 'Please fill in URL and product name', variant: 'destructive' });
      return;
    }

    // Prepare data with proper validation
    const linkData = {
      ...newLink,
      commission: newLink.commission || '0', // Keep as string
      description: newLink.description ? newLink.description.substring(0, 500) : '', // Truncate description to 500 chars
      status: 'pending'
    };

    createAffiliateLink.mutate(linkData);
  };

  const handleScrapeUrl = async () => {
    if (!newLink.url) {
      toast({ title: 'Error', description: 'Please enter a URL first', variant: 'destructive' });
      return;
    }

    setIsScrapingUrl(true);
    try {
      const response = await apiRequest('POST', '/api/affiliate-links/scrape', {
        url: newLink.url,
        aiProvider: 'deepseek'
      });

      // Parse JSON response
      const jsonResponse = await response.json();
      console.log('Parsed API response:', jsonResponse);

      // Validate response structure
      if (!jsonResponse || !jsonResponse.success) {
        throw new Error(jsonResponse?.error?.message || jsonResponse?.error || 'Failed to scrape URL');
      }

      const scrapedData = jsonResponse.data;
      if (!scrapedData) {
        throw new Error('No data received from scraping service');
      }

      console.log('Extracted scraped data:', scrapedData);
      
      // Ensure all required fields exist with fallbacks
      const extractedData = {
        merchant: scrapedData.merchant || 'Unknown Merchant',
        productName: scrapedData.productName || 'Product Name Not Found',
        category: scrapedData.category || 'general',
        commission: scrapedData.commission ? scrapedData.commission.toString() : '5',
        description: (scrapedData.description || 'Product description not available').substring(0, 500), // Truncate to 500 chars
        imageUrl: scrapedData.imageUrl || ''
      };

      setNewLink({
        ...newLink,
        ...extractedData
      });

      toast({ 
        title: 'Success', 
        description: `Extracted: ${extractedData.productName}` 
      });

      // Force refresh of affiliate links cache
      queryClient.invalidateQueries({ queryKey: ['/api/affiliate-links'] });
      
      // Also trigger immediate refetch
      refetchAffiliateLinks();
      
    } catch (error: any) {
      console.error('URL scraping error:', error);
      
      // Extract meaningful error message
      let errorMessage = 'Failed to extract product information';
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      // Handle authentication errors specifically
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        errorMessage = 'Please log in to use the URL scraping feature';
      }
      
      toast({ 
        title: 'Scraping Failed', 
        description: errorMessage, 
        variant: 'destructive' 
      });
    } finally {
      setIsScrapingUrl(false);
    }
  };

  const handleCreateContent = () => {
    createContent.mutate({
      ...newContent,
      scheduledFor: new Date().toISOString()
    });
    setNewContent({ 
      title: '', 
      contentType: 'blog', 
      targetPlatform: 'blog', 
      aiProvider: 'deepseek', 
      prompt: '' 
    });
  };

  // Automation workflow functions
  const handleBulkConversion = async () => {
    setIsProcessing(true);
    try {
      const response = await apiRequest('POST', '/api/automation/convert-links-to-products', {
        maxLinks: 5
      });
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: 'Success',
          description: `Created ${result.data.productsCreated} products from affiliate links`
        });
        refetchAffiliateLinks();
      } else {
        throw new Error(result.error || 'Failed to convert links');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to convert affiliate links to products',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateBlogs = async () => {
    setIsProcessing(true);
    try {
      const response = await apiRequest('POST', '/api/automation/generate-category-blogs');
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: 'Success',
          description: `Generated ${result.data.blogsCreated} blog posts from product categories`
        });
      } else {
        throw new Error(result.error || 'Failed to generate blogs');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate blog content',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFullWorkflow = async () => {
    setIsProcessing(true);
    try {
      const response = await apiRequest('POST', '/api/automation/content-workflow', {
        processUnprocessedLinks: true,
        createProducts: true,
        createBlogs: true,
        maxLinksToProcess: 3
      });
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: 'Full Automation Complete',
          description: `Created ${result.data.productsCreated} products and ${result.data.blogsCreated} blogs`
        });
        refetchAffiliateLinks();
      } else {
        throw new Error(result.error || 'Full automation failed');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Full automation workflow failed',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Render functions
  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Automation System Status
          </CardTitle>
          <CardDescription>Real-time automation system monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{status?.isRunning ? 'RUNNING' : 'STOPPED'}</div>
              <div className="text-sm text-muted-foreground">System Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{status?.activeRules || 0}</div>
              <div className="text-sm text-muted-foreground">Active Rules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{status?.revenueToday || '$0'}</div>
              <div className="text-sm text-muted-foreground">Revenue Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{status?.contentGenerated || 0}</div>
              <div className="text-sm text-muted-foreground">Content Generated</div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={() => status?.isRunning ? stopAutomation.mutate() : startAutomation.mutate()}
              disabled={startAutomation.isPending || stopAutomation.isPending}
              variant={status?.isRunning ? 'destructive' : 'default'}
              className="flex items-center gap-2"
            >
              {status?.isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {status?.isRunning ? 'Stop Automation' : 'Start Automation'}
            </Button>

            <Button 
              variant="outline" 
              onClick={() => triggerAction.mutate('content_creation')}
              disabled={triggerAction.isPending}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Trigger Content Creation
            </Button>

            <Button 
              variant="outline" 
              onClick={() => triggerAction.mutate('affiliate_scraping')}
              disabled={triggerAction.isPending}
              className="flex items-center gap-2"
            >
              <Link className="h-4 w-4" />
              Scrape Affiliate Links
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Social Posts</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status?.socialPosts || 0}</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Affiliate Clicks</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status?.affiliateClicks || 0}</div>
            <p className="text-xs text-muted-foreground">+8% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2%</div>
            <p className="text-xs text-muted-foreground">+0.3% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Load</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status?.systemLoad || 'Normal'}</div>
            <p className="text-xs text-muted-foreground">Optimal performance</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAffiliateTab = () => (
    <div className="space-y-6">
      {/* Create New Affiliate Link */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Affiliate Link</CardTitle>
          <CardDescription>Register a new affiliate link for automation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {/* Enhanced URL Input with Smart Features */}
            <SmartFormEnhancements
              url={newLink.url}
              onUrlChange={(url) => setNewLink({ ...newLink, url })}
              onSuggestionSelect={(suggestion) => {
                if (suggestion.type === 'category') {
                  setNewLink({ ...newLink, category: suggestion.value });
                } else if (suggestion.type === 'commission') {
                  setNewLink({ ...newLink, commission: suggestion.value.replace('%', '') });
                }
                // Handle other suggestion types as needed
              }}
              disabled={isScrapingUrl}
            />

            {/* Auto-Fill Button */}
            <div className="flex gap-2">
              <Button 
                onClick={handleScrapeUrl} 
                disabled={isScrapingUrl || !newLink.url}
                variant="outline"
                className="flex items-center gap-2"
              >
                {isScrapingUrl ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
                {isScrapingUrl ? 'Scraping...' : 'Auto-Fill'}
              </Button>
              
              <Button 
                onClick={() => setShowBulkImport(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Bulk Import
              </Button>
            </div>

            {/* Auto-filled Product Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="merchant">Merchant</Label>
                <Input
                  id="merchant"
                  value={newLink.merchant}
                  onChange={(e) => setNewLink({ ...newLink, merchant: e.target.value })}
                  placeholder="Amazon (auto-filled)"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newLink.category}
                  onChange={(e) => setNewLink({ ...newLink, category: e.target.value })}
                  placeholder="supplements (auto-filled)"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={newLink.productName}
                  onChange={(e) => setNewLink({ ...newLink, productName: e.target.value })}
                  placeholder="Premium Omega-3 Fish Oil (auto-filled)"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newLink.description}
                  onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                  placeholder="Product description (auto-filled)"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="commission">Commission (%)</Label>
                <Input
                  id="commission"
                  type="number"
                  value={newLink.commission}
                  onChange={(e) => setNewLink({ ...newLink, commission: e.target.value })}
                  placeholder="5.0 (auto-filled)"
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={newLink.imageUrl}
                  onChange={(e) => setNewLink({ ...newLink, imageUrl: e.target.value })}
                  placeholder="https://... (auto-filled)"
                />
              </div>
            </div>

            {/* Action Buttons - Primary Row */}
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleCreateLink} 
                disabled={createAffiliateLink.isPending}
                className="bg-sage-600 hover:bg-sage-700"
              >
                {createAffiliateLink.isPending ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Add Affiliate Link
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setNewLink({
                    url: 'https://www.amazon.com/dp/B08H8YZPXT',
                    merchant: 'Amazon',
                    productName: 'Ashwagandha 1300mg - Premium Root Powder with Black Pepper',
                    category: 'Herbal Supplements',
                    commission: '4',
                    description: 'Organic Ashwagandha root powder supplement with black pepper for enhanced absorption. Supports stress management and overall wellness.',
                    imageUrl: 'https://m.media-amazon.com/images/I/61mj0BqL+5L._AC_SL1500_.jpg'
                  });
                  toast({ title: 'Demo Data Loaded', description: 'Sample affiliate link loaded for testing' });
                }}
                className="flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Load Demo Data
              </Button>
            </div>

            {/* Workflow Automation Buttons - Secondary Row */}
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                onClick={handleBulkConversion}
                disabled={isProcessing}
                className="flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                {isProcessing ? 'Converting...' : 'Convert to Products'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleGenerateBlogs}
                disabled={isProcessing}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                {isProcessing ? 'Generating...' : 'Generate Blog Content'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleFullWorkflow}
                disabled={isProcessing}
                className="flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                {isProcessing ? 'Running...' : 'Full Automation'}
              </Button>
            </div>

            {/* Management Links - Tertiary Row */}
            <div className="flex gap-2 pt-3 border-t mt-3">
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => window.open('/admin', '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Manage Products & Blogs
              </Button>
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => window.open('/analytics', '_blank')}
                className="flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                View Analytics
              </Button>
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => window.open('/automation', '_blank')}
                className="flex items-center gap-2"
              >
                <Bot className="w-4 h-4" />
                Advanced Control
              </Button>
            </div>

            {/* Pro Tips Section */}
            <div className="text-sm text-muted-foreground space-y-1 mt-4 p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center">
                💡 Just paste any product URL and click "Auto-Fill" to extract all details automatically
              </div>
              <div className="text-xs opacity-75">
                💡 <strong>Pro tip:</strong> Use full Amazon URLs (amazon.com/dp/...) instead of short links (amzn.to) for better results
              </div>
              <div className="text-xs opacity-75 text-blue-600">
                🚀 <strong>Quick Start:</strong> Click "Load Demo Data" to test the automation workflow when scraping fails
              </div>
              <div className="text-xs opacity-75 text-amber-600 mt-2 p-2 bg-amber-50 rounded">
                ⚠️ <strong>When scraping fails:</strong> Many websites block automated requests. Use "Load Demo Data" for testing, or manually fill in product details.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Affiliate Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link className="w-5 h-5" />
              Affiliate Links ({affiliateLinks.length})
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetchAffiliateLinks()}
              className="flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </CardTitle>
          <CardDescription>Manage your affiliate link database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Automation Actions */}
            <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
              <Button 
                onClick={() => handleBulkConversion()}
                disabled={isProcessing}
                className="flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                {isProcessing ? 'Converting...' : 'Convert to Products'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleGenerateBlogs()}
                disabled={isProcessing}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Generate Blog Content
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleFullWorkflow()}
                disabled={isProcessing}
                className="flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Full Automation
              </Button>
            </div>

            {/* Affiliate Links List */}
            {affiliateLinks.map((link: AffiliateLink) => (
              <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{link.productName}</div>
                  <div className="text-sm text-muted-foreground">{link.merchant} • {link.category}</div>
                  <div className="text-xs text-muted-foreground">{link.url}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">{link.commission}%</div>
                    <Badge variant={link.status === 'approved' ? 'default' : 'secondary'}>
                      {link.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContentTab = () => (
    <div className="space-y-6">
      {/* Create New Content */}
      <Card>
        <CardHeader>
          <CardTitle>Create AI Content</CardTitle>
          <CardDescription>Generate wellness content using AI automation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Content Title</Label>
              <Input
                id="title"
                value={newContent.title}
                onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                placeholder="5 Morning Rituals for Better Energy"
              />
            </div>
            <div>
              <Label htmlFor="contentType">Content Type</Label>
              <Select value={newContent.contentType} onValueChange={(value) => setNewContent({ ...newContent, contentType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog">Blog Post</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="video">Video Script</SelectItem>
                  <SelectItem value="audio">Audio Script</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="targetPlatform">Target Platform</Label>
              <Select value={newContent.targetPlatform} onValueChange={(value) => setNewContent({ ...newContent, targetPlatform: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="x">X (Twitter)</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="aiProvider">AI Provider</Label>
              <Select value={newContent.aiProvider} onValueChange={(value) => setNewContent({ ...newContent, aiProvider: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deepseek">DeepSeek (Cost-Effective)</SelectItem>
                  <SelectItem value="openai">OpenAI (Premium)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="prompt">Custom Prompt (Optional)</Label>
            <Textarea
              id="prompt"
              value={newContent.prompt}
              onChange={(e) => setNewContent({ ...newContent, prompt: e.target.value })}
              placeholder="Add specific instructions for the AI..."
              rows={3}
            />
          </div>
          <Button onClick={handleCreateContent} disabled={createContent.isPending}>
            Generate Content
          </Button>
        </CardContent>
      </Card>

      {/* Content Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Content Pipeline ({contentPipeline.length})</CardTitle>
          <CardDescription>Track AI-generated content creation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contentPipeline.map((content: ContentPipeline) => (
              <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{content.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {content.contentType} • {content.targetPlatform} • {content.aiProvider}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(content.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={
                    content.status === 'completed' ? 'default' : 
                    content.status === 'generating' ? 'secondary' : 
                    'outline'
                  }>
                    {content.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRevenueTab = () => (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Revenue Analytics
          </CardTitle>
          <CardDescription>Track affiliate marketing performance and revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                ${revenueStats?.revenue?.totalRevenue || '0.00'}
              </div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {revenueStats?.revenue?.totalClicks || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Clicks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {((revenueStats?.revenue?.avgConversion || 0) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Conversion</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Content Performance</CardTitle>
          <CardDescription>AI-generated content engagement and revenue metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {revenueStats?.engagement?.avgEngagement || 0}
              </div>
              <div className="text-sm text-muted-foreground">Avg Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {revenueStats?.engagement?.totalPosts || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Posts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                ${revenueStats?.engagement?.totalRevenue || '0.00'}
              </div>
              <div className="text-sm text-muted-foreground">Content Revenue</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'affiliate', label: 'Affiliate Links', icon: Link },
    { id: 'content', label: 'Content Pipeline', icon: MessageSquare },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'advanced', label: 'Advanced AI', icon: Sparkles },
  ];

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return renderOverviewTab();
      case 'affiliate':
        return renderAffiliateTab();
      case 'content':
        return renderContentTab();
      case 'revenue':
        return renderRevenueTab();
      case 'advanced':
        return <AdvancedAutomationFeatures />;
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Automation & System Control</h1>
        <p className="text-muted-foreground">
          Manage your automated affiliate marketing and content creation system
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
                selectedTab === tab.id
                  ? 'bg-background border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Bulk Import Modal */}
      <BulkImportModal 
        isOpen={showBulkImport} 
        onClose={() => setShowBulkImport(false)} 
      />
    </div>
  );
}