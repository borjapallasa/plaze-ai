
import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAffiliatePayouts } from "@/hooks/use-affiliate-payouts";

export function PayoutsTab() {
  const { data: payouts = [], isLoading, error } = useAffiliatePayouts();

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
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
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Reference ID</TableHead>
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
                  <TableCell>{payout.created_at}</TableCell>
                  <TableCell className="text-right font-mono">
                    ${payout.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{getStatusBadge(payout.status)}</TableCell>
                  <TableCell>{getPaymentMethodDisplay(payout.method)}</TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{payout.payout_uuid}</span>
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
