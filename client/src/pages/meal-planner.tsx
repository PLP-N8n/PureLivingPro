import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { 
  Crown, 
  UtensilsCrossed, 
  Clock, 
  Users, 
  ChefHat,
  Sparkles,
  Heart,
  Leaf,
  Target,
  Calendar,
  CheckCircle,
  Info
} from "lucide-react";

interface MealPlan {
  id: string;
  title: string;
  description: string;
  meals: {
    breakfast: MealItem[];
    lunch: MealItem[];
    dinner: MealItem[];
    snacks: MealItem[];
  };
  nutritionSummary: {
    totalCalories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  shoppingList: string[];
  preparationTips: string[];
  createdAt: Date;
}

interface MealItem {
  name: string;
  description: string;
  calories: number;
  prepTime: number;
  ingredients: string[];
  instructions: string[];
  nutritionInfo: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

interface MealPlanRequest {
  dietaryPreferences: string[];
  healthGoals: string[];
  allergies: string[];
  calorieTarget: number;
  mealsPerDay: number;
  cookingTime: string;
  servingSize: number;
  additionalNotes: string;
}

export default function MealPlanner() {
  const { t } = useTranslation();
  const { subscription, isPremium, isLoading: subscriptionLoading } = useSubscription();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [currentMealPlan, setCurrentMealPlan] = useState<MealPlan | null>(null);
  const [formData, setFormData] = useState<MealPlanRequest>({
    dietaryPreferences: [],
    healthGoals: [],
    allergies: [],
    calorieTarget: 2000,
    mealsPerDay: 3,
    cookingTime: "30-45",
    servingSize: 1,
    additionalNotes: ""
  });

  const generateMealPlan = useMutation({
    mutationFn: async (data: MealPlanRequest) => {
      const response = await apiRequest("POST", "/api/meal-planner/generate", data);
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentMealPlan(data.mealPlan);
      toast({
        title: "Meal Plan Generated!",
        description: "Your personalized meal plan is ready.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate meal plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const dietaryOptions = [
    { id: "vegetarian", label: "Vegetarian", icon: <Leaf className="w-4 h-4" /> },
    { id: "vegan", label: "Vegan", icon: <Leaf className="w-4 h-4" /> },
    { id: "keto", label: "Ketogenic", icon: <Target className="w-4 h-4" /> },
    { id: "paleo", label: "Paleo", icon: <Target className="w-4 h-4" /> },
    { id: "mediterranean", label: "Mediterranean", icon: <Heart className="w-4 h-4" /> },
    { id: "lowcarb", label: "Low Carb", icon: <Target className="w-4 h-4" /> },
    { id: "glutenfree", label: "Gluten-Free", icon: <Leaf className="w-4 h-4" /> },
    { id: "dairyfree", label: "Dairy-Free", icon: <Leaf className="w-4 h-4" /> }
  ];

  const healthGoalOptions = [
    { id: "weight-loss", label: "Weight Loss" },
    { id: "weight-gain", label: "Weight Gain" },
    { id: "muscle-building", label: "Muscle Building" },
    { id: "energy-boost", label: "Energy Boost" },
    { id: "heart-health", label: "Heart Health" },
    { id: "digestive-health", label: "Digestive Health" },
    { id: "immune-support", label: "Immune Support" },
    { id: "maintenance", label: "Maintenance" }
  ];

  const handleDietaryChange = (optionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      dietaryPreferences: checked 
        ? [...prev.dietaryPreferences, optionId]
        : prev.dietaryPreferences.filter(id => id !== optionId)
    }));
  };

  const handleHealthGoalChange = (optionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      healthGoals: checked 
        ? [...prev.healthGoals, optionId]
        : prev.healthGoals.filter(id => id !== optionId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "AI Meal Planner is available for premium subscribers only.",
        variant: "destructive",
      });
      return;
    }
    generateMealPlan.mutate(formData);
  };

