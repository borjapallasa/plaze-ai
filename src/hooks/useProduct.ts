
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProduct = (productId?: string) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) throw new Error("No product ID provided");
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_uuid', productId)
        .maybeSingle();
        
      if (error) {
        console.error('Product fetch error:', error);
        throw error;
      }
      return data;
    },
    enabled: !!productId
  });
};
