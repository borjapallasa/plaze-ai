
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TransactionFinancials {
  amount: number;
  afiliate_fees: number; // Note: this matches the actual column name in the database
  gross_margin: number;
  transaction_fees: number;
  stripe_fees: number;
  amount_taxes: number;
  transaction_uuid: string; // Add the transaction_uuid
}

export function useTransactionFinancials(productsTransactionUuid: string) {
  return useQuery({
    queryKey: ['transaction-financials', productsTransactionUuid],
    queryFn: async (): Promise<TransactionFinancials | null> => {
      console.log('Fetching transaction financials for products_transactions_uuid:', productsTransactionUuid);
      
      const { data: transaction, error } = await supabase
        .from('transactions')
        .select('amount, afiliate_fees, gross_margin, transaction_fees, stripe_fees, amount_taxes, transaction_uuid')
        .eq('products_transactions_uuid', productsTransactionUuid)
        .maybeSingle();

      if (error) {
        console.error('Error fetching transaction financials:', error);
        throw error;
      }

      console.log('Transaction financials found:', transaction);

      if (!transaction) {
        return null;
      }

      return {
        amount: transaction.amount || 0,
        afiliate_fees: transaction.afiliate_fees || 0,
        gross_margin: transaction.gross_margin || 0,
        transaction_fees: transaction.transaction_fees || 0,
        stripe_fees: transaction.stripe_fees || 0,
        amount_taxes: transaction.amount_taxes || 0,
        transaction_uuid: transaction.transaction_uuid,
      };
    },
    enabled: !!productsTransactionUuid,
  });
}
