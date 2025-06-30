
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

interface AffiliateTransaction {
  transaction_uuid: string;
  created_at: string;
  amount: number;
  affiliate_fees: number;
  status: string;
  user_name: string;
  user_email: string;
  partnership_name: string;
  commission_percentage: number;
  is_boosted: boolean;
}

export function useAffiliateTransactions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['affiliate-transactions', user?.id],
    queryFn: async (): Promise<AffiliateTransaction[]> => {
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

      // Fetch transactions with joins
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          transaction_uuid,
          created_at,
          amount,
          afiliate_fees,
          status,
          affiliate_boosted,
          affiliate_amount_boosted,
          users!transactions_user_uuid_fkey (
            first_name,
            last_name,
            email
          ),
          affiliate_partnerships!transactions_affiliate_partnership_uuid_fkey (
            name
          )
        `)
        .eq('affiliate_uuid', affiliateData.affiliate_uuid)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching affiliate transactions:', error);
        throw error;
      }

      return data?.map(transaction => {
        const baseAmount = transaction.amount || 0;
        const isBoosted = transaction.affiliate_boosted || false;
        const boostedAmount = transaction.affiliate_amount_boosted || 0;
        
        // Calculate commission percentage and affiliate fees
        let commissionPercentage = 5; // Base 5%
        let affiliateFees = transaction.afiliate_fees || 0;
        
        if (isBoosted) {
          // If boosted, add 3% to make it 8% total
          commissionPercentage = 8;
          // Recalculate affiliate fees with boosted rate
          affiliateFees = (baseAmount * 0.08);
        } else if (baseAmount > 0 && transaction.afiliate_fees) {
          // Calculate actual commission percentage from existing data
          commissionPercentage = Math.round((transaction.afiliate_fees / baseAmount) * 100);
        }

        return {
          transaction_uuid: transaction.transaction_uuid,
          created_at: new Date(transaction.created_at).toLocaleDateString(),
          amount: baseAmount,
          affiliate_fees: affiliateFees,
          status: transaction.status || 'unknown',
          user_name: `${transaction.users?.first_name || ''} ${transaction.users?.last_name || ''}`.trim() || 'Unknown User',
          user_email: transaction.users?.email || 'Unknown Email',
          partnership_name: transaction.affiliate_partnerships?.name || 'Unknown Partnership',
          commission_percentage: commissionPercentage,
          is_boosted: isBoosted
        };
      }) || [];
    },
    enabled: !!user?.id,
  });
}
