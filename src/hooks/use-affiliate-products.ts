
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AffiliateProduct {
  affiliate_products_uuid: string;
  product_uuid: string;
  affiliate_share: number;
  expert_share: number;
  status: string;
  created_at: string;
  // Product details from joined query
  product_name: string;
  product_description: string;
  product_thumbnail: string;
  product_price_from: number;
  expert_name: string;
  product_slug: string;
}

export function useAffiliateProducts() {
  return useQuery({
    queryKey: ['affiliate-products'],
    queryFn: async (): Promise<AffiliateProduct[]> => {
      console.log('Fetching affiliate products with status active');
      
      const { data: affiliateProducts, error } = await supabase
        .from('affiliate_products')
        .select(`
          affiliate_products_uuid,
          product_uuid,
          affiliate_share,
          expert_share,
          status,
          created_at,
          products!inner(
            name,
            description,
            thumbnail,
            price_from,
            slug,
            expert_uuid,
            experts(
              name
            )
          )
        `)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching affiliate products:', error);
        throw error;
      }

      console.log('Affiliate products found:', affiliateProducts);

      if (!affiliateProducts || affiliateProducts.length === 0) {
        return [];
      }

      return affiliateProducts.map((item) => ({
        affiliate_products_uuid: item.affiliate_products_uuid,
        product_uuid: item.product_uuid,
        affiliate_share: item.affiliate_share || 0,
        expert_share: item.expert_share || 0,
        status: item.status,
        created_at: item.created_at,
        product_name: item.products?.name || '',
        product_description: item.products?.description || '',
        product_thumbnail: item.products?.thumbnail || '',
        product_price_from: item.products?.price_from || 0,
        expert_name: item.products?.experts?.name || '',
        product_slug: item.products?.slug || '',
      }));
    },
  });
}
