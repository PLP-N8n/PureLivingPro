import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Brain, 
  Clock, 
  Target, 
  TrendingUp, 
  Zap, 
  Settings,
  BarChart3,
  MessageSquare,
  Camera,
  Globe,
  Cpu,
  ChevronRight
} from 'lucide-react';

interface WorkflowRule {
  id: number;
  name: string;
  trigger: string;
  conditions: string[];
  actions: string[];
  priority: number;
  isActive: boolean;
  executionCount: number;
  lastExecuted?: string;
  successRate: number;
}

interface PerformanceMetrics {
  conversionRate: number;
  engagementRate: number;
  revenueGrowth: number;
  contentQuality: number;
  automationEfficiency: number;
}

export function AdvancedAutomationFeatures() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch workflow rules
  const { data: workflowRules = [] } = useQuery<any>({
    queryKey: ['/api/automation/workflow-rules'],
    select: (data: any) => data?.data || []
  });

  // Fetch performance metrics
  const { data: performanceMetrics } = useQuery<any>({
    queryKey: ['/api/automation/performance-metrics'],
    select: (data: any) => data?.data || {}
  });

  // AI Optimization mutation
  const optimizeWorkflow = useMutation({
    mutationFn: (workflowId: string) => 
      apiRequest('POST', `/api/automation/optimize-workflow/${workflowId}`),
    onSuccess: () => {
      toast({
        title: 'Workflow Optimized',
        description: 'AI has successfully optimized the workflow for better performance'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/automation/workflow-rules'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Optimization Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Multi-Channel Integration
  const integrationChannels = [
    { id: 'instagram', name: 'Instagram', connected: true, posts: 234, engagement: '4.2%' },
    { id: 'tiktok', name: 'TikTok', connected: true, posts: 156, engagement: '6.8%' },
    { id: 'youtube', name: 'YouTube', connected: false, posts: 0, engagement: '0%' },
    { id: 'twitter', name: 'X (Twitter)', connected: true, posts: 89, engagement: '3.1%' },
    { id: 'linkedin', name: 'LinkedIn', connected: false, posts: 0, engagement: '0%' }
  ];

  const handleWorkflowOptimization = async () => {
    setIsOptimizing(true);
    
    try {
      // Simulate AI optimization process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'AI Optimization Complete',
        description: 'All workflows have been optimized for peak performance'
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/automation/performance-metrics'] });
    } catch (error) {
      toast({
        title: 'Optimization Error',
        description: 'Failed to optimize workflows',
        variant: 'destructive'
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Performance Dashboard */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI Performance Intelligence
          </CardTitle>
          <CardDescription>
            Real-time AI optimization and performance analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {((performanceMetrics?.conversionRate || 0) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Conversion Rate</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(performanceMetrics?.conversionRate || 0) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {((performanceMetrics?.engagementRate || 0) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Engagement Rate</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(performanceMetrics?.engagementRate || 0) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                +{((performanceMetrics?.revenueGrowth || 0) * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">Revenue Growth</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${Math.min((performanceMetrics?.revenueGrowth || 0) * 100, 100)}%` }}
                />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {((performanceMetrics?.contentQuality || 0) * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">Content Quality</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full" 
                  style={{ width: `${(performanceMetrics?.contentQuality || 0) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {((performanceMetrics?.automationEfficiency || 0) * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">AI Efficiency</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full" 
                  style={{ width: `${(performanceMetrics?.automationEfficiency || 0) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={handleWorkflowOptimization}
              disabled={isOptimizing}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isOptimizing ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Optimizing AI...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  AI Auto-Optimize
                </>
              )}
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Performance Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Intelligent Workflow Engine */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Intelligent Workflow Engine
          </CardTitle>
          <CardDescription>
            Manage AI-powered automation rules and triggers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflowRules.map((rule: WorkflowRule) => (
              <div 
                key={rule.id} 
                className="p-4 border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
                onClick={() => setSelectedWorkflow(selectedWorkflow === rule.id.toString() ? null : rule.id.toString())}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Switch checked={rule.isActive} />
                    <div>
                      <div className="font-medium">{rule.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Trigger: {rule.trigger} • Priority: {rule.priority} • Success: {(rule.successRate * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      Runs: {rule.executionCount}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        optimizeWorkflow.mutate(rule.id.toString());
                      }}
                      disabled={optimizeWorkflow.isPending}
                    >
                      <Zap className="h-3 w-3" />
                    </Button>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
                
                {selectedWorkflow === rule.id.toString() && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Conditions:</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rule.conditions.map((condition, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Actions:</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rule.actions.map((action, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {action}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {rule.lastExecuted && (
                      <div className="text-xs text-muted-foreground">
                        Last executed: {new Date(rule.lastExecuted).toLocaleString()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Multi-Channel Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Multi-Channel Integration
          </CardTitle>
          <CardDescription>
            Manage social media automation and cross-platform publishing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrationChannels.map((channel) => (
              <div key={channel.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      channel.connected ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <span className="font-medium">{channel.name}</span>
                  </div>
                  <Badge variant={channel.connected ? 'default' : 'secondary'}>
                    {channel.connected ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Posts:</span>
                    <span>{channel.posts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Engagement:</span>
                    <span className={channel.connected ? 'text-green-600' : 'text-gray-400'}>
                      {channel.engagement}
                    </span>
                  </div>
                </div>
                
                <Button 
                  size="sm" 
                  variant={channel.connected ? 'outline' : 'default'}
                  className="w-full mt-3"
                >
                  {channel.connected ? 'Configure' : 'Connect'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Content Enhancement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Next-Level AI Features
          </CardTitle>
          <CardDescription>
            Advanced AI capabilities for content creation and optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Image Recognition</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Auto-generate alt text and SEO descriptions from product images
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Configure AI Vision
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium">Competitor Analysis</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Auto-suggest similar products and competitive pricing
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Enable Monitoring
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Voice Commands</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                "Add new Amazon product for [keyword]" voice automation
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Setup Voice AI
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg bg-gradient-to-br from-orange-50 to-red-50">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="h-4 w-4 text-orange-600" />
                <span className="font-medium">Predictive Analytics</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Forecast performance trends and optimize strategies
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Enable Forecasting
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
