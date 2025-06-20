
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UserTransaction {
  transaction_uuid: string;
  amount: number;
  type: string;
  created_at: string;
  seller_name: string | null;
}

export function useUserTransactions(userUuid: string) {
  const { data: transactions = [], isLoading, error, refetch } = useQuery({
    queryKey: ['user-transactions', userUuid],
    queryFn: async () => {
      console.log('Fetching transactions for user UUID:', userUuid);
      
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          transaction_uuid,
          amount,
          type,
          created_at,
          expert_uuid,
          experts!inner(name)
        `)
        .eq('buyer_user_uuid', userUuid)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user transactions:', error);
        throw error;
      }

      console.log('Raw transaction data:', data);

      // Transform the data to match our interface
      const transformedData: UserTransaction[] = (data || []).map(transaction => ({
        transaction_uuid: transaction.transaction_uuid,
        amount: transaction.amount || 0,
        type: transaction.type || 'unknown',
        created_at: transaction.created_at,
        seller_name: transaction.experts?.name || null
      }));

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
