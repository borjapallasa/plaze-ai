
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = mockTransactions.filter(transaction =>
    transaction.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.referenceId.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Affiliate Transactions</h2>
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

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
            {filteredTransactions.map((transaction) => (
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
    </div>
  );
}
