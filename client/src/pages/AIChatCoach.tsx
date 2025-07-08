import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Send, 
  Bot, 
  User, 
  Heart, 
  Activity, 
  Brain, 
  Sparkles,
  MessageCircle,
  Clock,
  Star,
  Target,
  TrendingUp,
  Zap
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  suggestions?: string[];
  insights?: {
    type: "progress" | "recommendation" | "motivation";
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

interface CoachingSession {
  id: string;
  title: string;
  date: string;
  messageCount: number;
  lastMessage: string;
  mood: "positive" | "neutral" | "concerned";
}

const quickSuggestions = [
  "How can I improve my sleep quality?",
  "What's a healthy breakfast for energy?",
  "I'm feeling stressed, can you help?",
  "How do I stay motivated to exercise?",
  "What are some mindfulness techniques?",
  "How can I build better habits?"
];

const coachingInsights = [
  {
    type: "progress" as const,
    title: "Great Progress This Week",
    description: "You've completed 5 out of 6 planned workouts. Keep it up!",
    icon: TrendingUp
  },
  {
    type: "recommendation" as const,
    title: "Hydration Reminder",
    description: "Based on your activity, aim for 8-10 glasses of water today.",
    icon: Target
  },
  {
    type: "motivation" as const,
    title: "Mindful Moment",
    description: "Remember: Small consistent actions lead to big transformations.",
    icon: Sparkles
  }
];

export default function AIChatCoach() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chat history
  const { data: chatHistory, isLoading } = useQuery({
    queryKey: ["/api/ai-coach/history"],
    enabled: !!user,
  });

  // Fetch recent coaching sessions
  const { data: sessions } = useQuery({
    queryKey: ["/api/ai-coach/sessions"],
    enabled: !!user,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageContent: string) => {
      return await apiRequest("POST", "/api/ai-coach/chat", { 
        message: messageContent,
        context: {
          userGoals: user?.wellnessGoals || [],
          currentMood: "neutral",
          recentActivity: "general_wellness"
        }
      });
    },
    onSuccess: (response) => {
      const aiMessage: Message = {
        id: Date.now().toString() + "_ai",
        type: "ai",
        content: response.message,
        timestamp: new Date(),
        suggestions: response.suggestions || [],
        insights: response.insights || []
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      
      // Update chat history
      queryClient.invalidateQueries({ queryKey: ["/api/ai-coach/history"] });
    },
    onError: (error) => {
      setIsTyping(false);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    sendMessageMutation.mutate(message);
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setMessage(suggestion);
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        type: "ai",
        content: `Hello ${user?.firstName || "there"}! I'm your AI wellness coach. I'm here to help you on your wellness journey with personalized guidance, motivation, and support. What would you like to work on today?`,
        timestamp: new Date(),
        suggestions: quickSuggestions.slice(0, 3),
        insights: coachingInsights
      };
      setMessages([welcomeMessage]);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-sage-600 rounded-xl">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-sage-800">AI Wellness Coach</h1>
          </div>
          <p className="text-sage-600">
            Your personal wellness companion, available 24/7 for guidance and support
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-4 border-b border-sage-200">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-sage-600" />
                  Wellness Chat
                  <Badge variant="outline" className="ml-auto">
                    Online
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.type === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={msg.type === "user" ? "bg-sage-600 text-white" : "bg-purple-100 text-purple-600"}>
                          {msg.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`max-w-[70%] ${msg.type === "user" ? "text-right" : ""}`}>
                        <div
                          className={`inline-block p-3 rounded-lg ${
                            msg.type === "user"
                              ? "bg-sage-600 text-white"
                              : "bg-white border border-sage-200"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1 text-xs text-sage-500">
                          <Clock className="w-3 h-3" />
                          {msg.timestamp.toLocaleTimeString()}
                        </div>

                        {/* AI Suggestions */}
                        {msg.type === "ai" && msg.suggestions && msg.suggestions.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs text-sage-600 font-medium">Quick suggestions:</p>
                            {msg.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="text-xs h-8 border-sage-300 hover:bg-sage-50"
                                onClick={() => handleQuickSuggestion(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}

                        {/* Insights */}
                        {msg.type === "ai" && msg.insights && msg.insights.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {msg.insights.map((insight, index) => {
                              const Icon = insight.icon;
                              return (
                                <div key={index} className="p-2 bg-sage-50 rounded-lg border border-sage-200">
                                  <div className="flex items-start gap-2">
                                    <Icon className="w-4 h-4 text-sage-600 mt-0.5" />
                                    <div>
                                      <p className="text-xs font-medium text-sage-800">{insight.title}</p>
                                      <p className="text-xs text-sage-600">{insight.description}</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-white border border-sage-200 rounded-lg p-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-sage-200">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask me about wellness, nutrition, fitness, or mental health..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isTyping}
                    className="bg-sage-600 hover:bg-sage-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-sage-600" />
                  Quick Start
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left h-auto p-3 border-sage-300 hover:bg-sage-50"
                    onClick={() => handleQuickSuggestion(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Today's Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-sage-600" />
                  Today's Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {coachingInsights.map((insight, index) => {
                  const Icon = insight.icon;
                  return (
                    <div key={index} className="p-3 bg-sage-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Icon className="w-4 h-4 text-sage-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-sage-800">{insight.title}</p>
                          <p className="text-xs text-sage-600 mt-1">{insight.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-sage-600" />
                  Recent Chats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { title: "Morning Motivation", time: "2 hours ago", preview: "Great tips for starting the day..." },
                    { title: "Workout Planning", time: "Yesterday", preview: "Discussed weekly fitness goals..." },
                    { title: "Stress Management", time: "2 days ago", preview: "Breathing exercises and mindfulness..." }
                  ].map((session, index) => (
                    <div key={index} className="p-3 border border-sage-200 rounded-lg hover:bg-sage-50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-sage-800">{session.title}</p>
                          <p className="text-xs text-sage-600 mt-1">{session.preview}</p>
                        </div>
                        <span className="text-xs text-sage-500">{session.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}