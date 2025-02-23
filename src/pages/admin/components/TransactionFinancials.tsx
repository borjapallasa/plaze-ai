
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TransactionFinancialsProps {
  transactionAmount: number;
  transactionFees: number;
  affiliateFees: number;
  stripeFees: number;
  grossMargin: number;
  netMargin: number;
}

export function TransactionFinancials({
  transactionAmount,
  transactionFees,
  affiliateFees,
  stripeFees,
  grossMargin,
  netMargin
}: TransactionFinancialsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Financial Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-[#8E9196] mr-2">Transaction Amount</span>
              <span className="font-medium shrink-0">${transactionAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-[#8E9196] mr-2">Transaction Fees</span>
              <span className="font-medium shrink-0">${transactionFees.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-[#8E9196] mr-2">Affiliate Fees</span>
              <span className="font-medium shrink-0">${affiliateFees.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-[#8E9196] mr-2">Stripe Fees</span>
              <span className="font-medium shrink-0">${stripeFees.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-[#8E9196] mr-2">Gross Margin</span>
              <span className="font-medium shrink-0">${grossMargin.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#F8F9FC] rounded-lg border-2 border-[#9b87f5]">
              <span className="font-medium text-lg text-[#1A1F2C] mr-2">Net Margin</span>
              <span className="font-medium text-lg text-[#9b87f5] shrink-0">${netMargin.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
