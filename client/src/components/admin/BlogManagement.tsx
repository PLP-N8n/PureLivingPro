import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  AlertTriangle
} from "lucide-react";
import { BlogPost } from "@shared/schema";
import { blogPostSchema, type BlogPostFormData } from "@shared/validation/admin";
import type { BlogPostForm } from "@shared/types/admin";
import { useAdminFilters } from "@/hooks/useAdminFilters";
import { useBulkOperations } from "@/hooks/useBulkOperations";
import { SearchAndFilters } from "./SearchAndFilters";
import { BulkOperations } from "./BulkOperations";

export default function BlogManagement() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [bulkCreateCount, setBulkCreateCount] = useState(3);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const [newPost, setNewPost] = useState<BlogPostForm>({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    published: false,
    featured: false,
    metaDescription: '',
    slug: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ['/api/blog/posts'],
  });

  // Enhanced filtering and search
  const {
    filters,
    filteredData: filteredPosts,
    updateFilter,
    resetFilters,
    totalCount,
    filteredCount
  } = useAdminFilters({
    data: (blogPosts as BlogPost[]) || [],
    searchFields: ['title', 'content', 'excerpt'],
    categoryField: 'category',
    statusField: 'isPublished'
  });

  // Bulk operations
  const bulkOps = useBulkOperations({
    queryKey: ['/api/blog/posts'],
    endpoint: '/api/blog/posts'
  });

  // Categories for filtering
  const categories = [
    { value: 'wellness', label: 'Wellness' },
    { value: 'nutrition', label: 'Nutrition' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'mindfulness', label: 'Mindfulness' },
    { value: 'lifestyle', label: 'Lifestyle' }
  ];

  // Form validation function
  const validateForm = (): boolean => {
    try {
      blogPostSchema.parse(newPost);
      setValidationErrors({});
      return true;
    } catch (error: any) {
      const errors: Record<string, string> = {};
      if (error.errors) {
        error.errors.forEach((err: any) => {
          errors[err.path[0]] = err.message;
        });
      }
      setValidationErrors(errors);
      toast({
        title: "Validation Error",
        description: "Please fix the form errors before submitting",
        variant: "destructive"
      });
      return false;
    }
  };

  const createPostMutation = useMutation({
    mutationFn: async (post: BlogPostFormData) => {
      if (!validateForm()) {
        throw new Error('Form validation failed');
      }
      const response = await apiRequest('POST', '/api/blog/posts', post);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      setIsCreateDialogOpen(false);
      resetForm();
      bulkOps.clearSelection();
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
    },
    onError: (error) => {
      if (error.message !== 'Form validation failed') {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async (post: any) => {
      const response = await apiRequest('PUT', `/api/blog/posts/${selectedPost?.id}`, post);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      setIsEditDialogOpen(false);
      setSelectedPost(null);
      resetForm();
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/blog/posts/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateAIPostMutation = useMutation({
    mutationFn: async (data: { title: string; category: string; autoPublish: boolean }) => {
      const response = await apiRequest('POST', '/api/admin/generate-blog-post', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      toast({
        title: "Success",
        description: "AI blog post generated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setNewPost({
      title: '',
      content: '',
      excerpt: '',
      category: '',
      tags: '',
      published: false,
      featured: false,
      metaDescription: '',
      slug: ''
    });
    setValidationErrors({});
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setNewPost({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      category: post.category || '',
      tags: post.tags?.join(', ') || '',
      published: post.isPublished || false,
      featured: false, // This field might not exist in the schema
      metaDescription: '',
      slug: post.slug
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      deletePostMutation.mutate(id);
    }
  };

  const handleGenerateAI = async () => {
    if (!newPost.title || !newPost.category) {
      toast({
        title: "Error",
        description: "Please provide both title and category for AI generation",
        variant: "destructive",
      });
      return;
    }

    setIsAIGenerating(true);
    try {
      await generateAIPostMutation.mutateAsync({
        title: newPost.title,
        category: newPost.category,
        autoPublish: newPost.published
      });
    } finally {
      setIsAIGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Blog Management</h2>
          <p className="text-muted-foreground">Create, edit, and manage blog posts</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Blog Post</DialogTitle>
                <DialogDescription>
                  Create a new blog post manually or use AI to generate content
                </DialogDescription>
              </DialogHeader>
              <BlogPostForm
                post={newPost}
                setPost={setNewPost}
                onSubmit={() => createPostMutation.mutate(newPost)}
                onAIGenerate={handleGenerateAI}
                isSubmitting={createPostMutation.isPending}
                isAIGenerating={isAIGenerating}
                validationErrors={validationErrors}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enhanced Search and Filtering */}
      <SearchAndFilters
        filters={filters}
        onFilterChange={updateFilter}
        onResetFilters={resetFilters}
        categories={categories}
        totalCount={totalCount}
        filteredCount={filteredCount}
        className="bg-sage-50/50 p-4 rounded-lg border"
      />

      {/* Bulk Operations */}
      <BulkOperations
        selectedItems={bulkOps.selectedItems}
        totalItems={filteredPosts.length}
        isProcessing={bulkOps.isProcessing}
        onSelectAll={() => bulkOps.handleSelectAll(filteredPosts.map(p => p.id))}
        onBulkAction={bulkOps.handleBulkAction}
        onClearSelection={bulkOps.clearSelection}
      />

      {/* Enhanced Blog Posts Grid */}
      <div className="grid gap-4">
        {filteredPosts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No blog posts found</h3>
              <p className="text-muted-foreground mb-4">
                {totalCount === 0 
                  ? "Get started by creating your first blog post" 
                  : "Try adjusting your search or filter criteria"
                }
              </p>
              {totalCount === 0 && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Post
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post: BlogPost) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3 flex-1">
                    <Checkbox
                      checked={bulkOps.selectedItems.includes(post.id)}
                      onCheckedChange={() => bulkOps.handleSelectItem(post.id)}
                      aria-label={`Select ${post.title}`}
                    />
                    <div className="flex-1">
                      <CardTitle className="text-lg hover:text-sage-600 cursor-pointer">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {post.excerpt || post.content.substring(0, 150) + '...'}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(post)}
                      className="hover:bg-sage-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant={post.published ? "default" : "secondary"}>
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                  {post.featured && (
                    <Badge variant="outline" className="border-yellow-200 text-yellow-700">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-sage-50">
                    {post.category}
                  </Badge>
                  {post.tags && post.tags.length > 0 && (
                    <Badge variant="outline" className="bg-blue-50">
                      <Tag className="h-3 w-3 mr-1" />
                      {post.tags.length} tags
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'No date'}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Author {post.authorId}
                    </div>
                  </div>
                  {!post.isPublished && (
                    <div className="flex items-center gap-1 text-orange-600">
                      <AlertTriangle className="h-4 w-4" />
                      Needs Review
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>
              Update the blog post details
            </DialogDescription>
          </DialogHeader>
          <BlogPostForm
            post={newPost}
            setPost={setNewPost}
            onSubmit={() => updatePostMutation.mutate(newPost)}
            isSubmitting={updatePostMutation.isPending}
            isEditing={true}
            validationErrors={validationErrors}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BlogPostForm({ 
  post, 
  setPost, 
  onSubmit, 
  onAIGenerate, 
  isSubmitting, 
  isAIGenerating, 
  isEditing = false,
  validationErrors = {}
}: {
  post: BlogPostForm;
  setPost: (post: BlogPostForm) => void;
  onSubmit: () => void;
  onAIGenerate?: () => void;
  isSubmitting: boolean;
  isAIGenerating?: boolean;
  isEditing?: boolean;
  validationErrors?: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            placeholder="Enter post title"
            className={validationErrors.title ? "border-red-500" : ""}
          />
          {validationErrors.title && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {validationErrors.title}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={post.category} onValueChange={(value) => setPost({ ...post, category: value })}>
            <SelectTrigger className={validationErrors.category ? "border-red-500" : ""}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fitness">Fitness</SelectItem>
              <SelectItem value="nutrition">Nutrition</SelectItem>
              <SelectItem value="mindfulness">Mindfulness</SelectItem>
              <SelectItem value="wellness">Wellness</SelectItem>
              <SelectItem value="lifestyle">Lifestyle</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors.category && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {validationErrors.category}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={post.excerpt}
          onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
          placeholder="Brief description of the post"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={post.content}
          onChange={(e) => setPost({ ...post, content: e.target.value })}
          placeholder="Post content"
          rows={8}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            value={post.tags}
            onChange={(e) => setPost({ ...post, tags: e.target.value })}
            placeholder="wellness, health, fitness"
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={post.slug}
            onChange={(e) => setPost({ ...post, slug: e.target.value })}
            placeholder="post-url-slug"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="metaDescription">Meta Description</Label>
        <Textarea
          id="metaDescription"
          value={post.metaDescription}
          onChange={(e) => setPost({ ...post, metaDescription: e.target.value })}
          placeholder="SEO meta description"
          rows={2}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="published"
            checked={post.published}
            onCheckedChange={(checked) => setPost({ ...post, published: checked })}
          />
          <Label htmlFor="published">Published</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="featured"
            checked={post.featured}
            onCheckedChange={(checked) => setPost({ ...post, featured: checked })}
          />
          <Label htmlFor="featured">Featured</Label>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {isEditing ? 'Update Post' : 'Create Post'}
        </Button>
        
        {!isEditing && onAIGenerate && (
          <Button
            variant="outline"
            onClick={onAIGenerate}
            disabled={isAIGenerating || !post.title || !post.category}
          >
            {isAIGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4 mr-2" />
            )}
            Generate with AI
          </Button>
        )}
      </div>
    </div>
  );
}