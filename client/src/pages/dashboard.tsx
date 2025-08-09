import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import WellnessQuiz from "@/components/wellness/wellness-quiz";
import DailyLog from "@/components/wellness/daily-log";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, 
  Target, 
  TrendingUp, 
  Heart, 
  Zap, 
  Smile,
  Flame,
  BookOpen,
  Droplets,
  Moon,
  Brain,
  Plus,
  Award,
  MessageCircle,
  Send,
  Sparkles,
  Activity,
  Clock,
  BarChart,
  Users,
  Eye
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Dashboard() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const queryClient = useQueryClient();
  const [aiMessage, setAiMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      type: "ai",
      message: t('dashboard.aiCoach.greeting'),
      timestamp: new Date()
    }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: userChallenges, isLoading: challengesLoading } = useQuery<any>({
    queryKey: ["/api/user/challenges"],
    retry: false,
  });

  const { data: dailyLogs, isLoading: logsLoading } = useQuery<any>({
    queryKey: ["/api/user/logs"],
    retry: false,
  });

  const { data: wellnessPlan, isLoading: planLoading } = useQuery<any>({
    queryKey: ["/api/wellness/generate-plan"],
    retry: false,
    enabled: !!user?.wellnessProfile,
  });

  // Generate personalized content
  const generateContentMutation = useMutation({
    mutationFn: async (contentType: string) => {
      const response = await apiRequest("POST", "/api/wellness/personalized-content", {
        contentType,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Content Generated!",
        description: "Your personalized wellness content is ready.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to generate personalized content.",
        variant: "destructive",
      });
    },
  });

  // AI Chat functionality
  const aiChatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/wellness/ai-chat", {
        message,
        userId: user?.id,
        context: "dashboard"
      });
      return response.json();
    },
    onSuccess: (data) => {
      setChatHistory(prev => [...prev, {
        type: "ai",
        message: data.response,
        timestamp: new Date()
      }]);
      setIsAiTyping(false);
    },
    onError: (error) => {
      setIsAiTyping(false);
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAiChat = async (message: string) => {
    if (!message.trim()) return;
    
    setChatHistory(prev => [...prev, {
      type: "user",
      message: message,
      timestamp: new Date()
    }]);
    setAiMessage("");
    setIsAiTyping(true);
    
    await aiChatMutation.mutateAsync(message);
  };

  const handleQuickMessage = (message: string) => {
    handleAiChat(message);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sage-25 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-sage-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  // Show wellness quiz if profile not completed
  if (!user?.wellnessProfile) {
    return (
      <div className="min-h-screen bg-sage-25">
        <Navbar />
        <div className="pt-24 pb-16">
          <WellnessQuiz />
        </div>
        <Footer />
      </div>
    );
  }

  const todayLog = dailyLogs?.[0];
  const activeChallenge = userChallenges?.find((uc: any) => !uc.isCompleted);
  const completedChallenges = userChallenges?.filter((uc: any) => uc.isCompleted)?.length || 0;
  
  // Calculate wellness streak
  const wellnessStreak = dailyLogs?.length || 0;
  
  // Calculate weekly progress
  const weeklyGoals = 5; // Example: 5 daily goals
  const completedGoals = todayLog ? 
    (todayLog.exercise ? 1 : 0) + 
    (todayLog.meditation ? 1 : 0) + 
    (todayLog.mood >= 4 ? 1 : 0) + 
    (todayLog.energy >= 3 ? 1 : 0) + 
    (todayLog.sleep >= 7 ? 1 : 0) : 0;

  return (
    <div className="min-h-screen bg-sage-25">
      <Navbar />
      
      {/* Header */}
      <section className="pt-24 pb-8 wellness-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-sage-800 mb-4">
              {t('dashboard.welcome', { name: user?.firstName || "Wellness Warrior" })}
            </h1>
            <p className="text-xl text-sage-600 mb-6">
              {t('dashboard.subtitle')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-sage-100 text-sage-700 px-4 py-2">
                <Calendar className="w-4 h-4 mr-2" />
                {t('dashboard.badges.day', { count: wellnessStreak + 1 })}
              </Badge>
              <Badge className="bg-amber-100 text-amber-700 px-4 py-2">
                <Flame className="w-4 h-4 mr-2" />
                {t('dashboard.badges.streak', { count: wellnessStreak })}
              </Badge>
              {user?.isPremium && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2">
                  {t('dashboard.badges.premiumMember')}
                </Badge>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-sage-600" />
                </div>
                <div className="text-2xl font-bold text-sage-800">{userChallenges?.length || 0}</div>
                <p className="text-sage-600 text-sm">{t('dashboard.stats.activeChallenges')}</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-sage-800">{completedChallenges}</div>
                <p className="text-sage-600 text-sm">{t('dashboard.stats.completed')}</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-sage-800">
                  {Math.round((completedGoals / weeklyGoals) * 100)}%
                </div>
                <p className="text-sage-600 text-sm">{t('dashboard.stats.dailyProgress')}</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Flame className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-sage-800">{wellnessStreak}</div>
                <p className="text-sage-600 text-sm">{t('dashboard.stats.dayStreak')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <section className="py-8 wellness-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Today's Progress */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="organic-border premium-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-sage-600" />
                    {t('dashboard.sections.todaysLog')}
                  </CardTitle>
                  <CardDescription>
                    {t('dashboard.sections.logDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DailyLog />
                </CardContent>
              </Card>

              {/* Weekly Challenge */}
              {activeChallenge && (
                <Card className="organic-border premium-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-amber-600" />
                      {t('dashboard.sections.currentChallenge')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                        <Droplets className="w-8 h-8 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sage-800 mb-2">
                          Hydration Hero Challenge
                        </h3>
                        <p className="text-sage-600 text-sm mb-4">
                          Drink 8 glasses of water daily for 7 days
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-sage-700">Progress</span>
                            <span className="text-sage-600">5/7 days</span>
                          </div>
                          <Progress value={71} className="h-2" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-sage-200">
                      <Link href="/challenges">
                        <Button variant="outline" size="sm">
                          {t('dashboard.actions.viewChallenges')}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Wellness Plan Preview */}
              {wellnessPlan && (
                <Card className="organic-border premium-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-sage-600" />
                      {t('dashboard.sections.wellnessPlan')}
                    </CardTitle>
                    <CardDescription>
                      {wellnessPlan.weeklyFocus}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold text-sage-800 mb-4">
                      {wellnessPlan.planTitle}
                    </h3>
                    {wellnessPlan.dailyPlan?.slice(0, 2).map((day: any) => (
                      <div key={day.day} className="mb-4 p-4 bg-sage-50 rounded-lg">
                        <h4 className="font-medium text-sage-700 mb-2">
                          Day {day.day}: {day.theme}
                        </h4>
                        <p className="text-sage-600 text-sm">{day.morningActivity}</p>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full">
                      {t('dashboard.actions.viewPlan')}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Mood & Energy */}
              <Card className="organic-border premium-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-600" />
                    {t('dashboard.sections.todaysWellness')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sage-700">{t('dashboard.wellness.mood')}</span>
                    <div className="flex space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Smile
                          key={i}
                          className={`w-4 h-4 ${
                            i < (todayLog?.mood || 0)
                              ? 'text-amber-400 fill-current'
                              : 'text-sage-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sage-700">{t('dashboard.wellness.energy')}</span>
                    <div className="flex space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Zap
                          key={i}
                          className={`w-4 h-4 ${
                            i < (todayLog?.energy || 0)
                              ? 'text-green-400 fill-current'
                              : 'text-sage-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sage-700">{t('dashboard.wellness.dailyGoals')}</span>
                      <span className="text-sage-600 text-sm">{completedGoals}/{weeklyGoals}</span>
                    </div>
                    <Progress value={(completedGoals / weeklyGoals) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* AI Wellness Coach */}
              <Card className="organic-border premium-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-sage-600" />
                    {t('dashboard.sections.aiCoach')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="max-h-64 overflow-y-auto space-y-3">
                    {chatHistory.map((chat, index) => (
                      <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          chat.type === 'user' 
                            ? 'bg-sage-100 text-sage-800' 
                            : 'bg-[#eedfc8] text-sage-800'
                        }`}>
                          <p className="text-sm">{chat.message}</p>
                        </div>
                      </div>
                    ))}
                    {isAiTyping && (
                      <div className="flex justify-start">
                        <div className="bg-[#eedfc8] text-sage-800 p-3 rounded-lg">
                          <p className="text-sm">{t('dashboard.aiCoach.typing')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {(t('dashboard.aiCoach.suggestions', { returnObjects: true }) as unknown as string[]).map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs h-8 justify-start"
                        onClick={() => handleQuickMessage(suggestion)}
                        disabled={isAiTyping}
                      >
                        <Sparkles className="w-3 h-3 mr-2" />
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aiMessage}
                      onChange={(e) => setAiMessage(e.target.value)}
                      placeholder={t('dashboard.aiCoach.placeholder')}
                      className="flex-1 px-3 py-2 border border-sage-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAiChat(aiMessage);
                        }
                      }}
                      disabled={isAiTyping}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAiChat(aiMessage)}
                      disabled={isAiTyping || !aiMessage.trim()}
                      className="bg-sage-600 hover:bg-sage-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="organic-border premium-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-sage-600" />
                    {t('dashboard.sections.quickActions')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/meditation-timer">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Brain className="w-4 h-4 mr-2" />
                      {t('dashboard.actions.startMeditation')}
                    </Button>
                  </Link>
                  <Link href="/challenges">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Target className="w-4 h-4 mr-2" />
                      {t('dashboard.actions.joinChallenge')}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => generateContentMutation.mutate("tip")}
                    disabled={generateContentMutation.isPending}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    {t('dashboard.actions.getWellnessTip')}
                  </Button>
                </CardContent>
              </Card>

              {/* Wellness Insights */}
              <Card className="organic-border premium-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="w-5 h-5 text-sage-600" />
                    {t('dashboard.sections.insights')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sage-700 text-sm">{t('dashboard.wellness.sleep')}</span>
                      <span className="font-semibold text-sage-800">{todayLog?.sleep || 0}h</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sage-700 text-sm">{t('dashboard.wellness.water')}</span>
                      <span className="font-semibold text-sage-800">{todayLog?.water || 0}/8 glasses</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sage-700 text-sm">{t('dashboard.wellness.exercise')}</span>
                      <span className="text-green-600 text-sm">
                        {todayLog?.exercise ? '✓ Complete' : '○ Pending'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sage-700 text-sm">{t('dashboard.wellness.meditation')}</span>
                      <span className="text-blue-600 text-sm">
                        {todayLog?.meditation ? '✓ Complete' : '○ Pending'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-sage-200">
                    <div className="text-xs text-sage-600 mb-2">Weekly Trend</div>
                    <div className="flex justify-center space-x-1">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-6 rounded-full ${
                            i < 5 // Mock trend data
                              ? 'bg-sage-400'
                              : 'bg-sage-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="organic-border premium-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-amber-600" />
                    {t('dashboard.sections.recentActivity')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Brain className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-sage-800">Completed meditation</p>
                        <p className="text-xs text-sage-600">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Droplets className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-sage-800">Logged water intake</p>
                        <p className="text-xs text-sage-600">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                        <Target className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-sage-800">Joined new challenge</p>
                        <p className="text-xs text-sage-600">Yesterday</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
