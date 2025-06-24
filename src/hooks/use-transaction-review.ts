
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TransactionReview {
  review_uuid: string;
  rating: number;
  title: string;
  comments: string;
  buyer_name: string;
  buyer_email: string;
  created_at: string;
}

export function useTransactionReview(transactionUuid: string) {
  return useQuery({
    queryKey: ['transaction-review', transactionUuid],
    queryFn: async (): Promise<TransactionReview[]> => {
      console.log('Fetching reviews for transaction:', transactionUuid);
      
      if (!transactionUuid) {
        console.log('No transaction UUID provided');
        return [];
      }
      
      // Try to fetch reviews for the specific transaction
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('review_uuid, rating, title, comments, buyer_name, buyer_email, created_at')
        .eq('transaction_uuid', transactionUuid);

      if (error) {
        console.error('Error fetching transaction reviews:', error);
        throw error;
      }

      console.log('Reviews found for transaction:', reviews);

      return reviews || [];
    },
    enabled: !!transactionUuid,
  });
}
