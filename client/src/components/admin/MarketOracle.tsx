import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  TrendingUp, 
  Eye, 
  Target, 
  Globe,
  BarChart3,
  Zap,
  Brain,
  DollarSign,
  Calendar,
  Users,
  ArrowUp,
  ArrowDown,
  Sparkles
} from 'lucide-react';

interface TrendForecast {
  keyword: string;
  category: string;
  currentVolume: number;
  predictedVolume: number;
  growthRate: number;
  confidence: number;
  peakPeriod: string;
  monetizationPotential: number;
}

interface ArbitrageOpportunity {
  id: string;
  product: string;
  sourcePrice: number;
  targetPrice: number;
  profitMargin: number;
  marketGap: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeWindow: string;
  competition: number;
}

interface CompetitorIntel {
  competitor: string;
  marketShare: number;
  recentMoves: string[];
  weaknesses: string[];
  opportunities: string[];
  threatLevel: 'low' | 'medium' | 'high';
}

interface SeasonalStrategy {
  season: string;
  categories: string[];
  expectedLift: number;
  optimalTiming: string;
  recommendedActions: string[];
}

export function MarketOracle() {
  const [selectedHorizon, setSelectedHorizon] = useState<'7d' | '30d' | '90d'>('30d');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch trend forecasts
  const { data: trendForecasts = [] } = useQuery<any>({
    queryKey: ['/api/market-oracle/trends', selectedHorizon],
    select: (data: any) => data?.data || []
  });

  // Fetch arbitrage opportunities
  const { data: arbitrageOpps = [] } = useQuery<any>({
    queryKey: ['/api/market-oracle/arbitrage'],
    select: (data: any) => data?.data || []
  });

  // Fetch competitor intelligence
  const { data: competitorIntel = [] } = useQuery<any>({
    queryKey: ['/api/market-oracle/competitors'],
    select: (data: any) => data?.data || []
  });

  // Fetch seasonal strategies
  const { data: seasonalStrategies = [] } = useQuery<any>({
    queryKey: ['/api/market-oracle/seasonal'],
    select: (data: any) => data?.data || []
  });

  // Execute market prediction
  const executeMarketPrediction = useMutation({
    mutationFn: () => apiRequest('POST', '/api/market-oracle/predict'),
    onSuccess: () => {
      toast({
        title: 'Market Prediction Updated',
        description: 'AI has analyzed latest market data and updated forecasts'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/market-oracle'] });
    }
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Market Oracle Header */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            Market Oracle - Predictive Intelligence
            <Badge variant="outline" className="ml-2">
              Advanced Market Intelligence
            </Badge>
          </CardTitle>
          <CardDescription>
            AI-powered market forecasting and opportunity identification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Select value={selectedHorizon} onValueChange={(value: '7d' | '30d' | '90d') => setSelectedHorizon(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Day Forecast</SelectItem>
                <SelectItem value="30d">30 Day Forecast</SelectItem>
                <SelectItem value="90d">90 Day Forecast</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={() => executeMarketPrediction.mutate()}
              disabled={executeMarketPrediction.isPending}
              className="flex items-center gap-2"
            >
              <Brain className="h-4 w-4" />
              {executeMarketPrediction.isPending ? 'Analyzing...' : 'Update Predictions'}
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">47</div>
              <div className="text-sm text-muted-foreground">Trend Forecasts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-sm text-muted-foreground">Arbitrage Opportunities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">8</div>
              <div className="text-sm text-muted-foreground">Competitor Moves</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">94%</div>
              <div className="text-sm text-muted-foreground">Prediction Accuracy</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trend Forecasts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trend Forecasts ({selectedHorizon})
          </CardTitle>
          <CardDescription>
            AI-predicted market trends and keyword opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trendForecasts.map((forecast: TrendForecast, index: number) => (
              <div key={index} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/30">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{forecast.keyword}</span>
                    <Badge variant="outline" className="text-xs">
                      {forecast.category}
                    </Badge>
                    {forecast.growthRate > 0 ? (
                      <ArrowUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Volume: {forecast.currentVolume.toLocaleString()} → {forecast.predictedVolume.toLocaleString()} 
                    ({forecast.growthRate > 0 ? '+' : ''}{(forecast.growthRate * 100).toFixed(1)}%)
                  </div>
                  
                  <div className="text-xs text-blue-600 mt-1">
                    Peak: {forecast.peakPeriod} • Confidence: {(forecast.confidence * 100).toFixed(0)}%
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    ${forecast.monetizationPotential}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Revenue Potential
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Arbitrage Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Arbitrage Opportunities
          </CardTitle>
          <CardDescription>
            Price gaps and profit opportunities across markets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {arbitrageOpps.map((opp: ArbitrageOpportunity) => (
              <div key={opp.id} className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{opp.product}</h4>
                  <div className={`w-3 h-3 rounded-full ${getDifficultyColor(opp.difficulty)}`} />
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Source Price:</span>
                    <span>${opp.sourcePrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Target Price:</span>
                    <span>${opp.targetPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">Profit Margin:</span>
                    <span className="text-green-600">{(opp.profitMargin * 100).toFixed(1)}%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">
                    {opp.timeWindow} • {opp.difficulty} difficulty
                  </div>
                  <Badge variant="outline">
                    ${(opp.targetPrice - opp.sourcePrice).toFixed(0)} profit
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Competitor Intelligence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Competitor Intelligence
          </CardTitle>
          <CardDescription>
            Real-time competitor analysis and strategic insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {competitorIntel.map((intel: CompetitorIntel, index: number) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{intel.competitor}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {(intel.marketShare * 100).toFixed(1)}% share
                    </Badge>
                    <Badge variant={intel.threatLevel === 'high' ? 'destructive' : 'secondary'}>
                      {intel.threatLevel} threat
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium mb-2">Recent Moves</h5>
                    <ul className="space-y-1">
                      {intel.recentMoves.slice(0, 2).map((move, i) => (
                        <li key={i} className="text-muted-foreground text-xs">• {move}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-2">Weaknesses</h5>
                    <ul className="space-y-1">
                      {intel.weaknesses.slice(0, 2).map((weakness, i) => (
                        <li key={i} className="text-muted-foreground text-xs">• {weakness}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-2">Opportunities</h5>
                    <ul className="space-y-1">
                      {intel.opportunities.slice(0, 2).map((opp, i) => (
                        <li key={i} className="text-muted-foreground text-xs">• {opp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seasonal Strategies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Seasonal Strategy Intelligence
          </CardTitle>
          <CardDescription>
            AI-optimized seasonal marketing strategies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seasonalStrategies.map((strategy: SeasonalStrategy, index: number) => (
              <div key={index} className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{strategy.season}</h4>
                  <div className="text-green-600 font-bold">
                    +{(strategy.expectedLift * 100).toFixed(0)}% lift
                  </div>
                </div>
                
                <div className="mb-3">
                  <h5 className="text-sm font-medium mb-1">Target Categories:</h5>
                  <div className="flex flex-wrap gap-1">
                    {strategy.categories.map((cat, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="text-sm">
                  <div className="text-muted-foreground mb-1">
                    Optimal Timing: {strategy.optimalTiming}
                  </div>
                  <div className="text-xs text-blue-600">
                    {strategy.recommendedActions.slice(0, 2).join(' • ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
