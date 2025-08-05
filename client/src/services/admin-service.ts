// Admin Service - TanStack Query hooks for admin operations
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

// Query Keys
export const ADMIN_KEYS = {
  all: ['admin'] as const,
  stats: () => [...ADMIN_KEYS.all, 'stats'] as const,
  users: (params?: any) => [...ADMIN_KEYS.all, 'users', params] as const,
  blogPosts: (params?: any) => [...ADMIN_KEYS.all, 'blog-posts', params] as const,
  products: (params?: any) => [...ADMIN_KEYS.all, 'products', params] as const,
  challenges: (params?: any) => [...ADMIN_KEYS.all, 'challenges', params] as const,
  automation: () => [...ADMIN_KEYS.all, 'automation'] as const,
  analytics: () => [...ADMIN_KEYS.all, 'analytics'] as const,
};

// Admin Stats (with caching)
export const useAdminStats = () => {
  return useQuery({
    queryKey: ADMIN_KEYS.stats(),
    queryFn: () => apiRequest('/api/admin/stats'),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });
};

// Bulk Operations
export const useBulkBlogOperation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ action, ids }: { action: string; ids: number[] }) =>
      apiRequest('POST', '/api/admin/bulk/blog-posts', { action, ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.blogPosts() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.stats() });
    },
  });
};

export const useBulkProductOperation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ action, ids }: { action: string; ids: number[] }) =>
      apiRequest('POST', '/api/admin/bulk/products', { action, ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.products() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.stats() });
    },
  });
};

// Automation Control
export const useAutomationStatus = () => {
  return useQuery({
    queryKey: ADMIN_KEYS.automation(),
    queryFn: () => apiRequest('/api/automation/status'),
    refetchInterval: 30 * 1000, // Refresh every 30 seconds
  });
};

export const useToggleAutomation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (action: 'start' | 'stop') =>
      apiRequest('POST', `/api/automation/${action}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.automation() });
    },
  });
};

// Analytics Data
export const useAnalytics = (dateRange?: { from: Date; to: Date }) => {
  return useQuery({
    queryKey: [...ADMIN_KEYS.analytics(), dateRange],
    queryFn: () => apiRequest('/api/analytics', { params: dateRange }),
    enabled: !!dateRange,
  });
};

// Content Management
export const useAdminBlogPosts = (params: { page: number; pageSize: number; search?: string }) => {
  return useQuery({
    queryKey: ADMIN_KEYS.blogPosts(params),
    queryFn: () => apiRequest('/api/admin/blog-posts', { params }),
  });
};

export const useAdminProducts = (params: { page: number; pageSize: number; search?: string }) => {
  return useQuery({
    queryKey: ADMIN_KEYS.products(params),
    queryFn: () => apiRequest('/api/admin/products', { params }),
  });
};

export const useAdminChallenges = (params: { page: number; pageSize: number; search?: string }) => {
  return useQuery({
    queryKey: ADMIN_KEYS.challenges(params),
    queryFn: () => apiRequest('/api/admin/challenges', { params }),
  });
};