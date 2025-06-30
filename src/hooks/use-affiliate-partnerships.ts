
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

interface AffiliatePartnership {
  affiliate_partnership_uuid: string;
  name: string;
  type: string;
  expert_uuid: string;
  created_at: string;
  revenue: number;
  affiliate_link: string;
}

export function useAffiliatePartnerships() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['affiliate-partnerships', user?.id],
    queryFn: async (): Promise<AffiliatePartnership[]> => {
      if (!user?.id) {
        throw new Error('No authenticated user');
      }

      // First get the affiliate_uuid for the authenticated user
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('affiliates')
        .select('affiliate_uuid')
        .eq('user_uuid', user.id)
        .maybeSingle();

      if (affiliateError) {
        console.error('Error fetching affiliate data:', affiliateError);
        throw affiliateError;
      }

      if (!affiliateData?.affiliate_uuid) {
        return [];
      }

      // Fetch partnerships for this affiliate
      const { data, error } = await supabase
        .from('affiliate_partnerships')
        .select('*')
        .eq('affiliate_uuid', affiliateData.affiliate_uuid)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching affiliate partnerships:', error);
        throw error;
      }

      return data?.map(partnership => ({
        affiliate_partnership_uuid: partnership.affiliate_partnership_uuid,
        name: partnership.name || 'Unnamed Partnership',
        type: partnership.type || 'product',
        expert_uuid: partnership.expert_uuid || '',
        created_at: new Date(partnership.created_at).toLocaleDateString(),
        revenue: partnership.revenue || 0,
        affiliate_link: partnership.affiliate_link || ''
      })) || [];
    },
    enabled: !!user?.id,
  });
}
