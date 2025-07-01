
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
  questions: string[];
  // Extended fields for display
  product_name?: string;
  product_price_from?: number;
  product_thumbnail?: string;
  expert_name?: string;
  product_description?: string;
}

export function useAffiliateProducts(productUuid?: string) {
  return useQuery({
    queryKey: ['affiliate-products', productUuid],
    queryFn: async (): Promise<AffiliateProductData[]> => {
      if (!productUuid) return [];

      const { data, error } = await supabase
        .from('affiliate_products')
        .select(`
          *,
          products!inner(
            name,
            price_from,
            thumbnail,
            description,
            expert_uuid,
            experts(name)
          )
        `)
        .eq('product_uuid', productUuid);

      if (error) {
        console.error('Error fetching affiliate products:', error);
        throw error;
      }

      console.log('Raw affiliate products from database:', data);

      return (data || []).map(item => ({
        affiliate_products_uuid: item.affiliate_products_uuid,
        product_uuid: item.product_uuid,
        expert_share: item.expert_share,
        affiliate_share: item.affiliate_share,
        status: item.status,
        type: item.type,
        created_at: item.created_at,
        questions: Array.isArray(item.questions) 
          ? item.questions.map((q: any) => typeof q === 'string' ? q : String(q))
          : [],
        product_name: item.products?.name,
        product_price_from: item.products?.price_from,
        product_thumbnail: item.products?.thumbnail,
        expert_name: item.products?.experts?.name,
        product_description: item.products?.description
      }));
    },
    enabled: !!productUuid
  });
}

// Hook for fetching all affiliate products (for affiliates page)
export function useAllAffiliateProducts() {
  return useQuery({
    queryKey: ['all-affiliate-products'],
    queryFn: async (): Promise<AffiliateProductData[]> => {
      const { data, error } = await supabase
        .from('affiliate_products')
        .select(`
          *,
          products!inner(
            name,
            price_from,
            thumbnail,
            description,
            expert_uuid,
            experts(name)
          )
        `);

      if (error) {
        console.error('Error fetching all affiliate products:', error);
        throw error;
      }

      return (data || []).map(item => ({
        affiliate_products_uuid: item.affiliate_products_uuid,
        product_uuid: item.product_uuid,
        expert_share: item.expert_share,
        affiliate_share: item.affiliate_share,
        status: item.status,
        type: item.type,
        created_at: item.created_at,
        questions: Array.isArray(item.questions) 
          ? item.questions.map((q: any) => typeof q === 'string' ? q : String(q))
          : [],
        product_name: item.products?.name,
        product_price_from: item.products?.price_from,
        product_thumbnail: item.products?.thumbnail,
        expert_name: item.products?.experts?.name,
        product_description: item.products?.description
      }));
    }
  });
}
