
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TransactionReviewData {
  transaction_uuid: string;
  status: string;
  review_score: number | null;
  review_comment: string | null;
  created_at: string;
  updated_at: string | null;
  reviewer_name: string | null;
  reviewer_email: string | null;
}

export function useTransactionReview(transactionUuid: string | undefined) {
  return useQuery({
    queryKey: ['transaction-review', transactionUuid],
    queryFn: async (): Promise<TransactionReviewData | null> => {
      if (!transactionUuid) return null;

      const { data, error } = await supabase
        .from('reviews')
        .select(`
          review_uuid,
          status,
          rating,
          comments,
          created_at,
          title,
          buyer_name,
          buyer_email
        `)
        .eq('transaction_type', 'product')
        .eq('product_transaction_item_uuid', transactionUuid)
        .maybeSingle();

      if (error) {
        console.error('Error fetching transaction review:', error);
        throw error;
      }

      if (!data) return null;

      return {
        transaction_uuid: transactionUuid,
        status: data.status || 'pending',
        review_score: data.rating,
        review_comment: data.comments,
        created_at: data.created_at,
        updated_at: data.created_at,
        reviewer_name: data.buyer_name,
        reviewer_email: data.buyer_email
      };
    },
    enabled: !!transactionUuid
  });
}
