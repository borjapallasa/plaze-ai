
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCommunityProduct(communityProductUuid?: string) {
  return useQuery({
    queryKey: ['communityProduct', communityProductUuid],
    queryFn: async () => {
      if (!communityProductUuid) return null;
      
      console.log('Fetching community product data for UUID:', communityProductUuid);
      
      const { data, error } = await supabase
        .from('community_products')
        .select(`
          *,
          products!community_products_product_uuid_fkey (
            name,
            description,
            thumbnail
          ),
          experts (
            name,
            thumbnail,
            client_satisfaction,
            created_at
          )
        `)
        .eq('community_product_uuid', communityProductUuid)
        .single();

      if (error) {
        console.error('Error fetching community product:', error);
        throw error;
      }

      console.log('Community product data:', data);
      return data;
    },
    enabled: !!communityProductUuid
  });
}
