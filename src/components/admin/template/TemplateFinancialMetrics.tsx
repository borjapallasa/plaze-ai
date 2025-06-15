
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TemplateFinancialMetricsProps {
  salesCount?: number;
  salesAmount?: number;
  priceFrom?: number;
}

export function TemplateFinancialMetrics({ 
  salesCount, 
  salesAmount, 
  priceFrom 
}: TemplateFinancialMetricsProps) {
  const mockConversionRate = 8.5;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Financial Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-[#8E9196]">Times Sold</p>
            <p className="text-xl font-semibold">{salesCount || 35}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-[#8E9196]">Total Revenue</p>
            <p className="text-xl font-semibold text-green-600">
              ${salesAmount || 1200}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-[#8E9196]">Average Price</p>
            <p className="text-xl font-semibold">
              ${priceFrom || 39}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-[#8E9196]">Conversion Rate</p>
            <p className="text-xl font-semibold">
              {mockConversionRate}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
