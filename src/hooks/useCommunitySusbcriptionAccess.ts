
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

interface CommunitySubscriptionAccess {
  hasAccess: boolean;
  status: string | null;
  subscription: any;
  loading: boolean;
  error: Error | null;
}

export const useCommunitySusbcriptionAccess = (communityId?: string): CommunitySubscriptionAccess => {
  const { user } = useAuth();

  const { data: subscription, isLoading, error } = useQuery({
    queryKey: ['community-subscription-access', user?.id, communityId],
    queryFn: async () => {
      if (!user?.id || !communityId) return null;
      
      const { data, error } = await supabase
        .from('community_subscriptions')
        .select('status, community_subscription_uuid, created_at')
        .eq('user_uuid', user.id)
        .eq('community_uuid', communityId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id && !!communityId
  });

  const hasAccess = subscription?.status === 'active';
  const status = subscription?.status || null;

  return {
    hasAccess,
    status,
    subscription,
    loading: isLoading,
    error: error as Error | null
  };
};
