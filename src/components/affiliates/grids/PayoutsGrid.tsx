
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, CreditCard } from "lucide-react";

interface Payout {
  id: string;
  date: string;
  amount: number;
  status: "completed" | "processing" | "pending" | "failed";
  paymentMethod: "paypal" | "bank_transfer" | "stripe";
  referenceId: string;
  description: string;
}

interface PayoutsGridProps {
  payouts: Payout[];
}

export function PayoutsGrid({ payouts }: PayoutsGridProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default">Completed</Badge>;
      case "processing":
        return <Badge variant="secondary">Processing</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case "paypal":
        return "PayPal";
      case "bank_transfer":
        return "Bank Transfer";
      case "stripe":
        return "Stripe";
      default:
        return method;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {payouts.map((payout) => (
        <Card key={payout.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{new Date(payout.date).toLocaleDateString()}</span>
              </div>
              {getStatusBadge(payout.status)}
            </div>
            
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-lg font-bold">${payout.amount.toFixed(2)}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-3 w-3 text-muted-foreground" />
                <span>{getPaymentMethodDisplay(payout.paymentMethod)}</span>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {payout.description}
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <div className="text-xs text-muted-foreground font-mono">
                {payout.referenceId}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
