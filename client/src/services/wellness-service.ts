// Wellness Service - TanStack Query hooks for wellness data
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

// Query Keys
export const WELLNESS_KEYS = {
  all: ['wellness'] as const,
  plans: () => [...WELLNESS_KEYS.all, 'plans'] as const,
  plan: (id: string) => [...WELLNESS_KEYS.plans(), id] as const,
  userProfile: () => [...WELLNESS_KEYS.all, 'profile'] as const,
  moodAnalysis: () => [...WELLNESS_KEYS.all, 'mood'] as const,
  aiCoach: () => [...WELLNESS_KEYS.all, 'ai-coach'] as const,
};

// Wellness Plan Queries
export const useWellnessPlans = () => {
  return useQuery({
    queryKey: WELLNESS_KEYS.plans(),
    queryFn: () => apiRequest('/api/wellness/plans'),
  });
};

export const useWellnessPlan = (id: string) => {
  return useQuery({
    queryKey: WELLNESS_KEYS.plan(id),
    queryFn: () => apiRequest(`/api/wellness/plans/${id}`),
    enabled: !!id,
  });
};

// Generate Wellness Plan Mutation
export const useGenerateWellnessPlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (profileData: any) => 
      apiRequest('POST', '/api/wellness/generate-plan', profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WELLNESS_KEYS.plans() });
    },
  });
};

// Mood Analysis
export const useMoodAnalysis = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (moodData: { mood: string; energy: string; activities?: string[] }) =>
      apiRequest('POST', '/api/wellness/analyze-mood', moodData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WELLNESS_KEYS.moodAnalysis() });
    },
  });
};

// AI Coach Chat
export const useAICoach = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (chatData: { message: string; context?: string }) =>
      apiRequest('POST', '/api/wellness/ai-chat', chatData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WELLNESS_KEYS.aiCoach() });
    },
  });
};

// User Wellness Profile
export const useWellnessProfile = () => {
  return useQuery({
    queryKey: WELLNESS_KEYS.userProfile(),
    queryFn: () => apiRequest('/api/user/wellness-profile'),
  });
};

export const useUpdateWellnessProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (profileData: any) =>
      apiRequest('PUT', '/api/user/wellness-profile', profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WELLNESS_KEYS.userProfile() });
    },
  });
};

// Personalized Content
export const usePersonalizedContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (contentRequest: { contentType: 'article' | 'tip' | 'recommendation' }) =>
      apiRequest('POST', '/api/wellness/personalized-content', contentRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WELLNESS_KEYS.all });
    },
  });
};