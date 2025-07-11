
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCommunityProducts(productUuid?: string) {
  return useQuery({
    queryKey: ['communityProducts', productUuid],
    queryFn: async () => {
      if (!productUuid) return [];
      
      console.log('Fetching community products for product UUID:', productUuid);
      
      const { data, error } = await supabase
        .from('community_products')
        .select(`
          *,
          community:communities(
            name,
            community_uuid
          )
        `)
        .eq('product_uuid', productUuid);

      if (error) {
        console.error('Error fetching community products:', error);
        throw error;
      }

      console.log('Community products data:', data);
      return data || [];
    },
    enabled: !!productUuid
  });
}
