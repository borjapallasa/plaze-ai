
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export function useAffiliateData() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['affiliate-data', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('No authenticated user');
      }

      console.log('Fetching affiliate data for user:', user.id);
      
      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_uuid', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching affiliate data:', error);
        throw error;
      }

      console.log('Affiliate data:', data);
      return data;
    },
    enabled: !!user?.id,
  });
}
