
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useRelatedProducts(productUuid?: string) {
  return useQuery({
    queryKey: ["relatedProducts", productUuid],
    queryFn: async () => {
      if (!productUuid) {
        return [];
      }
      
      // First, try to get related products with the RPC function
      try {
        const { data: relatedProductsWithVariants, error } = await supabase
          .rpc('get_related_products_with_variants', { product_uuid_input: productUuid });

        if (error) {
          console.error("Error fetching related products from RPC:", error);
          throw error;
        }
        
        console.log("Found related products from RPC:", relatedProductsWithVariants?.length || 0);
        
        return relatedProductsWithVariants || [];
      } catch (rpcError) {
        // If RPC fails, fall back to direct query
        console.warn("RPC failed, falling back to direct query:", rpcError);
        
        const { data: relationships, error: relError } = await supabase
          .from('product_relationships')
          .select(`
            related_product_uuid,
            products!product_relationships_related_product_uuid_fkey (
              product_uuid,
              name,
              price_from
            )
          `)
          .eq('product_uuid', productUuid);
          
        if (relError) {
          console.error("Error in fallback query:", relError);
          throw relError;
        }
        
        // Transform the data to match the RPC output format
        const transformedData = relationships?.map(rel => ({
          related_product_uuid: rel.related_product_uuid,
          related_product_name: rel.products?.name || '',
          related_product_price_from: rel.products?.price_from || 0,
          variant_uuid: null,
          variant_name: null,
          variant_price: null,
          variant_tags: null,
          variant_files_link: null
        })) || [];
        
        console.log("Found related products from fallback:", transformedData.length);
        return transformedData;
      }
    },
    enabled: !!productUuid,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
}
