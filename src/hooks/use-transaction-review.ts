
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

export function useTransactionReview(transactionUuid: string | undefined) {
  return useQuery({
    queryKey: ['transaction-review', transactionUuid],
    queryFn: async (): Promise<TransactionReview[]> => {
      console.log('Fetching reviews for transaction:', transactionUuid);
      
      if (!transactionUuid) {
        console.log('No transaction UUID provided');
        return [];
      }
      
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('transaction_uuid', transactionUuid);

      if (error) {
        console.error('Error fetching transaction reviews:', error);
        throw error;
      }

      console.log('Reviews found for transaction:', reviews);

      if (!reviews) {
        return [];
      }

      const transformedReviews = reviews.map((review) => ({
        review_uuid: review.review_uuid,
        rating: review.rating,
        title: review.title,
        comments: review.comments,
        buyer_name: review.buyer_name,
        buyer_email: review.buyer_email || '',
        created_at: review.created_at,
      }));

      return transformedReviews;
    },
    enabled: !!transactionUuid,
  });
}
