import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Sparkles, 
  Loader2,
  Calendar,
  User,
  Tag,
  FileText,
  Wand2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  MoreHorizontal
} from "lucide-react";

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

interface PaginatedResponse {
  data: BlogPost[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export function OptimizedBlogManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  
  // Form state
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    tags: "",
    isPublished: false,
    isPremium: false
  });

  // Debounced search term for better performance
  const debouncedSearchTerm = useMemo(() => {
    const timer = setTimeout(() => searchTerm, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch paginated blog posts with caching
  const { data: blogData, isLoading, error } = useQuery({
    queryKey: ['/api/admin/blog-posts', currentPage, pageSize, searchTerm, categoryFilter, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter && { category: categoryFilter }),
        ...(statusFilter && { status: statusFilter })
      });
      
      const response = await apiRequest('GET', `/api/admin/blog-posts?${params}`);
      return response as PaginatedResponse;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false
  });

  // Create blog post mutation
  const createPost = useMutation({
    mutationFn: (postData: any) => apiRequest('POST', '/api/admin/blog-posts', postData),
    onSuccess: () => {
      toast({ title: "Success", description: "Blog post created successfully" });
      setIsCreateDialogOpen(false);
      setNewPost({
        title: "",
        content: "",
        excerpt: "",
        category: "",
        tags: "",
        isPublished: false,
        isPremium: false
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog-posts'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create blog post",
        variant: "destructive"
      });
    }
  });

  // Update blog post mutation
  const updatePost = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiRequest('PUT', `/api/admin/blog-posts/${id}`, data),
    onSuccess: () => {
      toast({ title: "Success", description: "Blog post updated successfully" });
      setEditingPost(null);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog-posts'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update blog post",
        variant: "destructive"
      });
    }
  });

  // Delete blog post mutation
  const deletePost = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/admin/blog-posts/${id}`),
    onSuccess: () => {
      toast({ title: "Success", description: "Blog post deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog-posts'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete blog post",
        variant: "destructive"
      });
    }
  });

  // Bulk operations mutation
  const bulkOperation = useMutation({
    mutationFn: ({ action, ids }: { action: string; ids: number[] }) =>
      apiRequest('POST', '/api/admin/blog-posts/bulk', { action, ids }),
    onSuccess: (_, variables) => {
      toast({ 
        title: "Success", 
        description: `Bulk ${variables.action} completed for ${variables.ids.length} posts` 
      });
      setSelectedPosts([]);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog-posts'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Bulk operation failed",
        variant: "destructive"
      });
    }
  });

  const handleSelectPost = (postId: number) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPosts.length === blogData?.data?.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(blogData?.data?.map(post => post.id) || []);
    }
  };

  const posts = blogData?.data || [];
  const pagination = blogData?.pagination;

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-10">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Failed to load blog posts</h3>
            <p className="text-muted-foreground">Please try refreshing the page</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Blog Management
                {pagination && (
                  <Badge variant="outline">
                    {pagination.total} total posts
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Manage your blog posts with advanced filtering and bulk operations
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Blog Post</DialogTitle>
                  <DialogDescription>
                    Create a new blog post for your wellness platform
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newPost.title}
                      onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter post title..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={newPost.excerpt}
                      onChange={(e) => setNewPost(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Brief description..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newPost.category} onValueChange={(value) => setNewPost(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wellness">Wellness</SelectItem>
                          <SelectItem value="fitness">Fitness</SelectItem>
                          <SelectItem value="nutrition">Nutrition</SelectItem>
                          <SelectItem value="mindfulness">Mindfulness</SelectItem>
                          <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={newPost.tags}
                        onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder="wellness, health, tips"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={newPost.content}
                      onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your blog post content..."
                      rows={10}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="published"
                        checked={newPost.isPublished}
                        onCheckedChange={(checked) => setNewPost(prev => ({ ...prev, isPublished: !!checked }))}
                      />
                      <Label htmlFor="published">Publish immediately</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="premium"
                        checked={newPost.isPremium}
                        onCheckedChange={(checked) => setNewPost(prev => ({ ...prev, isPremium: !!checked }))}
                      />
                      <Label htmlFor="premium">Premium content</Label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => createPost.mutate(newPost)}
                      disabled={createPost.isPending || !newPost.title || !newPost.content}
                    >
                      {createPost.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Create Post
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Advanced Filtering */}
          <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-muted rounded-lg">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All categories</SelectItem>
                <SelectItem value="wellness">Wellness</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="nutrition">Nutrition</SelectItem>
                <SelectItem value="mindfulness">Mindfulness</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
            <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="25">25 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Operations */}
          {selectedPosts.length > 0 && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-700">
                {selectedPosts.length} post{selectedPosts.length !== 1 ? 's' : ''} selected
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => bulkOperation.mutate({ action: 'publish', ids: selectedPosts })}
                disabled={bulkOperation.isPending}
              >
                Publish
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => bulkOperation.mutate({ action: 'unpublish', ids: selectedPosts })}
                disabled={bulkOperation.isPending}
              >
                Unpublish
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => bulkOperation.mutate({ action: 'delete', ids: selectedPosts })}
                disabled={bulkOperation.isPending}
              >
                Delete
              </Button>
            </div>
          )}

          {/* Posts Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted p-3">
              <div className="flex items-center">
                <Checkbox
                  checked={selectedPosts.length === posts.length && posts.length > 0}
                  onCheckedChange={handleSelectAll}
                  className="mr-3"
                />
                <span className="text-sm font-medium">Select All</span>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-10">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">No blog posts found</h3>
                <p className="text-muted-foreground">Create your first blog post to get started</p>
              </div>
            ) : (
              <div className="divide-y">
                {posts.map((post) => (
                  <div key={post.id} className="p-4 hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedPosts.includes(post.id)}
                        onCheckedChange={() => handleSelectPost(post.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{post.title}</h4>
                          {post.isPublished ? (
                            <Badge variant="default">Published</Badge>
                          ) : (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                          {post.isPremium && (
                            <Badge variant="outline">Premium</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{post.category}</span>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          {post.readTime && <span>{post.readTime} min read</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingPost(post)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deletePost.mutate(post.id)}
                          disabled={deletePost.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {((pagination.page - 1) * pagination.pageSize) + 1} to{' '}
                {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
                {pagination.total} posts
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={page === pagination.page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={pagination.page === pagination.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}