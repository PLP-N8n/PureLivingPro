import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Save, 
  X, 
  BookOpen, 
  ShoppingBag, 
  Users, 
  BarChart3,
  Settings,
  Crown,
  Target,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category: string | null;
  readTime: number | null;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  isPremium: boolean | null;
  tags?: string[] | null;
  authorId?: string | null;
}

interface Product {
  id: number;
  name: string;
  price: string;
  description: string | null;
  category: string | null;
  rating: string | null;
  imageUrl: string | null;
  affiliateLink: string | null;
  isRecommended: boolean | null;
  tags?: string[] | null;
  createdAt: string;
  updatedAt: string;
}

interface Challenge {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  duration: number | null;
  difficulty: string | null;
  goals: string[] | null;
  isActive: boolean | null;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  affiliateLink: string | null;
  isRecommended: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [user, authLoading, toast]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-sage-25 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-sage-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-sage-25 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="w-8 h-8 text-sage-600" />
            <h1 className="text-3xl font-bold text-sage-800">Admin Dashboard</h1>
          </div>
          <p className="text-sage-600">Manage your wellness platform content and settings</p>
        </div>

        {/* Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Blog Posts
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="blog">
            <BlogManagement />
          </TabsContent>

          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="challenges">
            <ChallengeManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function OverviewTab() {
  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
    retry: false,
  });

  const statsCards = [
    {
      title: "Total Blog Posts",
      value: stats?.totalPosts || 0,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: ShoppingBag,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Active Challenges",
      value: stats?.activeChallenges || 0,
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-sage-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-sage-800">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest content and user activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New blog post published</p>
                  <p className="text-xs text-sage-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New product added</p>
                  <p className="text-xs text-sage-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Challenge completed by user</p>
                  <p className="text-xs text-sage-500">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-sage-600 hover:bg-sage-700">
              <Plus className="w-4 h-4 mr-2" />
              Create New Blog Post
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              Add New Product
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              Create Challenge
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BlogManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blog-posts"],
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/admin/blog-posts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return await apiRequest("PUT", `/api/admin/blog-posts/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      setEditingPost(null);
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/admin/blog-posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    },
  });

  // Auto Blog Creation States
  const [autoTitle, setAutoTitle] = useState("");
  const [autoCategory, setAutoCategory] = useState("wellness");
  const [autoProvider, setAutoProvider] = useState("deepseek");
  const [autoPublish, setAutoPublish] = useState(false);
  const [bulkTitles, setBulkTitles] = useState("");

  const autoCreateMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/admin/auto-create-blog", data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      setAutoTitle("");
      toast({
        title: "Auto-Creation Complete!",
        description: response.message,
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Auto-Creation Failed",
        description: "Failed to automatically create blog post",
        variant: "destructive",
      });
    },
  });

  const bulkCreateMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/admin/bulk-create-blogs", data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      setBulkTitles("");
      toast({
        title: "Bulk Creation Complete!",
        description: response.message,
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Bulk Creation Failed",
        description: "Failed to create multiple blog posts",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin w-6 h-6 border-4 border-sage-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-sage-800">Blog Posts</h2>
        <div className="flex gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-sage-600 text-sage-600 hover:bg-sage-50">
                <Plus className="w-4 h-4 mr-2" />
                Manual Create
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Blog Post</DialogTitle>
                <DialogDescription>
                  Add a new blog post to your wellness platform
                </DialogDescription>
              </DialogHeader>
              <BlogPostForm 
                onSubmit={(data) => createMutation.mutate(data)}
                isLoading={createMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Automated Blog Creation Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Single Auto-Create */}
        <Card className="bg-gradient-to-br from-emerald-50 to-sage-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-800 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Auto-Create Blog Post
            </CardTitle>
            <CardDescription>
              Generate a complete blog post from just a title and category using AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="auto-title">Blog Post Title</Label>
              <Input
                id="auto-title"
                placeholder="e.g., Morning Meditation Benefits for Busy Professionals"
                value={autoTitle}
                onChange={(e) => setAutoTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="auto-category">Category</Label>
                <Select value={autoCategory} onValueChange={setAutoCategory}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wellness">Wellness</SelectItem>
                    <SelectItem value="mindfulness">Mindfulness</SelectItem>
                    <SelectItem value="nutrition">Nutrition</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="mental-health">Mental Health</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="auto-provider">AI Provider</Label>
                <Select value={autoProvider} onValueChange={setAutoProvider}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deepseek">DeepSeek (Cost-Effective)</SelectItem>
                    <SelectItem value="openai">OpenAI (Premium)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-publish"
                checked={autoPublish}
                onCheckedChange={setAutoPublish}
              />
              <Label htmlFor="auto-publish">Auto-publish immediately</Label>
            </div>
            <Button 
              onClick={() => autoCreateMutation.mutate({
                title: autoTitle,
                category: autoCategory,
                provider: autoProvider,
                autoPublish: autoPublish
              })}
              disabled={!autoTitle || autoCreateMutation.isPending}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {autoCreateMutation.isPending ? "Creating..." : "Auto-Create Blog Post"}
            </Button>
          </CardContent>
        </Card>

        {/* Bulk Auto-Create */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Bulk Auto-Create
            </CardTitle>
            <CardDescription>
              Create multiple blog posts at once (up to 5)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="bulk-titles">Blog Post Titles (one per line)</Label>
              <Textarea
                id="bulk-titles"
                placeholder={`Benefits of Morning Yoga
Healthy Meal Prep Tips
Stress Relief Techniques
Sleep Hygiene Guide
Mindful Walking Practice`}
                value={bulkTitles}
                onChange={(e) => setBulkTitles(e.target.value)}
                rows={5}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="bulk-category">Category</Label>
                <Select value={autoCategory} onValueChange={setAutoCategory}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wellness">Wellness</SelectItem>
                    <SelectItem value="mindfulness">Mindfulness</SelectItem>
                    <SelectItem value="nutrition">Nutrition</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="mental-health">Mental Health</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bulk-provider">AI Provider</Label>
                <Select value={autoProvider} onValueChange={setAutoProvider}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deepseek">DeepSeek (Cost-Effective)</SelectItem>
                    <SelectItem value="openai">OpenAI (Premium)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="bulk-auto-publish"
                checked={autoPublish}
                onCheckedChange={setAutoPublish}
              />
              <Label htmlFor="bulk-auto-publish">Auto-publish all posts</Label>
            </div>
            <Button 
              onClick={() => {
                const titles = bulkTitles.split('\n').filter(t => t.trim()).slice(0, 5);
                if (titles.length === 0) return;
                bulkCreateMutation.mutate({
                  titles: titles,
                  category: autoCategory,
                  provider: autoProvider,
                  autoPublish: autoPublish
                });
              }}
              disabled={!bulkTitles.trim() || bulkCreateMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {bulkCreateMutation.isPending ? "Creating Posts..." : `Create ${bulkTitles.split('\n').filter(t => t.trim()).slice(0, 5).length} Posts`}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-sage-800">{post.title}</h3>
                    {post.isPublished ? (
                      <Badge className="bg-green-100 text-green-700">
                        <Eye className="w-3 h-3 mr-1" />
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <EyeOff className="w-3 h-3 mr-1" />
                        Draft
                      </Badge>
                    )}
                    {post.isPremium && (
                      <Badge className="bg-amber-100 text-amber-700">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <p className="text-sage-600 mb-2">{post.excerpt || "No excerpt"}</p>
                  <div className="flex items-center gap-4 text-sm text-sage-500">
                    <span>Category: {post.category || "Uncategorized"}</span>
                    <span>Read time: {post.readTime || 5} min</span>
                    <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog open={editingPost?.id === post.id} onOpenChange={(open) => !open && setEditingPost(null)}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingPost(post)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Blog Post</DialogTitle>
                        <DialogDescription>
                          Update your blog post content and settings
                        </DialogDescription>
                      </DialogHeader>
                      {editingPost && (
                        <BlogPostForm 
                          initialData={editingPost}
                          onSubmit={(data) => updateMutation.mutate({ id: post.id, data })}
                          isLoading={updateMutation.isPending}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => deleteMutation.mutate(post.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function BlogPostForm({ 
  initialData, 
  onSubmit, 
  isLoading 
}: { 
  initialData?: BlogPost; 
  onSubmit: (data: any) => void; 
  isLoading: boolean; 
}) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    category: initialData?.category || "",
    readTime: initialData?.readTime || 5,
    isPublished: initialData?.isPublished || false,
    isPremium: initialData?.isPremium || false,
    tags: initialData?.tags?.join(", ") || "",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiProvider, setAiProvider] = useState("deepseek");
  const { toast } = useToast();

  const categories = [
    "nutrition", "mindfulness", "fitness", "natural-remedies", 
    "recipes", "skincare", "mental-health"
  ];

  const generateContent = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic or idea for content generation",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiRequest("POST", "/api/admin/generate-content", {
        prompt: aiPrompt,
        category: formData.category,
        type: "blog_post",
        provider: aiProvider
      });

      setFormData(prev => ({
        ...prev,
        title: response.title || prev.title,
        content: response.content || prev.content,
        excerpt: response.excerpt || prev.excerpt,
        tags: response.tags || prev.tags,
        readTime: response.readTime || prev.readTime,
      }));

      toast({
        title: "Success",
        description: "AI content generated successfully!",
      });
      setAiPrompt("");
    } catch (error: any) {
      const errorMessage = error.message?.includes('quota') 
        ? "OpenAI quota exceeded. Please check your billing and add credits to continue using AI features."
        : "Failed to generate content. Please try again.";
      
      toast({
        title: "AI Generation Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const optimizeForSEO = async () => {
    if (!formData.title || !formData.content) {
      toast({
        title: "Error", 
        description: "Please add title and content before SEO optimization",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiRequest("POST", "/api/admin/optimize-seo", {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        provider: aiProvider
      });

      setFormData(prev => ({
        ...prev,
        title: response.optimizedTitle || prev.title,
        excerpt: response.metaDescription || prev.excerpt,
        tags: response.keywords || prev.tags,
      }));

      toast({
        title: "Success",
        description: "Content optimized for SEO!",
      });
    } catch (error: any) {
      const errorMessage = error.message?.includes('quota') 
        ? "OpenAI quota exceeded. Please add credits to continue using SEO optimization."
        : "Failed to optimize content. Please try again.";
      
      toast({
        title: "SEO Optimization Error", 
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* AI Content Generation */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <Label className="text-lg font-semibold text-purple-800">AI Content Generator</Label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-purple-600">Provider:</span>
            <select 
              className="text-xs border rounded px-2 py-1"
              value={aiProvider}
              onChange={(e) => setAiProvider(e.target.value)}
            >
              <option value="deepseek">DeepSeek (Cost-Effective)</option>
              <option value="openai">OpenAI GPT-4o</option>
            </select>
          </div>
        </div>
        <p className="text-sm text-purple-600 mb-3">Generate high-quality wellness content automatically with {aiProvider === 'deepseek' ? 'cost-effective' : 'premium'} AI</p>
        <div className="flex gap-2">
          <Input
            placeholder="Enter topic: e.g., 'Benefits of meditation for stress relief'"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="flex-1"
          />
          <Button 
            type="button" 
            onClick={generateContent}
            disabled={isGenerating}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />}
            Generate
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              const samples = [
                {
                  title: "Ancient Wisdom Meets Modern Wellness: The Art of Mindful Living",
                  content: "# The Timeless Path to Inner Balance\n\nIn our fast-paced modern world, the ancient art of mindful living offers a sanctuary of peace and purpose. Drawing from millennia-old traditions of Ayurveda, Traditional Chinese Medicine, and Greek philosophy, we can discover profound wisdom that speaks directly to our contemporary challenges.\n\n## The Science Behind Ancient Practices\n\nModern neuroscience validates what ancient sages knew intuitively: mindfulness practices literally rewire our brains for greater resilience, emotional regulation, and overall well-being. Studies show that just 8 weeks of mindfulness meditation can increase gray matter density in areas associated with learning, memory, and emotional regulation.\n\n## Integrating Timeless Wisdom Into Daily Life\n\n### Morning Rituals\n- **Ayurvedic Awakening**: Begin with warm lemon water and gentle stretching\n- **Mindful Breathing**: Practice pranayama for 5-10 minutes\n- **Intention Setting**: Connect with your deeper purpose\n\n### Throughout the Day\n- **Mindful Transitions**: Use doorways as reminders to breathe consciously\n- **Nature Connection**: Spend time outdoors, even if briefly\n- **Gratitude Practice**: Notice three things you appreciate\n\n### Evening Reflection\n- **Digital Sunset**: Disconnect from screens 1 hour before bed\n- **Gentle Movement**: Light yoga or stretching\n- **Journaling**: Reflect on the day's lessons and growth\n\n## The Creation of Life Philosophy\n\nAt the heart of mindful living lies the understanding that we are active participants in creating our life experience. Every breath, every choice, every moment of awareness contributes to the masterpiece of our existence.\n\nThis integration of ancient wisdom with modern understanding creates a pathway to authentic wellness—not just the absence of illness, but the presence of vitality, purpose, and joy.",
                  excerpt: "Discover how ancient wisdom traditions offer powerful tools for modern wellness, combining time-tested practices with scientific validation.",
                  tags: "mindfulness, ancient wisdom, wellness, meditation, ayurveda",
                  readTime: 8
                },
                {
                  title: "The Healing Power of Plant-Based Nutrition: A Holistic Approach",
                  content: "# Nourishing the Body Temple\n\nFood is medicine—this principle, recognized by ancient healing traditions worldwide, is now supported by extensive scientific research. A thoughtfully planned plant-based diet provides not just nutrition, but a pathway to optimal health and vitality.\n\n## Ancient Nutritional Wisdom\n\n### Ayurvedic Principles\n- **Six Tastes**: Sweet, sour, salty, bitter, pungent, and astringent in every meal\n- **Seasonal Eating**: Aligning diet with natural cycles\n- **Mindful Consumption**: Eating with awareness and gratitude\n\n### Traditional Chinese Medicine\n- **Food as Medicine**: Using ingredients for their energetic properties\n- **Balance of Elements**: Incorporating warming and cooling foods\n- **Digestive Fire**: Supporting healthy metabolism\n\n## Modern Scientific Validation\n\nResearch consistently shows that plant-based diets can:\n- Reduce inflammation throughout the body\n- Lower risk of heart disease by up to 40%\n- Support healthy weight management\n- Enhance cognitive function and mood\n- Promote longevity and vitality\n\n## Practical Implementation\n\n### Weekly Meal Planning\n1. **Monday**: Mediterranean-inspired quinoa bowls\n2. **Tuesday**: Asian stir-fry with seasonal vegetables\n3. **Wednesday**: Indian dal with turmeric and healing spices\n4. **Thursday**: Mexican bean and vegetable fiesta\n5. **Friday**: Fresh Mediterranean salads\n6. **Weekend**: Creative cooking and meal prep\n\n### Essential Nutrients\n- **Protein**: Legumes, nuts, seeds, whole grains\n- **Omega-3s**: Flax, chia, hemp, walnuts\n- **B12**: Fortified foods or supplements\n- **Iron**: Dark leafy greens, legumes, pumpkin seeds\n- **Calcium**: Tahini, almonds, dark greens\n\n## The Conscious Kitchen\n\nTransform your kitchen into a sanctuary of health by:\n- Choosing organic, locally-sourced ingredients when possible\n- Cooking with intention and gratitude\n- Creating beautiful, nourishing meals that feed both body and soul\n- Sharing meals with loved ones to strengthen community bonds",
                  excerpt: "Explore how plant-based nutrition, rooted in ancient wisdom and validated by modern science, can transform your health and vitality.",
                  tags: "nutrition, plant-based, ayurveda, traditional chinese medicine, healthy eating",
                  readTime: 10
                }
              ];
              const sample = samples[Math.floor(Math.random() * samples.length)];
              setFormData(prev => ({...prev, ...sample}));
              toast({
                title: "Sample Content Loaded",
                description: "You can edit this content or use AI when credits are available",
              });
            }}
          >
            Load Sample
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="title">Title</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={optimizeForSEO}
              disabled={isGenerating}
            >
              {isGenerating && <div className="animate-spin w-3 h-3 border-2 border-current border-t-transparent rounded-full mr-1" />}
              SEO Optimize
            </Button>
          </div>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({...formData, slug: e.target.value})}
            placeholder="auto-generated if empty"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          rows={8}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="readTime">Read Time (minutes)</Label>
          <Input
            id="readTime"
            type="number"
            value={formData.readTime}
            onChange={(e) => setFormData({...formData, readTime: parseInt(e.target.value) || 5})}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({...formData, tags: e.target.value})}
          placeholder="wellness, health, nutrition"
        />
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.isPublished}
            onCheckedChange={(checked) => setFormData({...formData, isPublished: checked})}
          />
          <Label>Published</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.isPremium}
            onCheckedChange={(checked) => setFormData({...formData, isPremium: checked})}
          />
          <Label>Premium Content</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isLoading} className="bg-sage-600 hover:bg-sage-700">
          {isLoading && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />}
          <Save className="w-4 h-4 mr-2" />
          {initialData ? "Update" : "Create"} Post
        </Button>
      </div>
    </form>
  );
}

function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    affiliateLink: "",
    isRecommended: false
  });

