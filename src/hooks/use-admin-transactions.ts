
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AdminTransaction {
  concept: string;
  type: 'product' | 'community';
  createdAt: string;
  status: string;
  amount: number;
  seller: string;
  user: string;
  checkoutId: string;
}

export function useAdminTransactions() {
  return useQuery({
    queryKey: ['admin-transactions'],
    queryFn: async (): Promise<AdminTransaction[]> => {
      console.log('Fetching admin transactions from transactions table...');
      
      // Fetch from transactions table with related data
      const { data: transactionData, error } = await supabase
        .from('transactions')
        .select(`
          transaction_uuid,
          amount,
          created_at,
          type,
          transaction_fees,
          gross_margin,
          experts!transactions_expert_uuid_fkey(name, email),
          users!transactions_buyer_user_uuid_fkey(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }

      console.log('Transactions found:', transactionData);

      // Transform the data to match the AdminTransaction interface
      const transformedTransactions: AdminTransaction[] = transactionData?.map(transaction => {
        const buyerName = transaction.users 
          ? `${transaction.users.first_name || ''} ${transaction.users.last_name || ''}`.trim()
          : 'Unknown User';
        
        const sellerName = transaction.experts?.name || 'Unknown Expert';
        const amount = transaction.amount || 0;
        const concept = `Transaction ${transaction.transaction_uuid.slice(0, 8)}`;

        return {
          concept,
          type: transaction.type === 'product' ? 'product' : 'community',
          createdAt: new Date(transaction.created_at).toLocaleString(),
          status: 'paid', // Transactions table doesn't have status, assuming paid
          amount,
          seller: sellerName,
          user: buyerName,
          checkoutId: transaction.transaction_uuid,
        };
      }) || [];

      console.log('Transformed transactions:', transformedTransactions);
      return transformedTransactions;
    },
  });
}
