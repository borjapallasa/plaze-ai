
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useRelatedProducts(productUuid?: string) {
  return useQuery({
    queryKey: ["relatedProducts", productUuid],
    queryFn: async () => {
      if (!productUuid) {
        return [];
      }
      
      const { data: relatedProductsWithVariants, error } = await supabase
        .rpc('get_related_products_with_variants', { product_uuid_input: productUuid });

      if (error) {
        console.error("Error fetching related products:", error);
        throw error;
      }
      
      console.log("Found related products:", relatedProductsWithVariants?.length || 0);
      
      return relatedProductsWithVariants || [];
    },
    enabled: !!productUuid
  });
}
