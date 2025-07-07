import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2,
  Sparkles,
  Home
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

const wellnessQuestions = [
  {
    id: 1,
    question: "What are your primary wellness goals?",
    type: "multiple",
    options: [
      { value: "weight-management", label: "Weight Management", icon: "⚖️" },
      { value: "stress-reduction", label: "Stress Reduction", icon: "🧘" },
      { value: "better-sleep", label: "Better Sleep", icon: "😴" },
      { value: "more-energy", label: "More Energy", icon: "⚡" },
      { value: "immune-support", label: "Immune Support", icon: "🛡️" },
      { value: "digestive-health", label: "Digestive Health", icon: "🥗" }
    ]
  },
  {
    id: 2,
    question: "What's your experience level with wellness practices?",
    type: "single",
    options: [
      { value: "beginner", label: "Complete Beginner", description: "New to wellness and healthy living" },
      { value: "some-experience", label: "Some Experience", description: "Tried a few things but want to learn more" },
      { value: "experienced", label: "Experienced", description: "Regular wellness practices, looking to optimize" },
      { value: "expert", label: "Very Experienced", description: "Deep wellness knowledge, seeking advanced tips" }
    ]
  },
  {
    id: 3,
    question: "Which types of content interest you most?",
    type: "multiple",
    options: [
      { value: "nutrition", label: "Nutrition & Diet", icon: "🥬" },
      { value: "fitness", label: "Fitness & Movement", icon: "🏃‍♀️" },
      { value: "mindfulness", label: "Mindfulness & Meditation", icon: "🧘‍♀️" },
      { value: "natural-remedies", label: "Natural Remedies", icon: "🌿" },
      { value: "recipes", label: "Healthy Recipes", icon: "👩‍🍳" },
      { value: "supplements", label: "Supplements & Vitamins", icon: "💊" }
    ]
  },
  {
    id: 4,
    question: "What best describes your current lifestyle?",
    type: "single",
    options: [
      { value: "very-busy", label: "Very Busy", description: "Little time for wellness practices" },
      { value: "moderately-busy", label: "Moderately Busy", description: "Some time for wellness, but limited" },
      { value: "flexible", label: "Flexible Schedule", description: "Good amount of time for wellness activities" },
      { value: "lots-of-time", label: "Lots of Free Time", description: "Ample time to focus on wellness" }
    ]
  },
  {
    id: 5,
    question: "What influences your product purchasing decisions?",
    type: "multiple",
    options: [
      { value: "scientific-evidence", label: "Scientific Evidence", icon: "🔬" },
      { value: "user-reviews", label: "User Reviews", icon: "⭐" },
      { value: "price-value", label: "Price & Value", icon: "💰" },
      { value: "natural-ingredients", label: "Natural Ingredients", icon: "🌱" },
      { value: "brand-reputation", label: "Brand Reputation", icon: "🏆" },
      { value: "expert-recommendations", label: "Expert Recommendations", icon: "👨‍⚕️" }
    ]
  }
];

export default function WellnessQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: async (wellnessProfile: any) => {
      const response = await apiRequest("PUT", "/api/user/wellness-profile", {
        wellnessProfile,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setIsCompleted(true);
      toast({
        title: "Profile Updated!",
        description: "Your wellness profile has been saved successfully.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Please sign in to save your wellness profile.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Error",
        description: "Failed to save wellness profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAnswer = (questionId: number, value: string, isMultiple = false) => {
    setAnswers(prev => {
      if (isMultiple) {
        const currentAnswers = (prev[questionId] as string[]) || [];
        const newAnswers = currentAnswers.includes(value)
          ? currentAnswers.filter(a => a !== value)
          : [...currentAnswers, value];
        return { ...prev, [questionId]: newAnswers };
      } else {
        return { ...prev, [questionId]: value };
      }
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < wellnessQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      completeQuiz();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const completeQuiz = () => {
    const wellnessProfile = {
      goals: answers[1] || [],
      experienceLevel: answers[2] || 'beginner',
      preferences: answers[3] || [],
      lifestyle: answers[4] || 'moderately-busy',
      shoppingPreferences: answers[5] || []
    };

    updateProfileMutation.mutate(wellnessProfile);
  };

  const currentQ = wellnessQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / wellnessQuestions.length) * 100;
  const currentAnswer = answers[currentQ?.id];
  const canProceed = currentAnswer && (Array.isArray(currentAnswer) ? currentAnswer.length > 0 : true);

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="organic-border premium-shadow bg-white overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-sage-500 to-sage-600 text-white p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
              <p className="text-white/90">Your personalized wellness journey starts now</p>
            </div>
            
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold text-sage-700 mb-4">
                Welcome to Your Personalized Wellness Experience
              </h2>
              <p className="text-sage-600 mb-8 leading-relaxed">
                Based on your responses, we'll curate content and product recommendations 
                specifically tailored to your wellness goals and preferences.
              </p>
              
              <div className="space-y-4">
                <Link href="/">
                  <Button 
                    size="lg" 
                    className="w-full bg-sage-600 hover:bg-sage-700 text-white organic-border premium-shadow"
                  >
                    <Home className="w-5 h-5 mr-2" />
                    Explore Your Personalized Content
                  </Button>
                </Link>
                
                <Link href="/dashboard">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full border-sage-300 text-sage-700 hover:bg-sage-50 organic-border"
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    View Your Wellness Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="organic-border premium-shadow bg-white overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-sage-500 to-sage-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-white/20 text-white px-3 py-1">
              Question {currentQuestion + 1} of {wellnessQuestions.length}
            </Badge>
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
          <Progress value={progress} className="mb-4 bg-white/20" />
          <CardTitle className="text-2xl">{currentQ?.question}</CardTitle>
        </CardHeader>

        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
                {currentQ?.options.map((option) => {
                  const isSelected = currentQ.type === "multiple" 
                    ? (currentAnswer as string[])?.includes(option.value)
                    : currentAnswer === option.value;

                  return (
                    <motion.div
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all duration-300 border-2 ${
                          isSelected 
                            ? 'border-sage-500 bg-sage-50 premium-shadow' 
                            : 'border-sage-200 hover:border-sage-300 hover:bg-sage-25'
                        }`}
                        onClick={() => handleAnswer(currentQ.id, option.value, currentQ.type === "multiple")}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4">
                            {option.icon && (
                              <span className="text-2xl">{option.icon}</span>
                            )}
                            <div className="flex-1">
                              <h3 className="font-semibold text-sage-700 mb-1">
                                {option.label}
                              </h3>
                              {option.description && (
                                <p className="text-sm text-sage-600">
                                  {option.description}
                                </p>
                              )}
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-6 h-6 text-sage-600" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>

        <div className="p-6 bg-sage-50 flex justify-between">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="border-sage-300 text-sage-700 hover:bg-sage-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={nextQuestion}
            disabled={!canProceed || updateProfileMutation.isPending}
            className="bg-sage-600 hover:bg-sage-700 text-white"
          >
            {updateProfileMutation.isPending ? (
              "Saving..."
            ) : currentQuestion === wellnessQuestions.length - 1 ? (
              <>
                Complete Quiz
                <CheckCircle2 className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
