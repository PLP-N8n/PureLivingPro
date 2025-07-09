import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface SubscriptionStatus {
  isPremium: boolean;
  status: 'none' | 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid';
  currentPeriodEnd?: number;
  trialEnd?: number;
}

export function useSubscription() {
  const { data: subscription, isLoading, error } = useQuery({
    queryKey: ["/api/subscription-status"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const subscriptionData = subscription as SubscriptionStatus;

  return {
    subscription: subscriptionData,
    isPremium: subscriptionData?.isPremium || false,
    isTrialing: subscriptionData?.status === 'trialing',
    isLoading,
    error,
    trialEndDate: subscriptionData?.trialEnd ? new Date(subscriptionData.trialEnd * 1000) : null,
    subscriptionEndDate: subscriptionData?.currentPeriodEnd ? new Date(subscriptionData.currentPeriodEnd * 1000) : null,
  };
}

export async function cancelSubscription() {
  return apiRequest("POST", "/api/cancel-subscription");
}