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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  Loader2,
  ExternalLink,
  Star,
  ChevronLeft,
  ChevronRight,
  Search,
  DollarSign,
  Tag,
  AlertTriangle
} from "lucide-react";

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

interface PaginatedResponse {
  data: Product[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export function OptimizedProductManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  
  // Form state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    rating: "",
    imageUrl: "",
    affiliateLink: "",
    isRecommended: false,
    tags: ""
  });

  // Fetch paginated products with caching
  const { data: productData, isLoading, error } = useQuery({
    queryKey: ['/api/admin/products', currentPage, pageSize, searchTerm, categoryFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter && categoryFilter !== 'all' && { category: categoryFilter })
      });
      
      const response = await apiRequest('GET', `/api/admin/products?${params}`);
      return response as unknown as PaginatedResponse;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false
  });

  // Create product mutation
  const createProduct = useMutation({
    mutationFn: (productData: any) => apiRequest('POST', '/api/admin/products', {
      ...productData,
      price: parseFloat(productData.price) || 0,
      rating: parseFloat(productData.rating) || null,
      tags: productData.tags ? productData.tags.split(',').map((t: string) => t.trim()) : []
    }),
    onSuccess: () => {
      toast({ title: "Success", description: "Product created successfully" });
      setIsCreateDialogOpen(false);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        rating: "",
        imageUrl: "",
        affiliateLink: "",
        isRecommended: false,
        tags: ""
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive"
      });
    }
  });

  // Update product mutation
  const updateProduct = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiRequest('PUT', `/api/admin/products/${id}`, data),
    onSuccess: () => {
      toast({ title: "Success", description: "Product updated successfully" });
      setEditingProduct(null);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update product",
        variant: "destructive"
      });
    }
  });

  // Delete product mutation
  const deleteProduct = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/admin/products/${id}`),
    onSuccess: () => {
      toast({ title: "Success", description: "Product deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive"
      });
    }
  });

  // Bulk operations mutation
  const bulkOperation = useMutation({
    mutationFn: ({ action, ids }: { action: string; ids: number[] }) =>
      apiRequest('POST', '/api/admin/products/bulk', { action, ids }),
    onSuccess: (_, variables) => {
      toast({ 
        title: "Success", 
        description: `Bulk ${variables.action} completed for ${variables.ids.length} products` 
      });
      setSelectedProducts([]);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Bulk operation failed",
        variant: "destructive"
      });
    }
  });

  const handleSelectProduct = (productId: number) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === productData?.data?.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(productData?.data?.map(product => product.id) || []);
    }
  };

  const products = productData?.data || [];
  const pagination = productData?.pagination;

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-10">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Failed to load products</h3>
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
                <Package className="h-5 w-5" />
                Product Management
                {pagination && (
                  <Badge variant="outline">
                    {pagination.total} total products
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Manage your affiliate products with advanced filtering and bulk operations
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Add a new affiliate product to your platform
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter product name..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Product description..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newProduct.category} onValueChange={(value) => setNewProduct(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="supplements">Supplements</SelectItem>
                          <SelectItem value="fitness">Fitness Equipment</SelectItem>
                          <SelectItem value="nutrition">Nutrition</SelectItem>
                          <SelectItem value="wellness">Wellness</SelectItem>
                          <SelectItem value="books">Books</SelectItem>
                          <SelectItem value="courses">Courses</SelectItem>
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
                        value={newProduct.rating}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, rating: e.target.value }))}
                        placeholder="4.5"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      value={newProduct.imageUrl}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, imageUrl: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="affiliateLink">Affiliate Link</Label>
                    <Input
                      id="affiliateLink"
                      value={newProduct.affiliateLink}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, affiliateLink: e.target.value }))}
                      placeholder="https://affiliate-link.com/product"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={newProduct.tags}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="organic, natural, premium"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="recommended"
                      checked={newProduct.isRecommended}
                      onCheckedChange={(checked) => setNewProduct(prev => ({ ...prev, isRecommended: !!checked }))}
                    />
                    <Label htmlFor="recommended">Recommended product</Label>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => createProduct.mutate(newProduct)}
                      disabled={createProduct.isPending || !newProduct.name || !newProduct.affiliateLink}
                    >
                      {createProduct.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Add Product
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
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="supplements">Supplements</SelectItem>
                <SelectItem value="fitness">Fitness Equipment</SelectItem>
                <SelectItem value="nutrition">Nutrition</SelectItem>
                <SelectItem value="wellness">Wellness</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="courses">Courses</SelectItem>
              </SelectContent>
            </Select>
            <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 per page</SelectItem>
                <SelectItem value="12">12 per page</SelectItem>
                <SelectItem value="24">24 per page</SelectItem>
                <SelectItem value="48">48 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Operations */}
          {selectedProducts.length > 0 && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-700">
                {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => bulkOperation.mutate({ action: 'recommend', ids: selectedProducts })}
                disabled={bulkOperation.isPending}
              >
                Mark Recommended
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => bulkOperation.mutate({ action: 'unrecommend', ids: selectedProducts })}
                disabled={bulkOperation.isPending}
              >
                Remove Recommendation
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => bulkOperation.mutate({ action: 'delete', ids: selectedProducts })}
                disabled={bulkOperation.isPending}
              >
                Delete
              </Button>
            </div>
          )}

          {/* Products Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-10">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No products found</h3>
              <p className="text-muted-foreground">Add your first affiliate product to get started</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <div className="flex items-center">
                  <Checkbox
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onCheckedChange={handleSelectAll}
                    className="mr-3"
                  />
                  <span className="text-sm font-medium">Select All</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={() => handleSelectProduct(product.id)}
                        />
                        <div className="flex-1 min-w-0">
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-32 object-cover rounded-lg mb-3"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          )}
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
                            {product.isRecommended && (
                              <Badge variant="secondary" className="ml-2 shrink-0">
                                <Star className="h-3 w-3 mr-1" />
                                Rec
                              </Badge>
                            )}
                          </div>
                          
                          {product.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                              {product.description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {product.price && (
                                <span className="text-sm font-semibold text-green-600 flex items-center">
                                  <DollarSign className="h-3 w-3" />
                                  {product.price}
                                </span>
                              )}
                              {product.rating && (
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                  <span className="text-xs ml-1">{product.rating}</span>
                                </div>
                              )}
                            </div>
                            {product.category && (
                              <Badge variant="outline" className="text-xs">
                                {product.category}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingProduct(product)}
                              className="flex-1"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            {product.affiliateLink && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(product.affiliateLink!, '_blank')}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteProduct.mutate(product.id)}
                              disabled={deleteProduct.isPending}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {((pagination.page - 1) * pagination.pageSize) + 1} to{' '}
                {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
                {pagination.total} products
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