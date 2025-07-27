import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { BulkOperation } from '@shared/types/admin';

interface UseBulkOperationsProps {
  queryKey: string[];
  endpoint: string;
}

export function useBulkOperations({ queryKey, endpoint }: UseBulkOperationsProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const bulkMutation = useMutation({
    mutationFn: async ({ action, selectedIds }: BulkOperation) => {
      const operations = selectedIds.map(id => {
        switch (action) {
          case 'publish':
            return apiRequest('PUT', `${endpoint}/${id}`, { published: true });
          case 'unpublish':
            return apiRequest('PUT', `${endpoint}/${id}`, { published: false });
          case 'delete':
            return apiRequest('DELETE', `${endpoint}/${id}`);
          default:
            throw new Error(`Unsupported action: ${action}`);
        }
      });
      
      return Promise.all(operations);
    },
    onSuccess: (_, { action, selectedIds }) => {
      queryClient.invalidateQueries({ queryKey });
      setSelectedItems([]);
      
      const actionText = action === 'delete' ? 'deleted' : 
                        action === 'publish' ? 'published' : 'unpublished';
      
      toast({
        title: "Success",
        description: `${selectedIds.length} items ${actionText} successfully`
      });
    },
    onError: (error, { action }) => {
      toast({
        title: "Error",
        description: `Failed to ${action} selected items`,
        variant: "destructive"
      });
    }
  });

  const handleSelectItem = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (itemIds: number[]) => {
    setSelectedItems(prev => 
      prev.length === itemIds.length ? [] : itemIds
    );
  };

  const handleBulkAction = (action: BulkOperation['action']) => {
    if (selectedItems.length === 0) {
      toast({
        title: "Error",
        description: "Please select items first",
        variant: "destructive"
      });
      return;
    }

    const actionText = action === 'delete' ? 'delete' : action;
    if (window.confirm(`${actionText} ${selectedItems.length} selected items?`)) {
      bulkMutation.mutate({ action, selectedIds: selectedItems });
    }
  };

  return {
    selectedItems,
    isProcessing: bulkMutation.isPending,
    handleSelectItem,
    handleSelectAll,
    handleBulkAction,
    clearSelection: () => setSelectedItems([])
  };
}