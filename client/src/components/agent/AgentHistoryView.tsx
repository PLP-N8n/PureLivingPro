// Agent History View - Task execution history and memory logs
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Brain, 
  Search, 
  Filter,
  Download,
  RefreshCw,
  Trash2
} from 'lucide-react';

export interface TaskHistory {
  id: string;
  title: string;
  agentType: string;
  status: 'completed' | 'failed' | 'running' | 'queued';
  startTime: Date;
  endTime?: Date;
  duration?: number; // in seconds
  output?: string;
  errorMessage?: string;
  memoryContext?: string[];
  parameters?: Record<string, any>;
}

export interface MemoryLog {
  id: string;
  timestamp: Date;
  type: 'task' | 'learning' | 'error' | 'optimization';
  content: string;
  agentId: string;
  context?: Record<string, any>;
  importance: 'low' | 'medium' | 'high';
}

interface AgentHistoryViewProps {
  taskHistory: TaskHistory[];
  memoryLogs: MemoryLog[];
  onClearHistory: () => void;
  onExportLogs: () => void;
  onRefresh: () => void;
  className?: string;
}

const statusConfig = {
  completed: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
  failed: { color: 'bg-red-100 text-red-700', icon: AlertTriangle },
  running: { color: 'bg-blue-100 text-blue-700', icon: RefreshCw },
  queued: { color: 'bg-gray-100 text-gray-700', icon: Clock },
};

const memoryTypeConfig = {
  task: { color: 'bg-blue-100 text-blue-700', label: 'Task' },
  learning: { color: 'bg-green-100 text-green-700', label: 'Learning' },
  error: { color: 'bg-red-100 text-red-700', label: 'Error' },
  optimization: { color: 'bg-purple-100 text-purple-700', label: 'Optimization' },
};

export const AgentHistoryView = ({ 
  taskHistory, 
  memoryLogs, 
  onClearHistory, 
  onExportLogs, 
  onRefresh,
  className 
}: AgentHistoryViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [memoryTypeFilter, setMemoryTypeFilter] = useState<string>('all');

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const formatTimeAgo = (date: Date) => {
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

  const filteredTaskHistory = taskHistory.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.agentType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredMemoryLogs = memoryLogs.filter(log => {
    const matchesSearch = log.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = memoryTypeFilter === 'all' || log.type === memoryTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary-500" />
            <span>Agent History & Memory</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={onExportLogs}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={onClearHistory}>
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Search and Filters */}
        <div className="flex space-x-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tasks and logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tasks">Task History ({taskHistory.length})</TabsTrigger>
            <TabsTrigger value="memory">Memory Logs ({memoryLogs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            {/* Task Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="queued">Queued</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ScrollArea className="h-[400px] w-full">
              <div className="space-y-3">
                {filteredTaskHistory.map((task) => {
                  const config = statusConfig[task.status];
                  const StatusIcon = config.icon;
                  
                  return (
                    <div key={task.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${config.color}`}>
                            <StatusIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-gray-600">{task.agentType}</p>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <p>{formatTimeAgo(task.startTime)}</p>
                          {task.duration && (
                            <p>{formatDuration(task.duration)}</p>
                          )}
                        </div>
                      </div>

                      {task.output && (
                        <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                          <p className="font-medium mb-1">Output:</p>
                          <p className="text-gray-700">{task.output}</p>
                        </div>
                      )}

                      {task.errorMessage && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm">
                          <p className="font-medium mb-1 text-red-700">Error:</p>
                          <p className="text-red-600">{task.errorMessage}</p>
                        </div>
                      )}

                      {task.memoryContext && task.memoryContext.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-2">Memory Context:</p>
                          <div className="flex flex-wrap gap-1">
                            {task.memoryContext.map((context, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {context}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredTaskHistory.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No task history found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="memory" className="space-y-4">
            {/* Memory Type Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={memoryTypeFilter} onValueChange={setMemoryTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="optimization">Optimization</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ScrollArea className="h-[400px] w-full">
              <div className="space-y-3">
                {filteredMemoryLogs.map((log) => {
                  const typeConfig = memoryTypeConfig[log.type];
                  
                  return (
                    <div key={log.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge className={typeConfig.color}>{typeConfig.label}</Badge>
                          {log.importance === 'high' && (
                            <Badge variant="destructive" className="text-xs">High Priority</Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(log.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2">{log.content}</p>
                      
                      {log.context && Object.keys(log.context).length > 0 && (
                        <div className="text-xs text-gray-500">
                          <p className="font-medium mb-1">Context:</p>
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                            {JSON.stringify(log.context, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredMemoryLogs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No memory logs found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AgentHistoryView;