
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AffiliateProductData {
  affiliate_products_uuid: string;
  product_uuid: string;
  expert_share: number;
  affiliate_share: number;
  status: string;
  type: string;
  created_at: string;
}

export function useAffiliateProducts(productUuid: string | undefined) {
  return useQuery({
    queryKey: ['affiliate-products', productUuid],
    queryFn: async (): Promise<AffiliateProductData[]> => {
      if (!productUuid) return [];

      const { data, error } = await supabase
        .from('affiliate_products')
        .select('*')
        .eq('product_uuid', productUuid);

      if (error) {
        console.error('Error fetching affiliate products:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!productUuid
  });
}
