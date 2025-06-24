
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TransactionItemReview {
  review_uuid: string;
  rating: number;
  title: string;
  comments: string;
  buyer_name: string;
  created_at: string;
}

export function useTransactionItemReview(transactionItemUuid: string) {
  return useQuery({
    queryKey: ['transaction-item-review', transactionItemUuid],
    queryFn: async () => {
      console.log('Fetching reviews for transaction item:', transactionItemUuid);
      
      if (!transactionItemUuid) {
        console.log('No transaction item UUID provided');
        return [];
      }
      
      // Fetch reviews for the specific transaction item
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('review_uuid, rating, title, comments, buyer_name, created_at')
        .eq('product_transaction_item_uuid', transactionItemUuid);

      if (error) {
        console.error('Error fetching transaction item reviews:', error);
        throw error;
      }

      console.log('Reviews found for transaction item:', reviews);

      return reviews || [];
    },
    enabled: !!transactionItemUuid,
  });
}
