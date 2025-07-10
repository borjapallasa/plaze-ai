
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AffiliateProductData {
  affiliate_products_uuid: string;
  product_uuid?: string;
  community_uuid?: string;
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
  // Community-specific fields
  community_name?: string;
  community_price?: number;
  community_thumbnail?: string;
  community_description?: string;
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
        .eq('product_uuid', productUuid)
        .eq('status', 'active');

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
      // Fetch product-based affiliate products
      const { data: productAffiliates, error: productError } = await supabase
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
        .eq('status', 'active')
        .not('product_uuid', 'is', null);

      if (productError) {
        console.error('Error fetching product affiliate products:', productError);
        throw productError;
      }

      // Fetch community-based affiliate products
      const { data: communityAffiliates, error: communityError } = await supabase
        .from('affiliate_products')
        .select(`
          *,
          communities!inner(
            name,
            price,
            thumbnail,
            description,
            expert_uuid,
            experts(name)
          )
        `)
        .eq('status', 'active')
        .not('community_uuid', 'is', null);

      if (communityError) {
        console.error('Error fetching community affiliate products:', communityError);
        throw communityError;
      }

      // Transform product-based affiliates
      const transformedProductAffiliates = (productAffiliates || []).map(item => ({
        affiliate_products_uuid: item.affiliate_products_uuid,
        product_uuid: item.product_uuid,
        expert_share: item.expert_share,
        affiliate_share: item.affiliate_share,
        status: item.status,
        type: item.type || 'product',
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

      // Transform community-based affiliates
      const transformedCommunityAffiliates = (communityAffiliates || []).map(item => ({
        affiliate_products_uuid: item.affiliate_products_uuid,
        community_uuid: item.community_uuid,
        expert_share: item.expert_share,
        affiliate_share: item.affiliate_share,
        status: item.status,
        type: item.type || 'community',
        created_at: item.created_at,
        questions: Array.isArray(item.questions) 
          ? item.questions.map((q: any) => typeof q === 'string' ? q : String(q))
          : [],
        community_name: item.communities?.name,
        community_price: item.communities?.price,
        community_thumbnail: item.communities?.thumbnail,
        expert_name: item.communities?.experts?.name,
        community_description: item.communities?.description
      }));

      // Combine both types
      return [...transformedProductAffiliates, ...transformedCommunityAffiliates];
    }
  });
}
