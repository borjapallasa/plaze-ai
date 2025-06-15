
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

      // Get transaction items
      const { data: items, error: itemsError } = await supabase
        .from('products_transaction_items')
        .select('*')
        .eq('product_transaction_uuid', transactionId);

      if (itemsError) {
        console.error('Error fetching transaction items:', itemsError);
        throw itemsError;
      }

      // For each item, get product and variant details separately
      const enrichedItems = await Promise.all(
        (items || []).map(async (item) => {
          let productName = '';
          let variantName = '';
          let filesLink = '';

          // Get product details if product_uuid exists
          if (item.product_uuid) {
            const { data: product } = await supabase
              .from('products')
              .select('name, product_files')
              .eq('product_uuid', item.product_uuid)
              .maybeSingle();
            
            if (product) {
              productName = product.name || '';
              filesLink = product.product_files || '';
            }
          }

          // Get variant details if variant_uuid exists
          if (item.variant_uuid) {
            const { data: variant } = await supabase
              .from('variants')
              .select('name, files_link')
              .eq('variant_uuid', item.variant_uuid)
              .maybeSingle();
            
            if (variant) {
              variantName = variant.name || '';
              // Variant files_link takes precedence over product files
              if (variant.files_link) {
                filesLink = variant.files_link;
              }
            }
          }

          return {
            product_uuid: item.product_uuid,
            variant_uuid: item.variant_uuid,
            price: item.price || 0,
            quantity: item.quantity || 1,
            product_name: productName,
            variant_name: variantName,
            files_link: filesLink,
          };
        })
      );

      return {
        transaction_uuid: transaction.product_transaction_uuid,
        total_amount: transaction.total_amount || 0,
        created_at: transaction.created_at,
        status: transaction.status || 'unknown',
        items: enrichedItems
      };
    },
    enabled: !!transactionId,
  });
}
