import { useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Heart, 
  Activity, 
  Brain, 
  Utensils, 
  Moon, 
  Target, 
  ArrowRight,
  CheckCircle,
  Sparkles
} from "lucide-react";

interface QuizAnswer {
  questionId: string;
  answer: string | string[];
}

interface Question {
  id: string;
  type: "single" | "multiple" | "scale";
  question: string;
  description?: string;
  options: { value: string; label: string; description?: string }[];
  icon: React.ComponentType<{ className?: string }>;
  category: string;
}

const questions: Question[] = [
  {
    id: "wellness_goals",
    type: "multiple",
    question: "What are your primary wellness goals?",
    description: "Select all that apply to create your personalized plan",
    options: [
      { value: "weight_loss", label: "Weight Management", description: "Reach and maintain healthy weight" },
      { value: "fitness", label: "Physical Fitness", description: "Improve strength, endurance, and flexibility" },
      { value: "stress_reduction", label: "Stress Relief", description: "Manage anxiety and find inner calm" },
      { value: "better_sleep", label: "Better Sleep", description: "Improve sleep quality and duration" },
      { value: "nutrition", label: "Healthy Eating", description: "Develop sustainable eating habits" },
      { value: "mental_health", label: "Mental Wellness", description: "Boost mood and emotional well-being" }
    ],
    icon: Target,
    category: "Goals"
  },
  {
    id: "current_fitness",
    type: "single",
    question: "How would you describe your current fitness level?",
    options: [
      { value: "beginner", label: "Beginner", description: "Just starting my fitness journey" },
      { value: "intermediate", label: "Intermediate", description: "Regular exercise, moderate fitness" },
      { value: "advanced", label: "Advanced", description: "Very active with high fitness level" },
      { value: "athlete", label: "Athlete", description: "Competitive or professional level" }
    ],
    icon: Activity,
    category: "Fitness"
  },
  {
    id: "exercise_preferences",
    type: "multiple",
    question: "What types of exercise do you enjoy?",
    description: "We'll recommend activities you'll actually want to do",
    options: [
      { value: "cardio", label: "Cardio", description: "Running, cycling, dancing" },
      { value: "strength", label: "Strength Training", description: "Weight lifting, bodyweight exercises" },
      { value: "yoga", label: "Yoga & Stretching", description: "Flexibility and mindfulness" },
      { value: "sports", label: "Sports", description: "Team sports, tennis, swimming" },
      { value: "outdoor", label: "Outdoor Activities", description: "Hiking, rock climbing, nature walks" },
      { value: "classes", label: "Group Classes", description: "Fitness classes, group workouts" }
    ],
    icon: Heart,
    category: "Exercise"
  },
  {
    id: "stress_level",
    type: "scale",
    question: "How would you rate your current stress level?",
    description: "1 = Very relaxed, 5 = Very stressed",
    options: [
      { value: "1", label: "1 - Very Relaxed" },
      { value: "2", label: "2 - Slightly Stressed" },
      { value: "3", label: "3 - Moderately Stressed" },
      { value: "4", label: "4 - Quite Stressed" },
      { value: "5", label: "5 - Very Stressed" }
    ],
    icon: Brain,
    category: "Mental Health"
  },
  {
    id: "sleep_quality",
    type: "single",
    question: "How would you describe your sleep quality?",
    options: [
      { value: "excellent", label: "Excellent", description: "I sleep deeply and wake refreshed" },
      { value: "good", label: "Good", description: "Generally sleep well with minor issues" },
      { value: "fair", label: "Fair", description: "Some nights good, some nights poor" },
      { value: "poor", label: "Poor", description: "Frequently have trouble sleeping" }
    ],
    icon: Moon,
    category: "Sleep"
  },
  {
    id: "nutrition_habits",
    type: "single",
    question: "How would you describe your current eating habits?",
    options: [
      { value: "very_healthy", label: "Very Healthy", description: "Mostly whole foods, balanced meals" },
      { value: "mostly_healthy", label: "Mostly Healthy", description: "Good habits with occasional treats" },
      { value: "mixed", label: "Mixed", description: "Some healthy, some not so healthy" },
      { value: "needs_improvement", label: "Needs Improvement", description: "Lots of processed foods, irregular meals" }
    ],
    icon: Utensils,
    category: "Nutrition"
  },
  {
    id: "time_availability",
    type: "single",
    question: "How much time can you dedicate to wellness activities daily?",
    options: [
      { value: "15_min", label: "15 minutes", description: "Quick daily habits" },
      { value: "30_min", label: "30 minutes", description: "Short focused sessions" },
      { value: "60_min", label: "1 hour", description: "Dedicated wellness time" },
      { value: "90_min", label: "90+ minutes", description: "Extended wellness commitment" }
    ],
    icon: Target,
    category: "Time"
  }
];

