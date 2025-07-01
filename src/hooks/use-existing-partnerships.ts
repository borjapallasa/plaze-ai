
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export function useExistingPartnerships() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['existing-partnerships', user?.id],
    queryFn: async (): Promise<string[]> => {
      if (!user?.id) {
        return [];
      }

      // First get the affiliate_uuid for the authenticated user
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('affiliates')
        .select('affiliate_uuid')
        .eq('user_uuid', user.id)
        .maybeSingle();

      if (affiliateError || !affiliateData?.affiliate_uuid) {
        return [];
      }

      // Get existing partnerships to filter out
      const { data: partnerships, error: partnershipsError } = await supabase
        .from('affiliate_partnerships')
        .select('affiliate_product_uuid')
        .eq('affiliate_uuid', affiliateData.affiliate_uuid);

      if (partnershipsError) {
        console.error('Error fetching existing partnerships:', partnershipsError);
        return [];
      }

      return partnerships?.map(p => p.affiliate_product_uuid).filter(Boolean) || [];
    },
    enabled: !!user?.id,
  });
}
