
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCommunityMembers = (communityId?: string) => {
  return useQuery({
    queryKey: ['community-members', communityId],
    queryFn: async () => {
      if (!communityId) return [];
      
      console.log('Fetching community members for:', communityId);
      
      const { data, error } = await supabase
        .from('community_subscriptions')
        .select(`
          community_subscription_uuid,
          status,
          created_at,
          user_uuid,
          users!inner(
            user_uuid,
            first_name,
            last_name,
            user_thumbnail
          )
        `)
        .eq('community_uuid', communityId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching community members:', error);
        throw error;
      }

      console.log('Community members fetched:', data);
      return data || [];
    },
    enabled: !!communityId
  });
};
