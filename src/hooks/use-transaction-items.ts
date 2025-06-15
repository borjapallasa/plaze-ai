
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
  product_name?: string | null;
  variant_name?: string | null;
}

export function useTransactionItems(transactionId: string) {
  return useQuery({
    queryKey: ['transaction-items', transactionId],
    queryFn: async (): Promise<TransactionItem[]> => {
      console.log('Fetching transaction items for transaction ID:', transactionId);
      
      const { data: items, error } = await supabase
        .from('products_transaction_items')
        .select(`
          *,
          products!inner(name),
          variants!inner(name)
        `)
        .eq('product_transaction_uuid', transactionId);

      if (error) {
        console.error('Error fetching transaction items:', error);
        throw error;
      }

      console.log('Transaction items found:', items);
      
      // Map the data to include product and variant names
      const mappedItems: TransactionItem[] = items?.map(item => ({
        product_transaction_item_uuid: item.product_transaction_item_uuid,
        product_uuid: item.product_uuid,
        variant_uuid: item.variant_uuid,
        price: item.price,
        quantity: item.quantity,
        product_type: item.product_type,
        status: item.status,
        total_price: item.total_price,
        tax: item.tax,
        product_name: item.products?.name || null,
        variant_name: item.variants?.name || null,
      })) || [];

      return mappedItems;
    },
    enabled: !!transactionId,
  });
}
