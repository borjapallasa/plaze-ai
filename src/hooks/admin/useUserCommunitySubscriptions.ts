
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CommunitySubscription {
  community_subscription_uuid: string;
  community_uuid: string;
  status: string;
  created_at: string;
  amount: number;
  cancelled_at?: string;
  communities?: {
    name: string;
    title: string;
  };
  experts?: {
    name: string;
  };
}

export function useUserCommunitySubscriptions(userId: string | undefined) {
  return useQuery({
    queryKey: ['user-community-subscriptions', userId],
    queryFn: async (): Promise<CommunitySubscription[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('community_subscriptions')
        .select(`
          community_subscription_uuid,
          community_uuid,
          status,
          created_at,
          amount,
          cancelled_at,
          communities:community_uuid (
            name,
            title
          ),
          experts:expert_user_uuid (
            name
          )
        `)
        .eq('user_uuid', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId
  });
}
