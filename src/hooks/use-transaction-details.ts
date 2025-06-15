
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

      // Mock items data for now
      const mockItems = [
        {
          product_uuid: 'mock-product-uuid-123',
          variant_uuid: 'mock-variant-uuid-456',
          price: 30.00,
          quantity: 1,
          product_name: "Find Customer Email List Of Competitors From Social Media Instagram Account",
          variant_name: "Standard Package",
          files_link: "https://docs.google.com/document/d/1Tu4aBhms9OvovbPHGj7yVA7DX7r99X3Beupqm77HoNc/edit?usp=sharing",
        }
      ];

      // Construct buyer and seller info
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
        total_amount: transaction?.total_amount || 30.00,
        created_at: transaction?.created_at || new Date().toISOString(),
        status: transaction?.status || 'completed',
        buyer_user: buyerUser,
        seller_user: sellerUser,
        items: mockItems
      };
    },
    enabled: !!transactionId,
  });
}
