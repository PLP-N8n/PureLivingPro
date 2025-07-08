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
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sage-600 hover:bg-sage-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Post
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
        type: "blog_post"
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
        category: formData.category
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
        <Label className="text-lg font-semibold text-purple-800">AI Content Generator</Label>
        <p className="text-sm text-purple-600 mb-3">Generate high-quality wellness content automatically</p>
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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-sage-800">Products</h2>
        <Button className="bg-sage-600 hover:bg-sage-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-sage-600">Product management interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function ChallengeManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-sage-800">Challenges</h2>
        <Button className="bg-sage-600 hover:bg-sage-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Challenge
        </Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-sage-600">Challenge management interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function UserManagement() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-sage-800">Users</h2>
      <Card>
        <CardContent className="p-6">
          <p className="text-sage-600">User management interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-sage-800">Settings</h2>
      <Card>
        <CardContent className="p-6">
          <p className="text-sage-600">Platform settings coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}