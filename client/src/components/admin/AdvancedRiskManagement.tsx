import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Shield, 
  AlertTriangle, 
  TrendingDown, 
  Brain,
  Target,
  Zap,
  Activity,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign
} from 'lucide-react';

interface RiskAlert {
  id: string;
  type: 'fraud_detection' | 'market_anomaly' | 'performance_drop' | 'compliance_risk';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  confidence: number;
  suggestedAction: string;
  potentialLoss: number;
  timestamp: string;
  status: 'active' | 'mitigated' | 'false_positive';
  autoMitigated?: boolean;
}

interface RiskMetrics {
  overallRiskScore: number;
  fraudDetectionAccuracy: number;
  anomalyDetectionRate: number;
  preventedLosses: number;
  mitigationSuccessRate: number;
  falsePositiveRate: number;
}

export function AdvancedRiskManagement() {
  const [riskThresholds, setRiskThresholds] = useState({
    fraudThreshold: 0.7,
    anomalyThreshold: 0.8,
    autoMitigationEnabled: true,
    maxDailyRisk: 1000
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch risk alerts
  const { data: riskAlerts = [] } = useQuery({
    queryKey: ['/api/risk/alerts'],
    refetchInterval: 10000,
    select: (data: any) => data?.data || []
  });

  // Fetch risk metrics
  const { data: riskMetrics } = useQuery({
    queryKey: ['/api/risk/metrics'],
    refetchInterval: 30000,
    select: (data: any) => data?.data || {}
  });

  // Auto-mitigate risk
  const autoMitigate = useMutation({
    mutationFn: (alertId: string) => 
      apiRequest('POST', `/api/risk/auto-mitigate/${alertId}`),
    onSuccess: () => {
      toast({
        title: 'Risk Auto-Mitigated',
        description: 'AI has automatically resolved the risk threat'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/risk/alerts'] });
    }
  });

  // Run comprehensive risk scan
  const runRiskScan = useMutation({
    mutationFn: () => apiRequest('POST', '/api/risk/comprehensive-scan'),
    onSuccess: () => {
      toast({
        title: 'Risk Scan Complete',
        description: 'Comprehensive risk analysis completed'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/risk/alerts'] });
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fraud_detection': return <Shield className="h-4 w-4" />;
      case 'market_anomaly': return <TrendingDown className="h-4 w-4" />;
      case 'performance_drop': return <BarChart3 className="h-4 w-4" />;
      case 'compliance_risk': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Risk Management Overview */}
      <Card className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            Advanced Risk Management System
            <Badge variant="outline" className="ml-2">
              99% Autonomy Target
            </Badge>
          </CardTitle>
          <CardDescription>
            AI-powered fraud detection and autonomous risk mitigation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {((riskMetrics?.overallRiskScore || 0) * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">Risk Score</div>
              <Progress value={(riskMetrics?.overallRiskScore || 0) * 100} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {((riskMetrics?.fraudDetectionAccuracy || 0) * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">Fraud Detection</div>
              <Progress value={(riskMetrics?.fraudDetectionAccuracy || 0) * 100} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {((riskMetrics?.anomalyDetectionRate || 0) * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">Anomaly Detection</div>
              <Progress value={(riskMetrics?.anomalyDetectionRate || 0) * 100} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">
                ${(riskMetrics?.preventedLosses || 0).toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground">Prevented Losses</div>
              <div className="mt-2 text-xs text-green-600">This month</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">
                {((riskMetrics?.mitigationSuccessRate || 0) * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">Mitigation Success</div>
              <Progress value={(riskMetrics?.mitigationSuccessRate || 0) * 100} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {((riskMetrics?.falsePositiveRate || 0) * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">False Positives</div>
              <Progress value={(riskMetrics?.falsePositiveRate || 0) * 100} className="mt-2" />
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={() => runRiskScan.mutate()}
              disabled={runRiskScan.isPending}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600"
            >
              <Brain className="h-4 w-4" />
              {runRiskScan.isPending ? 'Scanning...' : 'AI Risk Scan'}
            </Button>
            
            <div className="flex items-center gap-2">
              <Switch
                checked={riskThresholds.autoMitigationEnabled}
                onCheckedChange={(checked) => 
                  setRiskThresholds(prev => ({ ...prev, autoMitigationEnabled: checked }))
                }
              />
              <Label className="text-sm">Auto-Mitigation</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Risk Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Real-time Risk Alerts ({riskAlerts.length})
          </CardTitle>
          <CardDescription>
            AI-detected threats with autonomous mitigation capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {riskAlerts.map((alert: RiskAlert) => (
              <div key={alert.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/30">
                <div className={`w-3 h-3 rounded-full ${getSeverityColor(alert.severity)}`} />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getTypeIcon(alert.type)}
                    <span className="font-medium">{alert.description}</span>
                    {alert.autoMitigated && (
                      <Badge variant="outline" className="text-xs bg-green-50">
                        Auto-Mitigated
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Confidence: {(alert.confidence * 100).toFixed(0)}% • 
                    Potential Loss: ${alert.potentialLoss} • 
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </div>
                  
                  <div className="text-xs text-blue-600 mt-1">
                    Suggested: {alert.suggestedAction}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant={alert.status === 'mitigated' ? 'default' : 'secondary'}>
                    {alert.status.replace('_', ' ')}
                  </Badge>
                  
                  {alert.status === 'active' && (
                    <Button
                      size="sm"
                      onClick={() => autoMitigate.mutate(alert.id)}
                      disabled={autoMitigate.isPending}
                    >
                      <Zap className="h-3 w-3" />
                    </Button>
                  )}
                  
                  {alert.status === 'mitigated' && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Configuration */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Risk Thresholds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Fraud Detection Threshold ({(riskThresholds.fraudThreshold * 100).toFixed(0)}%)</Label>
              <input
                type="range"
                min="0.5"
                max="1.0"
                step="0.05"
                value={riskThresholds.fraudThreshold}
                onChange={(e) => 
                  setRiskThresholds(prev => ({ ...prev, fraudThreshold: parseFloat(e.target.value) }))
                }
                className="w-full mt-1"
              />
            </div>
            
            <div>
              <Label>Anomaly Detection Threshold ({(riskThresholds.anomalyThreshold * 100).toFixed(0)}%)</Label>
              <input
                type="range"
                min="0.5"
                max="1.0"
                step="0.05"
                value={riskThresholds.anomalyThreshold}
                onChange={(e) => 
                  setRiskThresholds(prev => ({ ...prev, anomalyThreshold: parseFloat(e.target.value) }))
                }
                className="w-full mt-1"
              />
            </div>
            
            <div>
              <Label>Max Daily Risk Exposure ($)</Label>
              <Input
                type="number"
                value={riskThresholds.maxDailyRisk}
                onChange={(e) => 
                  setRiskThresholds(prev => ({ ...prev, maxDailyRisk: parseInt(e.target.value) }))
                }
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Learning Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Pattern Recognition</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  AI identified suspicious click patterns saving $347 in potential fraud
                </p>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Market Anomaly</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Detected unusual market behavior in fitness category, auto-paused campaigns
                </p>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Compliance Monitor</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Auto-updated 12 affiliate links to maintain FTC compliance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}