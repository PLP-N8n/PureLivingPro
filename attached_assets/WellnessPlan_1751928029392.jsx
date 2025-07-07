import React, { useState, useEffect } from "react";
import { User, DailyWellnessLog } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Loader2, ClipboardList, CheckCircle, Target, Sun, Moon, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const planJsonSchema = {
  type: "object",
  properties: {
    planTitle: { type: "string", description: "A catchy title for the 7-day wellness plan." },
    weeklyFocus: { type: "string", description: "A brief, one-sentence summary of the main goal for the week." },
    dailyPlan: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "number", description: "Day number (1-7)." },
          theme: { type: "string", description: "The theme for the day (e.g., 'Mindful Monday')." },
          morningActivity: { type: "string", description: "A short, actionable morning activity." },
          afternoonActivity: { type: "string", description: "A short, actionable afternoon activity." },
          eveningAffirmation: { type: "string", description: "A positive affirmation for the evening." },
        },
        required: ["day", "theme", "morningActivity", "afternoonActivity", "eveningAffirmation"]
      }
    }
  },
  required: ["planTitle", "weeklyFocus", "dailyPlan"]
};

export default function WellnessPlan() {
  const [user, setUser] = useState(null);
  const [wellnessPlan, setWellnessPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const generatePlan = async () => {
    if (!user?.wellness_profile) return;
    setIsGenerating(true);

    const recentLogs = await DailyWellnessLog.filter({ created_by: user.email }, '-log_date', 5);
    const logContext = recentLogs.map(log => `- ${log.log_date}: Mood ${log.mood}/5, Energy ${log.energy_level}/5`).join('\n') || 'No recent logs.';

    const prompt = `
      Create a personalized 7-day wellness plan for a user with the following profile:
      - Wellness Goals: ${user.wellness_profile.wellness_goals.join(', ')}
      - Experience Level: ${user.wellness_profile.experience_level}
      - Lifestyle: ${user.wellness_profile.lifestyle}
      - Recent Wellness Logs (for context):
      ${logContext}

      Instructions:
      - The plan should be encouraging, actionable, and not overwhelming.
      - Tailor the activities to the user's goals and lifestyle. For a 'very_busy' lifestyle, suggest shorter activities.
      - Each day should have a unique, positive theme.
      - Provide a catchy title and a summary focus for the week.
      - Return the plan in the specified JSON format.
    `;

    try {
      const plan = await InvokeLLM({
        prompt: prompt,
        response_json_schema: planJsonSchema,
      });
      setWellnessPlan(plan);
    } catch (error) {
      console.error("Error generating wellness plan:", error);
      // You could set an error state here to show a message to the user
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return <div className="wellness-gradient min-h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-sage-600" /></div>;
  }

  if (!user) {
    return (
      <div className="wellness-gradient min-h-screen flex items-center justify-center">
        <Card className="text-center p-8">
          <CardTitle>Access Your Wellness Plan</CardTitle>
          <CardDescription className="mt-2 mb-4">Please sign in to generate your personalized plan.</CardDescription>
          <Button onClick={() => User.login()}>Sign In</Button>
        </Card>
      </div>
    );
  }

  if (!user.wellness_profile?.quiz_completed) {
    return (
      <div className="wellness-gradient min-h-screen flex items-center justify-center">
        <Card className="text-center p-8 max-w-lg">
          <CardHeader>
            <CardTitle>First, Discover Your Wellness Profile</CardTitle>
            <CardDescription className="mt-2">
              Complete our 2-minute wellness quiz so we can create a plan that's perfectly tailored to you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to={createPageUrl("WellnessQuiz")}>
              <Button>Take the Wellness Quiz <Sparkles className="w-4 h-4 ml-2" /></Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="wellness-gradient min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-sage-700 mb-2 text-center">My 7-Day Wellness Plan</h1>
        <p className="text-lg text-sage-600 text-center mb-12">A personalized week of wellness, generated by AI just for you.</p>

        {!wellnessPlan && (
          <div className="text-center">
            <Button onClick={generatePlan} disabled={isGenerating} size="lg" className="bg-sage-600 hover:bg-sage-700">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Your Plan...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" /> Generate My Personal Plan
                </>
              )}
            </Button>
          </div>
        )}

        <AnimatePresence>
          {wellnessPlan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="mb-8 organic-border premium-shadow">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-sage-800">{wellnessPlan.planTitle}</CardTitle>
                  <CardDescription className="text-md">{wellnessPlan.weeklyFocus}</CardDescription>
                </CardHeader>
              </Card>
              
              <div className="space-y-6">
                {wellnessPlan.dailyPlan.map((day, index) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="organic-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-4">
                          <span className="flex items-center justify-center w-12 h-12 bg-sage-100 text-sage-600 font-bold text-xl organic-border">
                            {day.day}
                          </span>
                          <span className="text-xl text-sage-700">{day.theme}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start gap-4">
                          <Sun className="w-5 h-5 text-amber-500 mt-1" />
                          <div>
                            <h4 className="font-semibold text-sage-700">Morning</h4>
                            <p className="text-sage-600">{day.morningActivity}</p>
                          </div>
                        </div>
                         <div className="flex items-start gap-4">
                          <Leaf className="w-5 h-5 text-green-500 mt-1" />
                          <div>
                            <h4 className="font-semibold text-sage-700">Afternoon</h4>
                            <p className="text-sage-600">{day.afternoonActivity}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <Moon className="w-5 h-5 text-indigo-400 mt-1" />
                          <div>
                            <h4 className="font-semibold text-sage-700">Evening Affirmation</h4>
                            <p className="text-sage-600 italic">"{day.eveningAffirmation}"</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <div className="text-center mt-8">
                <Button onClick={generatePlan} variant="outline" disabled={isGenerating}>
                   {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                   Regenerate Plan
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}