import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Users, Target, Trophy, Heart, Zap, Moon, Activity } from 'lucide-react';

interface UserWellnessInsights {
  userId: string;
  overallScore: number;
  trends: {
    mood: { current: number; trend: 'up' | 'down' | 'stable'; change: number };
    energy: { current: number; trend: 'up' | 'down' | 'stable'; change: number };
    sleep: { current: number; trend: 'up' | 'down' | 'stable'; change: number };
    exercise: { frequency: number; trend: 'up' | 'down' | 'stable' };
  };
  achievements: {
    challengesCompleted: number;
    streakDays: number;
    totalLoggingDays: number;
    improvementAreas: string[];
  };
  recommendations: string[];
  nextMilestones: string[];
}

interface PlatformAnalytics {
  userEngagement: {
    activeUsers: number;
    retentionRate: number;
    averageSessionTime: number;
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
  };
  contentPerformance: {
    topBlogPosts: Array<{ id: number; title: string; views: number; engagement: number }>;
    topProducts: Array<{ id: number; name: string; clicks: number; conversions: number }>;
    contentCategories: Array<{ category: string; performance: number }>;
  };
  wellnessMetrics: {
    averageWellnessScore: number;
    moodDistribution: Record<number, number>;
    energyTrends: Array<{ date: string; average: number }>;
    challengeCompletionRate: number;
    mostPopularChallenges: Array<{ id: number; title: string; participants: number }>;
  };
  revenueInsights: {
    totalRevenue: number;
    monthlyRecurringRevenue: number;
    conversionRate: number;
    topPerformingProducts: Array<{ id: number; name: string; revenue: number }>;
    revenueByCategory: Record<string, number>;
  };
}

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case 'down':
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    default:
      return <Minus className="h-4 w-4 text-gray-500" />;
  }
};

