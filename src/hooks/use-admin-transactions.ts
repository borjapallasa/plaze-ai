
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
      console.log('Fetching admin transactions...');
      
      // Fetch products transactions with related data
      const { data: productsTransactions, error: productsError } = await supabase
        .from('products_transactions')
        .select(`
          product_transaction_uuid,
          total_amount,
          created_at,
          status,
          payment_reference_id,
          users!products_transactions_user_uuid_fkey(first_name, last_name, email),
          experts!products_transactions_expert_uuid_fkey(name, email),
          products_transaction_items(
            product_uuid,
            price,
            quantity,
            products(name),
            variants(name, files_link)
          )
        `)
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Error fetching products transactions:', productsError);
        throw productsError;
      }

      console.log('Products transactions found:', productsTransactions);

      // Transform the data to match the AdminTransaction interface
      const transformedTransactions: AdminTransaction[] = productsTransactions?.map(transaction => {
        const firstItem = transaction.products_transaction_items?.[0];
        const productName = firstItem?.products?.name || 'Unknown Product';
        const variantName = firstItem?.variants?.name || '';
        const concept = variantName ? `${productName} - ${variantName}` : productName;
        
        const buyerName = transaction.users 
          ? `${transaction.users.first_name || ''} ${transaction.users.last_name || ''}`.trim()
          : 'Unknown User';
        
        const sellerName = transaction.experts?.name || 'Unknown Expert';
        const amount = transaction.total_amount || 0;

        return {
          concept,
          type: 'product' as const,
          createdAt: new Date(transaction.created_at).toLocaleString(),
          status: transaction.status || 'unknown',
          amount,
          seller: sellerName,
          user: buyerName,
          checkoutId: transaction.product_transaction_uuid,
        };
      }) || [];

      console.log('Transformed transactions:', transformedTransactions);
      return transformedTransactions;
    },
  });
}
