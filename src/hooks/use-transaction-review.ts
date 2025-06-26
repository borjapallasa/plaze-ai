
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useTransactionReview(transactionUuid: string | undefined) {
  return useQuery({
    queryKey: ['transaction-review', transactionUuid],
    queryFn: async () => {
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

      if (error) throw error;
      return data;
    },
    enabled: !!transactionUuid
  });
}
