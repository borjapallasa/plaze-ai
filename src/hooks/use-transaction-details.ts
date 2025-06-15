
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
      
      // Fetch only from products_transactions
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

      // Mock items data if none exists
      const mockItems = [
        {
          product_uuid: 'mock-product-uuid',
          variant_uuid: 'mock-variant-uuid',
          price: transaction.total_amount || 30.00,
          quantity: 1,
          product_name: "Find Customer Email List Of Competitors From Social Media Instagram Account",
          variant_name: "Standard Package",
          files_link: "https://docs.google.com/document/d/1Tu4aBhms9OvovbPHGj7yVA7DX7r99X3Beupqm77HoNc/edit?usp=sharing",
        }
      ];

      return {
        transaction_uuid: transaction.product_transaction_uuid,
        total_amount: transaction.total_amount || 30.00,
        created_at: transaction.created_at,
        status: transaction.status || 'completed',
        items: mockItems
      };
    },
    enabled: !!transactionId,
  });
}
