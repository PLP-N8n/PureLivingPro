import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Brain, 
  Bot, 
  Zap, 
  TrendingUp, 
  Target, 
  Settings,
  BarChart3,
  DollarSign,
  Clock,
  Globe,
  Shield,
  Cpu,
  Activity,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  PlayCircle,
  PauseCircle
} from 'lucide-react';

interface AutonomousConfig {
  isEnabled: boolean;
  autoDiscovery: {
    enabled: boolean;
    dailyLimit: number;
    confidenceThreshold: number;
    minCommission: number;
    maxCompetitionScore: number;
  };
  autoProcessing: {
    enabled: boolean;
    autoApprovalThreshold: number;
    bulkProcessingLimit: number;
  };
  selfOptimization: {
    enabled: boolean;
    learningRate: number;
    optimizationFrequency: string;
  };
  riskManagement: {
    maxDailySpend: number;
    pauseOnLowPerformance: boolean;
    emergencyStopThreshold: number;
  };
}

interface SystemMetrics {
  autonomyLevel: number;
  operationalEfficiency: number;
  decisionAccuracy: number;
  profitOptimization: number;
  riskManagement: number;
  systemHealth: number;
  currentOperations: number;
  dailyDecisions: number;
  successRate: number;
  costSavings: number;
}

interface AutonomousDecision {
  id: string;
  type: 'discovery' | 'optimization' | 'resource_allocation' | 'risk_mitigation';
  description: string;
  confidence: number;
  expectedImpact: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  timestamp: string;
  result?: string;
}

