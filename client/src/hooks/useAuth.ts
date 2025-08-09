import { useQuery } from "@tanstack/react-query";

import type { User } from '@/types/models';
export function useAuth(): { user: User | null; isLoading: boolean; isAuthenticated: boolean } {
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
  };
}
