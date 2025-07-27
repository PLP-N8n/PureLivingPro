import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';
import type { AdminFilters } from '@shared/types/admin';

interface SearchAndFiltersProps {
  filters: AdminFilters;
  onFilterChange: (key: keyof AdminFilters, value: any) => void;
  onResetFilters: () => void;
  categories?: { value: string; label: string; }[];
  totalCount: number;
  filteredCount: number;
  className?: string;
}

export function SearchAndFilters({
  filters,
  onFilterChange,
  onResetFilters,
  categories = [],
  totalCount,
  filteredCount,
  className = ""
}: SearchAndFiltersProps) {
  const hasActiveFilters = filters.searchTerm || 
    filters.categoryFilter !== 'all' || 
    filters.statusFilter !== 'all';

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search content..."
            value={filters.searchTerm}
            onChange={(e) => onFilterChange('searchTerm', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 items-center">
          {categories.length > 0 && (
            <Select 
              value={filters.categoryFilter} 
              onValueChange={(value) => onFilterChange('categoryFilter', value)}
            >
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <Select 
            value={filters.statusFilter} 
            onValueChange={(value) => onFilterChange('statusFilter', value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onResetFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Filter Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Showing {filteredCount} of {totalCount} items
          </span>
          
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span>•</span>
              <div className="flex gap-1">
                {filters.searchTerm && (
                  <Badge variant="secondary" className="text-xs">
                    Search: "{filters.searchTerm}"
                  </Badge>
                )}
                {filters.categoryFilter !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    Category: {filters.categoryFilter}
                  </Badge>
                )}
                {filters.statusFilter !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    Status: {filters.statusFilter}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}