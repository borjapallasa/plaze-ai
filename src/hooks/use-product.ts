
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductData } from "@/types/Product";

interface UseProductParams {
  productId?: string;
  productSlug?: string;
}

export function useProduct({ productId, productSlug }: UseProductParams) {
  return useQuery({
    queryKey: ["product", productId, productSlug],
    queryFn: async (): Promise<ProductData | null> => {
      console.log("Fetching product with ID:", productId, "or slug:", productSlug);
      
      let query = supabase.from("products").select("*");
      
      if (productId) {
        query = query.eq("product_uuid", productId);
      } else if (productSlug) {
        query = query.eq("slug", productSlug);
      } else {
        throw new Error("Either productId or productSlug must be provided");
      }
      
      const { data, error } = await query.maybeSingle();
      
      if (error) {
        console.error("Error fetching product:", error);
        throw error;
      }
      
      console.log("Fetched product:", data);
      return data;
    },
    enabled: !!(productId || productSlug),
  });
}
