
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactionFinancials } from "@/hooks/use-transaction-financials";
import { Skeleton } from "@/components/ui/skeleton";

interface TransactionFinancialsProps {
  transactionAmount: number;
  productsTransactionUuid: string;
}

export function TransactionFinancials({
  transactionAmount,
  productsTransactionUuid
}: TransactionFinancialsProps) {
  const {
    data: financials,
    isLoading,
    error
  } = useTransactionFinancials(productsTransactionUuid);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Financial Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-[#8E9196] mr-2">Amount</span>
              <span className="font-medium shrink-0">${financials.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-[#8E9196] mr-2">Transaction Fees</span>
              <span className="font-medium shrink-0">${financials.transaction_fees.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-[#8E9196] mr-2">Affiliate Fees</span>
              <span className="font-medium shrink-0">${financials.afiliate_fees.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-[#8E9196] mr-2">Stripe Fees</span>
              <span className="font-medium shrink-0">${financials.stripe_fees.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-[#8E9196] mr-2">Amount Taxes</span>
              <span className="font-medium shrink-0">${financials.amount_taxes.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-[#F8F9FC] rounded-lg border-2 border-[#9b87f5]">
              <span className="font-medium text-lg text-[#1A1F2C] mr-2">Gross Margin</span>
              <span className="font-medium text-lg text-[#9b87f5] shrink-0">${financials.gross_margin.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
