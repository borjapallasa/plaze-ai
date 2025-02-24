
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useVariants = (productId?: string) => {
  return useQuery({
    queryKey: ['variants', productId],
    queryFn: async () => {
      if (!productId) throw new Error("No product ID provided");

      const { data, error } = await supabase
        .from('variants')
        .select('*')
        .eq('product_uuid', productId);
        
      if (error) {
        console.error('Variants fetch error:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!productId
  });
};
