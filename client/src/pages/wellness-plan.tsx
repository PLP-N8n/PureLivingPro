import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Brain, Target, Calendar, TrendingUp, Plus, Settings } from "lucide-react";

const generatePlanSchema = z.object({
  goals: z.array(z.string()).min(1, "At least one goal is required"),
  preferences: z.array(z.string()),
  fitnessLevel: z.enum(["beginner", "intermediate", "advanced"]),
  healthConditions: z.string().optional(),
});

const goalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  targetValue: z.number().optional(),
  dueDate: z.string().optional(),
});

type GeneratePlanFormData = z.infer<typeof generatePlanSchema>;
type GoalFormData = z.infer<typeof goalSchema>;

export default function WellnessPlan() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
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
  }, [isAuthenticated, authLoading, toast]);

  const generatePlanForm = useForm<GeneratePlanFormData>({
    resolver: zodResolver(generatePlanSchema),
    defaultValues: {
      goals: [],
      preferences: [],
      fitnessLevel: "beginner",
      healthConditions: "",
    },
  });

  const goalForm = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      targetValue: undefined,
      dueDate: "",
    },
  });

  const { data: plans = [], isLoading } = useQuery<any>({
    queryKey: ["/api/wellness-plans"],
    enabled: isAuthenticated,
  });

  const { data: goals = [] } = useQuery<any>({
    queryKey: ["/api/wellness-goals"],
    enabled: isAuthenticated,
  });

  const generatePlanMutation = useMutation({
    mutationFn: async (data: GeneratePlanFormData) => {
      const response = await apiRequest("POST", "/api/generate-wellness-plan", data);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your personalized wellness plan has been generated!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/wellness-plans"] });
      setIsGenerateDialogOpen(false);
      generatePlanForm.reset();
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
        description: "Failed to generate wellness plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createGoalMutation = useMutation({
    mutationFn: async (data: GoalFormData) => {
      const response = await apiRequest("POST", "/api/wellness-goals", data);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Goal created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/wellness-goals"] });
      setIsGoalDialogOpen(false);
      goalForm.reset();
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
        description: "Failed to create goal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const goalOptions = [
    "Weight Loss",
    "Muscle Gain",
    "Improved Endurance",
    "Better Sleep",
    "Stress Reduction",
    "Healthy Eating",
    "Mental Clarity",
    "Energy Boost",
  ];

  const preferenceOptions = [
    "Home Workouts",
    "Gym Sessions",
    "Outdoor Activities",
    "Yoga/Meditation",
    "Meal Planning",
    "Supplement Guidance",
    "Sleep Optimization",
    "Mindfulness Practices",
  ];

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Wellness Plan</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Your personalized journey to better health and wellness
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Target className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
                <DialogDescription>
                  Set a specific wellness goal to track your progress.
                </DialogDescription>
              </DialogHeader>
              <Form {...goalForm}>
                <form onSubmit={goalForm.handleSubmit((data) => createGoalMutation.mutate(data))} className="space-y-4">
                  <FormField
                    control={goalForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goal Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Lose 10 pounds" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={goalForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="fitness">Fitness</SelectItem>
                            <SelectItem value="nutrition">Nutrition</SelectItem>
                            <SelectItem value="mental-health">Mental Health</SelectItem>
                            <SelectItem value="sleep">Sleep</SelectItem>
                            <SelectItem value="habits">Habits</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={goalForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe your goal in detail..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={goalForm.control}
                    name="targetValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Value (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="e.g., 10 (for 10 pounds)" 
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={goalForm.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Date (Optional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={createGoalMutation.isPending}
                    className="w-full"
                  >
                    {createGoalMutation.isPending ? "Creating..." : "Create Goal"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Brain className="h-4 w-4 mr-2" />
                Generate AI Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Generate Personalized Wellness Plan</DialogTitle>
                <DialogDescription>
                  Tell us about your goals and preferences, and our AI will create a customized wellness plan for you.
                </DialogDescription>
              </DialogHeader>
              <Form {...generatePlanForm}>
                <form onSubmit={generatePlanForm.handleSubmit((data) => generatePlanMutation.mutate(data))} className="space-y-6">
                  <FormField
                    control={generatePlanForm.control}
                    name="goals"
                    render={() => (
                      <FormItem>
                        <FormLabel>Goals (Select at least one)</FormLabel>
                        <div className="grid grid-cols-2 gap-3">
                          {goalOptions.map((goal) => (
                            <FormField
                              key={goal}
                              control={generatePlanForm.control}
                              name="goals"
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-3">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(goal)}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), goal]
                                          : field.value?.filter((value) => value !== goal) || [];
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {goal}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generatePlanForm.control}
                    name="preferences"
                    render={() => (
                      <FormItem>
                        <FormLabel>Preferences (Optional)</FormLabel>
                        <div className="grid grid-cols-2 gap-3">
                          {preferenceOptions.map((preference) => (
                            <FormField
                              key={preference}
                              control={generatePlanForm.control}
                              name="preferences"
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-3">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(preference)}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), preference]
                                          : field.value?.filter((value) => value !== preference) || [];
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {preference}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generatePlanForm.control}
                    name="fitnessLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fitness Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generatePlanForm.control}
                    name="healthConditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Health Conditions (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please mention any health conditions or limitations..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={generatePlanMutation.isPending}
                    className="w-full"
                  >
                    {generatePlanMutation.isPending ? "Generating..." : "Generate Plan"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList>
          <TabsTrigger value="plans">My Plans</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : plans.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No wellness plans yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Get started by generating your first AI-powered wellness plan.
                </p>
                <Button onClick={() => setIsGenerateDialogOpen(true)}>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate Your First Plan
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {plans.map((plan: any) => (
                <Card key={plan.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{plan.title}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </div>
                      <Badge variant={plan.status === "active" ? "default" : "secondary"}>
                        {plan.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-gray-500">{plan.completionPercentage || 0}%</span>
                        </div>
                        <Progress value={plan.completionPercentage || 0} />
                      </div>
                      
                      {plan.goals && plan.goals.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Goals</h4>
                          <div className="flex flex-wrap gap-2">
                            {plan.goals.map((goal: string, index: number) => (
                              <Badge key={index} variant="outline">{goal}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {plan.duration && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Calendar className="h-4 w-4 mr-1" />
                          Duration: {plan.duration}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          {goals.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No goals set yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Set specific wellness goals to track your progress.
                </p>
                <Button onClick={() => setIsGoalDialogOpen(true)}>
                  <Target className="h-4 w-4 mr-2" />
                  Add Your First Goal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {goals.map((goal: any) => (
                <Card key={goal.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                        {goal.description && (
                          <CardDescription>{goal.description}</CardDescription>
                        )}
                      </div>
                      <Badge variant={goal.isCompleted ? "default" : "secondary"}>
                        {goal.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      {goal.targetValue && (
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Target: {goal.targetValue} {goal.unit || ""}
                        </span>
                      )}
                      {goal.dueDate && (
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Due: {new Date(goal.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-300">
                  Progress tracking coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
