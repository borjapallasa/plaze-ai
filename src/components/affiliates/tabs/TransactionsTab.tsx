
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AffiliateLayoutSwitcher } from "../AffiliateLayoutSwitcher";
import { TransactionsGrid } from "../grids/TransactionsGrid";

interface AffiliateTransaction {
  id: string;
  date: string;
  userName: string;
  userEmail: string;
  productName: string;
  amount: number;
  commissionRate: number;
  commissionEarned: number;
  status: "completed" | "pending" | "failed";
  referenceId: string;
}

const mockTransactions: AffiliateTransaction[] = [
  {
    id: "1",
    date: "2024-06-25",
    userName: "Alice Brown",
    userEmail: "alice@example.com",
    productName: "Premium Template Pack",
    amount: 99.00,
    commissionRate: 0.10,
    commissionEarned: 9.90,
    status: "completed",
    referenceId: "TXN_001"
  },
  {
    id: "2",
    date: "2024-06-24",
    userName: "Bob Miller",
    userEmail: "bob@example.com",
    productName: "Advanced Course Bundle",
    amount: 299.00,
    commissionRate: 0.15,
    commissionEarned: 44.85,
    status: "completed",
    referenceId: "TXN_002"
  },
  {
    id: "3",
    date: "2024-06-23",
    userName: "Carol White",
    userEmail: "carol@example.com",
    productName: "Starter Kit",
    amount: 49.00,
    commissionRate: 0.10,
    commissionEarned: 4.90,
    status: "pending",
    referenceId: "TXN_003"
  },
  {
    id: "4",
    date: "2024-06-22",
    userName: "David Lee",
    userEmail: "david@example.com",
    productName: "Pro Membership",
    amount: 199.00,
    commissionRate: 0.12,
    commissionEarned: 23.88,
    status: "failed",
    referenceId: "TXN_004"
  }
];

export function TransactionsTab() {
  const [layout, setLayout] = useState<"table" | "grid">("table");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default">Completed</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AffiliateLayoutSwitcher layout={layout} onLayoutChange={setLayout} />
      </div>

      {layout === "table" ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{transaction.userName}</div>
                      <div className="text-sm text-muted-foreground">{transaction.userEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>{transaction.productName}</TableCell>
                  <TableCell className="text-right font-mono">
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {(transaction.commissionRate * 100).toFixed(0)}%
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${transaction.commissionEarned.toFixed(2)}
                  </TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{transaction.referenceId}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <TransactionsGrid transactions={mockTransactions} />
      )}
    </div>
  );
}
