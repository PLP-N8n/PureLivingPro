import { useState, lazy, Suspense } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart3,
  FileText,
  Package,
  Target,
  Users,
  Settings,
  Bot,
  TrendingUp,
  Shield,
  Eye,
  Handshake,
  Loader2
} from "lucide-react";

// Lazy load components for better performance
const OptimizedBlogManagement = lazy(() => import('./OptimizedBlogManagement').then(m => ({ default: m.OptimizedBlogManagement })));
const OptimizedProductManagement = lazy(() => import('./OptimizedProductManagement').then(m => ({ default: m.OptimizedProductManagement })));
const AutomationDashboard = lazy(() => import('../AutomationDashboard').then(m => ({ default: m.AutomationDashboard })));
const AdvancedRiskManagement = lazy(() => import('./AdvancedRiskManagement').then(m => ({ default: m.AdvancedRiskManagement })));
const MarketOracle = lazy(() => import('./MarketOracle').then(m => ({ default: m.MarketOracle })));
const AutonomousNegotiation = lazy(() => import('./AutonomousNegotiation').then(m => ({ default: m.AutonomousNegotiation })));
const AgentConsole = lazy(() => import('../../pages/agent-console').then(m => ({ default: m.default })));

// Loading component for suspense
const ComponentLoader = () => (
  <div className="flex items-center justify-center py-10">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
      <p className="text-sm text-muted-foreground">Loading component...</p>
    </div>
  </div>
);

// Quick stats component with caching
const QuickStats = () => {
  const [stats, setStats] = useState({
    totalPosts: 156,
    publishedPosts: 142,
    totalProducts: 89,
    activeChallenges: 12,
    weeklyViews: 2847,
    monthlyRevenue: 12456,
    userGrowth: 23.5,
    conversionRate: 4.2
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
              <p className="text-2xl font-bold">{stats.totalPosts}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2">
            <span className="text-xs text-green-600">+{stats.totalPosts - stats.publishedPosts} drafts</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Products</p>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </div>
            <Package className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2">
            <span className="text-xs text-blue-600">Affiliate network</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
              <p className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-emerald-500" />
          </div>
          <div className="mt-2">
            <span className="text-xs text-green-600">+{stats.userGrowth}% growth</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold">{stats.conversionRate}%</p>
            </div>
            <Target className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-2">
            <span className="text-xs text-blue-600">Optimized performance</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export function ModularAdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Authentication check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-sage-25 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-sage-25 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-sage-900">Pure Living Pro - Admin</h1>
            <p className="text-sage-600 mt-2">Autonomous wellness platform management</p>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Button
              variant="outline"
              onClick={() => window.location.href = "/"}
            >
              Back to Site
            </Button>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Agents
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Automation
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Risk
            </TabsTrigger>
            <TabsTrigger value="market" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Market
            </TabsTrigger>
            <TabsTrigger value="negotiation" className="flex items-center gap-2">
              <Handshake className="h-4 w-4" />
              Deals
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <QuickStats />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Real-time platform health</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Status</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Operational
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Healthy
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Automation</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        99% Autonomous
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Uptime</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        99.9%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest automated actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Auto-generated 3 blog posts</span>
                      <span className="text-xs text-muted-foreground ml-auto">2m ago</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Scraped 12 new affiliate products</span>
                      <span className="text-xs text-muted-foreground ml-auto">15m ago</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Negotiated 8% commission increase</span>
                      <span className="text-xs text-muted-foreground ml-auto">1h ago</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Risk alert mitigated automatically</span>
                      <span className="text-xs text-muted-foreground ml-auto">2h ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Agent Console Tab */}
          <TabsContent value="agents">
            <Suspense fallback={<ComponentLoader />}>
              <AgentConsole />
            </Suspense>
          </TabsContent>

          {/* Blog Management Tab */}
          <TabsContent value="blog">
            <Suspense fallback={<ComponentLoader />}>
              <OptimizedBlogManagement />
            </Suspense>
          </TabsContent>

          {/* Product Management Tab */}
          <TabsContent value="products">
            <Suspense fallback={<ComponentLoader />}>
              <OptimizedProductManagement />
            </Suspense>
          </TabsContent>

          {/* Automation Dashboard Tab */}
          <TabsContent value="automation">
            <Suspense fallback={<ComponentLoader />}>
              <AutomationDashboard />
            </Suspense>
          </TabsContent>

          {/* Risk Management Tab */}
          <TabsContent value="risk">
            <Suspense fallback={<ComponentLoader />}>
              <AdvancedRiskManagement />
            </Suspense>
          </TabsContent>

          {/* Market Oracle Tab */}
          <TabsContent value="market">
            <Suspense fallback={<ComponentLoader />}>
              <MarketOracle />
            </Suspense>
          </TabsContent>

          {/* Negotiation Tab */}
          <TabsContent value="negotiation">
            <Suspense fallback={<ComponentLoader />}>
              <AutonomousNegotiation />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}