
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
        // Simplified query without joins to avoid RLS recursion issues
        const { data: relatedProductsData, error } = await supabase
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

        if (error) {
          console.error("Error fetching related products:", error);
          throw error;
        }
        
        console.log("Found related products:", relatedProductsData?.length || 0);
        
        // Get variants for each related product separately
        const processedData = [];
        
        if (relatedProductsData && relatedProductsData.length > 0) {
          for (const rel of relatedProductsData) {
            const product = rel.products;
            
            if (product) {
              // Fetch ALL variants for this product instead of limiting to 1
              const { data: variants, error: variantsError } = await supabase
                .from('variants')
                .select('variant_uuid, name, price, tags, files_link')
                .eq('product_uuid', rel.related_product_uuid);

              if (variantsError) {
                console.error("Error fetching variants:", variantsError);
              }

              // Process all variants if available, otherwise create default
              if (variants && variants.length > 0) {
                variants.forEach(variant => {
                  processedData.push({
                    related_product_uuid: rel.related_product_uuid,
                    related_product_name: product.name || '',
                    related_product_price_from: product.price_from || 0,
                    variant_uuid: variant.variant_uuid,
                    variant_name: variant.name || "Default Option",
                    variant_price: variant.price || 0,
                    variant_tags: variant.tags,
                    variant_files_link: variant.files_link
                  });
                });
              } else {
                // Create default variant data
                processedData.push({
                  related_product_uuid: rel.related_product_uuid,
                  related_product_name: product.name || '',
                  related_product_price_from: product.price_from || 0,
                  variant_uuid: `default-${rel.related_product_uuid}`,
                  variant_name: "Default Option",
                  variant_price: product.price_from || 0,
                  variant_tags: null,
                  variant_files_link: null
                });
              }
            }
          }
        }
        
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
