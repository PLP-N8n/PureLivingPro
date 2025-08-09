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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  ExternalLink,
  Package,
  DollarSign,
  Tag,
  Loader2
} from "lucide-react";
import { Product } from "@shared/schema";

export default function ProductManagement() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    tags: '',
    imageUrl: '',
    affiliateLink: '',
    rating: '',
    isRecommended: false
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery<any>({
    queryKey: ['/api/products'],
  });

  const createProductMutation = useMutation({
    mutationFn: async (product: any) => {
      const response = await apiRequest('POST', '/api/products', {
        ...product,
        price: parseFloat(product.price),
        rating: product.rating ? parseFloat(product.rating) : null,
        tags: product.tags ? product.tags.split(',').map((tag: string) => tag.trim()) : []
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Product created successfully",
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

  const updateProductMutation = useMutation({
    mutationFn: async (product: any) => {
      const response = await apiRequest('PUT', `/api/products/${selectedProduct?.id}`, {
        ...product,
        price: parseFloat(product.price),
        rating: product.rating ? parseFloat(product.rating) : null,
        tags: product.tags ? product.tags.split(',').map((tag: string) => tag.trim()) : []
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      resetForm();
      toast({
        title: "Success",
        description: "Product updated successfully",
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

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/products/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Success",
        description: "Product deleted successfully",
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
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      tags: '',
      imageUrl: '',
      affiliateLink: '',
      rating: '',
      isRecommended: false
    });
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category || '',
      tags: product.tags?.join(', ') || '',
      imageUrl: product.imageUrl || '',
      affiliateLink: product.affiliateLink || '',
      rating: product.rating?.toString() || '',
      isRecommended: product.isRecommended || false
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id);
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
          <h2 className="text-2xl font-bold">Product Management</h2>
          <p className="text-muted-foreground">Manage affiliate products and recommendations</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Add a new wellness product to your recommendations
              </DialogDescription>
            </DialogHeader>
            <ProductForm
              product={newProduct}
              setProduct={setNewProduct}
              onSubmit={() => createProductMutation.mutate(newProduct)}
              isSubmitting={createProductMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {products?.map((product: Product) => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {product.description?.substring(0, 100)}...
                    </CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">${product.price}</Badge>
                      {product.rating && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current" />
                          {product.rating}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {product.isRecommended && (
                  <Badge className="bg-green-100 text-green-800">
                    <Star className="h-3 w-3 mr-1" />
                    Recommended
                  </Badge>
                )}
                {product.category && (
                  <Badge variant="outline">{product.category}</Badge>
                )}
                {product.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
              {product.affiliateLink && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(product.affiliateLink || undefined, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Product
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product details
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            product={newProduct}
            setProduct={setNewProduct}
            onSubmit={() => updateProductMutation.mutate(newProduct)}
            isSubmitting={updateProductMutation.isPending}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProductForm({ 
  product, 
  setProduct, 
  onSubmit, 
  isSubmitting, 
  isEditing = false 
}: {
  product: any;
  setProduct: (product: any) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isEditing?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            placeholder="Enter product name"
          />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
          placeholder="Product description"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={product.category} onValueChange={(value) => setProduct({ ...product, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="supplements">Supplements</SelectItem>
              <SelectItem value="fitness">Fitness Equipment</SelectItem>
              <SelectItem value="skincare">Skincare</SelectItem>
              <SelectItem value="nutrition">Nutrition</SelectItem>
              <SelectItem value="wellness">Wellness</SelectItem>
              <SelectItem value="books">Books</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="rating">Rating (1-5)</Label>
          <Input
            id="rating"
            type="number"
            min="1"
            max="5"
            step="0.1"
            value={product.rating}
            onChange={(e) => setProduct({ ...product, rating: e.target.value })}
            placeholder="4.5"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={product.tags}
          onChange={(e) => setProduct({ ...product, tags: e.target.value })}
          placeholder="organic, natural, vegan"
        />
      </div>

      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          value={product.imageUrl}
          onChange={(e) => setProduct({ ...product, imageUrl: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <Label htmlFor="affiliateLink">Affiliate Link</Label>
        <Input
          id="affiliateLink"
          value={product.affiliateLink}
          onChange={(e) => setProduct({ ...product, affiliateLink: e.target.value })}
          placeholder="https://affiliate-link.com"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isRecommended"
          checked={product.isRecommended}
          onCheckedChange={(checked) => setProduct({ ...product, isRecommended: checked })}
        />
        <Label htmlFor="isRecommended">Recommended Product</Label>
      </div>

      <Button onClick={onSubmit} disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {isEditing ? 'Update Product' : 'Create Product'}
      </Button>
    </div>
  );
}
