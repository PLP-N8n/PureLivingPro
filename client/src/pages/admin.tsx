import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  BookOpen,
  ShoppingBag,
  Target,
  Users,
  BarChart3,
  Crown
} from "lucide-react";
import { motion } from "framer-motion";

export default function Admin() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState("blog");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Admin access requires authentication.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Admin check (in a real app, this would be based on user roles)
  const isAdmin = user?.email?.includes("admin") || false;

  const { data: blogPosts, isLoading: blogLoading } = useQuery({
    queryKey: ["/api/blog/posts?limit=50"],
    retry: false,
    enabled: isAuthenticated && isAdmin,
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products?limit=50"],
    retry: false,
    enabled: isAuthenticated && isAdmin,
  });

  const { data: challenges, isLoading: challengesLoading } = useQuery({
    queryKey: ["/api/challenges?limit=50"],
    retry: false,
    enabled: isAuthenticated && isAdmin,
  });

  // Form state for creating content
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    price: "",
    isPremium: false,
    isPublished: false,
    duration: "",
    difficulty: "",
  });

  const createContentMutation = useMutation({
    mutationFn: async (data: any) => {
      let endpoint = "";
      let payload = {};

      switch (selectedContentType) {
        case "blog":
          endpoint = "/api/blog/posts";
          payload = {
            title: data.title,
            slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            excerpt: data.description,
            content: data.content,
            category: data.category,
            isPremium: data.isPremium,
            isPublished: data.isPublished,
            readTime: Math.ceil(data.content.length / 200), // Estimate reading time
          };
          break;
        case "product":
          endpoint = "/api/products";
          payload = {
            name: data.title,
            description: data.description,
            price: parseFloat(data.price),
            category: data.category,
            isRecommended: data.isPremium, // Reuse premium field for recommended
          };
          break;
        case "challenge":
          endpoint = "/api/challenges";
          payload = {
            title: data.title,
            description: data.description,
            duration: parseInt(data.duration),
            category: data.category,
            difficulty: data.difficulty,
            goals: [data.category], // Simple goal assignment
            isActive: data.isPublished,
          };
          break;
      }

      const response = await apiRequest("POST", endpoint, payload);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/challenges"] });
      setIsCreateDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        content: "",
        category: "",
        price: "",
        isPremium: false,
        isPublished: false,
        duration: "",
        difficulty: "",
      });
      toast({
        title: "Content Created!",
        description: "Your content has been successfully created.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You don't have permission to create content.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create content. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sage-25 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-sage-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-sage-25">
        <Navbar />
        <div className="pt-24 pb-16 flex items-center justify-center">
          <Card className="max-w-md mx-4">
            <CardContent className="pt-6 text-center">
              <Settings className="w-12 h-12 text-sage-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-sage-800 mb-2">Admin Access Required</h2>
              <p className="text-sage-600 mb-4">
                You need administrator privileges to access this area.
              </p>
              <Button onClick={() => window.location.href = "/"}>
                Go Home
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateContent = () => {
    createContentMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-sage-25">
      <Navbar />
      
      {/* Header */}
      <section className="pt-24 pb-8 wellness-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-sage-800 mb-4">
                  Admin Dashboard
                </h1>
                <p className="text-xl text-sage-600">
                  Manage content, users, and platform settings
                </p>
              </div>
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2">
                <Crown className="w-4 h-4 mr-2" />
                Administrator
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Admin Stats */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-sage-800">{blogPosts?.length || 0}</div>
                <p className="text-sage-600 text-sm">Blog Posts</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-sage-800">{products?.length || 0}</div>
                <p className="text-sage-600 text-sm">Products</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-sage-800">{challenges?.length || 0}</div>
                <p className="text-sage-600 text-sm">Challenges</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-sage-800">1,247</div>
                <p className="text-sage-600 text-sm">Total Users</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Admin Content */}
      <section className="py-16 wellness-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="flex items-center justify-between">
              <TabsList className="grid w-full max-w-2xl grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="blog">Blog Posts</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="challenges">Challenges</TabsTrigger>
              </TabsList>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-sage-600 hover:bg-sage-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Content
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Content</DialogTitle>
                    <DialogDescription>
                      Add new content to the platform
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="contentType">Content Type</Label>
                      <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blog">Blog Post</SelectItem>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="challenge">Challenge</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        placeholder="Enter title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Enter description"
                        rows={3}
                      />
                    </div>

                    {selectedContentType === "blog" && (
                      <div>
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          value={formData.content}
                          onChange={(e) => handleInputChange("content", e.target.value)}
                          placeholder="Enter blog post content"
                          rows={6}
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => handleInputChange("category", e.target.value)}
                        placeholder="Enter category"
                      />
                    </div>

                    {selectedContentType === "product" && (
                      <div>
                        <Label htmlFor="price">Price (£)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => handleInputChange("price", e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                    )}

                    {selectedContentType === "challenge" && (
                      <>
                        <div>
                          <Label htmlFor="duration">Duration (days)</Label>
                          <Input
                            id="duration"
                            type="number"
                            value={formData.duration}
                            onChange={(e) => handleInputChange("duration", e.target.value)}
                            placeholder="7"
                          />
                        </div>
                        <div>
                          <Label htmlFor="difficulty">Difficulty</Label>
                          <Select value={formData.difficulty} onValueChange={(value) => handleInputChange("difficulty", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isPremium"
                          checked={formData.isPremium}
                          onCheckedChange={(checked) => handleInputChange("isPremium", checked)}
                        />
                        <Label htmlFor="isPremium">
                          {selectedContentType === "product" ? "Recommended" : "Premium"}
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isPublished"
                          checked={formData.isPublished}
                          onCheckedChange={(checked) => handleInputChange("isPublished", checked)}
                        />
                        <Label htmlFor="isPublished">
                          {selectedContentType === "challenge" ? "Active" : "Published"}
                        </Label>
                      </div>
                    </div>

                    <Button
                      onClick={handleCreateContent}
                      disabled={!formData.title || createContentMutation.isPending}
                      className="w-full"
                    >
                      {createContentMutation.isPending ? "Creating..." : "Create Content"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="organic-border premium-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      Platform Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sage-600">Daily Active Users</span>
                        <span className="font-semibold">324</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sage-600">Premium Members</span>
                        <span className="font-semibold">89</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sage-600">Content Views</span>
                        <span className="font-semibold">2,847</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="organic-border premium-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-green-600" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>New blog post published</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Product added to catalog</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span>Challenge completed by user</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="organic-border premium-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      User Engagement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sage-600">Challenge Participants</span>
                        <span className="font-semibold">156</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sage-600">Meditation Sessions</span>
                        <span className="font-semibold">428</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sage-600">Daily Logs</span>
                        <span className="font-semibold">89</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="blog" className="space-y-6">
              <Card className="organic-border premium-shadow">
                <CardHeader>
                  <CardTitle>Blog Posts</CardTitle>
                  <CardDescription>Manage your blog content</CardDescription>
                </CardHeader>
                <CardContent>
                  {blogLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {blogPosts?.map((post: any) => (
                        <div key={post.id} className="flex items-center justify-between p-4 border border-sage-200 rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-semibold text-sage-800">{post.title}</h3>
                            <div className="flex items-center space-x-4 mt-2">
                              <Badge variant="outline">{post.category}</Badge>
                              {post.isPremium && <Badge>Premium</Badge>}
                              {post.isPublished ? (
                                <Badge className="bg-green-100 text-green-700">Published</Badge>
                              ) : (
                                <Badge variant="outline">Draft</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              <Card className="organic-border premium-shadow">
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                  <CardDescription>Manage wellness products</CardDescription>
                </CardHeader>
                <CardContent>
                  {productsLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {products?.map((product: any) => (
                        <div key={product.id} className="flex items-center justify-between p-4 border border-sage-200 rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-semibold text-sage-800">{product.name}</h3>
                            <div className="flex items-center space-x-4 mt-2">
                              <Badge variant="outline">{product.category}</Badge>
                              <span className="text-sage-600">£{product.price}</span>
                              {product.isRecommended && <Badge className="bg-amber-100 text-amber-700">Recommended</Badge>}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="challenges" className="space-y-6">
              <Card className="organic-border premium-shadow">
                <CardHeader>
                  <CardTitle>Challenges</CardTitle>
                  <CardDescription>Manage wellness challenges</CardDescription>
                </CardHeader>
                <CardContent>
                  {challengesLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {challenges?.map((challenge: any) => (
                        <div key={challenge.id} className="flex items-center justify-between p-4 border border-sage-200 rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-semibold text-sage-800">{challenge.title}</h3>
                            <div className="flex items-center space-x-4 mt-2">
                              <Badge variant="outline">{challenge.category}</Badge>
                              <Badge variant="outline">{challenge.duration} days</Badge>
                              <Badge variant="outline">{challenge.difficulty}</Badge>
                              {challenge.isActive ? (
                                <Badge className="bg-green-100 text-green-700">Active</Badge>
                              ) : (
                                <Badge variant="outline">Inactive</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}
