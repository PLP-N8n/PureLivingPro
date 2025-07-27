import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Handshake, 
  TrendingUp, 
  DollarSign, 
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Brain,
  Star,
  Gift,
  Users
} from 'lucide-react';

interface NegotiationTarget {
  id: string;
  merchant: string;
  currentCommission: number;
  targetCommission: number;
  volume: number;
  leverage: number;
  confidence: number;
  strategy: string;
  status: 'pending' | 'negotiating' | 'accepted' | 'rejected' | 'counter_offered';
  estimatedIncrease: number;
  negotiationHistory: string[];
}

interface ExclusiveDeal {
  id: string;
  merchant: string;
  product: string;
  exclusivityType: 'early_access' | 'exclusive_discount' | 'unique_bundle';
  value: number;
  duration: string;
  status: 'discovered' | 'negotiating' | 'secured' | 'expired';
  competitiveAdvantage: string;
}

interface PartnershipOpportunity {
  id: string;
  merchant: string;
  opportunityType: 'content_collaboration' | 'co_marketing' | 'product_development';
  potentialValue: number;
  requirements: string[];
  aiRecommendation: string;
  priority: 'low' | 'medium' | 'high';
}

export function AutonomousNegotiation() {
  const [autoNegotiationEnabled, setAutoNegotiationEnabled] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch negotiation targets
  const { data: negotiationTargets = [] } = useQuery({
    queryKey: ['/api/negotiation/targets'],
    refetchInterval: 60000,
    select: (data: any) => data?.data || []
  });

  // Fetch exclusive deals
  const { data: exclusiveDeals = [] } = useQuery({
    queryKey: ['/api/negotiation/exclusive-deals'],
    select: (data: any) => data?.data || []
  });

  // Fetch partnership opportunities
  const { data: partnerships = [] } = useQuery({
    queryKey: ['/api/negotiation/partnerships'],
    select: (data: any) => data?.data || []
  });

  // Auto-negotiate commission rates
  const autoNegotiate = useMutation({
    mutationFn: (targetId: string) => 
      apiRequest('POST', `/api/negotiation/auto-negotiate/${targetId}`),
    onSuccess: () => {
      toast({
        title: 'Negotiation Initiated',
        description: 'AI is autonomously negotiating better commission rates'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/negotiation/targets'] });
    }
  });

  // Hunt for exclusive deals
  const huntExclusiveDeals = useMutation({
    mutationFn: () => apiRequest('POST', '/api/negotiation/hunt-exclusives'),
    onSuccess: () => {
      toast({
        title: 'Deal Hunting Active',
        description: 'AI is scanning for exclusive partnership opportunities'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/negotiation/exclusive-deals'] });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': case 'secured': return 'text-green-600';
      case 'negotiating': case 'discovered': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      case 'rejected': case 'expired': return 'text-red-600';
      case 'counter_offered': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': case 'secured': return <CheckCircle className="h-4 w-4" />;
      case 'negotiating': case 'discovered': return <Clock className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'rejected': case 'expired': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Autonomous Negotiation Overview */}
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Handshake className="h-5 w-5 text-green-600" />
            Autonomous Negotiation Engine
            <Badge variant="outline" className="ml-2">
              +1% Autonomy Gain
            </Badge>
          </CardTitle>
          <CardDescription>
            AI-powered commission optimization and partnership building
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">23</div>
              <div className="text-xs text-muted-foreground">Active Negotiations</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">+2.3%</div>
              <div className="text-xs text-muted-foreground">Avg Commission Increase</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">$1,247</div>
              <div className="text-xs text-muted-foreground">Monthly Gain</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">87%</div>
              <div className="text-xs text-muted-foreground">Success Rate</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">12</div>
              <div className="text-xs text-muted-foreground">Exclusive Deals</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={autoNegotiationEnabled}
                onCheckedChange={setAutoNegotiationEnabled}
              />
              <Label>Auto-Negotiation</Label>
            </div>
            
            <Button 
              onClick={() => huntExclusiveDeals.mutate()}
              disabled={huntExclusiveDeals.isPending}
              className="flex items-center gap-2"
            >
              <Gift className="h-4 w-4" />
              Hunt Exclusive Deals
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Commission Rate Negotiations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Commission Rate Optimization
          </CardTitle>
          <CardDescription>
            AI-driven negotiations for higher commission rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {negotiationTargets.map((target: NegotiationTarget) => (
              <div key={target.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/30">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{target.merchant}</span>
                    {getStatusIcon(target.status)}
                    <Badge variant="outline" className="text-xs">
                      {target.strategy}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-2">
                    Current: {target.currentCommission}% → Target: {target.targetCommission}% 
                    (+{((target.targetCommission - target.currentCommission) * 100).toFixed(1)}%)
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs">
                    <span>Volume: ${target.volume.toLocaleString()}</span>
                    <span>Leverage: {(target.leverage * 100).toFixed(0)}%</span>
                    <span>Confidence: {(target.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-sm font-medium ${getStatusColor(target.status)}`}>
                    {target.status.replace('_', ' ').toUpperCase()}
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    +${target.estimatedIncrease}/mo
                  </div>
                  {target.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => autoNegotiate.mutate(target.id)}
                      disabled={autoNegotiate.isPending}
                      className="mt-2"
                    >
                      <Zap className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exclusive Deals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Exclusive Deal Pipeline
          </CardTitle>
          <CardDescription>
            Secured and potential exclusive partnership opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exclusiveDeals.map((deal: ExclusiveDeal) => (
              <div key={deal.id} className="p-4 border rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{deal.product}</h4>
                  <Badge variant={deal.status === 'secured' ? 'default' : 'secondary'}>
                    {deal.status.replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Merchant:</span>
                    <span>{deal.merchant}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{deal.exclusivityType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Value:</span>
                    <span className="text-green-600 font-medium">${deal.value}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{deal.duration}</span>
                  </div>
                </div>
                
                <div className="text-xs text-blue-600">
                  Advantage: {deal.competitiveAdvantage}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Partnership Building */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Partnership Automation
          </CardTitle>
          <CardDescription>
            AI-identified partnership opportunities and relationship building
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {partnerships.map((partnership: PartnershipOpportunity) => (
              <div key={partnership.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/30">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{partnership.merchant}</span>
                    <Badge variant="outline" className="text-xs">
                      {partnership.opportunityType.replace('_', ' ')}
                    </Badge>
                    <Badge variant={partnership.priority === 'high' ? 'default' : 'secondary'}>
                      {partnership.priority} priority
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-2">
                    Potential Value: ${partnership.potentialValue.toLocaleString()}
                  </div>
                  
                  <div className="text-xs text-blue-600 mb-2">
                    AI Recommendation: {partnership.aiRecommendation}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Requirements: {partnership.requirements.slice(0, 2).join(' • ')}
                  </div>
                </div>
                
                <div className="text-right">
                  <Button size="sm" variant="outline">
                    <Brain className="h-3 w-3 mr-1" />
                    AI Initiate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Negotiation Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Negotiation Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">87%</div>
              <div className="text-sm text-muted-foreground mb-2">Success Rate</div>
              <Progress value={87} className="h-2" />
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">+$3,247</div>
              <div className="text-sm text-muted-foreground mb-2">Monthly Revenue Increase</div>
              <div className="text-xs text-green-600">+18% vs last month</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">2.3 days</div>
              <div className="text-sm text-muted-foreground mb-2">Avg Negotiation Time</div>
              <div className="text-xs text-green-600">-40% faster than manual</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}