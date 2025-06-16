
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
  transactionUuid: string;
}

export function useAdminTransactions() {
  return useQuery({
    queryKey: ['admin-transactions'],
    queryFn: async (): Promise<AdminTransaction[]> => {
      console.log('Fetching admin transactions from transactions table...');
      
      // Fetch from transactions table with related data including status
      const { data: transactionData, error } = await supabase
        .from('transactions')
        .select(`
          transaction_uuid,
          amount,
          created_at,
          type,
          status,
          transaction_fees,
          gross_margin,
          products_transactions_uuid,
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

        return {
          concept: transaction.transaction_uuid,
          type: transaction.type === 'product' ? 'product' : 'community',
          createdAt: new Date(transaction.created_at).toLocaleString(),
          status: transaction.status || 'unknown',
          amount,
          seller: sellerName,
          user: buyerName,
          checkoutId: transaction.products_transactions_uuid || transaction.transaction_uuid,
          transactionUuid: transaction.transaction_uuid,
        };
      }) || [];

      console.log('Transformed transactions:', transformedTransactions);
      return transformedTransactions;
    },
  });
}

export function useAdminProductTransactions() {
  return useQuery({
    queryKey: ['admin-product-transactions'],
    queryFn: async (): Promise<AdminTransaction[]> => {
      console.log('Fetching admin product transactions from products_transactions table...');
      
      // Fetch from products_transactions table with related data
      const { data: productTransactionData, error } = await supabase
        .from('products_transactions')
        .select(`
          product_transaction_uuid,
          total_amount,
          created_at,
          status,
          payment_reference_id,
          experts!products_transactions_expert_uuid_fkey(name, email),
          users!products_transactions_user_uuid_fkey(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching product transactions:', error);
        throw error;
      }

      console.log('Product transactions found:', productTransactionData);

      // Transform the data to match the AdminTransaction interface
      const transformedTransactions: AdminTransaction[] = productTransactionData?.map(transaction => {
        const buyerName = transaction.users 
          ? `${transaction.users.first_name || ''} ${transaction.users.last_name || ''}`.trim()
          : 'Unknown User';
        
        const sellerName = transaction.experts?.name || 'Unknown Expert';
        const amount = transaction.total_amount || 0;

        return {
          concept: transaction.product_transaction_uuid,
          type: 'product' as const,
          createdAt: new Date(transaction.created_at).toLocaleString(),
          status: transaction.status || 'unknown',
          amount,
          seller: sellerName,
          user: buyerName,
          checkoutId: transaction.payment_reference_id || transaction.product_transaction_uuid,
          transactionUuid: transaction.product_transaction_uuid,
        };
      }) || [];

      console.log('Transformed product transactions:', transformedTransactions);
      return transformedTransactions;
    },
  });
}
