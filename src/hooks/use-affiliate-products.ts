
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AffiliateProductData {
  affiliate_products_uuid: string;
  product_uuid: string;
  expert_share: number;
  affiliate_share: number;
  status: string;
  type: string;
  questions: any;
  created_at: string;
  // Extended fields for display
  product_name?: string;
  product_price?: number;
  expert_name?: string;
  product_description?: string;
}

export function useAffiliateProducts(productUuid?: string) {
  return useQuery({
    queryKey: ['affiliate-products', productUuid],
    queryFn: async (): Promise<AffiliateProductData[]> => {
      if (!productUuid) return [];

      // Fetch affiliate products using product_uuid
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('affiliate_products')
        .select('*')
        .eq('product_uuid', productUuid)
        .eq('type', 'product');

      if (affiliateError) {
        console.error('Error fetching affiliate products:', affiliateError);
        throw affiliateError;
      }

      // Then get product details separately
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select(`
          name,
          tech_stack_price,
          description,
          user_uuid,
          experts(name)
        `)
        .eq('product_uuid', productUuid)
        .single();

      if (productError) {
        console.error('Error fetching product details:', productError);
      }

      return (affiliateData || []).map(item => ({
        affiliate_products_uuid: item.affiliate_products_uuid,
        product_uuid: item.product_uuid,
        expert_share: item.expert_share,
        affiliate_share: item.affiliate_share,
        status: item.status,
        type: item.type,
        questions: item.questions,
        created_at: item.created_at,
        product_name: productData?.name,
        product_price: productData?.tech_stack_price,
        expert_name: productData?.experts?.name,
        product_description: productData?.description
      }));
    },
    enabled: !!productUuid
  });
}