  if (subscriptionLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <UtensilsCrossed className="w-8 h-8 text-primary" />
            <Badge variant="secondary" className="gap-1">
              <Crown className="w-4 h-4" />
              Premium Feature
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            AI Meal Planner
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get personalized meal plans generated by AI based on your dietary preferences, health goals, and lifestyle
          </p>
        </div>

        {!isPremium ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>Premium Feature Required</CardTitle>
              <CardDescription>
                The AI Meal Planner is available for premium subscribers only. 
                Upgrade to access personalized meal planning with AI-generated recipes.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => window.location.href = '/subscribe'}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Configuration Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5" />
                  Meal Plan Configuration
                </CardTitle>
                <CardDescription>
                  Tell us about your preferences and we'll create a personalized meal plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Dietary Preferences */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Dietary Preferences</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {dietaryOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={option.id}
                            checked={formData.dietaryPreferences.includes(option.id)}
                            onChange={(e) => handleDietaryChange(option.id, e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={option.id} className="text-sm flex items-center gap-2 cursor-pointer">
                            {option.icon}
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Health Goals */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Health Goals</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {healthGoalOptions.map((goal) => (
                        <div key={goal.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={goal.id}
                            checked={formData.healthGoals.includes(goal.id)}
                            onChange={(e) => handleHealthGoalChange(goal.id, e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={goal.id} className="text-sm cursor-pointer">
                            {goal.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Calorie Target */}
                  <div>
                    <Label htmlFor="calories" className="text-sm font-medium">Daily Calorie Target</Label>
                    <Input
                      id="calories"
                      type="number"
                      value={formData.calorieTarget}
                      onChange={(e) => setFormData(prev => ({ ...prev, calorieTarget: parseInt(e.target.value) }))}
                      min="1200"
                      max="4000"
                      className="mt-2"
                    />
                  </div>

                  {/* Cooking Time */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Preferred Cooking Time</Label>
                    <RadioGroup
                      value={formData.cookingTime}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, cookingTime: value }))}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="15-30" id="time1" />
                        <Label htmlFor="time1" className="text-sm">15-30 minutes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="30-45" id="time2" />
                        <Label htmlFor="time2" className="text-sm">30-45 minutes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="45-60" id="time3" />
                        <Label htmlFor="time3" className="text-sm">45-60 minutes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="60+" id="time4" />
                        <Label htmlFor="time4" className="text-sm">60+ minutes</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Serving Size */}
                  <div>
                    <Label htmlFor="servings" className="text-sm font-medium">Serving Size</Label>
                    <Select value={formData.servingSize.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, servingSize: parseInt(value) }))}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 person</SelectItem>
                        <SelectItem value="2">2 people</SelectItem>
                        <SelectItem value="3">3 people</SelectItem>
                        <SelectItem value="4">4 people</SelectItem>
                        <SelectItem value="5">5+ people</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <Label htmlFor="notes" className="text-sm font-medium">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any allergies, specific preferences, or additional requirements..."
                      value={formData.additionalNotes}
                      onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                      className="mt-2"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={generateMealPlan.isPending}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    {generateMealPlan.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Generating Meal Plan...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Generate AI Meal Plan
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Generated Meal Plan */}
            {currentMealPlan && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {currentMealPlan.title}
                  </CardTitle>
                  <CardDescription>
                    {currentMealPlan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Nutrition Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {currentMealPlan.nutritionSummary.totalCalories}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Calories</div>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <div className="text-lg font-semibold">
                        P: {currentMealPlan.nutritionSummary.protein}g
                      </div>
                      <div className="text-lg font-semibold">
                        C: {currentMealPlan.nutritionSummary.carbs}g
                      </div>
                      <div className="text-lg font-semibold">
                        F: {currentMealPlan.nutritionSummary.fat}g
                      </div>
                    </div>
                  </div>

                  {/* Daily Meals */}
                  <div className="space-y-4">
                    {Object.entries(currentMealPlan.meals).map(([mealType, meals]) => (
                      <div key={mealType}>
                        <h3 className="font-semibold capitalize text-lg mb-2">{mealType}</h3>
                        <div className="space-y-2">
                          {meals.map((meal, index) => (
                            <div key={index} className="bg-card border rounded-lg p-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{meal.name}</h4>
                                  <p className="text-sm text-muted-foreground">{meal.description}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-medium">{meal.calories} cal</div>
                                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {meal.prepTime}min
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shopping List */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Shopping List</h3>
                    <div className="bg-card border rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-2">
                        {currentMealPlan.shoppingList.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-primary" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Preparation Tips */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Preparation Tips</h3>
                    <div className="bg-card border rounded-lg p-4">
                      <ul className="space-y-2">
                        {currentMealPlan.preparationTips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Info className="w-4 h-4 text-primary mt-0.5" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}