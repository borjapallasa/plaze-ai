
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UserTransaction {
  transaction_uuid: string;
  amount: number;
  type: string;
  created_at: string;
  seller_name: string | null;
  products_transactions_uuid?: string | null;
  community_transaction_uuid?: string | null;
  afiliate_fees: number;
}

export function useUserTransactions(userUuid: string) {
  const { data: transactions = [], isLoading, error, refetch } = useQuery({
    queryKey: ['user-transactions', userUuid],
    queryFn: async (): Promise<UserTransaction[]> => {
      console.log('Fetching transactions for user UUID:', userUuid);
      
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          transaction_uuid,
          amount,
          type,
          created_at,
          expert_uuid,
          products_transactions_uuid,
          afiliate_fees
        `)
        .eq('user_uuid', userUuid)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user transactions:', error);
        throw error;
      }

      console.log('Raw transaction data:', data);

      // Transform the data and fetch seller names and community transaction UUIDs
      const transformedData: UserTransaction[] = [];
      
      for (const transaction of data || []) {
        let sellerName = null;
        let communityTransactionUuid = null;
        
        // For transactions with expert_uuid, fetch the expert name
        if (transaction.expert_uuid) {
          const { data: expertData, error: expertError } = await supabase
            .from('experts')
            .select('name')
            .eq('expert_uuid', transaction.expert_uuid)
            .maybeSingle();

          if (!expertError && expertData) {
            sellerName = expertData.name;
          }
        }

        // For community transactions, fetch community_transaction_uuid
        if (transaction.type === 'community') {
          const { data: communityTransactionData, error: communityError } = await supabase
            .from('community_subscriptions_transactions')
            .select('community_subscription_transaction_uuid')
            .eq('transaction_uuid', transaction.transaction_uuid)
            .maybeSingle();

          if (!communityError && communityTransactionData) {
            communityTransactionUuid = communityTransactionData.community_subscription_transaction_uuid;
          }
        }

        transformedData.push({
          transaction_uuid: transaction.transaction_uuid,
          amount: transaction.amount || 0,
          type: transaction.type || 'unknown',
          created_at: transaction.created_at,
          seller_name: sellerName,
          products_transactions_uuid: transaction.products_transactions_uuid,
          community_transaction_uuid: communityTransactionUuid,
          afiliate_fees: transaction.afiliate_fees || 0
        });
      }

      console.log('Transformed transaction data:', transformedData);
      return transformedData;
    },
    enabled: !!userUuid
  });

  return {
    transactions,
    isLoading,
    error,
    refetch
  };
}
