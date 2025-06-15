
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TransactionDetails {
  transaction_uuid: string;
  total_amount: number;
  created_at: string;
  status: string;
  buyer_user?: {
    name: string;
    email: string;
  };
  seller_user?: {
    name: string;
    email: string;
  };
  items: {
    product_uuid: string;
    variant_uuid: string;
    price: number;
    quantity: number;
    product_name?: string;
    variant_name?: string;
    files_link?: string;
  }[];
}

export function useTransactionDetails(transactionId: string) {
  return useQuery({
    queryKey: ['transaction-details', transactionId],
    queryFn: async (): Promise<TransactionDetails | null> => {
      console.log('Fetching transaction details for:', transactionId);
      
      // Fetch from products_transactions using the correct field name
      const { data: transaction, error: transactionError } = await supabase
        .from('products_transactions')
        .select(`
          *,
          buyer:users!products_transactions_user_uuid_fkey(first_name, last_name, email),
          seller:experts!products_transactions_expert_uuid_fkey(name, email)
        `)
        .eq('product_transaction_uuid', transactionId)
        .maybeSingle();

      if (transactionError) {
        console.error('Error fetching transaction:', transactionError);
        throw transactionError;
      }

      console.log('Transaction found:', transaction);

      if (!transaction) {
        return null;
      }

      // Fetch transaction items
      const { data: items, error: itemsError } = await supabase
        .from('products_transaction_items')
        .select(`
          *,
          products(name),
          variants(name)
        `)
        .eq('product_transaction_uuid', transactionId);

      if (itemsError) {
        console.error('Error fetching transaction items:', itemsError);
        throw itemsError;
      }

      console.log('Transaction items found:', items);

      // Map the items to match our interface
      const transactionItems = items?.map(item => ({
        product_uuid: item.product_uuid || '',
        variant_uuid: item.variant_uuid || '',
        price: item.price || 0,
        quantity: item.quantity || 1,
        product_name: item.products?.name || 'Unknown Product',
        variant_name: item.variants?.name || 'Unknown Variant',
        files_link: item.variants?.files_link || '',
      })) || [];

      // Construct buyer and seller info from the actual transaction record
      let buyerUser = undefined;
      let sellerUser = undefined;

      if (transaction?.buyer) {
        buyerUser = {
          name: `${transaction.buyer.first_name || ''} ${transaction.buyer.last_name || ''}`.trim() || 'Unknown User',
          email: transaction.buyer.email || ''
        };
      }

      if (transaction?.seller) {
        sellerUser = {
          name: transaction.seller.name || 'Unknown Expert',
          email: transaction.seller.email || ''
        };
      }

      return {
        transaction_uuid: transactionId,
        total_amount: transaction.total_amount || 0,
        created_at: transaction.created_at || new Date().toISOString(),
        status: transaction.status || 'unknown',
        buyer_user: buyerUser,
        seller_user: sellerUser,
        items: transactionItems
      };
    },
    enabled: !!transactionId,
  });
}
