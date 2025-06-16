
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TransactionReview {
  review_uuid: string;
  rating: number;
  title: string;
  comments: string;
  buyer_name: string;
  created_at: string;
}

export function useTransactionReview(transactionUuid: string) {
  return useQuery({
    queryKey: ['transaction-review', transactionUuid],
    queryFn: async (): Promise<TransactionReview[]> => {
      console.log('Fetching reviews for transaction:', transactionUuid);
      
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('review_uuid, rating, title, comments, buyer_name, created_at')
        .eq('transaction_uuid', transactionUuid);

      if (error) {
        console.error('Error fetching transaction reviews:', error);
        throw error;
      }

      console.log('Transaction reviews found:', reviews);

      return reviews || [];
    },
    enabled: !!transactionUuid,
  });
}
