
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
import { useAffiliateTransactions } from "@/hooks/use-affiliate-transactions";

export function TransactionsTab() {
  const { data: transactions = [], isLoading, error } = useAffiliateTransactions();

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
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

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center text-muted-foreground">
          Loading transactions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center text-red-500">
          Error loading transactions: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Partnership</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Commission %</TableHead>
            <TableHead className="text-right">Affiliate Fees</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Transaction ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                No transactions found
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.transaction_uuid}>
                <TableCell>{transaction.created_at}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{transaction.user_name}</div>
                    <div className="text-sm text-muted-foreground">{transaction.user_email}</div>
                  </div>
                </TableCell>
                <TableCell>{transaction.partnership_name}</TableCell>
                <TableCell className="text-right font-mono">
                  ${transaction.amount.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {transaction.commission_percentage}%
                </TableCell>
                <TableCell className="text-right font-mono">
                  ${transaction.affiliate_fees.toFixed(2)}
                </TableCell>
                <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                <TableCell>
                  <span className="font-mono text-sm">{transaction.transaction_uuid}</span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
