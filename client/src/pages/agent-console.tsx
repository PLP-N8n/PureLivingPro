// Agent Console Dashboard - Main agent control interface
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Import agent components
import AgentCard, { AgentStatus } from '@/components/agent/AgentCard';
import TaskSubmissionForm from '@/components/agent/TaskSubmissionForm';
import AgentHistoryView, { TaskHistory, MemoryLog } from '@/components/agent/AgentHistoryView';
import AgentHealthBar, { SystemHealth } from '@/components/agent/AgentHealthBar';

import { 
  Bot, 
  Zap, 
  TrendingUp, 
  Settings, 
  RefreshCw, 
  PlayCircle, 
  PauseCircle 
} from 'lucide-react';

// Mock data - replace with real API calls
const mockAgents: AgentStatus[] = [
  {
    id: 'content-creator-1',
    name: 'Wellness Content Creator',
    role: 'content-creator',
    status: 'active',
    progress: 75,
    lastExecuted: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    tasksCompleted: 247,
    nextExecution: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    uptime: 99.2,
  },
  {
    id: 'affiliate-scraper-1',
    name: 'Product Scraper',
    role: 'affiliate-scraper',
    status: 'idle',
    lastExecuted: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    tasksCompleted: 1834,
    nextExecution: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    uptime: 97.8,
  },
  {
    id: 'social-poster-1',
    name: 'Social Media Manager',
    role: 'social-poster',
    status: 'completed',
    lastExecuted: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    tasksCompleted: 156,
    nextExecution: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
    uptime: 98.5,
  },
  {
    id: 'wellness-coach-1',
    name: 'AI Wellness Coach',
    role: 'wellness-coach',
    status: 'failed',
    lastExecuted: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    tasksCompleted: 89,
    errorMessage: 'OpenAI API rate limit exceeded',
    uptime: 94.2,
  },
  {
    id: 'automation-controller-1',
    name: 'Master Controller',
    role: 'automation-controller',
    status: 'active',
    progress: 32,
    lastExecuted: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    tasksCompleted: 2103,
    nextExecution: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    uptime: 99.7,
  },
];

const mockSystemHealth: SystemHealth = {
  overall: 'healthy',
  uptime: 99.2,
  totalRequests: 45623,
  successRate: 97.8,
  performance: {
    avgResponseTime: 285,
    peakResponseTime: 1240,
    throughput: 125,
  },
  services: [
    {
      name: 'Database',
      status: 'healthy',
      uptime: 99.8,
      responseTime: 45,
      lastChecked: new Date(Date.now() - 30 * 1000),
      errorCount: 0,
    },
    {
      name: 'OpenAI API',
      status: 'degraded',
      uptime: 96.2,
      responseTime: 1200,
      lastChecked: new Date(Date.now() - 45 * 1000),
      errorCount: 3,
    },
    {
      name: 'DeepSeek API',
      status: 'healthy',
      uptime: 98.9,
      responseTime: 680,
      lastChecked: new Date(Date.now() - 20 * 1000),
      errorCount: 0,
    },
    {
      name: 'Authentication',
      status: 'healthy',
      uptime: 99.5,
      responseTime: 125,
      lastChecked: new Date(Date.now() - 15 * 1000),
      errorCount: 0,
    },
    {
      name: 'Automation Controller',
      status: 'healthy',
      uptime: 99.1,
      responseTime: 89,
      lastChecked: new Date(Date.now() - 10 * 1000),
      errorCount: 1,
    },
  ],
};

const mockTaskHistory: TaskHistory[] = [
  {
    id: 'task-1',
    title: 'Create wellness blog post about morning routines',
    agentType: 'Content Creator',
    status: 'completed',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 90 * 60 * 1000),
    duration: 30 * 60, // 30 minutes
    output: 'Successfully created and published blog post with 1,250 words, 3 images, and SEO optimization.',
    memoryContext: ['morning-routines', 'wellness-tips', 'productivity'],
  },
  {
    id: 'task-2',
    title: 'Scrape wellness products from Amazon',
    agentType: 'Affiliate Scraper',
    status: 'failed',
    startTime: new Date(Date.now() - 60 * 60 * 1000),
    duration: 15 * 60, // 15 minutes
    errorMessage: 'Access denied: IP rate limited by Amazon',
    memoryContext: ['amazon-scraping', 'wellness-products'],
  },
];

