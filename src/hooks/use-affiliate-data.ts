
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

interface AffiliateData {
  id: number;
  created_at: string;
  affiliate_uuid: string;
  email: string;
  status: string;
  affiliate_code: string;
  paypal: string;
  commissions_made: number;
  commissions_available: number;
  commissions_paid: number;
  affiliate_count: number;
  transaction_count: number;
  user_uuid: string;
}

export function useAffiliateData() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['affiliate-data', user?.id],
    queryFn: async (): Promise<AffiliateData | null> => {
      if (!user?.id) {
        throw new Error('No authenticated user');
      }

      console.log('Fetching affiliate data for user:', user.id);

      // First get the affiliate data
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_uuid', user.id)
        .maybeSingle();

      if (affiliateError) {
        console.error('Error fetching affiliate data:', affiliateError);
        throw affiliateError;
      }

      if (!affiliateData) {
        return null;
      }

      // Get payouts data to calculate actual paid out amount
      const { data: payoutsData, error: payoutsError } = await supabase
        .from('payouts')
        .select('amount, status')
        .eq('type', 'affiliate')
        .eq('affiliate_uuid', affiliateData.affiliate_uuid);

      if (payoutsError) {
        console.error('Error fetching payouts data:', payoutsError);
        // Don't throw error, just use the original data
      }

      // Calculate actual paid out amount from completed payouts
      const actualPaidOut = payoutsData
        ? payoutsData
            .filter(payout => payout.status?.toLowerCase() === 'completed')
            .reduce((sum, payout) => sum + (payout.amount || 0), 0)
        : affiliateData.commissions_paid || 0;

      console.log('Affiliate data:', {
        ...affiliateData,
        commissions_paid: actualPaidOut
      });

      return {
        ...affiliateData,
        commissions_paid: actualPaidOut
      };
    },
    enabled: !!user?.id,
  });
}
