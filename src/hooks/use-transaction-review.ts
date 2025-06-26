
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UserData {
  user_uuid: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface TransactionReviewData {
  transaction_uuid: string;
  status: string;
  review_score: number | null;
  review_comment: string | null;
  created_at: string;
  amount: number;
  affiliate_fees: number | null;
  user: UserData;
}

export function useTransactionReview(transactionUuid: string | undefined) {
  return useQuery({
    queryKey: ['transaction-review', transactionUuid],
    queryFn: async (): Promise<TransactionReviewData | null> => {
      if (!transactionUuid) return null;

      const { data, error } = await supabase
        .from('transactions')
        .select(`
          transaction_uuid,
          status,
          review_score,
          review_comment,
          created_at,
          amount,
          affiliate_fees,
          user:users(
            user_uuid,
            first_name,
            last_name,
            email
          )
        `)
        .eq('transaction_uuid', transactionUuid)
        .single();

      if (error) {
        console.error('Error fetching transaction review:', error);
        return null;
      }
      return data;
    },
    enabled: !!transactionUuid
  });
}
