// Task Submission Form - Agent task creation interface
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Upload, X, Plus, Zap, Calendar, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const taskSubmissionSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  agentType: z.enum(['content-creator', 'affiliate-scraper', 'social-poster', 'wellness-coach', 'automation-controller']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  parameters: z.record(z.string()).optional(),
  triggers: z.object({
    immediate: z.boolean().default(false),
    scheduled: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
  files: z.array(z.string()).optional(),
});

type TaskSubmissionForm = z.infer<typeof taskSubmissionSchema>;

interface TaskSubmissionFormProps {
  onSubmit: (task: TaskSubmissionForm) => Promise<void>;
  className?: string;
}

const agentTypes = [
  { value: 'content-creator', label: 'Content Creator', icon: '✍️' },
  { value: 'affiliate-scraper', label: 'Affiliate Scraper', icon: '🕷️' },
  { value: 'social-poster', label: 'Social Media Poster', icon: '📱' },
  { value: 'wellness-coach', label: 'AI Wellness Coach', icon: '🧠' },
  { value: 'automation-controller', label: 'Automation Controller', icon: '⚡' },
];

const priorityConfig = {
  low: { color: 'bg-gray-100 text-gray-700', label: 'Low' },
  medium: { color: 'bg-blue-100 text-blue-700', label: 'Medium' },
  high: { color: 'bg-orange-100 text-orange-700', label: 'High' },
  urgent: { color: 'bg-red-100 text-red-700', label: 'Urgent' },
};

export const TaskSubmissionForm = ({ onSubmit, className }: TaskSubmissionFormProps) => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<TaskSubmissionForm>({
    resolver: zodResolver(taskSubmissionSchema),
    defaultValues: {
      title: '',
      description: '',
      agentType: 'content-creator',
      priority: 'medium',
      parameters: {},
      triggers: {
        immediate: true,
        keywords: [],
      },
    },
  });

  const handleSubmit = async (data: TaskSubmissionForm) => {
    setIsSubmitting(true);
    try {
      // Add keywords to the submission
      const submissionData = {
        ...data,
        triggers: {
          immediate: !!data.triggers?.immediate,
          scheduled: data.triggers?.scheduled,
          keywords,
        },
      };

      await onSubmit(submissionData);
      
      toast({
        title: 'Task Submitted Successfully',
        description: `${data.title} has been queued for execution.`,
      });
      
      // Reset form
      form.reset();
      setKeywords([]);
      setNewKeyword('');
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your task. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const selectedAgent = agentTypes.find(agent => agent.value === form.watch('agentType'));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-primary-500" />
          <span>Submit New Task</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Task Info */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Create wellness blog post about morning routines" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detailed description of what the agent should accomplish..."
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Agent Selection & Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="agentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an agent" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {agentTypes.map((agent) => (
                          <SelectItem key={agent.value} value={agent.value}>
                            <div className="flex items-center space-x-2">
                              <span>{agent.icon}</span>
                              <span>{agent.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(priorityConfig).map(([value, config]) => (
                          <SelectItem key={value} value={value}>
                            <Badge className={config.color}>{config.label}</Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Triggers & Keywords */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span className="font-medium">Execution Triggers</span>
                </div>
              </div>

              <FormField
                control={form.control}
                name="triggers.immediate"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Execute Immediately</FormLabel>
                  </FormItem>
                )}
              />

              {/* Keywords */}
              <div className="space-y-2">
                <FormLabel>Keywords (Optional)</FormLabel>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add keyword trigger"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  />
                  <Button type="button" variant="outline" onClick={addKeyword}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{keyword}</span>
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeKeyword(keyword)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Reset
              </Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>{selectedAgent?.icon}</span>
                    <span>Submit Task</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TaskSubmissionForm;
