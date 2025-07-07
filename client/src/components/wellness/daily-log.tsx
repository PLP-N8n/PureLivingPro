import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Heart, 
  Zap, 
  Moon, 
  Dumbbell, 
  Brain,
  Save,
  CheckCircle,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";

export default function DailyLog() {
  const [mood, setMood] = useState([3]);
  const [energy, setEnergy] = useState([3]);
  const [sleep, setSleep] = useState([7]);
  const [exercise, setExercise] = useState(false);
  const [meditation, setMeditation] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get today's date for querying existing log
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: todayLog } = useQuery({
    queryKey: ["/api/user/logs", { date: today.toISOString() }],
    retry: false,
    enabled: !!user,
  });

  // Load existing log data if available
  useEffect(() => {
    if (todayLog) {
      setMood([todayLog.mood || 3]);
      setEnergy([todayLog.energy || 3]);
      setSleep([todayLog.sleep || 7]);
      setExercise(todayLog.exercise || false);
      setMeditation(todayLog.meditation || false);
      setNotes(todayLog.notes || "");
      setIsSubmitted(true);
    }
  }, [todayLog]);

  const saveDailyLogMutation = useMutation({
    mutationFn: async (logData: any) => {
      const response = await apiRequest("POST", "/api/user/logs", logData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/logs"] });
      setIsSubmitted(true);
      toast({
        title: "Daily Log Saved!",
        description: "Your wellness data has been recorded for today.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Please sign in to save your daily log.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Error",
        description: "Failed to save daily log. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    const logData = {
      date: new Date().toISOString(),
      mood: mood[0],
      energy: energy[0],
      sleep: sleep[0],
      exercise,
      meditation,
      notes: notes.trim() || null,
    };

    saveDailyLogMutation.mutate(logData);
  };

  const getMoodEmoji = (value: number) => {
    const emojis = ["😢", "😕", "😐", "😊", "😄"];
    return emojis[value - 1] || "😐";
  };

  const getEnergyColor = (value: number) => {
    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500"];
    return colors[value - 1] || "bg-yellow-500";
  };

  return (
    <div className="space-y-6">
      {isSubmitted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div>
            <p className="font-medium text-green-800">Today's log completed!</p>
            <p className="text-sm text-green-700">You can update it anytime throughout the day.</p>
          </div>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Mood Tracking */}
        <Card className="organic-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600" />
              Mood
            </CardTitle>
            <CardDescription>How are you feeling today?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-2">{getMoodEmoji(mood[0])}</div>
                <div className="text-lg font-semibold text-sage-700">
                  {mood[0]}/5
                </div>
              </div>
              <Slider
                value={mood}
                onValueChange={setMood}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-sage-500">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Energy Tracking */}
        <Card className="organic-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Energy Level
            </CardTitle>
            <CardDescription>How energetic do you feel?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-8 mx-1 rounded-full ${
                        i < energy[0] ? getEnergyColor(energy[0]) : 'bg-sage-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-lg font-semibold text-sage-700">
                  {energy[0]}/5
                </div>
              </div>
              <Slider
                value={energy}
                onValueChange={setEnergy}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-sage-500">
                <span>Exhausted</span>
                <span>Energetic</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sleep Tracking */}
        <Card className="organic-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-indigo-600" />
              Sleep
            </CardTitle>
            <CardDescription>Hours of sleep last night</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-sage-700 mb-2">
                  {sleep[0]}h
                </div>
              </div>
              <Slider
                value={sleep}
                onValueChange={setSleep}
                max={12}
                min={3}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-sage-500">
                <span>3h</span>
                <span>12h</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activities */}
        <Card className="organic-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sage-600" />
              Activities
            </CardTitle>
            <CardDescription>What did you do today?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Dumbbell className="w-5 h-5 text-blue-600" />
                  <div>
                    <Label htmlFor="exercise" className="text-sage-700 font-medium">
                      Exercise
                    </Label>
                    <p className="text-sm text-sage-600">Any physical activity</p>
                  </div>
                </div>
                <Switch
                  id="exercise"
                  checked={exercise}
                  onCheckedChange={setExercise}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <div>
                    <Label htmlFor="meditation" className="text-sage-700 font-medium">
                      Meditation
                    </Label>
                    <p className="text-sm text-sage-600">Mindfulness or meditation</p>
                  </div>
                </div>
                <Switch
                  id="meditation"
                  checked={meditation}
                  onCheckedChange={setMeditation}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes Section */}
      <Card className="organic-border">
        <CardHeader>
          <CardTitle>Daily Notes</CardTitle>
          <CardDescription>
            Any thoughts, reflections, or observations about your wellness today?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How was your day? Any insights about your wellness journey?"
            rows={4}
            className="border-sage-200 focus:border-sage-500 focus:ring-sage-500"
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleSave}
          disabled={saveDailyLogMutation.isPending}
          className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3"
        >
          {saveDailyLogMutation.isPending ? (
            "Saving..."
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save Daily Log
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
