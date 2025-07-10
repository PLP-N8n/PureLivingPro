import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Bot, 
  Brain, 
  Play, 
  Pause, 
  Settings, 
  Activity,
  Target,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Zap
} from 'lucide-react';

export function AutonomousControl() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [configOpen, setConfigOpen] = useState(false);

  // Get autonomous system status
  const { data: autonomousStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['/api/automation/autonomous/status'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Get scheduler status
  const { data: schedulerStatus } = useQuery({
    queryKey: ['/api/automation/scheduler/status'],
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  // Start autonomous mode
  const startAutonomous = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/automation/autonomous/start');
    },
    onSuccess: (response) => {
      const data = response.json();
      toast({
        title: "Autonomous Mode Started",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/automation/autonomous/status'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to Start",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Stop autonomous mode
  const stopAutonomous = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/automation/autonomous/stop');
    },
    onSuccess: (response) => {
      const data = response.json();
      toast({
        title: "Autonomous Mode Stopped",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/automation/autonomous/status'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to Stop",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Start scheduler
  const startScheduler = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/automation/scheduler/start');
    },
    onSuccess: () => {
      toast({
        title: "Scheduler Started",
        description: "Intelligent task scheduling is now active",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/automation/scheduler/status'] });
    },
    onError: (error) => {
      toast({
        title: "Scheduler Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Stop scheduler
  const stopScheduler = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/automation/scheduler/stop');
    },
    onSuccess: () => {
      toast({
        title: "Scheduler Stopped",
        description: "Task scheduling has been paused",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/automation/scheduler/status'] });
    },
    onError: (error) => {
      toast({
        title: "Scheduler Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const autonomousData = autonomousStatus?.data;
  const schedulerData = schedulerStatus?.data;

  if (statusLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-500" />
            Autonomous System Control
          </h2>
          <p className="text-muted-foreground">
            Complete automation with minimal human intervention
          </p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => setConfigOpen(!configOpen)}
          className="flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Configuration
        </Button>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Autonomous Status */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Autonomous Mode</p>
                <p className="text-2xl font-bold">
                  {autonomousData?.isRunning ? (
                    <span className="text-green-600">ACTIVE</span>
                  ) : (
                    <span className="text-gray-500">STOPPED</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Cycle #{autonomousData?.cycleCount || 0}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {autonomousData?.isRunning ? (
                  <Activity className="w-8 h-8 text-green-500 animate-pulse" />
                ) : (
                  <Pause className="w-8 h-8 text-gray-400" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Health</p>
                <p className="text-2xl font-bold">
                  {autonomousData?.systemHealth?.health || 0}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {autonomousData?.systemHealth?.status || 'Unknown'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {(autonomousData?.systemHealth?.health || 0) > 80 ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scheduler Status */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Task Scheduler</p>
                <p className="text-2xl font-bold">
                  {schedulerData?.isRunning ? (
                    <span className="text-blue-600">RUNNING</span>
                  ) : (
                    <span className="text-gray-500">IDLE</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {schedulerData?.pendingTasks || 0} pending tasks
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Master Control Panel
          </CardTitle>
          <CardDescription>
            Start, stop, and monitor your autonomous content creation system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Autonomous Control */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <h4 className="font-medium">Autonomous Content Engine</h4>
              <p className="text-sm text-muted-foreground">
                AI-powered content creation with automatic optimization
              </p>
              <div className="flex items-center gap-4 text-xs">
                <span>Interval: {autonomousData?.config?.cycleInterval || 60} min</span>
                <span>Max Links: {autonomousData?.config?.maxLinksPerCycle || 5}</span>
                <span>Auto-publish: {autonomousData?.config?.autoPublish ? 'ON' : 'OFF'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {autonomousData?.isRunning ? (
                <Button
                  onClick={() => stopAutonomous.mutate()}
                  disabled={stopAutonomous.isPending}
                  variant="outline"
                  size="sm"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              ) : (
                <Button
                  onClick={() => startAutonomous.mutate()}
                  disabled={startAutonomous.isPending}
                  size="sm"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </Button>
              )}
            </div>
          </div>

          {/* Scheduler Control */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <h4 className="font-medium">Intelligent Task Scheduler</h4>
              <p className="text-sm text-muted-foreground">
                Smart task management with optimal timing optimization
              </p>
              <div className="flex items-center gap-4 text-xs">
                <span>Queue: {schedulerData?.queueLength || 0} tasks</span>
                <span>Active: {schedulerData?.activeTasks || 0}</span>
                <span>Completed: {schedulerData?.completedTasks || 0}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {schedulerData?.isRunning ? (
                <Button
                  onClick={() => stopScheduler.mutate()}
                  disabled={stopScheduler.isPending}
                  variant="outline"
                  size="sm"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              ) : (
                <Button
                  onClick={() => startScheduler.mutate()}
                  disabled={startScheduler.isPending}
                  size="sm"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </Button>
              )}
            </div>
          </div>

          {/* System Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Content Creation Rate</span>
                <span>85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Revenue Optimization</span>
                <span>92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Autonomous Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {autonomousData?.systemHealth?.issues?.length > 0 ? (
              autonomousData.systemHealth.issues.map((issue, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm">{issue}</span>
                </div>
              ))
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">System running optimally</span>
                  <Badge variant="secondary" className="ml-auto">
                    {new Date().toLocaleTimeString()}
                  </Badge>
                </div>
                
                {autonomousData?.isRunning && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Brain className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">AI content generation active</span>
                    <Badge variant="secondary" className="ml-auto">
                      Cycle {autonomousData.cycleCount}
                    </Badge>
                  </div>
                )}
                
                {schedulerData?.isRunning && (
                  <div className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <Target className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">Smart task scheduling operational</span>
                    <Badge variant="secondary" className="ml-auto">
                      {schedulerData.pendingTasks} queued
                    </Badge>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Panel */}
      {configOpen && (
        <Card>
          <CardHeader>
            <CardTitle>Autonomous System Configuration</CardTitle>
            <CardDescription>
              Advanced settings for autonomous operation (Coming Soon)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cycle-interval">Cycle Interval (minutes)</Label>
                <Input
                  id="cycle-interval"
                  type="number"
                  placeholder="60"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-links">Max Links per Cycle</Label>
                <Input
                  id="max-links"
                  type="number"
                  placeholder="5"
                  disabled
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="auto-publish" disabled />
                <Label htmlFor="auto-publish">Auto-publish Content</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="smart-scheduling" disabled />
                <Label htmlFor="smart-scheduling">Smart Scheduling</Label>
              </div>
            </div>
            <Button className="mt-4" disabled>
              Save Configuration
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}