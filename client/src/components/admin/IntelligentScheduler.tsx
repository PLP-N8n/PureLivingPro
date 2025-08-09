import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Clock, 
  Calendar, 
  TrendingUp, 
  Target, 
  Brain,
  BarChart3,
  Zap,
  Globe,
  Users,
  MessageSquare,
  DollarSign,
  AlertCircle,
  CheckCircle,
  PlayCircle,
  PauseCircle
} from 'lucide-react';

interface ScheduledTask {
  id: string;
  name: string;
  type: 'content_creation' | 'link_discovery' | 'optimization' | 'analysis';
  schedule: string;
  nextRun: string;
  lastRun?: string;
  status: 'active' | 'paused' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedDuration: string;
  successRate: number;
  impact: string;
}

interface OptimalTiming {
  platform: string;
  optimalTimes: string[];
  engagement: number;
  conversion: number;
  competition: number;
}

export function IntelligentScheduler() {
  const [isLearning, setIsLearning] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch scheduled tasks
  const { data: scheduledTasks = [] } = useQuery<any>({
    queryKey: ['/api/scheduler/tasks'],
    refetchInterval: 30000,
    select: (data: any) => data?.data || []
  });

  // Fetch optimal timing data
  const { data: optimalTimings = [] } = useQuery<any>({
    queryKey: ['/api/scheduler/optimal-timings'],
    select: (data: any) => data?.data || []
  });

  // Fetch scheduler metrics
  const { data: schedulerMetrics } = useQuery<any>({
    queryKey: ['/api/scheduler/metrics'],
    refetchInterval: 60000,
    select: (data: any) => data?.data || {}
  });

  // AI optimization mutation
  const optimizeSchedule = useMutation({
    mutationFn: () => apiRequest('POST', '/api/scheduler/optimize'),
    onSuccess: () => {
      toast({
        title: 'Schedule Optimized',
        description: 'AI has optimized your schedule for maximum performance'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/scheduler/tasks'] });
    }
  });

  // Force learning cycle
  const forceLearning = useMutation({
    mutationFn: () => apiRequest('POST', '/api/scheduler/learn'),
    onSuccess: () => {
      toast({
        title: 'Learning Initiated',
        description: 'AI is analyzing patterns to improve scheduling'
      });
      setIsLearning(true);
      setTimeout(() => setIsLearning(false), 5000);
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'paused': return 'text-yellow-600';
      case 'completed': return 'text-blue-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Scheduler Overview */}
      <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-600" />
            Intelligent Task Scheduler
          </CardTitle>
          <CardDescription>
            AI-powered scheduling with optimal timing intelligence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">
                {schedulerMetrics?.efficiency || '94'}%
              </div>
              <div className="text-sm text-muted-foreground">Efficiency</div>
              <Progress value={schedulerMetrics?.efficiency || 94} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {schedulerMetrics?.activeTasks || 23}
              </div>
              <div className="text-sm text-muted-foreground">Active Tasks</div>
              <div className="mt-2 w-full h-2 bg-green-200 rounded-full">
                <div className="h-2 bg-green-600 rounded-full animate-pulse" style={{ width: '75%' }} />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {schedulerMetrics?.successRate || '91'}%
              </div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
              <Progress value={schedulerMetrics?.successRate || 91} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {schedulerMetrics?.timeSaved || '47'}h
              </div>
              <div className="text-sm text-muted-foreground">Time Saved</div>
              <div className="mt-2 text-xs text-green-600">This week</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                ${schedulerMetrics?.costOptimization || '1,247'}
              </div>
              <div className="text-sm text-muted-foreground">Cost Optimized</div>
              <div className="mt-2 text-xs text-green-600">Monthly</div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={() => optimizeSchedule.mutate()}
              disabled={optimizeSchedule.isPending}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              {optimizeSchedule.isPending ? 'Optimizing...' : 'AI Optimize'}
            </Button>
            
            <Button 
              onClick={() => forceLearning.mutate()}
              disabled={forceLearning.isPending || isLearning}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Brain className="h-4 w-4" />
              {isLearning ? 'Learning...' : 'Force Learning'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Optimal Timing Intelligence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Optimal Timing Intelligence
          </CardTitle>
          <CardDescription>
            AI-discovered best times for maximum engagement and conversion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {optimalTimings.map((timing: OptimalTiming) => (
              <div key={timing.platform} className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{timing.platform}</h4>
                  <Badge variant="outline">{timing.optimalTimes.length} slots</Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  {timing.optimalTimes.slice(0, 3).map((time, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{time}</span>
                      <span className="text-green-600 font-medium">Peak</span>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-medium text-blue-600">{(timing.engagement * 100).toFixed(0)}%</div>
                    <div className="text-muted-foreground">Engagement</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-green-600">{(timing.conversion * 100).toFixed(1)}%</div>
                    <div className="text-muted-foreground">Conversion</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-orange-600">{(timing.competition * 100).toFixed(0)}%</div>
                    <div className="text-muted-foreground">Competition</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Tasks Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Intelligent Task Queue ({scheduledTasks.length})
          </CardTitle>
          <CardDescription>
            AI-managed automation tasks with smart scheduling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scheduledTasks.map((task: ScheduledTask) => (
              <div key={task.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/30">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{task.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {task.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Schedule: {task.schedule} • Next: {new Date(task.nextRun).toLocaleString()}
                  </div>
                  
                  <div className="text-xs text-muted-foreground mt-1">
                    Duration: {task.estimatedDuration} • Success: {(task.successRate * 100).toFixed(0)}% • Impact: {task.impact}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getStatusColor(task.status)}`}>
                      {task.status.toUpperCase()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {task.priority} priority
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline">
                    {task.status === 'active' ? (
                      <PauseCircle className="h-4 w-4" />
                    ) : (
                      <PlayCircle className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Learning Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Learning Insights
          </CardTitle>
          <CardDescription>
            Patterns discovered by the AI scheduler
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Performance Patterns</h4>
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm">Morning posts (8-10 AM)</span>
                  <span className="text-sm font-medium text-green-600">+34% engagement</span>
                </div>
                <div className="flex justify-between p-2 bg-blue-50 rounded">
                  <span className="text-sm">Tuesday content creation</span>
                  <span className="text-sm font-medium text-blue-600">+28% efficiency</span>
                </div>
                <div className="flex justify-between p-2 bg-purple-50 rounded">
                  <span className="text-sm">Weekend optimization</span>
                  <span className="text-sm font-medium text-purple-600">+22% ROI</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Optimization Opportunities</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Reschedule link discovery to off-peak hours</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Batch similar tasks for 15% efficiency gain</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Auto-pause during low-engagement periods</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
