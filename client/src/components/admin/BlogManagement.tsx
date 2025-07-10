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
  Wand2
} from "lucide-react";
import { BlogPost } from "@shared/schema";

export default function BlogManagement() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [bulkCreateCount, setBulkCreateCount] = useState(3);
  const [newPost, setNewPost] = useState({
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

  const createPostMutation = useMutation({
    mutationFn: async (post: any) => {
      const response = await apiRequest('POST', '/api/blog/posts', post);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Blog post created successfully",
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
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setNewPost({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      category: post.category,
      tags: post.tags?.join(', ') || '',
      published: post.published,
      featured: post.featured,
      metaDescription: post.metaDescription || '',
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
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {blogPosts?.map((post: BlogPost) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {post.excerpt || post.content.substring(0, 150) + '...'}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(post)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
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
                  <Badge variant="outline">Featured</Badge>
                )}
                <Badge variant="outline">{post.category}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {post.authorId}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
  isEditing = false 
}: {
  post: any;
  setPost: (post: any) => void;
  onSubmit: () => void;
  onAIGenerate?: () => void;
  isSubmitting: boolean;
  isAIGenerating?: boolean;
  isEditing?: boolean;
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
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={post.category} onValueChange={(value) => setPost({ ...post, category: value })}>
            <SelectTrigger>
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