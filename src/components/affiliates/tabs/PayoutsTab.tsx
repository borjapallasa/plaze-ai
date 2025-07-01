
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useAffiliatePayouts } from "@/hooks/use-affiliate-payouts";
import { useToast } from "@/hooks/use-toast";
import { toStartCase } from "@/lib/utils";

export function PayoutsTab() {
  const { data, isLoading, error } = useAffiliatePayouts();
  const { toast } = useToast();

  const payouts = data?.payouts || [];
  const totalPaidOut = data?.totalPaidOut || 0;

  const getStatusBadge = (status: string) => {
    const displayStatus = toStartCase(status);
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge variant="default">{displayStatus}</Badge>;
      case "processing":
        return <Badge variant="secondary">{displayStatus}</Badge>;
      case "pending":
        return <Badge variant="outline">{displayStatus}</Badge>;
      case "failed":
        return <Badge variant="destructive">{displayStatus}</Badge>;
      default:
        return <Badge variant="secondary">{displayStatus}</Badge>;
    }
  };

  const getPaymentMethodDisplay = (method: string) => {
    switch (method.toLowerCase()) {
      case "paypal":
        return "PayPal";
      case "bank_transfer":
        return "Bank Transfer";
      case "stripe":
        return "Stripe";
      default:
        return method || "Unknown";
    }
  };

  const copyPayoutId = async (payoutId: string) => {
    try {
      await navigator.clipboard.writeText(payoutId);
      toast({
        title: "Copied!",
        description: "Payout ID has been copied to your clipboard",
      });
    } catch (err) {
      console.error('Failed to copy payout ID:', err);
      toast({
        title: "Copy failed",
        description: "Failed to copy payout ID to clipboard",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-md border">
          <div className="p-8 text-center text-muted-foreground">
            Loading payouts...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="rounded-md border">
          <div className="p-8 text-center text-red-500">
            Error loading payouts: {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Total Paid Out Summary */}
      <div className="rounded-md border p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Total Paid Out</h3>
          <p className="text-3xl font-bold text-green-600">${totalPaidOut.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Sum of all completed payouts
          </p>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="rounded-md border">
        <div className="w-full overflow-auto">
          <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
            </colgroup>
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Amount</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Method</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Payout ID</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {payouts.length === 0 ? (
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td colSpan={5} className="p-4 align-middle text-center text-muted-foreground py-8">
                    No payouts found
                  </td>
                </tr>
              ) : (
                payouts.map((payout) => (
                  <tr key={payout.payout_uuid} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle">{payout.created_at}</td>
                    <td className="p-4 align-middle text-right font-mono">
                      ${payout.amount.toFixed(2)}
                    </td>
                    <td className="p-4 align-middle">{getStatusBadge(payout.status)}</td>
                    <td className="p-4 align-middle">{getPaymentMethodDisplay(payout.method)}</td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm truncate flex-1">{payout.payout_uuid}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyPayoutId(payout.payout_uuid)}
                          className="flex items-center gap-1 px-2 shrink-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
