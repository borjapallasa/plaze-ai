
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
      
      if (!transactionUuid) {
        console.log('No transaction UUID provided');
        return [];
      }
      
      // First, let's see what reviews exist in the database
      const { data: allReviews, error: allError } = await supabase
        .from('reviews')
        .select('*')
        .limit(10);

      console.log('Sample reviews in database:', allReviews);
      console.log('Sample reviews error:', allError);

      // Now try to fetch reviews for the specific transaction
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('review_uuid, rating, title, comments, buyer_name, created_at');

      if (error) {
        console.error('Error fetching transaction reviews:', error);
        throw error;
      }

      console.log('All reviews found:', reviews);

      // For now, return empty array since we need to establish the proper relationship
      return [];
    },
    enabled: !!transactionUuid,
  });
}
