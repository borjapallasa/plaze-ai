
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactionFinancials } from "@/hooks/use-transaction-financials";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

interface TransactionFinancialsProps {
  transactionAmount: number;
  productsTransactionUuid: string;
  onTransactionUuidReceived?: (transactionUuid: string) => void;
}

export function TransactionFinancials({
  transactionAmount,
  productsTransactionUuid,
  onTransactionUuidReceived
}: TransactionFinancialsProps) {
  const {
    data: financials,
    isLoading,
    error
  } = useTransactionFinancials(productsTransactionUuid);

  // Pass the transaction_uuid back to parent when we receive it
  useEffect(() => {
    if (financials?.transaction_uuid && onTransactionUuidReceived) {
      onTransactionUuidReceived(financials.transaction_uuid);
    }
  }, [financials?.transaction_uuid, onTransactionUuidReceived]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Financial Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !financials) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Financial Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-[#8E9196]">Unable to load financial data</p>
            <p className="text-sm text-[#8E9196] mt-1">
              {error ? 'Error loading data' : 'No financial data found'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Financial Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-[#8E9196] text-sm mb-1">Amount</span>
            <span className="font-medium text-sm sm:text-base">${financials.amount.toFixed(2)}</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-[#8E9196] text-sm mb-1">Stripe Fees</span>
            <span className="font-medium text-sm sm:text-base">${financials.stripe_fees.toFixed(2)}</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-[#8E9196] text-sm mb-1">Transaction Fees</span>
            <span className="font-medium text-sm sm:text-base">${financials.transaction_fees.toFixed(2)}</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-[#8E9196] text-sm mb-1">Taxes</span>
            <span className="font-medium text-sm sm:text-base">${financials.amount_taxes.toFixed(2)}</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-[#8E9196] text-sm mb-1">Affiliate Fees</span>
            <span className="font-medium text-sm sm:text-base">${financials.afiliate_fees.toFixed(2)}</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-[#F8F9FC] rounded-lg border-2 border-[#9b87f5]">
            <span className="font-medium text-sm text-[#1A1F2C] mb-1">Gross Margin</span>
            <span className="font-medium text-base sm:text-lg text-[#9b87f5]">${financials.gross_margin.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
