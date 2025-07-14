
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UseProductParams {
  productId?: string;
  productSlug?: string;
}

export function useProduct(params: UseProductParams | string) {
  // Handle both old string parameter and new object parameter
  const productId = typeof params === 'string' ? params : params?.productId;
  const productSlug = typeof params === 'string' ? undefined : params?.productSlug;

  return useQuery({
    queryKey: ['product', productId, productSlug],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          experts (
            name,
            thumbnail,
            client_satisfaction,
            created_at,
            slug
          )
        `);

      if (productId) {
        query = query.eq('product_uuid', productId);
      } else if (productSlug) {
        query = query.eq('slug', productSlug);
      } else {
        throw new Error('Either productId or productSlug must be provided');
      }

      const { data, error } = await query.single();

      if (error) throw error;
      return data;
    },
    enabled: !!(productId || productSlug)
  });
}
