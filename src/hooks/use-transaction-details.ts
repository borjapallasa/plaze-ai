
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TransactionDetails {
  transaction_uuid: string;
  total_amount: number;
  created_at: string;
  status: string;
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
      
      // First, get the transaction
      const { data: transaction, error: transactionError } = await supabase
        .from('products_transactions')
        .select('*')
        .eq('product_transaction_uuid', transactionId)
        .maybeSingle();

      if (transactionError) {
        console.error('Error fetching transaction:', transactionError);
        throw transactionError;
      }

      if (!transaction) {
        console.log('No transaction found with UUID:', transactionId);
        return null;
      }

      // Get transaction items with product and variant details
      const { data: items, error: itemsError } = await supabase
        .from('products_transaction_items')
        .select(`
          *,
          products:product_uuid (
            name,
            product_files
          ),
          variants:variant_uuid (
            name,
            files_link
          )
        `)
        .eq('product_transaction_uuid', transactionId);

      if (itemsError) {
        console.error('Error fetching transaction items:', itemsError);
        throw itemsError;
      }

      return {
        transaction_uuid: transaction.product_transaction_uuid,
        total_amount: transaction.total_amount || 0,
        created_at: transaction.created_at,
        status: transaction.status || 'unknown',
        items: (items || []).map(item => ({
          product_uuid: item.product_uuid,
          variant_uuid: item.variant_uuid,
          price: item.price || 0,
          quantity: item.quantity || 1,
          product_name: item.products?.name,
          variant_name: item.variants?.name,
          files_link: item.variants?.files_link || item.products?.product_files,
        }))
      };
    },
    enabled: !!transactionId,
  });
}
