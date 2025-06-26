
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export function useUserProducts() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userProducts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // First get the expert_uuid for the current user
      const { data: expertData, error: expertError } = await supabase
        .from('experts')
        .select('expert_uuid')
        .eq('user_uuid', user.id)
        .maybeSingle();

      if (expertError) {
        console.error('Error fetching expert data:', expertError);
        return [];
      }

      if (!expertData) {
        console.log('No expert profile found for user');
        return [];
      }

      // Then fetch products for this expert where community_product_uuid is empty
      const { data, error } = await supabase
        .from('products')
        .select(`
          product_uuid,
          name,
          price_from,
          thumbnail,
          status,
          created_at
        `)
        .eq('expert_uuid', expertData.expert_uuid)
        .eq('status', 'active')
        .is('community_product_uuid', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user products:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id
  });
}
