
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export interface AffiliateTransaction {
  transaction_uuid: string;
  created_at: string;
  user_uuid: string;
  user_name: string;
  user_email: string;
  affiliate_partnership_uuid: string;
  partnership_name: string;
  amount: number;
  affiliate_fees: number;
  percentage_commission: number;
  status: string;
}

export function useAffiliateTransactions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['affiliate-transactions', user?.id],
    queryFn: async (): Promise<AffiliateTransaction[]> => {
      if (!user?.id) {
        console.log('No user ID for affiliate transactions fetch');
        return [];
      }

      console.log('Fetching affiliate transactions for user:', user.id);

      // First get the affiliate_uuid for the current user
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('affiliates')
        .select('affiliate_uuid')
        .eq('user_uuid', user.id)
        .single();

      if (affiliateError || !affiliateData) {
        console.error('Error fetching affiliate data or user is not an affiliate:', affiliateError);
        return [];
      }

      console.log('Found affiliate UUID:', affiliateData.affiliate_uuid);

      // Fetch transactions where affiliate_uuid matches
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select(`
          transaction_uuid,
          created_at,
          user_uuid,
          affiliate_partnership_uuid,
          amount,
          afiliate_fees,
          status,
          users!transactions_user_uuid_fkey(first_name, last_name, email),
          affiliate_partnerships!transactions_affiliate_partnership_uuid_fkey(name)
        `)
        .eq('affiliate_uuid', affiliateData.affiliate_uuid)
        .order('created_at', { ascending: false });

      if (transactionsError) {
        console.error('Error fetching affiliate transactions:', transactionsError);
        throw transactionsError;
      }

      console.log('Raw affiliate transactions:', transactions);

      return (transactions || []).map(transaction => {
        const userName = transaction.users 
          ? `${transaction.users.first_name || ''} ${transaction.users.last_name || ''}`.trim() || 'Unknown User'
          : 'Unknown User';
        
        const userEmail = transaction.users?.email || 'No email';
        const partnershipName = transaction.affiliate_partnerships?.name || 'No Partnership';
        const affiliateFees = transaction.afiliate_fees || 0;
        const amount = transaction.amount || 0;
        const percentageCommission = amount > 0 ? (affiliateFees / amount) * 100 : 0;

        return {
          transaction_uuid: transaction.transaction_uuid,
          created_at: transaction.created_at,
          user_uuid: transaction.user_uuid,
          user_name: userName,
          user_email: userEmail,
          affiliate_partnership_uuid: transaction.affiliate_partnership_uuid || '',
          partnership_name: partnershipName,
          amount,
          affiliate_fees: affiliateFees,
          percentage_commission: percentageCommission,
          status: transaction.status || 'unknown'
        };
      });
    },
    enabled: !!user?.id,
  });
}
