// Agent Health Bar - System status and API health monitoring
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Activity, 
  Wifi, 
  Database, 
  Brain, 
  Zap, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

export interface ServiceStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'down' | 'maintenance';
  uptime: number; // percentage
  responseTime: number; // in ms
  lastChecked: Date;
  errorCount: number;
}

export interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'critical';
  uptime: number;
  totalRequests: number;
  successRate: number;
  services: ServiceStatus[];
  performance: {
    avgResponseTime: number;
    peakResponseTime: number;
    throughput: number; // requests per minute
  };
}

interface AgentHealthBarProps {
  systemHealth: SystemHealth;
  className?: string;
}

const statusConfig = {
  healthy: {
    color: 'bg-green-100 text-green-700 border-green-200',
    badgeVariant: 'default' as const,
    icon: CheckCircle,
  },
  degraded: {
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    badgeVariant: 'secondary' as const,
    icon: AlertTriangle,
  },
  down: {
    color: 'bg-red-100 text-red-700 border-red-200',
    badgeVariant: 'destructive' as const,
    icon: AlertTriangle,
  },
  critical: {
    color: 'bg-red-100 text-red-700 border-red-200',
    badgeVariant: 'destructive' as const,
    icon: AlertTriangle,
  },
  maintenance: {
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    badgeVariant: 'secondary' as const,
    icon: Clock,
  },
};

const serviceIcons = {
  'Database': Database,
  'OpenAI API': Brain,
  'DeepSeek API': Brain,
  'Authentication': Wifi,
  'Automation Controller': Zap,
  'Content Pipeline': Activity,
};

export const AgentHealthBar = ({ systemHealth, className }: AgentHealthBarProps) => {
  const overallConfig = statusConfig[systemHealth.overall];
  const OverallIcon = overallConfig.icon;

  const formatUptime = (uptime: number) => {
    return `${uptime.toFixed(2)}%`;
  };

  const formatResponseTime = (time: number) => {
    if (time < 1000) return `${time}ms`;
    return `${(time / 1000).toFixed(1)}s`;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99.5) return 'text-green-600';
    if (uptime >= 95) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getResponseTimeColor = (time: number) => {
    if (time < 200) return 'text-green-600';
    if (time < 500) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <TooltipProvider>
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary-500" />
              <span>System Health</span>
            </div>
            <Badge variant={overallConfig.badgeVariant} className="flex items-center space-x-1">
              <OverallIcon className="h-3 w-3" />
              <span className="capitalize">{systemHealth.overall}</span>
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Overall System Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {formatUptime(systemHealth.uptime)}
              </p>
              <p className="text-sm text-gray-600">Uptime</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {systemHealth.totalRequests.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Requests</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {systemHealth.successRate.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">Success Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {systemHealth.performance.throughput}
              </p>
              <p className="text-sm text-gray-600">Req/min</p>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Performance</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Avg Response Time</p>
                <p className={`font-semibold ${getResponseTimeColor(systemHealth.performance.avgResponseTime)}`}>
                  {formatResponseTime(systemHealth.performance.avgResponseTime)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Peak Response Time</p>
                <p className={`font-semibold ${getResponseTimeColor(systemHealth.performance.peakResponseTime)}`}>
                  {formatResponseTime(systemHealth.performance.peakResponseTime)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Throughput</p>
                <p className="font-semibold text-blue-600">
                  {systemHealth.performance.throughput} req/min
                </p>
              </div>
            </div>
          </div>

          {/* Individual Service Status */}
          <div className="space-y-3">
            <h4 className="font-medium">Service Status</h4>
            <div className="space-y-2">
              {systemHealth.services.map((service, index) => {
                const config = statusConfig[service.status];
                const ServiceIcon = serviceIcons[service.name as keyof typeof serviceIcons] || Activity;
                
                return (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div className={`p-3 border rounded-lg ${config.color} hover:opacity-80 cursor-pointer`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <ServiceIcon className="h-4 w-4" />
                            <div>
                              <p className="font-medium">{service.name}</p>
                              <p className="text-xs opacity-75">
                                {formatResponseTime(service.responseTime)} • {formatUptime(service.uptime)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={config.badgeVariant} className="text-xs mb-1">
                              {service.status}
                            </Badge>
                            <p className="text-xs opacity-75">
                              {formatTimeAgo(service.lastChecked)}
                            </p>
                          </div>
                        </div>
                        
                        {/* Uptime Progress Bar */}
                        <div className="mt-2">
                          <Progress 
                            value={service.uptime} 
                            className="h-1 bg-white/30"
                          />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs">
                      <div className="space-y-2">
                        <p className="font-medium">{service.name} Details</p>
                        <div className="text-sm space-y-1">
                          <p>Status: <span className="capitalize">{service.status}</span></p>
                          <p>Uptime: {formatUptime(service.uptime)}</p>
                          <p>Response Time: {formatResponseTime(service.responseTime)}</p>
                          <p>Error Count: {service.errorCount}</p>
                          <p>Last Checked: {formatTimeAgo(service.lastChecked)}</p>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          {/* System Alerts */}
          {systemHealth.overall !== 'healthy' && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">System Alert</p>
                  <p className="text-sm text-yellow-700">
                    {systemHealth.overall === 'degraded' 
                      ? 'Some services are experiencing performance issues.'
                      : 'Critical system issues detected. Please check service status.'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default AgentHealthBar;