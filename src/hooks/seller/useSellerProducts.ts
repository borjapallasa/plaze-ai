
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSellerProducts(expertUuid: string | undefined) {
  return useQuery({
    queryKey: ['sellerProducts', expertUuid],
    queryFn: async () => {
      if (!expertUuid) return [];
      
      console.log('Fetching products for expert_uuid:', expertUuid);
      const { data, error } = await supabase
        .from('products')
        .select(`
          name,
          status,
          variant_count,
          price_from,
          created_at,
          thumbnail,
          product_uuid
        `)
        .eq('expert_uuid', expertUuid);

      if (error) {
        console.error('Error fetching seller products:', error);
        throw error;
      }

      console.log('Fetched products:', data);
      return data || [];
    },
    enabled: !!expertUuid
  });
}
