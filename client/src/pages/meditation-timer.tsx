import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Wind, 
  Brain, 
  Heart, 
  Sparkles,
  Timer as TimerIcon,
  Volume2,
  VolumeX
} from "lucide-react";
import { motion } from "framer-motion";

interface MeditationSession {
  id: string;
  name: string;
  description: string;
  icon: any;
  audioUrl?: string;
  color: string;
}

const meditationSessions: MeditationSession[] = [
  {
    id: "breathing",
    name: "Deep Breathing",
    description: "Simple breathwork to calm your mind",
    icon: Wind,
    color: "bg-blue-500",
  },
  {
    id: "mindfulness",
    name: "Mindfulness",
    description: "Present-moment awareness practice",
    icon: Brain,
    color: "bg-purple-500",
  },
  {
    id: "loving-kindness",
    name: "Loving Kindness",
    description: "Cultivate compassion and love",
    icon: Heart,
    color: "bg-pink-500",
  },
];

export default function MeditationTimer() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  
  const [selectedSession, setSelectedSession] = useState(meditationSessions[0]);
  const [duration, setDuration] = useState([10]); // in minutes
  const [timeLeft, setTimeLeft] = useState(duration[0] * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentPhase, setCurrentPhase] = useState("preparation");
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to access the meditation timer.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Update timer when duration changes
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(duration[0] * 60);
      setIsCompleted(false);
    }
  }, [duration, isRunning]);

  // Timer countdown logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            toast({
              title: "Session Complete!",
              description: "Congratulations on completing your meditation session.",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, toast]);

  // Update meditation phase based on progress
  useEffect(() => {
    const progress = 1 - timeLeft / (duration[0] * 60);
    if (progress < 0.1) {
      setCurrentPhase("preparation");
    } else if (progress < 0.9) {
      setCurrentPhase("meditation");
    } else {
      setCurrentPhase("completion");
    }
  }, [timeLeft, duration]);

  const handleStart = () => {
    setIsRunning(true);
    setIsCompleted(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration[0] * 60);
    setIsCompleted(false);
    setCurrentPhase("preparation");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - timeLeft / (duration[0] * 60);
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - progress * circumference;

  const getGuidanceText = () => {
    switch (currentPhase) {
      case "preparation":
        return "Find a comfortable seated position and close your eyes";
      case "meditation":
        return selectedSession.description;
      case "completion":
        return "Take a moment to notice how you feel";
      default:
        return "Ready to begin your meditation practice";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sage-25 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-sage-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-sage-25">
      <Navbar />
      
      {/* Header */}
      <section className="pt-24 pb-8 wellness-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center bg-sage-100 text-sage-700 px-4 py-2 rounded-full mb-6">
                <TimerIcon className="w-5 h-5 mr-2" />
                Meditation Timer
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-sage-800 mb-4">
                Guided Meditation Sessions
              </h1>
              <p className="text-xl text-sage-600 max-w-2xl mx-auto">
                Find peace and clarity with our guided meditation practices designed for every experience level.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Meditation Interface */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Session Selection */}
            <div className="space-y-4">
              <Card className="organic-border premium-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-sage-600" />
                    Choose Your Practice
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {meditationSessions.map((session) => (
                    <motion.div
                      key={session.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-300 ${
                          selectedSession.id === session.id
                            ? 'border-2 border-sage-500 bg-sage-50'
                            : 'border-2 border-sage-100 hover:border-sage-200 hover:bg-sage-25'
                        }`}
                        onClick={() => setSelectedSession(session)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 ${session.color} rounded-xl flex items-center justify-center`}>
                              <session.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-sage-700">{session.name}</h4>
                              <p className="text-sm text-sage-600">{session.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Duration Selector */}
              <Card className="organic-border premium-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Session Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <span className="text-3xl font-bold text-sage-700">{duration[0]}</span>
                      <span className="text-sage-600 ml-1">minutes</span>
                    </div>
                    <Slider
                      value={duration}
                      onValueChange={setDuration}
                      max={60}
                      min={1}
                      step={1}
                      className="w-full"
                      disabled={isRunning}
                    />
                    <div className="flex justify-between text-sm text-sage-500">
                      <span>1 min</span>
                      <span>60 min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Timer Display */}
            <div className="lg:col-span-2">
              <Card className="organic-border premium-shadow min-h-[500px] flex flex-col items-center justify-center p-8">
                {/* Timer Circle */}
                <div className="relative w-64 h-64 mb-8">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 256 256">
                    {/* Background circle */}
                    <circle
                      cx="128"
                      cy="128"
                      r="120"
                      stroke="hsl(var(--sage-200))"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="128"
                      cy="128"
                      r="120"
                      stroke="hsl(var(--sage-600))"
                      strokeWidth="8"
                      fill="transparent"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-300 ease-out"
                    />
                  </svg>
                  
                  {/* Timer Content */}
                  <div className="absolute inset-8 bg-white rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-sage-700 mb-2">
                        {formatTime(timeLeft)}
                      </div>
                      <div className={`w-12 h-12 ${selectedSession.color} rounded-full flex items-center justify-center mx-auto`}>
                        <selectedSession.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Session Info */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-sage-700 mb-2">
                    {selectedSession.name}
                  </h3>
                  <Badge className="bg-sage-100 text-sage-700 mb-4">
                    {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}
                  </Badge>
                  <Card className="bg-sage-50 border-sage-200 max-w-md mx-auto">
                    <CardContent className="p-4">
                      <p className="text-sage-700 italic">{getGuidanceText()}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-4">
                  {!isRunning ? (
                    <Button
                      onClick={handleStart}
                      className="bg-sage-600 hover:bg-sage-700 text-white p-4 rounded-full"
                      disabled={isCompleted && timeLeft === 0}
                    >
                      <Play className="w-6 h-6" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePause}
                      className="bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-full"
                    >
                      <Pause className="w-6 h-6" />
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="border-sage-300 text-sage-700 hover:bg-sage-50 p-4 rounded-full"
                  >
                    <RotateCcw className="w-6 h-6" />
                  </Button>
                  
                  <Button
                    onClick={() => setIsMuted(!isMuted)}
                    variant="outline"
                    className="border-sage-300 text-sage-700 hover:bg-sage-50 p-4 rounded-full"
                  >
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </Button>
                </div>

                {/* Completion Message */}
                {isCompleted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 text-center"
                  >
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-green-800 mb-2">
                        🎉 Session Complete!
                      </h4>
                      <p className="text-green-700">
                        Well done! Take a moment to notice how you feel.
                      </p>
                    </div>
                  </motion.div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
