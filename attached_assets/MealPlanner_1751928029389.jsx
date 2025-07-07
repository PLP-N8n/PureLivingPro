import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  UtensilsCrossed, 
  ShoppingCart, 
  Loader2, 
  Plus, 
  X, 
  Calendar,
  CheckCircle,
  Sparkles
} from "lucide-react";

const mealPlanSchema = {
  type: "object",
  properties: {
    weeklyPlan: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "string" },
          breakfast: { type: "string" },
          lunch: { type: "string" },
          dinner: { type: "string" },
          snack: { type: "string" }
        }
      }
    },
    shoppingList: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: { type: "string" },
          items: { type: "array", items: { type: "string" } }
        }
      }
    }
  }
};

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function MealPlanner() {
  const [user, setUser] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [customMeals, setCustomMeals] = useState({});
  const [checkedItems, setCheckedItems] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [preferences, setPreferences] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error("User not logged in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMealPlan = async () => {
    setIsGenerating(true);
    
    const userGoals = user?.wellness_profile?.wellness_goals || [];
    const nutritionFocused = userGoals.includes("better_nutrition");
    
    const prompt = `Create a 7-day healthy meal plan for someone with the following preferences:
    
    User Profile:
    - Wellness Goals: ${userGoals.join(", ") || "General wellness"}
    - Dietary Restrictions: ${dietaryRestrictions || "None specified"}
    - Food Preferences: ${preferences || "None specified"}
    
    Requirements:
    - Focus on whole foods, balanced nutrition
    - ${nutritionFocused ? "Extra emphasis on nutrient-dense meals" : "Simple, practical meals"}
    - Include variety throughout the week
    - Provide a comprehensive shopping list organized by category
    - Each meal should be realistic and not overly complex
    
    Return in the specified JSON format with breakfast, lunch, dinner, and snack for each day.`;

    try {
      const plan = await InvokeLLM({
        prompt: prompt,
        response_json_schema: mealPlanSchema
      });
      setMealPlan(plan);
      setCheckedItems({});
    } catch (error) {
      console.error("Error generating meal plan:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const updateMeal = (day, mealType, value) => {
    setCustomMeals(prev => ({
      ...prev,
      [`${day}_${mealType}`]: value
    }));
  };

  const getMealValue = (day, mealType) => {
    const customKey = `${day}_${mealType}`;
    if (customMeals[customKey]) return customMeals[customKey];
    
    const dayPlan = mealPlan?.weeklyPlan?.find(d => d.day === day);
    return dayPlan?.[mealType] || "";
  };

  const toggleShoppingItem = (category, item) => {
    const key = `${category}_${item}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (isLoading) {
    return (
      <div className="wellness-gradient min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-sage-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="wellness-gradient min-h-screen flex items-center justify-center">
        <Card className="text-center p-8">
          <CardTitle>Access Your Meal Planner</CardTitle>
          <p className="mt-2 mb-4 text-sage-600">Please sign in to create personalized meal plans.</p>
          <Button onClick={() => User.login()}>Sign In</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="wellness-gradient min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-sage-700 mb-4">
            Meal Planner & Shopping Lists
          </h1>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto">
            Create personalized weekly meal plans with automatic shopping lists tailored to your wellness goals.
          </p>
        </div>

        {!mealPlan && (
          <Card className="mb-8 organic-border premium-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Your Meal Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  Dietary Restrictions (optional)
                </label>
                <Input
                  value={dietaryRestrictions}
                  onChange={(e) => setDietaryRestrictions(e.target.value)}
                  placeholder="e.g., vegetarian, gluten-free, dairy-free"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  Food Preferences (optional)
                </label>
                <Textarea
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="e.g., love Mediterranean flavors, prefer quick meals, enjoy spicy food"
                  className="h-20"
                />
              </div>

              <Button 
                onClick={generateMealPlan} 
                disabled={isGenerating}
                className="w-full bg-sage-600 hover:bg-sage-700"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Your Meal Plan...
                  </>
                ) : (
                  <>
                    <UtensilsCrossed className="mr-2 h-5 w-5" />
                    Generate My Meal Plan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {mealPlan && (
          <Tabs defaultValue="meals" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="meals" className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Weekly Meals
              </TabsTrigger>
              <TabsTrigger value="shopping" className="flex items-center">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Shopping List
              </TabsTrigger>
            </TabsList>

            <TabsContent value="meals" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-sage-700">Your Weekly Meal Plan</h2>
                <Button 
                  variant="outline" 
                  onClick={generateMealPlan}
                  disabled={isGenerating}
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                  Regenerate
                </Button>
              </div>

              <div className="grid gap-6">
                {daysOfWeek.map((day) => (
                  <Card key={day} className="organic-border">
                    <CardHeader>
                      <CardTitle className="text-lg text-sage-700">{day}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {["breakfast", "lunch", "dinner", "snack"].map((mealType) => (
                        <div key={mealType} className="space-y-2">
                          <label className="block text-sm font-medium text-sage-600 capitalize">
                            {mealType}
                          </label>
                          <Textarea
                            value={getMealValue(day, mealType)}
                            onChange={(e) => updateMeal(day, mealType, e.target.value)}
                            className="h-16 resize-none"
                            placeholder={`Enter ${mealType} for ${day}`}
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="shopping" className="space-y-6">
              <h2 className="text-2xl font-bold text-sage-700">Shopping List</h2>
              
              {mealPlan.shoppingList?.map((category) => (
                <Card key={category.category} className="organic-border">
                  <CardHeader>
                    <CardTitle className="text-lg text-sage-700 capitalize">
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {category.items.map((item, index) => {
                        const itemKey = `${category.category}_${item}`;
                        const isChecked = checkedItems[itemKey];
                        
                        return (
                          <div key={index} className="flex items-center space-x-3">
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={() => toggleShoppingItem(category.category, item)}
                            />
                            <span className={`${isChecked ? 'line-through text-sage-400' : 'text-sage-700'}`}>
                              {item}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}