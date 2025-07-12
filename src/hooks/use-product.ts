
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductData } from "@/types/Product";

interface UseProductParams {
  productId?: string;
  productSlug?: string;
}

export function useProduct({ productId, productSlug }: UseProductParams = {}) {
  return useQuery({
    queryKey: ["product", productId, productSlug],
    queryFn: async (): Promise<ProductData | null> => {
      console.log("useProduct query function called with:", { productId, productSlug });
      
      if (!productId && !productSlug) {
        console.log("No productId or productSlug provided");
        return null;
      }

      let query = supabase.from('products').select('*');
      
      if (productId) {
        query = query.eq('product_uuid', productId);
      } else if (productSlug) {
        query = query.eq('slug', productSlug);
      }

      const { data, error } = await query.single();

      if (error) {
        console.error("Error fetching product:", error);
        throw error;
      }

      console.log("Fetched product data:", data);
      return data as ProductData;
    },
    enabled: !!(productId || productSlug),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