export function AutonomousController() {
  const [config, setConfig] = useState<AutonomousConfig>({
    isEnabled: false,
    autoDiscovery: {
      enabled: false,
      dailyLimit: 50,
      confidenceThreshold: 0.8,
      minCommission: 5,
      maxCompetitionScore: 0.6
    },
    autoProcessing: {
      enabled: false,
      autoApprovalThreshold: 0.85,
      bulkProcessingLimit: 100
    },
    selfOptimization: {
      enabled: false,
      learningRate: 0.1,
      optimizationFrequency: 'hourly'
    },
    riskManagement: {
      maxDailySpend: 500,
      pauseOnLowPerformance: true,
      emergencyStopThreshold: 0.3
    }
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch system metrics
  const { data: systemMetrics } = useQuery({
    queryKey: ['/api/autonomous/metrics'],
    refetchInterval: 30000, // Refresh every 30 seconds
    select: (data: any) => data?.data || {}
  });

  // Fetch recent autonomous decisions
  const { data: recentDecisions = [] } = useQuery({
    queryKey: ['/api/autonomous/decisions'],
    refetchInterval: 15000, // Refresh every 15 seconds
    select: (data: any) => data?.data || []
  });

  // Fetch autonomous status
  const { data: autonomousStatus } = useQuery({
    queryKey: ['/api/autonomous/status'],
    refetchInterval: 10000, // Refresh every 10 seconds
    select: (data: any) => data?.data || {}
  });

  // Start/Stop autonomous system
  const toggleAutonomous = useMutation({
    mutationFn: (enabled: boolean) => 
      apiRequest('POST', '/api/autonomous/toggle', { enabled, config }),
    onSuccess: (data: any) => {
      toast({
        title: data.enabled ? 'Autonomous Mode Activated' : 'Autonomous Mode Deactivated',
        description: data.enabled ? 
          'System is now operating autonomously with AI decision-making' : 
          'Manual control restored - autonomous operations paused'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/autonomous/status'] });
    },
    onError: (error: any) => {
      toast({
        title: 'System Toggle Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Force optimization cycle
  const forceOptimization = useMutation({
    mutationFn: () => apiRequest('POST', '/api/autonomous/optimize-now'),
    onSuccess: () => {
      toast({
        title: 'Optimization Initiated',
        description: 'AI is analyzing and optimizing all operations'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/autonomous/decisions'] });
    }
  });

  // Emergency stop
  const emergencyStop = useMutation({
    mutationFn: () => apiRequest('POST', '/api/autonomous/emergency-stop'),
    onSuccess: () => {
      toast({
        title: 'Emergency Stop Activated',
        description: 'All autonomous operations have been halted immediately',
        variant: 'destructive'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/autonomous/status'] });
    }
  });

  const handleConfigUpdate = (section: keyof AutonomousConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'executing': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'executing': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Autonomous System Control */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Autonomous AI Controller
            <Badge variant={autonomousStatus?.isEnabled ? 'default' : 'secondary'} className="ml-2">
              {autonomousStatus?.isEnabled ? 'AUTONOMOUS' : 'MANUAL'}
            </Badge>
          </CardTitle>
          <CardDescription>
            Complete system autonomy with AI decision-making and self-optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Switch
                checked={config.isEnabled}
                onCheckedChange={(checked) => {
                  setConfig(prev => ({ ...prev, isEnabled: checked }));
                  toggleAutonomous.mutate(checked);
                }}
                disabled={toggleAutonomous.isPending}
              />
              <div>
                <div className="font-medium">
                  {config.isEnabled ? 'Autonomous Mode Active' : 'Manual Control'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {config.isEnabled ? 
                    'AI is making decisions and optimizing automatically' : 
                    'System requires manual intervention for decisions'
                  }
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => forceOptimization.mutate()}
                disabled={forceOptimization.isPending}
                variant="outline"
                size="sm"
              >
                <Zap className="h-4 w-4 mr-2" />
                Force Optimize
              </Button>
              
              <Button
                onClick={() => emergencyStop.mutate()}
                disabled={emergencyStop.isPending}
                variant="destructive"
                size="sm"
              >
                <Shield className="h-4 w-4 mr-2" />
                Emergency Stop
              </Button>
            </div>
          </div>

          {/* Real-time System Metrics */}
          <div className="grid grid-cols-6 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {((systemMetrics?.autonomyLevel || 0) * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">Autonomy Level</div>
              <Progress value={(systemMetrics?.autonomyLevel || 0) * 100} className="h-2 mt-1" />
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {((systemMetrics?.operationalEfficiency || 0) * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">Efficiency</div>
              <Progress value={(systemMetrics?.operationalEfficiency || 0) * 100} className="h-2 mt-1" />
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {((systemMetrics?.decisionAccuracy || 0) * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
              <Progress value={(systemMetrics?.decisionAccuracy || 0) * 100} className="h-2 mt-1" />
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {systemMetrics?.currentOperations || 0}
              </div>
              <div className="text-xs text-muted-foreground">Active Ops</div>
              <div className="h-2 mt-1 bg-orange-200 rounded-full">
                <div className="h-2 bg-orange-600 rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {systemMetrics?.dailyDecisions || 0}
              </div>
              <div className="text-xs text-muted-foreground">Decisions Today</div>
              <div className="h-2 mt-1 bg-indigo-200 rounded-full">
                <div className="h-2 bg-indigo-600 rounded-full" style={{ width: '80%' }} />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                ${(systemMetrics?.costSavings || 0).toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground">Cost Savings</div>
              <div className="h-2 mt-1 bg-emerald-200 rounded-full">
                <div className="h-2 bg-emerald-600 rounded-full" style={{ width: '90%' }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Autonomous Configuration */}
      <div className="grid grid-cols-2 gap-6">
        {/* Auto-Discovery Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Auto-Discovery Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enable Auto-Discovery</Label>
              <Switch
                checked={config.autoDiscovery.enabled}
                onCheckedChange={(checked) => 
                  handleConfigUpdate('autoDiscovery', 'enabled', checked)
                }
              />
            </div>
            
            <div>
              <Label>Daily Discovery Limit</Label>
              <Input
                type="number"
                value={config.autoDiscovery.dailyLimit}
                onChange={(e) => 
                  handleConfigUpdate('autoDiscovery', 'dailyLimit', parseInt(e.target.value))
                }
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Confidence Threshold ({(config.autoDiscovery.confidenceThreshold * 100).toFixed(0)}%)</Label>
              <input
                type="range"
                min="0.5"
                max="1.0"
                step="0.05"
                value={config.autoDiscovery.confidenceThreshold}
                onChange={(e) => 
                  handleConfigUpdate('autoDiscovery', 'confidenceThreshold', parseFloat(e.target.value))
                }
                className="w-full mt-1"
              />
            </div>
            
            <div>
              <Label>Min Commission (%)</Label>
              <Input
                type="number"
                value={config.autoDiscovery.minCommission}
                onChange={(e) => 
                  handleConfigUpdate('autoDiscovery', 'minCommission', parseInt(e.target.value))
                }
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Risk Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Risk Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Max Daily Spend ($)</Label>
              <Input
                type="number"
                value={config.riskManagement.maxDailySpend}
                onChange={(e) => 
                  handleConfigUpdate('riskManagement', 'maxDailySpend', parseInt(e.target.value))
                }
                className="mt-1"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label>Auto-pause Low Performance</Label>
              <Switch
                checked={config.riskManagement.pauseOnLowPerformance}
                onCheckedChange={(checked) => 
                  handleConfigUpdate('riskManagement', 'pauseOnLowPerformance', checked)
                }
              />
            </div>
            
            <div>
              <Label>Emergency Stop Threshold ({(config.riskManagement.emergencyStopThreshold * 100).toFixed(0)}%)</Label>
              <input
                type="range"
                min="0.1"
                max="0.5"
                step="0.05"
                value={config.riskManagement.emergencyStopThreshold}
                onChange={(e) => 
                  handleConfigUpdate('riskManagement', 'emergencyStopThreshold', parseFloat(e.target.value))
                }
                className="w-full mt-1"
              />
            </div>
            
            <div>
              <Label>Optimization Frequency</Label>
              <Select 
                value={config.selfOptimization.optimizationFrequency}
                onValueChange={(value) => 
                  handleConfigUpdate('selfOptimization', 'optimizationFrequency', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="continuous">Continuous</SelectItem>
                  <SelectItem value="hourly">Every Hour</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent AI Decisions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            Autonomous AI Decisions (Real-time)
          </CardTitle>
          <CardDescription>
            Live feed of AI decisions and autonomous system actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recentDecisions.map((decision: AutonomousDecision) => (
              <div key={decision.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/30">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(decision.status)}`} />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(decision.status)}
                    <span className="font-medium">{decision.description}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Type: {decision.type} • Confidence: {(decision.confidence * 100).toFixed(0)}% • 
                    Impact: {decision.expectedImpact}
                  </div>
                  {decision.result && (
                    <div className="text-sm text-green-600 mt-1">
                      Result: {decision.result}
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  <Badge variant={decision.status === 'completed' ? 'default' : 'secondary'}>
                    {decision.status}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(decision.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health Monitor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            System Health & Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {((systemMetrics?.systemHealth || 0) * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">System Health</div>
              <Progress value={(systemMetrics?.systemHealth || 0) * 100} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {((systemMetrics?.profitOptimization || 0) * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">Profit Optimization</div>
              <Progress value={(systemMetrics?.profitOptimization || 0) * 100} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {((systemMetrics?.successRate || 0) * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
              <Progress value={(systemMetrics?.successRate || 0) * 100} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {autonomousStatus?.uptime || '0h 0m'}
              </div>
              <div className="text-sm text-muted-foreground">Uptime</div>
              <div className="mt-2 text-xs text-green-600">
                {autonomousStatus?.status || 'Offline'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}