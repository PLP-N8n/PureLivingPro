import { useEffect } from "react";
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
  Award
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const queryClient = useQueryClient();

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

  const { data: userChallenges, isLoading: challengesLoading } = useQuery({
    queryKey: ["/api/user/challenges"],
    retry: false,
  });

  const { data: dailyLogs, isLoading: logsLoading } = useQuery({
    queryKey: ["/api/user/logs"],
    retry: false,
  });

  const { data: wellnessPlan, isLoading: planLoading } = useQuery({
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
              Welcome back, {user?.firstName || "Wellness Warrior"}!
            </h1>
            <p className="text-xl text-sage-600 mb-6">
              Here's your wellness dashboard for today.
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-sage-100 text-sage-700 px-4 py-2">
                <Calendar className="w-4 h-4 mr-2" />
                Day {wellnessStreak + 1}
              </Badge>
              <Badge className="bg-amber-100 text-amber-700 px-4 py-2">
                <Flame className="w-4 h-4 mr-2" />
                {wellnessStreak} Day Streak
              </Badge>
              {user?.isPremium && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2">
                  Premium Member
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
                <p className="text-sage-600 text-sm">Active Challenges</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-sage-800">{completedChallenges}</div>
                <p className="text-sage-600 text-sm">Completed</p>
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
                <p className="text-sage-600 text-sm">Daily Progress</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Flame className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-sage-800">{wellnessStreak}</div>
                <p className="text-sage-600 text-sm">Day Streak</p>
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
                    Today's Wellness Log
                  </CardTitle>
                  <CardDescription>
                    Track your daily wellness activities and mood
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
                      Current Challenge
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
                          View All Challenges
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
                      Your Wellness Plan
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
                      View Full Plan
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
                    Today's Wellness
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sage-700">Mood</span>
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
                    <span className="text-sage-700">Energy</span>
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
                      <span className="text-sage-700">Daily Goals</span>
                      <span className="text-sage-600 text-sm">{completedGoals}/{weeklyGoals}</span>
                    </div>
                    <Progress value={(completedGoals / weeklyGoals) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="organic-border premium-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-sage-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/meditation-timer">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Brain className="w-4 h-4 mr-2" />
                      Start Meditation
                    </Button>
                  </Link>
                  <Link href="/challenges">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Target className="w-4 h-4 mr-2" />
                      Join Challenge
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
                    Get Wellness Tip
                  </Button>
                </CardContent>
              </Card>

              {/* Sleep Tracker */}
              <Card className="organic-border premium-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Moon className="w-5 h-5 text-indigo-600" />
                    Sleep Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-sage-800 mb-2">
                      {todayLog?.sleep || 0}h
                    </div>
                    <p className="text-sage-600 text-sm mb-4">Last night's sleep</p>
                    <div className="flex justify-center space-x-1">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-8 rounded-full ${
                            i < Math.floor((todayLog?.sleep || 0) / 1.2)
                              ? 'bg-indigo-400'
                              : 'bg-sage-200'
                          }`}
                        />
                      ))}
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
