
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useExpertCommunities(expert_uuid: string | undefined) {
  return useQuery({
    queryKey: ['expert-communities', expert_uuid],
    queryFn: async () => {
      if (!expert_uuid) return [];

      const { data, error } = await supabase
        .from('communities')
        .select(`
          community_uuid,
          name,
          intro,
          description,
          type,
          price,
          member_count,
          paid_member_count,
          monthly_recurring_revenue,
          thumbnail,
          created_at,
          product_count,
          classroom_count,
          post_count
        `)
        .eq('expert_uuid', expert_uuid);

      if (error) {
        console.error('Error fetching communities:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!expert_uuid
  });
}