  const { data: productsData = [], isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
    onSuccess: (data) => setProducts(data)
  });

  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const response = await apiRequest("POST", "/api/products", productData);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsProductDialogOpen(false);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        affiliateLink: "",
        isRecommended: false
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    },
  });

  const handleCreateProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createProductMutation.mutate({
      ...newProduct,
      price: parseFloat(newProduct.price)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-sage-800">Wellness Products</h2>
        <div className="flex gap-3">
          <Button
            onClick={() => setIsProductDialogOpen(true)}
            className="bg-sage-600 hover:bg-sage-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      {productsLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-sage-600 border-t-transparent rounded-full" />
        </div>
      ) : productsData.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingBag className="w-12 h-12 text-sage-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-sage-800 mb-2">No products yet</h3>
            <p className="text-sage-600 mb-4">Start curating wellness products for your audience.</p>
            <Button onClick={() => setIsProductDialogOpen(true)} className="bg-sage-600 hover:bg-sage-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsData.map((product: any) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-sage-800">{product.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={product.category ? "secondary" : "outline"}>
                          {product.category || "Uncategorized"}
                        </Badge>
                        {product.isRecommended && (
                          <Badge className="bg-amber-100 text-amber-800">Recommended</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingProduct(product);
                          setNewProduct({
                            name: product.name,
                            description: product.description || "",
                            price: product.price?.toString() || "",
                            category: product.category || "",
                            affiliateLink: product.affiliateLink || "",
                            isRecommended: product.isRecommended || false
                          });
                          setIsProductDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteProductMutation.mutate(product.id)}
                        disabled={deleteProductMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sage-600 text-sm mb-3 line-clamp-3">
                    {product.description || "No description available"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-sage-800">
                      ${product.price?.toFixed(2) || "0.00"}
                    </span>
                    {product.affiliateLink && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer">
                          View Product
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Product Creation/Edit Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={(open) => {
        setIsProductDialogOpen(open);
        if (!open) {
          setEditingProduct(null);
          setNewProduct({
            name: "",
            description: "",
            price: "",
            category: "",
            affiliateLink: "",
            isRecommended: false
          });
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct ? "Update product information" : "Add a new wellness product to your catalog"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g., Organic Protein Powder"
                />
              </div>
              
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="29.99"
                  step="0.01"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={newProduct.category} 
                  onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supplements">Supplements</SelectItem>
                    <SelectItem value="fitness">Fitness Equipment</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="wellness">Wellness Tools</SelectItem>
                    <SelectItem value="nutrition">Nutrition</SelectItem>
                    <SelectItem value="mindfulness">Mindfulness</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="affiliateLink">Affiliate Link</Label>
                <Input
                  id="affiliateLink"
                  value={newProduct.affiliateLink}
                  onChange={(e) => setNewProduct({ ...newProduct, affiliateLink: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Describe the product benefits..."
                  rows={6}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="recommended"
                  checked={newProduct.isRecommended}
                  onCheckedChange={(checked) => setNewProduct({ ...newProduct, isRecommended: checked })}
                />
                <Label htmlFor="recommended">Mark as Recommended</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsProductDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProduct}
              disabled={createProductMutation.isPending}
              className="bg-sage-600 hover:bg-sage-700"
            >
              {createProductMutation.isPending ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ChallengeManagement() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isChallengeDialogOpen, setIsChallengeDialogOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [newChallenge, setNewChallenge] = useState({
    title: "",
    description: "",
    category: "",
    duration: "",
    difficulty: "beginner",
    isActive: true
  });

  const { data: challengesData = [], isLoading: challengesLoading } = useQuery({
    queryKey: ["/api/challenges"],
    onSuccess: (data) => setChallenges(data)
  });

  const createChallengeMutation = useMutation({
    mutationFn: async (challengeData: any) => {
      const response = await apiRequest("POST", "/api/challenges", challengeData);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Challenge created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/challenges"] });
      setIsChallengeDialogOpen(false);
      setNewChallenge({
        title: "",
        description: "",
        category: "",
        duration: "",
        difficulty: "beginner",
        isActive: true
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create challenge. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deletChallengeMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/challenges/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Challenge deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/challenges"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete challenge.",
        variant: "destructive",
      });
    },
  });

  const handleCreateChallenge = () => {
    if (!newChallenge.title || !newChallenge.duration) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createChallengeMutation.mutate({
      ...newChallenge,
      duration: parseInt(newChallenge.duration)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-sage-800">Wellness Challenges</h2>
        <Button
          onClick={() => setIsChallengeDialogOpen(true)}
          className="bg-sage-600 hover:bg-sage-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Challenge
        </Button>
      </div>

      {/* Challenges Grid */}
      {challengesLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-sage-600 border-t-transparent rounded-full" />
        </div>
      ) : challengesData.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="w-12 h-12 text-sage-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-sage-800 mb-2">No challenges yet</h3>
            <p className="text-sage-600 mb-4">Create engaging wellness challenges for your community.</p>
            <Button onClick={() => setIsChallengeDialogOpen(true)} className="bg-sage-600 hover:bg-sage-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Challenge
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challengesData.map((challenge: any) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-sage-800">{challenge.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={challenge.category ? "secondary" : "outline"}>
                          {challenge.category || "General"}
                        </Badge>
                        <Badge variant={challenge.difficulty === "advanced" ? "destructive" : challenge.difficulty === "intermediate" ? "default" : "secondary"}>
                          {challenge.difficulty}
                        </Badge>
                        {challenge.isActive && (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingChallenge(challenge);
                          setNewChallenge({
                            title: challenge.title,
                            description: challenge.description || "",
                            category: challenge.category || "",
                            duration: challenge.duration?.toString() || "",
                            difficulty: challenge.difficulty || "beginner",
                            isActive: challenge.isActive || false
                          });
                          setIsChallengeDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletChallengeMutation.mutate(challenge.id)}
                        disabled={deletChallengeMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sage-600 text-sm mb-3 line-clamp-3">
                    {challenge.description || "No description available"}
                  </p>
                  <div className="flex items-center justify-between text-sm text-sage-500">
                    <span>{challenge.duration || 0} days</span>
                    <span>{new Date(challenge.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Challenge Creation/Edit Dialog */}
      <Dialog open={isChallengeDialogOpen} onOpenChange={(open) => {
        setIsChallengeDialogOpen(open);
        if (!open) {
          setEditingChallenge(null);
          setNewChallenge({
            title: "",
            description: "",
            category: "",
            duration: "",
            difficulty: "beginner",
            isActive: true
          });
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingChallenge ? "Edit Challenge" : "Create New Challenge"}
            </DialogTitle>
            <DialogDescription>
              {editingChallenge ? "Update challenge information" : "Create an engaging wellness challenge for your community"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="challengeTitle">Challenge Title *</Label>
                <Input
                  id="challengeTitle"
                  value={newChallenge.title}
                  onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                  placeholder="e.g., 30-Day Mindfulness Challenge"
                />
              </div>
              
              <div>
                <Label htmlFor="challengeDuration">Duration (days) *</Label>
                <Input
                  id="challengeDuration"
                  type="number"
                  value={newChallenge.duration}
                  onChange={(e) => setNewChallenge({ ...newChallenge, duration: e.target.value })}
                  placeholder="30"
                />
              </div>

              <div>
                <Label htmlFor="challengeCategory">Category</Label>
                <Select 
                  value={newChallenge.category} 
                  onValueChange={(value) => setNewChallenge({ ...newChallenge, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="nutrition">Nutrition</SelectItem>
                    <SelectItem value="mindfulness">Mindfulness</SelectItem>
                    <SelectItem value="sleep">Sleep</SelectItem>
                    <SelectItem value="habits">Healthy Habits</SelectItem>
                    <SelectItem value="stress">Stress Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="challengeDifficulty">Difficulty Level</Label>
                <Select 
                  value={newChallenge.difficulty} 
                  onValueChange={(value) => setNewChallenge({ ...newChallenge, difficulty: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="challengeDescription">Description</Label>
                <Textarea
                  id="challengeDescription"
                  value={newChallenge.description}
                  onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                  placeholder="Describe the challenge goals and daily activities..."
                  rows={6}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="challengeActive"
                  checked={newChallenge.isActive}
                  onCheckedChange={(checked) => setNewChallenge({ ...newChallenge, isActive: checked })}
                />
                <Label htmlFor="challengeActive">Active Challenge</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsChallengeDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateChallenge}
              disabled={createChallengeMutation.isPending}
              className="bg-sage-600 hover:bg-sage-700"
            >
              {createChallengeMutation.isPending ? "Saving..." : editingChallenge ? "Update Challenge" : "Create Challenge"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UserManagement() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-sage-800">User Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              User Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sage-600">Total Users:</span>
                <span className="font-semibold">Coming Soon</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sage-600">Active This Month:</span>
                <span className="font-semibold">Coming Soon</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sage-600">Premium Subscribers:</span>
                <span className="font-semibold">Coming Soon</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sage-600">Challenge Participants:</span>
                <span className="font-semibold">Coming Soon</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sage-600">Blog Readers:</span>
                <span className="font-semibold">Coming Soon</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sage-600">AI Plan Users:</span>
                <span className="font-semibold">Coming Soon</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" disabled>
              <Users className="w-4 h-4 mr-2" />
              Export User Data
            </Button>
            <Button variant="outline" className="w-full justify-start" disabled>
              <Crown className="w-4 h-4 mr-2" />
              Manage Subscriptions
            </Button>
            <Button variant="outline" className="w-full justify-start" disabled>
              <BarChart3 className="w-4 h-4 mr-2" />
              User Reports
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="text-center py-12">
          <Users className="w-12 h-12 text-sage-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-sage-800 mb-2">User Management Coming Soon</h3>
          <p className="text-sage-600 mb-4">
            Advanced user management features will be available in the next release. This will include user analytics, 
            subscription management, and engagement tracking.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsManagement() {
  const [settings, setSettings] = useState({
    siteName: "Pure Living Pro",
    siteDescription: "Your wellness journey starts here",
    enableComments: true,
    enableNewsletterSignup: true,
    maintenanceMode: false,
    aiProvider: "deepseek"
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-sage-800">Platform Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure basic site information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Configuration</CardTitle>
            <CardDescription>Configure AI content generation settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="aiProvider">AI Provider</Label>
              <Select 
                value={settings.aiProvider} 
                onValueChange={(value) => setSettings({ ...settings, aiProvider: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deepseek">DeepSeek (Cost-Effective)</SelectItem>
                  <SelectItem value="openai">OpenAI (Premium)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-sage-600 mt-1">
                {settings.aiProvider === "deepseek" 
                  ? "90% cost savings with high-quality content generation" 
                  : "Premium AI with advanced capabilities"}
              </p>
            </div>
            
            <div className="bg-sage-50 p-4 rounded-lg">
              <h4 className="font-semibold text-sage-800 mb-2">API Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>DeepSeek API:</span>
                  <Badge className="bg-green-100 text-green-800">Connected</Badge>
                </div>
                <div className="flex justify-between">
                  <span>OpenAI API:</span>
                  <Badge className="bg-green-100 text-green-800">Connected</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex justify-end pt-6">
          <Button className="bg-sage-600 hover:bg-sage-700">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}