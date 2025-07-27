import { useState, useMemo } from 'react';
import type { AdminFilters } from '@shared/types/admin';

interface UseAdminFiltersProps<T> {
  data: T[];
  searchFields: (keyof T)[];
  categoryField?: keyof T;
  statusField?: keyof T;
}

export function useAdminFilters<T>({ 
  data, 
  searchFields, 
  categoryField, 
  statusField 
}: UseAdminFiltersProps<T>) {
  const [filters, setFilters] = useState<AdminFilters>({
    searchTerm: '',
    categoryFilter: 'all',
    statusFilter: 'all'
  });

  const filteredData = useMemo(() => {
    return data?.filter((item: T) => {
      // Search filter
      const matchesSearch = filters.searchTerm === '' || 
        searchFields.some(field => {
          const value = item[field];
          return typeof value === 'string' && 
            value.toLowerCase().includes(filters.searchTerm.toLowerCase());
        });

      // Category filter
      const matchesCategory = filters.categoryFilter === 'all' || 
        !categoryField || 
        item[categoryField] === filters.categoryFilter;

      // Status filter
      const matchesStatus = filters.statusFilter === 'all' || 
        !statusField || 
        (filters.statusFilter === 'published' && item[statusField]) ||
        (filters.statusFilter === 'draft' && !item[statusField]);

      return matchesSearch && matchesCategory && matchesStatus;
    }) || [];
  }, [data, filters, searchFields, categoryField, statusField]);

  const updateFilter = (key: keyof AdminFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      categoryFilter: 'all',
      statusFilter: 'all'
    });
  };

  return {
    filters,
    filteredData,
    updateFilter,
    resetFilters,
    totalCount: data?.length || 0,
    filteredCount: filteredData.length
  };
}