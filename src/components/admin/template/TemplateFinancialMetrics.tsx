
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TemplateFinancialMetricsProps {
  salesCount?: number;
  salesAmount?: number;
  feesAmount?: number;
}

export function TemplateFinancialMetrics({ 
  salesCount, 
  salesAmount, 
  feesAmount 
}: TemplateFinancialMetricsProps) {
  const mockConversionRate = 8.5;
  
  // Calculate average price as sales_amount / sales_count
  const averagePrice = salesCount && salesCount > 0 && salesAmount ? 
    (salesAmount / salesCount).toFixed(2) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Financial Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-[#8E9196]">Times Sold</p>
            <p className="text-xl font-semibold">{salesCount || 0}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-[#8E9196]">Total Revenue</p>
            <p className="text-xl font-semibold text-green-600">
              ${salesAmount || 0}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-[#8E9196]">Average Price</p>
            <p className="text-xl font-semibold">
              ${averagePrice}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-[#8E9196]">Fees Amount</p>
            <p className="text-xl font-semibold text-red-600">
              ${feesAmount || 0}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
