
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
    queryFn: async (): Promise<TransactionReview | null> => {
      console.log('Fetching review for transaction:', transactionUuid);
      
      const { data: review, error } = await supabase
        .from('reviews')
        .select('review_uuid, rating, title, comments, buyer_name, created_at')
        .eq('transaction_uuid', transactionUuid)
        .maybeSingle();

      if (error) {
        console.error('Error fetching transaction review:', error);
        throw error;
      }

      console.log('Transaction review found:', review);

      return review;
    },
    enabled: !!transactionUuid,
  });
}