export default function WellnessQuiz() {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (questionId: string, answer: string | string[]) => {
    const newAnswers = answers.filter(a => a.questionId !== questionId);
    newAnswers.push({ questionId, answer });
    setAnswers(newAnswers);
  };

  const getCurrentAnswer = (questionId: string) => {
    return answers.find(a => a.questionId === questionId)?.answer || "";
  };

  const canProceed = () => {
    const currentAnswer = getCurrentAnswer(questions[currentQuestion].id);
    return Array.isArray(currentAnswer) ? currentAnswer.length > 0 : currentAnswer !== "";
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    try {
      const response = await apiRequest("POST", "/api/wellness-quiz", { answers });
      
      toast({
        title: "Quiz Completed!",
        description: "Your personalized wellness plan is being generated.",
      });
      
      // Navigate to dashboard with generated plan
      setLocation("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const question = questions[currentQuestion];
  const Icon = question.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-white py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-sage-600" />
            <h1 className="text-3xl font-bold text-sage-800">Wellness Discovery Quiz</h1>
          </div>
          <p className="text-sage-600">
            Let's create your personalized wellness journey in just a few minutes
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-sage-600">Question {currentQuestion + 1} of {questions.length}</span>
            <Badge variant="outline" className="text-sage-600 border-sage-300">
              {question.category}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-8 border-sage-200">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-sage-100 rounded-lg">
                <Icon className="w-5 h-5 text-sage-600" />
              </div>
              <CardTitle className="text-xl text-sage-800">{question.question}</CardTitle>
            </div>
            {question.description && (
              <CardDescription className="text-sage-600">
                {question.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {question.type === "single" && (
              <RadioGroup
                value={getCurrentAnswer(question.id) as string}
                onValueChange={(value) => handleAnswer(question.id, value)}
              >
                {question.options.map((option) => (
                  <div key={option.value} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-sage-50 transition-colors">
                    <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={option.value} className="font-medium text-sage-800 cursor-pointer">
                        {option.label}
                      </Label>
                      {option.description && (
                        <p className="text-sm text-sage-600 mt-1">{option.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </RadioGroup>
            )}

            {question.type === "multiple" && (
              <div className="space-y-3">
                {question.options.map((option) => {
                  const currentAnswers = getCurrentAnswer(question.id) as string[] || [];
                  const isChecked = currentAnswers.includes(option.value);
                  
                  return (
                    <div key={option.value} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-sage-50 transition-colors">
                      <Checkbox
                        id={option.value}
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          const newAnswers = checked
                            ? [...currentAnswers, option.value]
                            : currentAnswers.filter(a => a !== option.value);
                          handleAnswer(question.id, newAnswers);
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor={option.value} className="font-medium text-sage-800 cursor-pointer">
                          {option.label}
                        </Label>
                        {option.description && (
                          <p className="text-sm text-sage-600 mt-1">{option.description}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {question.type === "scale" && (
              <RadioGroup
                value={getCurrentAnswer(question.id) as string}
                onValueChange={(value) => handleAnswer(question.id, value)}
              >
                <div className="grid grid-cols-1 gap-3">
                  {question.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-sage-50 transition-colors">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="font-medium text-sage-800 cursor-pointer flex-1">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="border-sage-300 hover:bg-sage-50"
          >
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            className="bg-sage-600 hover:bg-sage-700"
          >
            {isSubmitting ? (
              "Processing..."
            ) : currentQuestion === questions.length - 1 ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Quiz
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}