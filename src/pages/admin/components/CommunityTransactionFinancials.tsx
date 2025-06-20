
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CommunityTransactionFinancialsProps {
  transactionAmount: number;
}

export function CommunityTransactionFinancials({
  transactionAmount
}: CommunityTransactionFinancialsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Financial Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-sm text-blue-600 mb-1">Subscription Amount</h4>
            <p className="text-2xl font-bold text-blue-700">${transactionAmount.toFixed(2)}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-sm text-green-600 mb-1">Total Amount</h4>
            <p className="text-2xl font-bold text-green-700">${transactionAmount.toFixed(2)}</p>
          </div>
        </div>

        <div className="text-sm text-[#8E9196] bg-gray-50 p-3 rounded-lg">
          <p>Community subscription payments are processed through our secure payment system. Fees and commission details may vary based on the community settings.</p>
        </div>
      </CardContent>
    </Card>
  );
}
