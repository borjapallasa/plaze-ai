
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CommunityProductData {
  community_product_uuid: string;
  community_uuid: string;
  expert_uuid: string;
  product_type: string;
  name: string;
  files_link: string | null;
  product_uuid: string;
  price: number | null;
  created_at: string;
  community: {
    name: string;
  };
}

export function useCommunityProducts(productUuid: string | undefined) {
  return useQuery({
    queryKey: ['community-products', productUuid],
    queryFn: async (): Promise<CommunityProductData[]> => {
      if (!productUuid) return [];

      const { data, error } = await supabase
        .from('community_products')
        .select(`
          community_product_uuid,
          community_uuid,
          expert_uuid,
          product_type,
          name,
          files_link,
          product_uuid,
          price,
          created_at,
          community:communities(name)
        `)
        .eq('product_uuid', productUuid);

      if (error) {
        console.error('Error fetching community products:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!productUuid
  });
}
