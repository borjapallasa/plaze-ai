
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useProductVariants(productUuid?: string) {
  return useQuery({
    queryKey: ['productVariants', productUuid],
    queryFn: async () => {
      if (!productUuid) return [];

      const { data, error } = await supabase
        .from('variants')
        .select('*')
        .eq('product_uuid', productUuid)
        .order('price', { ascending: true });

      if (error) throw error;

      return (data || []).map(variant => ({
        id: variant.variant_uuid,
        name: variant.name || "",
        price: variant.price || 0,
        comparePrice: variant.compare_price || 0,
        highlight: variant.highlighted || false,
        tags: Array.isArray(variant.tags) ? variant.tags : [],
        filesLink: variant.files_link || "",
        additionalDetails: variant.additional_details || "",
        label: variant.name || ""
      }));
    },
    enabled: !!productUuid
  });
}
