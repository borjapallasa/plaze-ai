
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCommunityProducts(productUuid?: string) {
  return useQuery({
    queryKey: ['communityProducts', productUuid],
    queryFn: async () => {
      if (!productUuid) return [];
      
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

      return data || [];
    },
    enabled: !!productUuid
  });
}
