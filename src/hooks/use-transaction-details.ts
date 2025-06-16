
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TransactionDetails {
  transaction_uuid: string;
  total_amount: number;
  created_at: string;
  status: string;
  type?: string;
  payment_provider?: string;
  payment_reference_id?: string;
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
      
      // Let's first check what columns actually exist in the products_transactions table
      const { data: allTransactions, error: allError } = await supabase
        .from('products_transactions')
        .select('*')
        .limit(5);

      console.log('Sample transactions from DB:', allTransactions);
      console.log('Sample transactions error:', allError);

      // Now let's try to find our specific transaction
      const { data: transactionCheck, error: checkError } = await supabase
        .from('products_transactions')
        .select('*')
        .eq('product_transaction_uuid', transactionId)
        .maybeSingle();

      console.log('Transaction check result:', transactionCheck);
      console.log('Transaction check error:', checkError);

      if (checkError) {
        console.error('Error checking transaction:', checkError);
        throw checkError;
      }

      if (!transactionCheck) {
        console.log('No transaction found with ID:', transactionId);
        // Let's also try a broader search to see if the ID exists anywhere
        const { data: broadSearch } = await supabase
          .from('products_transactions')
          .select('product_transaction_uuid')
          .ilike('product_transaction_uuid', `%${transactionId}%`);
        
        console.log('Broad search results:', broadSearch);
        return null;
      }

      // Now fetch with proper joins
      const { data: transaction, error: transactionError } = await supabase
        .from('products_transactions')
        .select(`
          *,
          users!products_transactions_user_uuid_fkey(first_name, last_name, email),
          experts!products_transactions_expert_uuid_fkey(name, email)
        `)
        .eq('product_transaction_uuid', transactionId)
        .maybeSingle();

      if (transactionError) {
        console.error('Error fetching transaction with joins:', transactionError);
        throw transactionError;
      }

      console.log('Transaction with joins found:', transaction);

      if (!transaction) {
        return null;
      }

      // Fetch transaction items with proper joins
      const { data: items, error: itemsError } = await supabase
        .from('products_transaction_items')
        .select(`
          *,
          products(name),
          variants(name, files_link)
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

      // Construct buyer and seller info from the joined data
      let buyerUser = undefined;
      let sellerUser = undefined;

      if (transaction?.users) {
        buyerUser = {
          name: `${transaction.users.first_name || ''} ${transaction.users.last_name || ''}`.trim() || 'Unknown User',
          email: transaction.users.email || ''
        };
      }

      if (transaction?.experts) {
        sellerUser = {
          name: transaction.experts.name || 'Unknown Expert',
          email: transaction.experts.email || ''
        };
      }

      return {
        transaction_uuid: transactionId,
        total_amount: transaction.total_amount || 0,
        created_at: transaction.created_at || new Date().toISOString(),
        status: transaction.status || 'unknown',
        type: transaction.type || undefined,
        payment_provider: transaction.payment_provider || undefined,
        payment_reference_id: transaction.payment_reference_id || undefined,
        buyer_user: buyerUser,
        seller_user: sellerUser,
        items: transactionItems
      };
    },
    enabled: !!transactionId,
  });
}
