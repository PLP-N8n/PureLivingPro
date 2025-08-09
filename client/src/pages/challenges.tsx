import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ChallengeCard from "@/components/wellness/challenge-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Target, 
  Trophy, 
  Calendar, 
  Users,
  Flame,
  Plus,
  Filter
} from "lucide-react";
import { motion } from "framer-motion";

export default function Challenges() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("available");

  const { data: availableChallenges, isLoading: challengesLoading } = useQuery<any>({
    queryKey: ["/api/challenges"],
    retry: false,
  });

  const { data: userChallenges, isLoading: userChallengesLoading } = useQuery<any>({
    queryKey: ["/api/user/challenges"],
    retry: false,
    enabled: isAuthenticated,
  });

  const joinChallengeMutation = useMutation({
    mutationFn: async (challengeId: number) => {
      const response = await apiRequest("POST", "/api/user/challenges", {
        challengeId,
        startDate: new Date().toISOString(),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/challenges"] });
      toast({
        title: "Challenge Joined!",
        description: "You've successfully joined the challenge. Good luck!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Sign In Required",
          description: "Please sign in to join challenges.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to join challenge. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-sage-25">
        <Navbar />
        <div className="pt-24 pb-16 flex items-center justify-center">
          <Card className="max-w-md mx-4">
            <CardContent className="pt-6 text-center">
              <Target className="w-12 h-12 text-sage-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-sage-800 mb-2">Sign In Required</h2>
              <p className="text-sage-600 mb-4">Please sign in to view and join wellness challenges.</p>
              <Button onClick={() => window.location.href = "/api/login"}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const activeChallenges = userChallenges?.filter((uc: any) => !uc.isCompleted) || [];
  const completedChallenges = userChallenges?.filter((uc: any) => uc.isCompleted) || [];
  const joinedChallengeIds = userChallenges?.map((uc: any) => uc.challengeId) || [];

  return (
    <div className="min-h-screen bg-sage-25">
      <Navbar />
      
      {/* Header */}
      <section className="pt-24 pb-16 wellness-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center bg-amber-100 text-amber-700 px-4 py-2 rounded-full mb-6">
                <Target className="w-5 h-5 mr-2" />
                Wellness Challenges
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-sage-800 mb-6">
                Challenge Yourself to Grow
              </h1>
              <p className="text-xl text-sage-600 max-w-3xl mx-auto mb-8">
                Join our community challenges designed to build healthy habits, boost motivation, and create lasting positive changes in your life.
              </p>
              
              {isAuthenticated && (
                <div className="flex flex-wrap justify-center gap-4">
                  <Badge className="bg-sage-100 text-sage-700 px-4 py-2 text-base">
                    <Calendar className="w-4 h-4 mr-2" />
                    {activeChallenges.length} Active
                  </Badge>
                  <Badge className="bg-green-100 text-green-700 px-4 py-2 text-base">
                    <Trophy className="w-4 h-4 mr-2" />
                    {completedChallenges.length} Completed
                  </Badge>
                  <Badge className="bg-amber-100 text-amber-700 px-4 py-2 text-base">
                    <Flame className="w-4 h-4 mr-2" />
                    Challenge Streak: 3
                  </Badge>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Challenge Stats */}
      {isAuthenticated && (
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold text-sage-800">{activeChallenges.length}</div>
                  <p className="text-sage-600 text-sm">Active Challenges</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-sage-800">{completedChallenges.length}</div>
                  <p className="text-sage-600 text-sm">Completed</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-sage-800">1,247</div>
                  <p className="text-sage-600 text-sm">Community Members</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Flame className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-sage-800">7</div>
                  <p className="text-sage-600 text-sm">Day Streak</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Challenges Content */}
      <section className="py-16 wellness-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="flex items-center justify-between">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="available">Available</TabsTrigger>
                <TabsTrigger value="active" disabled={!isAuthenticated}>
                  Active ({activeChallenges.length})
                </TabsTrigger>
                <TabsTrigger value="completed" disabled={!isAuthenticated}>
                  Completed ({completedChallenges.length})
                </TabsTrigger>
              </TabsList>
              
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            <TabsContent value="available" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-sage-800 mb-4">
                  Join a New Challenge
                </h2>
                <p className="text-sage-600">
                  Choose from our carefully designed challenges to build healthy habits and achieve your wellness goals.
                </p>
              </div>

              {challengesLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <Skeleton className="h-32 w-full" />
                      <CardContent className="p-6">
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-4" />
                        <Skeleton className="h-10 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableChallenges?.map((challenge: any, index: number) => (
                    <motion.div
                      key={challenge.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <ChallengeCard
                        challenge={challenge}
                        isJoined={joinedChallengeIds.includes(challenge.id)}
                        onJoin={() => joinChallengeMutation.mutate(challenge.id)}
                        isJoining={joinChallengeMutation.isPending}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="active" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-sage-800 mb-4">
                  Your Active Challenges
                </h2>
                <p className="text-sage-600">
                  Keep up the great work! Track your progress and stay motivated.
                </p>
              </div>

              {userChallengesLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <Skeleton className="h-32 w-full" />
                      <CardContent className="p-6">
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-4" />
                        <Skeleton className="h-10 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : activeChallenges.length === 0 ? (
                <div className="text-center py-16">
                  <Target className="w-16 h-16 text-sage-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-sage-700 mb-2">No Active Challenges</h3>
                  <p className="text-sage-600 mb-6">
                    Join a challenge from the Available tab to get started on your wellness journey.
                  </p>
                  <Button onClick={() => setActiveTab("available")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Browse Challenges
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeChallenges.map((userChallenge: any, index: number) => {
                    const challenge = availableChallenges?.find((c: any) => c.id === userChallenge.challengeId);
                    if (!challenge) return null;
                    
                    return (
                      <motion.div
                        key={userChallenge.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <ChallengeCard
                          challenge={challenge}
                          userChallenge={userChallenge}
                          isJoined={true}
                          showProgress={true}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-sage-800 mb-4">
                  Completed Challenges
                </h2>
                <p className="text-sage-600">
                  Celebrate your achievements and see how far you've come!
                </p>
              </div>

              {completedChallenges.length === 0 ? (
                <div className="text-center py-16">
                  <Trophy className="w-16 h-16 text-sage-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-sage-700 mb-2">No Completed Challenges Yet</h3>
                  <p className="text-sage-600 mb-6">
                    Complete your first challenge to see it here and earn your achievement badge.
                  </p>
                  <Button onClick={() => setActiveTab("available")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Start a Challenge
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedChallenges.map((userChallenge: any, index: number) => {
                    const challenge = availableChallenges?.find((c: any) => c.id === userChallenge.challengeId);
                    if (!challenge) return null;
                    
                    return (
                      <motion.div
                        key={userChallenge.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <ChallengeCard
                          challenge={challenge}
                          userChallenge={userChallenge}
                          isJoined={true}
                          isCompleted={true}
                          showProgress={true}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}
