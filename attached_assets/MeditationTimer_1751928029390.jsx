import React, { useState, useEffect } from "react";
import { User, DailyWellnessLog } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Brain, 
  Heart, 
  Leaf, 
  Moon,
  CheckCircle,
  Clock,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const guidedSessions = [
  {
    id: "breathing",
    name: "Deep Breathing",
    icon: Leaf,
    description: "Simple breathwork to calm your mind",
    durations: [5, 10, 15],
    instructions: [
      "Find a comfortable seated position",
      "Close your eyes and breathe naturally",
      "Inhale slowly for 4 counts",
      "Hold for 4 counts",
      "Exhale slowly for 6 counts",
      "Repeat this cycle"
    ]
  },
  {
    id: "mindfulness",
    name: "Mindfulness Meditation",
    icon: Brain,
    description: "Present-moment awareness practice",
    durations: [10, 15, 20, 30],
    instructions: [
      "Sit comfortably with your back straight",
      "Close your eyes and focus on your breath",
      "Notice thoughts without judgment",
      "Gently return attention to your breath",
      "Stay present in this moment"
    ]
  },
  {
    id: "loving-kindness",
    name: "Loving Kindness",
    icon: Heart,
    description: "Cultivate compassion and love",
    durations: [10, 15, 20],
    instructions: [
      "Begin by sending love to yourself",
      "Repeat: 'May I be happy and healthy'",
      "Extend this love to loved ones",
      "Include neutral people in your life",
      "Finally, send love to all beings"
    ]
  },
  {
    id: "sleep",
    name: "Sleep Meditation",
    icon: Moon,
    description: "Relaxation for better sleep",
    durations: [15, 20, 30],
    instructions: [
      "Lie down comfortably in bed",
      "Take three deep, slow breaths",
      "Starting from your toes, relax each muscle",
      "Let go of the day's thoughts",
      "Allow yourself to drift peacefully"
    ]
  }
];

