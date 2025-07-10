
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useRelatedProducts(productUuid?: string) {
  return useQuery({
    queryKey: ["relatedProducts", productUuid],
    queryFn: async () => {
      if (!productUuid) {
        return [];
      }
      
      try {
        // Use a direct query with proper joins to avoid RLS recursion issues
        const { data: relatedProductsData, error } = await supabase
          .from('product_relationships')
          .select(`
            related_product_uuid,
            products!product_relationships_related_product_uuid_fkey (
              product_uuid,
              name,
              price_from
            ),
            variants!inner (
              variant_uuid,
              name,
              price,
              tags,
              files_link
            )
          `)
          .eq('product_uuid', productUuid);

        if (error) {
          console.error("Error fetching related products:", error);
          throw error;
        }
        
        console.log("Found related products:", relatedProductsData?.length || 0);
        
        // Process the data to ensure each product has at least one variant
        const processedData = relatedProductsData?.map(rel => {
          const product = rel.products;
          const variants = rel.variants;
          
          // If the product has variants, use the first one
          if (variants && variants.length > 0) {
            const variant = variants[0];
            return {
              related_product_uuid: rel.related_product_uuid,
              related_product_name: product?.name || '',
              related_product_price_from: product?.price_from || 0,
              variant_uuid: variant.variant_uuid,
              variant_name: variant.name || "Default Option",
              variant_price: variant.price || 0,
              variant_tags: variant.tags,
              variant_files_link: variant.files_link
            };
          }
          
          // If no variants, create a default one
          return {
            related_product_uuid: rel.related_product_uuid,
            related_product_name: product?.name || '',
            related_product_price_from: product?.price_from || 0,
            variant_uuid: `default-${rel.related_product_uuid}`,
            variant_name: "Default Option",
            variant_price: product?.price_from || 0,
            variant_tags: null,
            variant_files_link: null
          };
        }) || [];
        
        return processedData;
      } catch (error) {
        console.error("Error fetching related products:", error);
        // Return empty array on error instead of throwing
        return [];
      }
    },
    enabled: !!productUuid,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false, // Reduce unnecessary refetches
    retry: 1 // Reduce retries to avoid spam
  });
}
