import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { BlogPost } from "@/api/entities";
import { WellnessPick } from "@/api/entities";
import { Challenge } from "@/api/entities";
import { UserChallengeProgress } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User as UserIcon,
  Heart,
  BookOpen,
  Trophy,
  Calendar,
  Target,
  Sparkles,
  Clock,
  CheckCircle,
  TrendingUp,
  Star,
  Crown,
  UtensilsCrossed,
  Timer,
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

import DailyTracker from "../components/dashboard/DailyTracker";
import WellnessCharts from "../components/dashboard/WellnessCharts";
import HabitTracker from "../components/dashboard/HabitTracker";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [savedArticles, setSavedArticles] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastLogUpdate, setLastLogUpdate] = useState(Date.now());

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const [challengeProgressData, allChallenges, recentPosts, recentProducts] = await Promise.all([
        UserChallengeProgress.filter({ user_id: currentUser.id }),
        Challenge.filter({ is_active: true }),
        BlogPost.filter({ published: true }, "-created_date", 10),
        WellnessPick.list("-created_date", 10)
      ]);

      const preferredCategories = currentUser.wellness_profile?.content_preferences || [];
      const matchingArticles = recentPosts.filter(post =>
        preferredCategories.some(pref => post.category?.includes(pref))
      ).slice(0, 5);

      const matchingProducts = recentProducts.filter(product =>
        preferredCategories.some(pref =>
          product.category?.includes(pref) ||
          product.benefits?.some(benefit => benefit.toLowerCase().includes(pref))
        )
      ).slice(0, 4);

      setSavedArticles(matchingArticles);
      setSavedProducts(matchingProducts);
      
      const challengeMap = allChallenges.reduce((map, obj) => (map[obj.id] = obj, map), {});

      const processedChallenges = challengeProgressData.map(progress => ({
          ...progress,
          details: challengeMap[progress.challenge_id]
      }));

      setActiveChallenges(processedChallenges.filter(cp => !cp.is_completed));
      setCompletedChallenges(processedChallenges.filter(cp => cp.is_completed));
      
      setLastLogUpdate(Date.now());

    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="wellness-gradient min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-sage-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 bg-sage-100 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="wellness-gradient min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <UserIcon className="w-16 h-16 text-sage-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-sage-700 mb-4">Welcome to Pure Living Pro</h1>
          <p className="text-sage-600 mb-8">Please sign in to access your personal wellness dashboard.</p>
          <Button onClick={() => User.login()} className="bg-sage-600 hover:bg-sage-700">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const profileType = user.wellness_profile?.type || "Wellness Seeker";

  return (
    <div className="wellness-gradient min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-sage-700 mb-4">
            Welcome back, {user.full_name?.split(' ')[0] || 'Wellness Warrior'}!
          </h1>
          <div className="flex items-center gap-4 mb-6">
            <Badge className="bg-sage-100 text-sage-700 px-4 py-2 text-sm">
              {profileType}
            </Badge>
            {user.membership_level === 'pro' && (
              <Badge className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-4 py-2 text-sm">
                <Crown className="w-4 h-4 mr-1" />
                Pro Member
              </Badge>
            )}
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tracking">Daily Tracking</TabsTrigger>
            <TabsTrigger value="habits">Habit Tracker</TabsTrigger>
            <TabsTrigger value="library">My Library</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="organic-border premium-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-sage-600">Active Challenges</p>
                      <p className="text-2xl font-bold text-sage-700">{activeChallenges.length}</p>
                    </div>
                    <Trophy className="w-8 h-8 text-amber-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="organic-border premium-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-sage-600">Completed Challenges</p>
                      <p className="text-2xl font-bold text-sage-700">{completedChallenges.length}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="organic-border premium-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-sage-600">Saved Content</p>
                      <p className="text-2xl font-bold text-sage-700">{savedArticles.length + savedProducts.length}</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-sage-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <WellnessCharts lastRefreshed={lastLogUpdate} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {activeChallenges.length > 0 && (
                <Card className="organic-border premium-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-amber-500" />
                      Active Challenges
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activeChallenges.slice(0, 3).map((challenge) => (
                      <Link to={createPageUrl("ChallengeDetail", challenge.challenge_id)} key={challenge.id}>
                        <div className="flex items-center justify-between p-3 bg-sage-50 rounded-lg hover:bg-sage-100 transition-colors">
                          <div>
                            <h4 className="font-medium text-sage-700">{challenge.details?.title || 'Challenge'}</h4>
                            <p className="text-sm text-sage-600">Day {challenge.current_day}</p>
                          </div>
                          <Progress value={(challenge.current_day / (challenge.details?.duration_days || 7)) * 100} className="w-20" />
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              )}

              <Card className="organic-border premium-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-sage-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to={createPageUrl("MealPlanner")} className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <UtensilsCrossed className="w-4 h-4 mr-2" />
                      Plan This Week's Meals
                    </Button>
                  </Link>
                  <Link to={createPageUrl("MeditationTimer")} className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Timer className="w-4 h-4 mr-2" />
                      Start Meditation Session
                    </Button>
                  </Link>
                  <Link to={createPageUrl("Challenges")} className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Trophy className="w-4 h-4 mr-2" />
                      Browse Challenges
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tracking">
            <DailyTracker onLogUpdated={loadDashboardData} />
          </TabsContent>

          <TabsContent value="habits">
            <HabitTracker />
          </TabsContent>

          <TabsContent value="library" className="space-y-8">
            <Card className="organic-border premium-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-sage-600" />
                  Recommended Articles
                </CardTitle>
              </CardHeader>
              <CardContent>
                {savedArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedArticles.map((article) => (
                      <Link key={article.id} to={createPageUrl("BlogPost", article.slug || article.id)}>
                        <div className="flex space-x-3 p-3 rounded-lg hover:bg-sage-50 transition-colors">
                          <img
                            src={article.featured_image || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"}
                            alt={article.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sage-700 line-clamp-2">{article.title}</h4>
                            <p className="text-sm text-sage-600 mt-1">
                              {format(new Date(article.created_date), "MMM d")} • {article.read_time || 5} min read
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sage-600 text-center py-8">
                    No recommended articles yet. Explore our blog to discover great content!
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="organic-border premium-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-sage-600" />
                  Recommended Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                {savedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedProducts.map((product) => (
                      <a key={product.id} href={product.affiliate_link} target="_blank" rel="noopener noreferrer">
                        <div className="flex space-x-3 p-3 rounded-lg hover:bg-sage-50 transition-colors">
                          <img
                            src={product.image_url || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sage-700 line-clamp-2">{product.name}</h4>
                            <p className="text-sm font-bold text-sage-700 mt-1">
                              £{product.discounted_price || product.original_price || "N/A"}
                            </p>
                            {product.rating && (
                              <div className="flex items-center mt-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < product.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sage-600 text-center py-8">
                    No recommended products yet. Check out our wellness picks!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}