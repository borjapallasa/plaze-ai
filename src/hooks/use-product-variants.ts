
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductVariant } from "@/types/Product";

export function useProductVariants(productUuid?: string) {
  return useQuery({
    queryKey: ['variants', productUuid],
    queryFn: async (): Promise<ProductVariant[]> => {
      console.log("Fetching variants for product:", productUuid);

      if (!productUuid) {
        return [];
      }

      const { data, error } = await supabase
        .from('variants')
        .select('*')
        .eq('product_uuid', productUuid)
        .order('price', { ascending: true });

      if (error) {
        console.error("Error fetching variants:", error);
        throw error;
      }

      console.log("Raw variants data from database:", data);
      console.log("Variants found:", data.length);

      return data.map((variant, index) => {
        // Handle JSONB tags field properly
        let parsedTags: string[] = [];
        if (variant.tags) {
          if (typeof variant.tags === 'string') {
            try {
              parsedTags = JSON.parse(variant.tags);
            } catch (e) {
              console.error('Error parsing tags JSON:', e);
              parsedTags = [];
            }
          } else if (Array.isArray(variant.tags)) {
            parsedTags = variant.tags.map(tag => String(tag));
          }
        }

        const mappedVariant = {
          id: variant.variant_uuid,
          name: variant.name || "Lorem Ipsum Package",
          price: variant.price || 99.99,
          comparePrice: variant.compare_price || 0, // Ensure compare_price is properly mapped
          label: "Package",
          highlight: variant.highlighted || index === 1,
          features: parsedTags.length > 0 
            ? parsedTags 
            : ["Core Features", "Basic Support"],
          tags: parsedTags,
          filesLink: variant.files_link || "",
          additionalDetails: variant.additional_details || "",
          // Include database fields for debugging
          variant_uuid: variant.variant_uuid,
          compare_price: variant.compare_price,
          files_link: variant.files_link,
          additional_details: variant.additional_details
        };

        console.log("Mapped variant:", mappedVariant);
        return mappedVariant;
      });
    },
    enabled: !!productUuid
  });
}
