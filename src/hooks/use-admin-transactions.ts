

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
  itemCount?: number;
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
      
      // Fetch from products_transactions table with related data including item_count
      const { data: productTransactionData, error } = await supabase
        .from('products_transactions')
        .select(`
          product_transaction_uuid,
          total_amount,
          created_at,
          status,
          payment_reference_id,
          item_count,
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
          itemCount: transaction.item_count || 0,
        };
      }) || [];

      console.log('Transformed product transactions:', transformedTransactions);
      return transformedTransactions;
    },
  });
}

export function useAdminCommunityTransactions() {
  return useQuery({
    queryKey: ['admin-community-transactions'],
    queryFn: async (): Promise<AdminTransaction[]> => {
      console.log('Fetching admin community transactions from community_subscriptions_transactions table...');
      
      // First, let's try a simple query without joins to see if we get any data
      const { data: rawData, error: rawError } = await supabase
        .from('community_subscriptions_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Raw community transactions data:', rawData, 'Error:', rawError);

      // Now try with joins using the correct column names
      const { data: communityTransactionData, error } = await supabase
        .from('community_subscriptions_transactions')
        .select(`
          community_subscription_transaction_uuid,
          amount,
          created_at,
          community_uuid,
          user_uuid,
          communities!community_subscriptions_transactions_community_uuid_fkey(name),
          users!community_subscriptions_transactions_user_uuid_fkey(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching community transactions:', error);
        throw error;
      }

      console.log('Community transactions found:', communityTransactionData);

      // Transform the data to match the AdminTransaction interface
      const transformedTransactions: AdminTransaction[] = communityTransactionData?.map(transaction => {
        const buyerName = transaction.users 
          ? `${transaction.users.first_name || ''} ${transaction.users.last_name || ''}`.trim()
          : 'Unknown User';
        
        const communityName = transaction.communities?.name || 'Unknown Community';
        const amount = transaction.amount || 0;

        return {
          concept: transaction.community_subscription_transaction_uuid,
          type: 'community' as const,
          createdAt: new Date(transaction.created_at).toLocaleString(),
          status: 'paid', // Community subscription transactions are typically paid
          amount,
          seller: communityName,
          user: buyerName,
          checkoutId: transaction.community_subscription_transaction_uuid,
          transactionUuid: transaction.community_subscription_transaction_uuid,
        };
      }) || [];

      console.log('Transformed community transactions:', transformedTransactions);
      return transformedTransactions;
    },
  });
}

