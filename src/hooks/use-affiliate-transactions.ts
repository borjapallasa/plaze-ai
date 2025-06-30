
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

interface AffiliateTransaction {
  transaction_uuid: string;
  created_at: string;
  amount: number;
  affiliate_fees: number;
  original_affiliate_fees: number;
  boosted_amount: number;
  status: string;
  user_name: string;
  user_email: string;
  partnership_name: string;
  commission_percentage: number;
  base_commission_percentage: number;
  additional_commission_percentage: number;
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
        const finalAffiliateFees = transaction.afiliate_fees || 0;
        
        // Get the additional percentage from affiliate_amount_boosted (stored as 0-1 in DB)
        const additionalPercentageDecimal = transaction.affiliate_amount_boosted || 0;
        const additionalPercentage = Math.round(additionalPercentageDecimal * 100); // Convert to percentage
        
        // Calculate affiliate fees and commission percentage
        let originalAffiliateFees = finalAffiliateFees;
        let baseCommissionPercentage = 5; // Base 5%
        let totalCommissionPercentage = baseCommissionPercentage;
        let boostedAmount = 0;
        
        if (isBoosted && additionalPercentage > 0 && baseAmount > 0) {
          // Reverse engineer: if final fee includes boost, calculate original fee
          // finalFee = originalFee + (baseAmount * additionalPercentage)
          // So: originalFee = finalFee - (baseAmount * additionalPercentage)
          boostedAmount = baseAmount * additionalPercentageDecimal;
          originalAffiliateFees = finalAffiliateFees - boostedAmount;
          totalCommissionPercentage = baseCommissionPercentage + additionalPercentage;
        } else if (baseAmount > 0 && finalAffiliateFees > 0) {
          // Calculate actual commission percentage from existing data
          totalCommissionPercentage = Math.round((finalAffiliateFees / baseAmount) * 100);
          baseCommissionPercentage = totalCommissionPercentage;
        }

        return {
          transaction_uuid: transaction.transaction_uuid,
          created_at: new Date(transaction.created_at).toLocaleDateString(),
          amount: baseAmount,
          affiliate_fees: finalAffiliateFees,
          original_affiliate_fees: originalAffiliateFees,
          boosted_amount: boostedAmount,
          status: transaction.status || 'unknown',
          user_name: `${transaction.users?.first_name || ''} ${transaction.users?.last_name || ''}`.trim() || 'Unknown User',
          user_email: transaction.users?.email || 'Unknown Email',
          partnership_name: transaction.affiliate_partnerships?.name || 'Unknown Partnership',
          commission_percentage: totalCommissionPercentage,
          base_commission_percentage: baseCommissionPercentage,
          additional_commission_percentage: additionalPercentage,
          is_boosted: isBoosted
        };
      }) || [];
    },
    enabled: !!user?.id,
  });
}