const mockMemoryLogs: MemoryLog[] = [
  {
    id: 'mem-1',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    type: 'learning',
    content: 'Identified trending wellness keywords: "adaptogenic herbs", "biohacking", "circadian rhythm"',
    agentId: 'content-creator-1',
    importance: 'high',
    context: { keywords: ['adaptogenic herbs', 'biohacking', 'circadian rhythm'], source: 'google-trends' },
  },
  {
    id: 'mem-2',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    type: 'optimization',
    content: 'Adjusted content generation prompt to increase engagement by 23%',
    agentId: 'content-creator-1',
    importance: 'medium',
    context: { engagement_increase: 23, optimization_type: 'prompt-tuning' },
  },
];

export default function AgentConsole() {
  const [agents, setAgents] = useState<AgentStatus[]>(mockAgents);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Simulated real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        if (agent.status === 'active' && agent.progress !== undefined) {
          return {
            ...agent,
            progress: Math.min(100, agent.progress + Math.random() * 5),
          };
        }
        return agent;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleStartAgent = async (agentId: string) => {
    try {
      setAgents(prev => prev.map(agent => 
        agent.id === agentId ? { ...agent, status: 'active', progress: 0 } : agent
      ));
      
      toast({
        title: 'Agent Started',
        description: 'Agent execution has been initiated.',
      });
    } catch (error) {
      toast({
        title: 'Start Failed',
        description: 'Failed to start agent. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handlePauseAgent = async (agentId: string) => {
    try {
      setAgents(prev => prev.map(agent => 
        agent.id === agentId ? { ...agent, status: 'paused' } : agent
      ));
      
      toast({
        title: 'Agent Paused',
        description: 'Agent execution has been paused.',
      });
    } catch (error) {
      toast({
        title: 'Pause Failed',
        description: 'Failed to pause agent. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleRestartAgent = async (agentId: string) => {
    try {
      setAgents(prev => prev.map(agent => 
        agent.id === agentId ? { 
          ...agent, 
          status: 'active', 
          progress: 0, 
          errorMessage: undefined 
        } : agent
      ));
      
      toast({
        title: 'Agent Restarted',
        description: 'Agent has been restarted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Restart Failed',
        description: 'Failed to restart agent. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleTaskSubmission = async (taskData: any) => {
    console.log('Submitting task:', taskData);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleGlobalControl = (action: 'start-all' | 'pause-all') => {
    const newStatus = action === 'start-all' ? 'active' : 'paused';
    setAgents(prev => prev.map(agent => ({ ...agent, status: newStatus })));
    
    toast({
      title: `All Agents ${action === 'start-all' ? 'Started' : 'Paused'}`,
      description: `${action === 'start-all' ? 'Started' : 'Paused'} all agent operations.`,
    });
  };

  const activeAgents = agents.filter(agent => agent.status === 'active').length;
  const totalTasks = agents.reduce((sum, agent) => sum + agent.tasksCompleted, 0);
  const avgUptime = agents.reduce((sum, agent) => sum + agent.uptime, 0) / agents.length;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agent Console</h1>
          <p className="text-gray-600 mt-1">Autonomous wellness platform control center</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => handleGlobalControl('pause-all')}
            className="flex items-center space-x-2"
          >
            <PauseCircle className="h-4 w-4" />
            <span>Pause All</span>
          </Button>
          <Button 
            onClick={() => handleGlobalControl('start-all')}
            className="flex items-center space-x-2"
          >
            <PlayCircle className="h-4 w-4" />
            <span>Start All</span>
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{activeAgents}</p>
                <p className="text-sm text-gray-600">Active Agents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{totalTasks.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-600">{avgUptime.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Avg Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Settings className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-600">99%</p>
                <p className="text-sm text-gray-600">Autonomy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="agents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="agents">Agents ({agents.length})</TabsTrigger>
          <TabsTrigger value="submit">Submit Task</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onStart={handleStartAgent}
                onPause={handlePauseAgent}
                onRestart={handleRestartAgent}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="submit">
          <TaskSubmissionForm onSubmit={handleTaskSubmission} />
        </TabsContent>

        <TabsContent value="history">
          <AgentHistoryView
            taskHistory={mockTaskHistory}
            memoryLogs={mockMemoryLogs}
            onClearHistory={() => console.log('Clear history')}
            onExportLogs={() => console.log('Export logs')}
            onRefresh={() => console.log('Refresh')}
          />
        </TabsContent>

        <TabsContent value="health">
          <AgentHealthBar systemHealth={mockSystemHealth} />
        </TabsContent>
      </Tabs>
    </div>
  );
}