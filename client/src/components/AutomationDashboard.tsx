import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  Pause, 
  Settings, 
  DollarSign, 
  TrendingUp, 
  Users, 
  BarChart3,
  Bot,
  Link,
  MessageSquare,
  Target,
  Zap
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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState('overview');

  // Fetch automation status
  const { data: status, isLoading: statusLoading } = useQuery({
    queryKey: ['/api/automation/status'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch affiliate links
  const { data: affiliateLinks = [] } = useQuery({
    queryKey: ['/api/affiliate-links'],
    enabled: selectedTab === 'affiliate',
  });

  // Fetch content pipeline
  const { data: contentPipeline = [] } = useQuery({
    queryKey: ['/api/content-pipeline'],
    enabled: selectedTab === 'content',
  });

  // Fetch revenue stats
  const { data: revenueStats } = useQuery({
    queryKey: ['/api/revenue/stats'],
    enabled: selectedTab === 'revenue',
  });

  // Automation control mutations
  const startAutomation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/automation/start'),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Automation system started successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/automation/status'] });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const stopAutomation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/automation/stop'),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Automation system stopped successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/automation/status'] });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const triggerAction = useMutation({
    mutationFn: (type: string) => apiRequest('POST', `/api/automation/trigger/${type}`),
    onSuccess: (_, type) => {
      toast({ title: 'Success', description: `${type} triggered successfully` });
      queryClient.invalidateQueries({ queryKey: ['/api/automation/status'] });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  // Create affiliate link mutation
  const createAffiliateLink = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/affiliate-links', data),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Affiliate link created successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/affiliate-links'] });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  // Create content pipeline mutation
  const createContent = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/content-pipeline', data),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Content creation started successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/content-pipeline'] });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const OverviewTab = () => (
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

  const AffiliateTab = () => {
    const [newLink, setNewLink] = useState({
      url: '',
      merchant: '',
      productName: '',
      category: '',
      commission: ''
    });

    const handleCreateLink = () => {
      createAffiliateLink.mutate({
        ...newLink,
        commission: parseFloat(newLink.commission) || 0,
        status: 'pending'
      });
      setNewLink({ url: '', merchant: '', productName: '', category: '', commission: '' });
    };

    return (
      <div className="space-y-6">
        {/* Create New Affiliate Link */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Affiliate Link</CardTitle>
            <CardDescription>Manually add affiliate links to the automation system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="url">Affiliate URL</Label>
                <Input
                  id="url"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  placeholder="https://amazon.com/dp/..."
                />
              </div>
              <div>
                <Label htmlFor="merchant">Merchant</Label>
                <Input
                  id="merchant"
                  value={newLink.merchant}
                  onChange={(e) => setNewLink({ ...newLink, merchant: e.target.value })}
                  placeholder="Amazon, ClickBank, etc."
                />
              </div>
              <div>
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={newLink.productName}
                  onChange={(e) => setNewLink({ ...newLink, productName: e.target.value })}
                  placeholder="Premium Omega-3 Supplement"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newLink.category} onValueChange={(value) => setNewLink({ ...newLink, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supplements">Supplements</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="meditation">Meditation</SelectItem>
                    <SelectItem value="skincare">Skincare</SelectItem>
                    <SelectItem value="nutrition">Nutrition</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
  };

  const ContentTab = () => {
    const [newContent, setNewContent] = useState({
      title: '',
      contentType: 'blog',
      targetPlatform: 'blog',
      aiProvider: 'deepseek',
      prompt: ''
    });

    const handleCreateContent = () => {
      createContent.mutate({
        ...newContent,
        scheduledFor: new Date().toISOString()
      });
      setNewContent({ title: '', contentType: 'blog', targetPlatform: 'blog', aiProvider: 'deepseek', prompt: '' });
    };

    return (
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
            <CardDescription>Track your automated content generation</CardDescription>
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
                      Created: {new Date(content.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant={
                    content.status === 'completed' ? 'default' :
                    content.status === 'generating' ? 'secondary' :
                    content.status === 'failed' ? 'destructive' : 'outline'
                  }>
                    {content.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const RevenueTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Revenue Analytics
          </CardTitle>
          <CardDescription>Track your automated revenue generation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div className="text-sm text-muted-foreground">Conversion Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Performance</CardTitle>
          <CardDescription>How your automated content is performing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    { id: 'overview', label: 'Overview', icon: BarChart3, component: OverviewTab },
    { id: 'affiliate', label: 'Affiliate Links', icon: Link, component: AffiliateTab },
    { id: 'content', label: 'Content Pipeline', icon: MessageSquare, component: ContentTab },
    { id: 'revenue', label: 'Revenue', icon: DollarSign, component: RevenueTab },
  ];

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
      {tabs.find(tab => tab.id === selectedTab)?.component()}
    </div>
  );
}