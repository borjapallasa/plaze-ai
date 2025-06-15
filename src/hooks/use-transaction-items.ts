
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TransactionItem {
  product_transaction_item_uuid: string;
  product_uuid: string | null;
  variant_uuid: string | null;
  price: number | null;
  quantity: number | null;
  product_type: string | null;
  status: string | null;
  total_price: number | null;
  tax: number | null;
}

export function useTransactionItems(transactionId: string) {
  return useQuery({
    queryKey: ['transaction-items', transactionId],
    queryFn: async (): Promise<TransactionItem[]> => {
      console.log('Fetching transaction items for transaction ID:', transactionId);
      
      const { data: items, error } = await supabase
        .from('products_transaction_items')
        .select('*')
        .eq('product_transaction_uuid', transactionId);

      if (error) {
        console.error('Error fetching transaction items:', error);
        throw error;
      }

      console.log('Transaction items found:', items);
      return items || [];
    },
    enabled: !!transactionId,
  });
}
