
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

      console.log("Variants found:", data.length);

      return data.map((variant, index) => ({
        id: variant.variant_uuid,
        name: variant.name || "Lorem Ipsum Package",
        price: variant.price || 99.99,
        comparePrice: variant.compare_price || 149.99,
        label: "Package",
        highlight: variant.highlighted || index === 1,
        features: Array.isArray(variant.tags)
          ? variant.tags.map(tag => String(tag))
          : ["Core Features", "Basic Support"],
        filesLink: variant.files_link || undefined,
        additionalDetails: variant.additional_details || undefined
      }));
    },
    enabled: !!productUuid
  });
}
