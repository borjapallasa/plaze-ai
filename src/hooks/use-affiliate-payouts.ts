
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

interface AffiliatePayout {
  payout_uuid: string;
  created_at: string;
  amount: number;
  status: string;
  method: string;
}

export function useAffiliatePayouts() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['affiliate-payouts', user?.id],
    queryFn: async (): Promise<AffiliatePayout[]> => {
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

      // Fetch payouts for this affiliate
      const { data, error } = await supabase
        .from('payouts')
        .select('payout_uuid, created_at, amount, status, method')
        .eq('type', 'affiliate')
        .eq('affiliate_uuid', affiliateData.affiliate_uuid)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching affiliate payouts:', error);
        throw error;
      }

      return data?.map(payout => ({
        payout_uuid: payout.payout_uuid,
        created_at: new Date(payout.created_at).toLocaleDateString(),
        amount: payout.amount || 0,
        status: payout.status || 'unknown',
        method: payout.method || 'unknown'
      })) || [];
    },
    enabled: !!user?.id,
  });
}
