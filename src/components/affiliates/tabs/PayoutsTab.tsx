
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAffiliatePayouts } from "@/hooks/use-affiliate-payouts";
import { useToast } from "@/hooks/use-toast";
import { toStartCase } from "@/lib/utils";

export function PayoutsTab() {
  const { data: payouts = [], isLoading, error } = useAffiliatePayouts();
  const { toast } = useToast();

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

  const totalPending = payouts
    .filter(p => p.status.toLowerCase() === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalCompleted = payouts
    .filter(p => p.status.toLowerCase() === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Pending Payouts</div>
            <div className="text-2xl font-bold">Loading...</div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Completed This Month</div>
            <div className="text-2xl font-bold">Loading...</div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Total Payouts</div>
            <div className="text-2xl font-bold">Loading...</div>
          </div>
        </div>
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
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Pending Payouts</div>
            <div className="text-2xl font-bold">$0.00</div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Completed This Month</div>
            <div className="text-2xl font-bold">$0.00</div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Total Payouts</div>
            <div className="text-2xl font-bold">$0.00</div>
          </div>
        </div>
        <div className="rounded-md border">
          <div className="p-8 text-center text-red-500">
            Error loading payouts: {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Pending Payouts</div>
          <div className="text-2xl font-bold">${totalPending.toFixed(2)}</div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Completed This Month</div>
          <div className="text-2xl font-bold">${totalCompleted.toFixed(2)}</div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Total Payouts</div>
          <div className="text-2xl font-bold">${(totalPending + totalCompleted).toFixed(2)}</div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/5">Date</TableHead>
              <TableHead className="w-1/5 text-right">Amount</TableHead>
              <TableHead className="w-1/5">Status</TableHead>
              <TableHead className="w-1/5">Method</TableHead>
              <TableHead className="w-1/5">Payout ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payouts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No payouts found
                </TableCell>
              </TableRow>
            ) : (
              payouts.map((payout) => (
                <TableRow key={payout.payout_uuid}>
                  <TableCell className="w-1/5">{payout.created_at}</TableCell>
                  <TableCell className="w-1/5 text-right font-mono">
                    ${payout.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="w-1/5">{getStatusBadge(payout.status)}</TableCell>
                  <TableCell className="w-1/5">{getPaymentMethodDisplay(payout.method)}</TableCell>
                  <TableCell className="w-1/5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{payout.payout_uuid}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyPayoutId(payout.payout_uuid)}
                        className="flex items-center gap-1 px-2 shrink-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
