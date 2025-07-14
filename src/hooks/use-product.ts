import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductData {
  id: number;
  product_uuid: string;
  user_uuid: string;
  name: string;
  description: string;
  price_from: number;
  price_to: number;
  thumbnail: string;
  status: string;
  created_at: string;
  updated_at: string;
  demo_url: string;
  additional_details: string;
  expert_uuid: string;
  community_product_uuid: string;
  product_includes: string;
  public_link: string;
  related_products: any[];
  review_count: number;
  sales_amount: number;
  sales_count: number;
  slug: string;
  video_url: string;
}

const mapProductData = (data: any): ProductData => ({
  id: data.id,
  product_uuid: data.product_uuid,
  user_uuid: data.user_uuid,
  name: data.name || '',
  description: data.description || '',
  price_from: data.price_from || 0,
  price_to: data.price_to || 0,
  thumbnail: data.thumbnail || '',
  status: data.status || 'draft',
  created_at: data.created_at || '',
  updated_at: data.updated_at || '',
  demo_url: data.demo_url || '',
  additional_details: data.additional_details || '',
  expert_uuid: data.expert_uuid || '',
  community_product_uuid: data.community_product_uuid || '',
  product_includes: data.product_includes || '',
  public_link: data.public_link || null,
  related_products: data.related_products || [],
  review_count: data.review_count || null,
  sales_amount: data.sales_amount || null,
  sales_count: data.sales_count || null,
  slug: data.slug || '',
  video_url: data.video_url || '',
});

export const useProduct = (productId: string | undefined) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) return null;
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_uuid', productId)
        .single();

      if (error) throw error;
      return mapProductData(data);
    },
    enabled: !!productId,
  });
};
