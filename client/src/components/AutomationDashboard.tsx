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
  RefreshCw
} from 'lucide-react';

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

  // All state hooks at component level
  const [newLink, setNewLink] = useState({
    url: '',
    merchant: '',
    productName: '',
    category: '',
    commission: ''
  });

  const [newContent, setNewContent] = useState({
    title: '',
    contentType: 'blog',
    targetPlatform: 'blog',
    aiProvider: 'deepseek',
    prompt: ''
  });

  // All queries at component level
  const { data: status, refetch: refetchStatus } = useQuery({
    queryKey: ['/api/automation/status'],
    refetchInterval: 30000
  });

  const { data: affiliateLinks = [] } = useQuery({
    queryKey: ['/api/affiliate-links'],
    enabled: selectedTab === 'affiliate'
  });

  const { data: contentPipeline = [] } = useQuery({
    queryKey: ['/api/content-pipeline'],
    enabled: selectedTab === 'content'
  });

  const { data: revenueStats } = useQuery({
    queryKey: ['/api/revenue/stats'],
    enabled: selectedTab === 'revenue'
  });

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
    mutationFn: (linkData: any) => apiRequest('POST', '/api/affiliate-links', linkData),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Affiliate link created successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/affiliate-links'] });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
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
    createAffiliateLink.mutate({
      ...newLink,
      commission: parseFloat(newLink.commission) || 0,
      status: 'pending'
    });
    setNewLink({ url: '', merchant: '', productName: '', category: '', commission: '' });
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="url">Affiliate URL</Label>
              <Input
                id="url"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                placeholder="https://amazon.com/dp/B12345"
              />
            </div>
            <div>
              <Label htmlFor="merchant">Merchant</Label>
              <Input
                id="merchant"
                value={newLink.merchant}
                onChange={(e) => setNewLink({ ...newLink, merchant: e.target.value })}
                placeholder="Amazon"
              />
            </div>
            <div>
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={newLink.productName}
                onChange={(e) => setNewLink({ ...newLink, productName: e.target.value })}
                placeholder="Premium Omega-3 Fish Oil"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={newLink.category}
                onChange={(e) => setNewLink({ ...newLink, category: e.target.value })}
                placeholder="supplements"
              />
            </div>
          </div>
          <div className="flex gap-4 items-end">
            <div className="w-32">
              <Label htmlFor="commission">Commission (%)</Label>
              <Input
                id="commission"
                type="number"
                value={newLink.commission}
                onChange={(e) => setNewLink({ ...newLink, commission: e.target.value })}
                placeholder="5.0"
              />
            </div>
            <Button onClick={handleCreateLink} disabled={createAffiliateLink.isPending}>
              Add Affiliate Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Affiliate Links */}
      <Card>
        <CardHeader>
          <CardTitle>Affiliate Links ({affiliateLinks.length})</CardTitle>
          <CardDescription>Manage your affiliate link database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
    </div>
  );
}