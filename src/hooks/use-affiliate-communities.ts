
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AffiliateCommunityData {
  affiliate_products_uuid: string;
  product_uuid: string;
  expert_share: number;
  affiliate_share: number;
  status: string;
  type: string;
  questions: any;
  created_at: string;
  // Extended fields for display
  community_name?: string;
  community_price?: number;
  expert_name?: string;
  community_description?: string;
}

export function useAffiliateCommunities(communityUuid?: string) {
  return useQuery({
    queryKey: ['affiliate-communities', communityUuid],
    queryFn: async (): Promise<AffiliateCommunityData[]> => {
      if (!communityUuid) return [];

      const { data, error } = await supabase
        .from('affiliate_products')
        .select(`
          *,
          communities!inner(
            name,
            price,
            description,
            user_uuid,
            experts(name)
          )
        `)
        .eq('product_uuid', communityUuid)
        .eq('type', 'community');

      if (error) {
        console.error('Error fetching affiliate communities:', error);
        throw error;
      }

      return (data || []).map(item => ({
        affiliate_products_uuid: item.affiliate_products_uuid,
        product_uuid: item.product_uuid,
        expert_share: item.expert_share,
        affiliate_share: item.affiliate_share,
        status: item.status,
        type: item.type,
        questions: item.questions,
        created_at: item.created_at,
        community_name: item.communities?.name,
        community_price: item.communities?.price,
        expert_name: item.communities?.experts?.name,
        community_description: item.communities?.description
      }));
    },
    enabled: !!communityUuid
  });
}