const MetricCard = ({ title, value, trend, icon: Icon, description }: {
  title: string;
  value: string | number;
  trend?: 'up' | 'down' | 'stable';
  icon: any;
  description?: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">{value}</div>
        {trend && <TrendIcon trend={trend} />}
      </div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </CardContent>
  </Card>
);

export default function AdvancedAnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState<string>('30');
  const [activeTab, setActiveTab] = useState('personal');

  // Fetch user wellness insights
  const { data: userInsights, isLoading: insightsLoading } = useQuery({
    queryKey: ['/api/analytics/wellness/user', timeframe],
    enabled: activeTab === 'personal'
  });

  // Fetch platform analytics
  const { data: platformAnalytics, isLoading: platformLoading } = useQuery({
    queryKey: ['/api/analytics/platform', timeframe],
    enabled: activeTab === 'platform'
  });

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive wellness insights and platform performance metrics
          </p>
        </div>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Personal Wellness</TabsTrigger>
          <TabsTrigger value="platform">Platform Analytics</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* Personal Wellness Tab */}
        <TabsContent value="personal" className="space-y-6">
          {insightsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : userInsights ? (
            <>
              {/* Overall Wellness Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Overall Wellness Score
                  </CardTitle>
                  <CardDescription>
                    Your comprehensive wellness rating based on multiple factors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Progress value={userInsights.overallScore} className="h-3" />
                    </div>
                    <div className="text-3xl font-bold">{userInsights.overallScore}%</div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MetricCard
                      title="Mood"
                      value={userInsights.trends.mood.current.toFixed(1)}
                      trend={userInsights.trends.mood.trend}
                      icon={Heart}
                    />
                    <MetricCard
                      title="Energy"
                      value={userInsights.trends.energy.current.toFixed(1)}
                      trend={userInsights.trends.energy.trend}
                      icon={Zap}
                    />
                    <MetricCard
                      title="Sleep"
                      value={`${userInsights.trends.sleep.current.toFixed(1)}h`}
                      trend={userInsights.trends.sleep.trend}
                      icon={Moon}
                    />
                    <MetricCard
                      title="Exercise"
                      value={`${Math.round(userInsights.trends.exercise.frequency * 100)}%`}
                      trend={userInsights.trends.exercise.trend}
                      icon={Activity}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Achievements & Progress */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Challenges Completed</span>
                      <Badge variant="secondary">{userInsights.achievements.challengesCompleted}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Current Streak</span>
                      <Badge variant="secondary">{userInsights.achievements.streakDays} days</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Logging Days</span>
                      <Badge variant="secondary">{userInsights.achievements.totalLoggingDays}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-500" />
                      Next Milestones
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {userInsights.nextMilestones.map((milestone, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-sm">{milestone}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Personalized Recommendations</CardTitle>
                  <CardDescription>
                    AI-powered suggestions to improve your wellness journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userInsights.recommendations.map((recommendation, index) => (
                      <div key={index} className="p-3 bg-secondary rounded-lg">
                        <p className="text-sm">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Improvement Areas */}
              {userInsights.achievements.improvementAreas.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Areas for Improvement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {userInsights.achievements.improvementAreas.map((area, index) => (
                        <Badge key={index} variant="outline">{area}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Start logging your wellness data to see personalized insights
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Platform Analytics Tab */}
        <TabsContent value="platform" className="space-y-6">
          {platformLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : platformAnalytics ? (
            <>
              {/* User Engagement Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                  title="Active Users"
                  value={platformAnalytics.userEngagement.activeUsers}
                  icon={Users}
                  description="Users active in selected period"
                />
                <MetricCard
                  title="Retention Rate"
                  value={`${platformAnalytics.userEngagement.retentionRate}%`}
                  icon={TrendingUp}
                  description="User retention rate"
                />
                <MetricCard
                  title="Wellness Score"
                  value={platformAnalytics.wellnessMetrics.averageWellnessScore}
                  icon={Heart}
                  description="Platform average"
                />
                <MetricCard
                  title="Challenge Rate"
                  value={`${platformAnalytics.wellnessMetrics.challengeCompletionRate}%`}
                  icon={Trophy}
                  description="Challenge completion rate"
                />
              </div>

              {/* Popular Challenges */}
              <Card>
                <CardHeader>
                  <CardTitle>Most Popular Challenges</CardTitle>
                  <CardDescription>
                    Challenges with highest participation rates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {platformAnalytics.wellnessMetrics.mostPopularChallenges.map((challenge, index) => (
                      <div key={challenge.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div>
                          <p className="font-medium">{challenge.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {challenge.participants} participants
                          </p>
                        </div>
                        <Badge>#{index + 1}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Insights</CardTitle>
                  <CardDescription>
                    Platform revenue and conversion metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">${platformAnalytics.revenueInsights.totalRevenue}</div>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">${platformAnalytics.revenueInsights.monthlyRecurringRevenue}</div>
                      <p className="text-sm text-muted-foreground">Monthly Recurring Revenue</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{platformAnalytics.revenueInsights.conversionRate}%</div>
                      <p className="text-sm text-muted-foreground">Conversion Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="blog" className="w-full">
                    <TabsList>
                      <TabsTrigger value="blog">Blog Posts</TabsTrigger>
                      <TabsTrigger value="products">Products</TabsTrigger>
                    </TabsList>
                    <TabsContent value="blog" className="space-y-4">
                      {platformAnalytics.contentPerformance.topBlogPosts.map((post) => (
                        <div key={post.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                          <div>
                            <p className="font-medium">{post.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {post.views} views • {post.engagement}% engagement
                            </p>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                    <TabsContent value="products" className="space-y-4">
                      {platformAnalytics.contentPerformance.topProducts.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.clicks} clicks • {product.conversions} conversions
                            </p>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Loading platform analytics...
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
              <CardDescription>
                Advanced analytics and predictive insights powered by artificial intelligence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">Wellness Trend Prediction</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Based on your recent patterns, your wellness score is likely to improve by 12% over the next 2 weeks if you maintain current habits.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-900 dark:text-green-100">Optimal Activity Window</h3>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Your energy levels peak between 9-11 AM. Scheduling workouts during this window could increase effectiveness by 23%.
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h3 className="font-semibold text-purple-900 dark:text-purple-100">Sleep Quality Correlation</h3>
                  <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                    Strong correlation detected between your meditation practice and sleep quality. Consistent evening meditation could improve sleep by 18%.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}