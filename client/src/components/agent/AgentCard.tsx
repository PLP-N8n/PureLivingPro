// Agent Card Component - Real-time agent status display
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Play, Pause, RotateCcw, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { cardClasses } from '@/theme';

export interface AgentStatus {
  id: string;
  name: string;
  role: 'content-creator' | 'affiliate-scraper' | 'social-poster' | 'wellness-coach' | 'automation-controller';
  status: 'idle' | 'active' | 'failed' | 'completed' | 'paused';
  progress?: number;
  lastExecuted?: Date;
  tasksCompleted: number;
  nextExecution?: Date;
  errorMessage?: string;
  uptime: number; // percentage
}

interface AgentCardProps {
  agent: AgentStatus;
  onStart: (agentId: string) => void;
  onPause: (agentId: string) => void;
  onRestart: (agentId: string) => void;
  className?: string;
}

const statusConfig = {
  idle: {
    color: 'bg-gray-100 text-gray-700',
    icon: Clock,
    badgeVariant: 'secondary' as const,
  },
  active: {
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle,
    badgeVariant: 'default' as const,
  },
  failed: {
    color: 'bg-red-100 text-red-700',
    icon: AlertTriangle,
    badgeVariant: 'destructive' as const,
  },
  completed: {
    color: 'bg-blue-100 text-blue-700',
    icon: CheckCircle,
    badgeVariant: 'default' as const,
  },
  paused: {
    color: 'bg-yellow-100 text-yellow-700',
    icon: Pause,
    badgeVariant: 'secondary' as const,
  },
};

const roleDisplayNames = {
  'content-creator': 'Content Creator',
  'affiliate-scraper': 'Affiliate Scraper',
  'social-poster': 'Social Media Poster',
  'wellness-coach': 'AI Wellness Coach',
  'automation-controller': 'Automation Controller',
};

export const AgentCard = ({ agent, onStart, onPause, onRestart, className }: AgentCardProps) => {
  const config = statusConfig[agent.status];
  const StatusIcon = config.icon;

  const formatLastExecuted = (date?: Date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const formatNextExecution = (date?: Date) => {
    if (!date) return 'Not scheduled';
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
    }).format(date);
  };

  return (
    <TooltipProvider>
      <Card className={`${cardClasses} ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-lg ${config.color}`}>
                <StatusIcon className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">{agent.name}</CardTitle>
                <p className="text-sm text-gray-600">{roleDisplayNames[agent.role]}</p>
              </div>
            </div>
            <Badge variant={config.badgeVariant}>{agent.status}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress Bar for Active Agents */}
          {agent.status === 'active' && agent.progress !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{agent.progress}%</span>
              </div>
              <Progress value={agent.progress} className="h-2" />
            </div>
          )}

          {/* Uptime & Performance Metrics */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Uptime</p>
              <p className="font-semibold">{agent.uptime}%</p>
            </div>
            <div>
              <p className="text-gray-600">Tasks Completed</p>
              <p className="font-semibold">{agent.tasksCompleted.toLocaleString()}</p>
            </div>
          </div>

          {/* Execution Timing */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Last Run</p>
              <p className="font-medium">{formatLastExecuted(agent.lastExecuted)}</p>
            </div>
            <div>
              <p className="text-gray-600">Next Run</p>
              <p className="font-medium">{formatNextExecution(agent.nextExecution)}</p>
            </div>
          </div>

          {/* Error Message */}
          {agent.status === 'failed' && agent.errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium">Error:</p>
              <p className="text-sm text-red-600">{agent.errorMessage}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-3 border-t">
          <div className="flex space-x-2 w-full">
            {agent.status === 'idle' || agent.status === 'paused' ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={() => onStart(agent.id)}
                    className="flex-1"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Start
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Start agent execution</TooltipContent>
              </Tooltip>
            ) : agent.status === 'active' ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onPause(agent.id)}
                    className="flex-1"
                  >
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Pause agent execution</TooltipContent>
              </Tooltip>
            ) : null}

            {(agent.status === 'failed' || agent.status === 'completed') && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onRestart(agent.id)}
                    className="flex-1"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Restart
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Restart agent</TooltipContent>
              </Tooltip>
            )}
          </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};

export default AgentCard;