
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CommunitySubscription {
  community_subscription_uuid: string;
  community_uuid: string;
  status: "active" | "inactive" | "pending";
  created_at: string;
  amount: number;
  total_amount: number;
  cancelled_at: string | null;
  communities: {
    name: string;
    thumbnail: string | null;
  };
  experts: {
    name: string;
  };
}

export function useUserCommunitySubscriptions(userId: string | undefined) {
  return useQuery({
    queryKey: ['userCommunitySubscriptions', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('community_subscriptions')
        .select(`
          community_subscription_uuid,
          community_uuid,
          status,
          created_at,
          amount,
          total_amount,
          cancelled_at,
          communities (
            name,
            thumbnail
          ),
          experts (
            name
          )
        `)
        .eq('user_uuid', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user community subscriptions:', error);
        throw error;
      }

      // Transform the data to match our interface, handling potential missing data
      return data?.map(subscription => ({
        community_subscription_uuid: subscription.community_subscription_uuid,
        community_uuid: subscription.community_uuid,
        status: subscription.status,
        created_at: subscription.created_at,
        amount: subscription.amount || 0,
        total_amount: subscription.total_amount || 0,
        cancelled_at: subscription.cancelled_at,
        communities: {
          name: subscription.communities?.name || 'Unknown Community',
          thumbnail: subscription.communities?.thumbnail || null,
        },
        experts: {
          name: subscription.experts?.name || 'Unknown Expert',
        }
      })) as CommunitySubscription[] || [];
    },
    enabled: !!userId,
  });
}
