import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Users, 
  Calendar, 
  Trophy,
  Clock,
  Flame,
  CheckCircle,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";

interface Challenge {
  id: number;
  title: string;
  description: string;
  duration: number;
  category: string;
  difficulty: string;
  goals: string[];
  isActive: boolean;
}

interface UserChallenge {
  id: number;
  challengeId: number;
  startDate: string;
  endDate?: string;
  isCompleted: boolean;
  progress?: {
    completedDays: number[];
    notes: string[];
  };
}

interface ChallengeCardProps {
  challenge: Challenge;
  userChallenge?: UserChallenge;
  isJoined?: boolean;
  isCompleted?: boolean;
  showProgress?: boolean;
  onJoin?: () => void;
  isJoining?: boolean;
}

export default function ChallengeCard({
  challenge,
  userChallenge,
  isJoined = false,
  isCompleted = false,
  showProgress = false,
  onJoin,
  isJoining = false,
}: ChallengeCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-700";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "advanced":
        return "bg-red-100 text-red-700";
      default:
        return "bg-sage-100 text-sage-700";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "fitness":
        return "🏃‍♀️";
      case "nutrition":
        return "🥗";
      case "mindfulness":
        return "🧘";
      case "sleep":
        return "😴";
      case "hydration":
        return "💧";
      default:
        return "🎯";
    }
  };

  const calculateProgress = () => {
    if (!userChallenge?.progress || !challenge.duration) return 0;
    const completedDays = userChallenge.progress.completedDays?.length || 0;
    return Math.round((completedDays / challenge.duration) * 100);
  };

  const getDaysRemaining = () => {
    if (!userChallenge?.startDate || !challenge.duration) return challenge.duration;
    const startDate = new Date(userChallenge.startDate);
    const today = new Date();
    const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, challenge.duration - daysPassed);
  };

  const progress = showProgress ? calculateProgress() : 0;
  const daysRemaining = showProgress ? getDaysRemaining() : challenge.duration;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`h-full organic-border premium-shadow transition-all duration-300 ${
        isCompleted 
          ? 'bg-green-50 border-green-200' 
          : isJoined 
            ? 'bg-amber-50 border-amber-200' 
            : 'bg-white hover:shadow-lg'
      }`}>
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getCategoryIcon(challenge.category)}</span>
              <Badge variant="outline" className="capitalize">
                {challenge.category}
              </Badge>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <Badge className={getDifficultyColor(challenge.difficulty)}>
                {challenge.difficulty}
              </Badge>
              {isCompleted && (
                <Badge className="bg-green-100 text-green-700">
                  <Trophy className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
          </div>
          
          <CardTitle className="text-sage-800 leading-tight">
            {challenge.title}
          </CardTitle>
          <CardDescription className="text-sage-600">
            {challenge.description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Challenge Info */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-sage-600">
                  <Calendar className="w-4 h-4" />
                  <span>{challenge.duration} days</span>
                </div>
                <div className="flex items-center space-x-1 text-sage-600">
                  <Users className="w-4 h-4" />
                  <span>234 joined</span>
                </div>
              </div>
              
              {showProgress && !isCompleted && (
                <div className="flex items-center space-x-1 text-amber-600">
                  <Clock className="w-4 h-4" />
                  <span>{daysRemaining} days left</span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {showProgress && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-sage-700">Progress</span>
                  <span className="text-sage-600">{progress}%</span>
                </div>
                <Progress 
                  value={progress} 
                  className={`h-2 ${
                    isCompleted 
                      ? '[&>div]:bg-green-500' 
                      : '[&>div]:bg-amber-500'
                  }`}
                />
                {isCompleted && (
                  <div className="flex items-center justify-center space-x-2 text-green-700 font-medium">
                    <CheckCircle className="w-4 h-4" />
                    <span>Challenge Completed!</span>
                  </div>
                )}
              </div>
            )}

            {/* Goals */}
            {challenge.goals && challenge.goals.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-sage-700 mb-2">Goals:</h4>
                <div className="flex flex-wrap gap-1">
                  {challenge.goals.slice(0, 3).map((goal, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {goal}
                    </Badge>
                  ))}
                  {challenge.goals.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{challenge.goals.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-2">
              {!isJoined ? (
                <Button
                  onClick={onJoin}
                  disabled={isJoining || !challenge.isActive}
                  className="w-full bg-sage-600 hover:bg-sage-700 text-white"
                >
                  {isJoining ? (
                    "Joining..."
                  ) : !challenge.isActive ? (
                    "Inactive"
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Join Challenge
                    </>
                  )}
                </Button>
              ) : isCompleted ? (
                <Button
                  variant="outline"
                  className="w-full border-green-200 text-green-700 hover:bg-green-50"
                  disabled
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Completed
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full border-amber-200 text-amber-700 hover:bg-amber-50"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    View Progress
                  </Button>
                  <div className="flex items-center justify-center space-x-2 text-xs text-sage-500">
                    <Flame className="w-3 h-3" />
                    <span>Keep up the great work!</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
