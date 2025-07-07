import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Challenge, ChallengeTask, UserChallengeProgress } from "@/api/entities";
import { useAuth } from "@/components/contexts/AuthContext";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Trophy,
  Play,
  CheckCircle2,
  Users,
  Target
} from "lucide-react";

const difficultyColors = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800", 
  advanced: "bg-red-100 text-red-800"
};

const categoryColors = {
  mindfulness: "bg-purple-100 text-purple-800",
  nutrition: "bg-green-100 text-green-800",
  fitness: "bg-orange-100 text-orange-800",
  sleep: "bg-blue-100 text-blue-800",
  detox: "bg-pink-100 text-pink-800",
  "self-care": "bg-amber-100 text-amber-800"
};

export default function ChallengeDetailPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (id) {
      loadChallengeData();
    }
  }, [id, user]);

  const loadChallengeData = async () => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      // Load challenge
      let challengeData = null;
      try {
        const challenges = await Challenge.filter({ id: id }, "-created_date", 1);
        challengeData = challenges && challenges.length > 0 ? challenges[0] : null;
      } catch (error) {
        console.warn("Error loading challenge:", error);
      }

      if (!challengeData) {
        setHasError(true);
        return;
      }

      setChallenge(challengeData);

      // Load challenge tasks
      try {
        const challengeTasks = await ChallengeTask.filter({ challenge_id: id }, "day_number", 50);
        setTasks(challengeTasks || []);
      } catch (error) {
        console.warn("Error loading challenge tasks:", error);
        setTasks([]);
      }

      // Load user progress if authenticated
      if (isAuthenticated && user) {
        try {
          const progressData = await UserChallengeProgress.filter({ 
            challenge_id: id, 
            user_id: user.id 
          }, "-created_date", 1);
          setUserProgress(progressData && progressData.length > 0 ? progressData[0] : null);
        } catch (error) {
          console.warn("Error loading user progress:", error);
          setUserProgress(null);
        }
      }

    } catch (error) {
      console.error("Error loading challenge data:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChallenge = async () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      alert("Please log in to start challenges");
      return;
    }

    try {
      const progressData = {
        challenge_id: id,
        user_id: user.id,
        started_date: new Date().toISOString().split('T')[0],
        current_day: 1,
        completed_tasks: [],
        is_completed: false,
        streak_days: 0,
        notes: []
      };

      await UserChallengeProgress.create(progressData);
      setUserProgress(progressData);
    } catch (error) {
      console.error("Error starting challenge:", error);
      alert("Error starting challenge. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <div className="flex gap-4 mb-8">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-28" />
          </div>
          <Skeleton className="h-48 w-full mb-8 rounded-2xl" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (hasError || !challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Challenge Not Found</h1>
          <p className="text-gray-600 mb-8">
            The challenge you're looking for doesn't exist or has been removed.
          </p>
          <Link to={createPageUrl("Challenges")}>
            <Button className="bg-sage-600 hover:bg-sage-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Challenges
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const progressPercentage = userProgress ? 
    Math.round((userProgress.current_day / challenge.duration_days) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to={createPageUrl("Challenges")}>
          <Button variant="outline" className="mb-8 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Challenges
          </Button>
        </Link>

        {/* Challenge Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <Badge className={`${categoryColors[challenge.category] || 'bg-gray-100 text-gray-800'} rounded-full`}>
              {challenge.category}
            </Badge>
            <Badge className={`${difficultyColors[challenge.difficulty_level] || 'bg-gray-100 text-gray-800'} rounded-full`}>
              {challenge.difficulty_level}
            </Badge>
            <div className="flex items-center text-gray-600 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              {challenge.duration_days} days
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {challenge.title}
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            {challenge.description}
          </p>

          {/* Challenge Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {!userProgress ? (
              <Button 
                onClick={handleStartChallenge}
                className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3 rounded-xl"
                disabled={!isAuthenticated}
              >
                <Play className="w-5 h-5 mr-2" />
                Start Challenge
              </Button>
            ) : (
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Day {userProgress.current_day} of {challenge.duration_days}
                  </span>
                  <span className="text-sm text-gray-500">
                    {progressPercentage}% Complete
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>
            )}
          </div>
        </div>

        {/* Challenge Image */}
        {challenge.image_url && (
          <div className="mb-12">
            <img
              src={challenge.image_url}
              alt={challenge.title}
              className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Challenge Tasks */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Challenge Timeline</h2>
          
          <div className="space-y-4">
            {tasks.map((task) => {
              const isCompleted = userProgress?.completed_tasks?.includes(task.id);
              const isCurrent = userProgress?.current_day === task.day_number;
              const isAccessible = !userProgress || task.day_number <= userProgress.current_day;
              
              return (
                <Card 
                  key={task.id} 
                  className={`border-2 transition-all duration-200 ${
                    isCompleted ? 'border-green-200 bg-green-50' : 
                    isCurrent ? 'border-sage-200 bg-sage-50' : 
                    'border-gray-200'
                  } ${!isAccessible ? 'opacity-50' : ''}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          isCompleted ? 'bg-green-500 text-white' : 
                          isCurrent ? 'bg-sage-500 text-white' : 
                          'bg-gray-200 text-gray-600'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <span className="text-sm font-semibold">{task.day_number}</span>
                          )}
                        </div>
                        Day {task.day_number}: {task.title}
                      </CardTitle>
                      {task.estimated_time && (
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          {task.estimated_time} min
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-3">{task.description}</p>
                    {task.instructions && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Instructions:</h4>
                        <p className="text-gray-700 text-sm">{task.instructions}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Challenge Stats */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-sage-600" />
              Challenge Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{challenge.duration_days}</div>
                <div className="text-sm text-gray-600">Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
                <div className="text-sm text-gray-600">Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {challenge.difficulty_level}
                </div>
                <div className="text-sm text-gray-600">Difficulty</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {challenge.reward_badge ? '🏆' : '⭐'}
                </div>
                <div className="text-sm text-gray-600">Reward</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}