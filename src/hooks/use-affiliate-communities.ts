
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AffiliateCommunityData {
  affiliate_products_uuid: string;
  community_uuid: string;
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

      // Fetch affiliate products using community_uuid
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('affiliate_products')
        .select('*')
        .eq('community_uuid', communityUuid)
        .eq('type', 'community');

      if (affiliateError) {
        console.error('Error fetching affiliate products:', affiliateError);
        throw affiliateError;
      }

      // Then get community details separately
      const { data: communityData, error: communityError } = await supabase
        .from('communities')
        .select(`
          name,
          price,
          description,
          user_uuid,
          experts(name)
        `)
        .eq('community_uuid', communityUuid)
        .single();

      if (communityError) {
        console.error('Error fetching community details:', communityError);
      }

      return (affiliateData || []).map(item => ({
        affiliate_products_uuid: item.affiliate_products_uuid,
        community_uuid: item.community_uuid,
        expert_share: item.expert_share,
        affiliate_share: item.affiliate_share,
        status: item.status,
        type: item.type,
        questions: item.questions,
        created_at: item.created_at,
        community_name: communityData?.name,
        community_price: communityData?.price,
        expert_name: communityData?.experts?.name,
        community_description: communityData?.description
      }));
    },
    enabled: !!communityUuid
  });
}
