
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AdminTransaction {
  templateName: string;
  createdAt: string;
  buyerEmail: string;
  deliverables: string;
  amount: number;
  marketplaceFees: number;
  sellerReceives: number;
  sellerUser: string;
  affiliateFees: number;
  status: string;
  completedAt: string;
  templateId: string;
  checkoutId: string;
  rating: number;
  review: string;
  type: 'product' | 'community';
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
        const templateName = variantName ? `${productName} - ${variantName}` : productName;
        
        const buyerName = transaction.users 
          ? `${transaction.users.first_name || ''} ${transaction.users.last_name || ''}`.trim()
          : 'Unknown User';
        
        const sellerName = transaction.experts?.name || 'Unknown Expert';
        const sellerEmail = transaction.experts?.email || '';

        const amount = transaction.total_amount || 0;
        const marketplaceFees = amount * 0.1; // 10% marketplace fee
        const affiliateFees = 0; // Default to 0 for now
        const sellerReceives = amount - marketplaceFees - affiliateFees;

        return {
          templateName,
          createdAt: new Date(transaction.created_at).toLocaleString(),
          buyerEmail: transaction.users?.email || 'unknown@email.com',
          deliverables: firstItem?.variants?.files_link || 'Digital product delivery',
          amount,
          marketplaceFees,
          sellerReceives,
          sellerUser: sellerEmail,
          affiliateFees,
          status: transaction.status || 'unknown',
          completedAt: transaction.status === 'completed' ? new Date(transaction.created_at).toLocaleString() : '',
          templateId: `TEMP${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          checkoutId: transaction.product_transaction_uuid,
          rating: 0, // We'll need to fetch this from reviews table if needed
          review: '',
          type: 'product' as const
        };
      }) || [];

      console.log('Transformed transactions:', transformedTransactions);
      return transformedTransactions;
    },
  });
}