export default function MeditationTimer() {
  const [user, setUser] = useState(null);
  const [selectedSession, setSelectedSession] = useState(guidedSessions[0]);
  const [duration, setDuration] = useState(10);
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    setTimeLeft(duration * 60);
    setIsCompleted(false);
    setCurrentInstructionIndex(0);
  }, [duration]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => {
          if (timeLeft <= 1) {
            setIsActive(false);
            setIsCompleted(true);
            handleSessionComplete();
            return 0;
          }
          return timeLeft - 1;
        });
      }, 1000);
    } else if (!isActive) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Cycle through instructions during active session
  useEffect(() => {
    if (isActive && selectedSession.instructions.length > 1) {
      const instructionInterval = setInterval(() => {
        setCurrentInstructionIndex(prev => 
          (prev + 1) % selectedSession.instructions.length
        );
      }, 30000); // Change instruction every 30 seconds
      
      return () => clearInterval(instructionInterval);
    }
  }, [isActive, selectedSession.instructions.length]);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error("User not logged in:", error);
    }
  };

  const handleSessionComplete = async () => {
    if (!user) return;
    
    try {
      // Log meditation as a completed habit
      const today = new Date().toISOString().split('T')[0];
      const logs = await DailyWellnessLog.filter({ log_date: today });
      
      if (logs.length > 0) {
        const todaysLog = logs[0];
        const updatedHabits = [...(todaysLog.habits_completed || [])];
        if (!updatedHabits.includes('meditation')) {
          updatedHabits.push('meditation');
          await DailyWellnessLog.update(todaysLog.id, {
            habits_completed: updatedHabits
          });
        }
      }
    } catch (error) {
      console.error("Error updating meditation log:", error);
    }
  };

  const startTimer = () => {
    setIsActive(true);
    setIsCompleted(false);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
    setIsCompleted(false);
    setCurrentInstructionIndex(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  return (
    <div className="wellness-gradient min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-sage-700 mb-4">
            Meditation Timer
          </h1>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto">
            Take a moment to center yourself with guided meditation sessions designed for every need.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Session Selection */}
          <div className="space-y-6">
            <Card className="organic-border premium-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-sage-700">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Choose Your Practice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {guidedSessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => {
                      setSelectedSession(session);
                      setDuration(session.durations[0]);
                      resetTimer();
                    }}
                    className={`w-full p-4 text-left rounded-xl transition-all ${
                      selectedSession.id === session.id
                        ? 'bg-sage-100 border-2 border-sage-300'
                        : 'bg-white border-2 border-sage-100 hover:border-sage-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <session.icon className={`w-6 h-6 mt-1 ${
                        selectedSession.id === session.id ? 'text-sage-600' : 'text-sage-400'
                      }`} />
                      <div>
                        <h3 className={`font-semibold ${
                          selectedSession.id === session.id ? 'text-sage-700' : 'text-sage-600'
                        }`}>
                          {session.name}
                        </h3>
                        <p className="text-sm text-sage-500">{session.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="organic-border">
              <CardHeader>
                <CardTitle className="text-sage-700">Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {selectedSession.durations.map((mins) => (
                    <Button
                      key={mins}
                      variant={duration === mins ? "default" : "outline"}
                      onClick={() => {
                        setDuration(mins);
                        resetTimer();
                      }}
                      className={duration === mins ? "bg-sage-600 hover:bg-sage-700" : ""}
                    >
                      {mins} min
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timer Display */}
          <div className="lg:col-span-2">
            <Card className="organic-border premium-shadow h-full">
              <CardContent className="p-8 flex flex-col items-center justify-center h-full min-h-[500px]">
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.div
                      key="completed"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-center space-y-6"
                    >
                      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-sage-700 mb-2">
                          Session Complete!
                        </h2>
                        <p className="text-sage-600">
                          Well done! You've completed a {duration}-minute {selectedSession.name.toLowerCase()} session.
                        </p>
                      </div>
                      <Button onClick={resetTimer} className="bg-sage-600 hover:bg-sage-700">
                        Start New Session
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="timer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center space-y-8 w-full"
                    >
                      {/* Timer Circle */}
                      <div className="relative w-64 h-64 mx-auto">
                        <motion.div
                          className="absolute inset-0 rounded-full border-8 border-sage-200"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5 }}
                        />
                        <motion.div
                          className="absolute inset-0 rounded-full border-8 border-sage-600"
                          style={{
                            background: `conic-gradient(#4a7c59 ${progressPercentage * 3.6}deg, transparent 0deg)`
                          }}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5 }}
                        />
                        <div className="absolute inset-8 bg-white rounded-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-sage-700 mb-2">
                              {formatTime(timeLeft)}
                            </div>
                            <selectedSession.icon className="w-8 h-8 text-sage-600 mx-auto" />
                          </div>
                        </div>
                      </div>

                      {/* Session Info */}
                      <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-sage-700">
                          {selectedSession.name}
                        </h2>
                        
                        {isActive && (
                          <motion.div
                            key={currentInstructionIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-sage-50 p-4 rounded-xl"
                          >
                            <p className="text-sage-700 italic">
                              {selectedSession.instructions[currentInstructionIndex]}
                            </p>
                          </motion.div>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex justify-center space-x-4">
                        {!isActive ? (
                          <Button
                            onClick={startTimer}
                            size="lg"
                            className="bg-sage-600 hover:bg-sage-700 px-8"
                          >
                            <Play className="w-5 h-5 mr-2" />
                            Start
                          </Button>
                        ) : (
                          <Button
                            onClick={pauseTimer}
                            size="lg"
                            variant="outline"
                            className="px-8"
                          >
                            <Pause className="w-5 h-5 mr-2" />
                            Pause
                          </Button>
                        )}
                        
                        <Button
                          onClick={resetTimer}
                          size="lg"
                          variant="outline"
                        >
                          <RotateCcw className="w-5 h-5 mr-2" />
                          Reset
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}