import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import WellnessPicks from "@/pages/wellness-picks";
import MeditationTimer from "@/pages/meditation-timer";
import Dashboard from "@/pages/dashboard";
import Premium from "@/pages/premium";
import Challenges from "@/pages/challenges";
import WellnessPlan from "@/pages/wellness-plan";
import MealPlanner from "@/pages/meal-planner";
import DeviceIntegration from "@/pages/device-integration";
import WellnessQuiz from "@/pages/WellnessQuiz";
import AIChatCoach from "@/pages/AIChatCoach";
import AffiliateProducts from "@/pages/AffiliateProducts";
import Subscribe from "@/pages/subscribe";
import Admin from "@/pages/admin";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { AutonomousControl } from "@/components/AutonomousControl";
import { AutomationDashboard } from "@/components/AutomationDashboard";
import AgentConsole from "@/pages/agent-console";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/admin" component={Admin} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/wellness-picks" component={WellnessPicks} />
          <Route path="/meditation-timer" component={MeditationTimer} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/wellness-plan" component={WellnessPlan} />
          <Route path="/meal-planner" component={MealPlanner} />
          <Route path="/premium" component={Premium} />
          <Route path="/challenges" component={Challenges} />
          <Route path="/device-integration" component={DeviceIntegration} />
          <Route path="/wellness-quiz" component={WellnessQuiz} />
          <Route path="/ai-coach" component={AIChatCoach} />
          <Route path="/affiliate-products" component={AffiliateProducts} />
          <Route path="/subscribe" component={Subscribe} />
          <Route path="/admin" component={Admin} />
          <Route path="/analytics" component={AnalyticsDashboard} />
          <Route path="/autonomous" component={AutonomousControl} />
          <Route path="/automation" component={AutomationDashboard} />
          <Route path="/agent-console" component={AgentConsole} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
