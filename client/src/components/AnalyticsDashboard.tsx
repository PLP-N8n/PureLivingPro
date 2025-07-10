import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  Activity, 
  DollarSign, 
  Brain, 
  Target, 
  AlertTriangle,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';

interface WellnessInsights {
  userEngagement: {
    totalActiveUsers: number;
    dailyActiveUsers: number;
    weeklyRetention: number;
    averageSessionTime: number;
    userGrowthRate: number;
  };
  wellnessMetrics: {
    averageMoodScore: number;
    averageEnergyLevel: number;
    averageSleepHours: number;
    exerciseCompletionRate: number;
    meditationCompletionRate: number;
    stressLevelTrends: Array<{ date: string; avgStress: number }>;
  };
  contentPerformance: {
    mostPopularContent: Array<{ title: string; category: string; engagement: number }>;
    categoryPerformance: Array<{ category: string; totalViews: number; avgRating: number }>;
    premiumConversionRate: number;
    contentCompletionRates: Array<{ type: string; completionRate: number }>;
  };
  revenueInsights: {
    affiliateRevenue: number;
    premiumSubscriptions: number;
    topPerformingProducts: Array<{ name: string; category: string; revenue: number; clicks: number }>;
    categoryRevenue: Array<{ category: string; revenue: number; conversionRate: number }>;
    monthlyTrends: Array<{ month: string; revenue: number; users: number }>;
  };
  challengeMetrics: {
    activeChallenges: number;
    completionRates: Array<{ challengeTitle: string; completionRate: number; avgProgress: number }>;
    popularCategories: Array<{ category: string; participants: number; avgCompletion: number }>;
    userMotivationFactors: Array<{ factor: string; effectiveness: number }>;
  };
  predictiveInsights: {
    churnRisk: Array<{ userId: string; riskScore: number; factors: string[] }>;
    recommendedInterventions: Array<{ type: string; targetUsers: number; expectedImpact: string }>;
    growthOpportunities: Array<{ area: string; potential: number; effort: string }>;
  };
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedTab, setSelectedTab] = useState('overview');

  const { data: insights, isLoading, refetch } = useQuery({
    queryKey: ['/api/analytics/wellness-insights', timeRange],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/analytics/wellness-insights?timeRange=${timeRange}`);
      return response.json();
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const analyticsData: WellnessInsights | null = insights?.data || null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading wellness insights...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Analytics Data Available</h3>
            <p className="text-muted-foreground mb-4">Unable to load wellness insights at this time.</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Advanced wellness insights and platform analytics</p>
          </div>
          
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">{analyticsData.userEngagement.totalActiveUsers.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{analyticsData.userEngagement.userGrowthRate}% growth
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Wellness Score</p>
                  <p className="text-2xl font-bold">{analyticsData.wellnessMetrics.averageMoodScore}/5</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <Activity className="w-3 h-3 mr-1" />
                    Energy: {analyticsData.wellnessMetrics.averageEnergyLevel}/5
                  </p>
                </div>
                <Brain className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">${analyticsData.revenueInsights.affiliateRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <DollarSign className="w-3 h-3 mr-1" />
                    {analyticsData.revenueInsights.premiumSubscriptions} premium users
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Challenge Completion</p>
                  <p className="text-2xl font-bold">{analyticsData.challengeMetrics.activeChallenges}</p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <Target className="w-3 h-3 mr-1" />
                    Active challenges
                  </p>
                </div>
                <Target className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="wellness">Wellness</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* User Engagement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    User Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Weekly Retention</span>
                      <span className="font-medium">{analyticsData.userEngagement.weeklyRetention}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${analyticsData.userEngagement.weeklyRetention}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Daily Active Users</span>
                      <span className="font-medium">{analyticsData.userEngagement.dailyActiveUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Session Time</span>
                      <span className="font-medium">{analyticsData.userEngagement.averageSessionTime} min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Most Popular Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.contentPerformance.mostPopularContent.slice(0, 5).map((content, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate">{content.title}</p>
                          <p className="text-xs text-muted-foreground">{content.category}</p>
                        </div>
                        <Badge variant="secondary">{content.engagement}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="wellness" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Wellness Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Wellness Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{analyticsData.wellnessMetrics.averageMoodScore}</p>
                      <p className="text-sm text-muted-foreground">Avg Mood</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{analyticsData.wellnessMetrics.averageEnergyLevel}</p>
                      <p className="text-sm text-muted-foreground">Avg Energy</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{analyticsData.wellnessMetrics.averageSleepHours}h</p>
                      <p className="text-sm text-muted-foreground">Sleep</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{analyticsData.wellnessMetrics.exerciseCompletionRate}%</p>
                      <p className="text-sm text-muted-foreground">Exercise</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stress Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5" />
                    Recent Stress Levels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analyticsData.wellnessMetrics.stressLevelTrends.slice(-7).map((trend, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{new Date(trend.date).toLocaleDateString()}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{trend.avgStress}/5</span>
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                trend.avgStress > 3.5 ? 'bg-red-500' : 
                                trend.avgStress > 2.5 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${(trend.avgStress / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Category Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Category Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.contentPerformance.categoryPerformance.map((category, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{category.category}</p>
                          <p className="text-sm text-muted-foreground">{category.totalViews} views</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i < Math.floor(category.avgRating) ? 'bg-yellow-400' : 'bg-muted'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">{category.avgRating}/5</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Content Completion Rates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Content Completion Rates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.contentPerformance.contentCompletionRates.map((content, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{content.type}</span>
                          <span className="text-sm font-medium">{content.completionRate}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${content.completionRate}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Premium Conversion Rate</span>
                        <Badge variant="outline">{analyticsData.contentPerformance.premiumConversionRate}%</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Revenue Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Revenue by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.revenueInsights.categoryRevenue.map((category, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{category.category}</p>
                          <p className="text-sm text-muted-foreground">{category.conversionRate}% conversion</p>
                        </div>
                        <p className="font-bold text-green-600">${category.revenue.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Top Performing Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.revenueInsights.topPerformingProducts.map((product, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.category} • {product.clicks} clicks</p>
                        </div>
                        <p className="font-medium text-green-600">${product.revenue}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Monthly Growth Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {analyticsData.revenueInsights.monthlyTrends.map((month, index) => (
                    <div key={index} className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium">{month.month}</p>
                      <p className="text-lg font-bold text-green-600">${month.revenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{month.users} users</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Challenge Completion */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Challenge Completion Rates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.challengeMetrics.completionRates.map((challenge, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{challenge.challengeTitle}</span>
                          <span className="text-sm">{challenge.completionRate}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ width: `${challenge.completionRate}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground">Avg Progress: {challenge.avgProgress}%</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Popular Challenge Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.challengeMetrics.popularCategories.map((category, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{category.category}</p>
                          <p className="text-sm text-muted-foreground">{category.participants} participants</p>
                        </div>
                        <Badge variant="outline">{category.avgCompletion}% avg completion</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Motivation Factors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  User Motivation Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {analyticsData.challengeMetrics.userMotivationFactors.map((factor, index) => (
                    <div key={index} className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium">{factor.factor}</p>
                      <p className="text-2xl font-bold text-purple-600">{factor.effectiveness}%</p>
                      <p className="text-xs text-muted-foreground">Effectiveness</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Churn Risk */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    High Churn Risk Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.predictiveInsights.churnRisk.slice(0, 5).map((user, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">User {user.userId.slice(-3)}</p>
                          <Badge variant={user.riskScore > 75 ? 'destructive' : user.riskScore > 60 ? 'secondary' : 'default'}>
                            {user.riskScore}% risk
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {user.factors.map((factor, factorIndex) => (
                            <Badge key={factorIndex} variant="outline" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Growth Opportunities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Growth Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.predictiveInsights.growthOpportunities.map((opportunity, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{opportunity.area}</p>
                          <p className="text-sm text-muted-foreground">Effort: {opportunity.effort}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">{opportunity.potential}%</p>
                          <p className="text-xs text-muted-foreground">Potential</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommended Interventions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Recommended Interventions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analyticsData.predictiveInsights.recommendedInterventions.map((intervention, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">{intervention.type}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Target Users:</span>
                          <span className="text-sm font-medium">{intervention.targetUsers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Expected Impact:</span>
                          <span className="text-sm font-medium text-green-600">{intervention.expectedImpact}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}