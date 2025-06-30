
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

interface Payout {
  id: string;
  date: string;
  amount: number;
  status: "completed" | "processing" | "pending" | "failed";
  paymentMethod: "paypal" | "bank_transfer" | "stripe";
  referenceId: string;
  description: string;
}

const mockPayouts: Payout[] = [
  {
    id: "1",
    date: "2024-06-15",
    amount: 1250.00,
    status: "completed",
    paymentMethod: "paypal",
    referenceId: "PAY_ABC123",
    description: "Monthly commission payout"
  },
  {
    id: "2",
    date: "2024-05-15",
    amount: 875.50,
    status: "completed",
    paymentMethod: "paypal",
    referenceId: "PAY_DEF456",
    description: "Monthly commission payout"
  },
  {
    id: "3",
    date: "2024-06-28",
    amount: 445.75,
    status: "processing",
    paymentMethod: "bank_transfer",
    referenceId: "PAY_GHI789",
    description: "Bonus commission payout"
  },
  {
    id: "4",
    date: "2024-06-30",
    amount: 320.00,
    status: "pending",
    paymentMethod: "paypal",
    referenceId: "PAY_JKL012",
    description: "Weekly commission payout"
  }
];

export function PayoutsTab() {
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

  const totalPending = mockPayouts
    .filter(p => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalCompleted = mockPayouts
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

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
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPayouts.map((payout) => (
              <TableRow key={payout.id}>
                <TableCell>{new Date(payout.date).toLocaleDateString()}</TableCell>
                <TableCell className="text-right font-mono">
                  ${payout.amount.toFixed(2)}
                </TableCell>
                <TableCell>{getStatusBadge(payout.status)}</TableCell>
                <TableCell>{getPaymentMethodDisplay(payout.paymentMethod)}</TableCell>
                <TableCell>
                  <span className="font-mono text-sm">{payout.referenceId}</span>
                </TableCell>
                <TableCell>{payout.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
