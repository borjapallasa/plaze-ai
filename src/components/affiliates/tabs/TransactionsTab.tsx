
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
import { Copy, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function TransactionsTab() {
  const { data: transactions = [], isLoading, error } = useAffiliateTransactions();
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    
    switch (status.toLowerCase()) {
      case "paid":
      case "completed":
        return <Badge variant="default">{capitalizedStatus}</Badge>;
      case "pending":
        return <Badge variant="outline">{capitalizedStatus}</Badge>;
      case "failed":
        return <Badge variant="destructive">{capitalizedStatus}</Badge>;
      default:
        return <Badge variant="secondary">{capitalizedStatus}</Badge>;
    }
  };

  const copyTransactionId = async (transactionId: string) => {
    try {
      await navigator.clipboard.writeText(transactionId);
      toast({
        title: "Transaction ID copied!",
        description: "Transaction ID has been copied to your clipboard",
      });
    } catch (err) {
      console.error('Failed to copy transaction ID:', err);
      toast({
        title: "Copy failed",
        description: "Failed to copy transaction ID to clipboard",
        variant: "destructive",
      });
    }
  };

  const renderAffiliateFees = (transaction: any) => {
    const originalFees = transaction.original_affiliate_fees || 0;
    const boostedAmount = transaction.boosted_amount || 0;
    const finalAmount = transaction.affiliate_fees;
    
    if (transaction.is_boosted && boostedAmount > 0) {
      return (
        <div className="text-right font-mono whitespace-nowrap">
          <div className="text-xs text-muted-foreground">
            ${originalFees.toFixed(2)} + ${boostedAmount.toFixed(2)}
          </div>
          <div className="text-green-600 font-medium">
            ${finalAmount.toFixed(2)}
          </div>
        </div>
      );
    }
    
    return (
      <div className="text-right font-mono whitespace-nowrap text-green-600 font-medium">
        ${finalAmount.toFixed(2)}
      </div>
    );
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
            <TableHead className="whitespace-nowrap">Date</TableHead>
            <TableHead className="whitespace-nowrap">User</TableHead>
            <TableHead className="whitespace-nowrap">Partnership</TableHead>
            <TableHead className="text-right whitespace-nowrap">Amount</TableHead>
            <TableHead className="text-right whitespace-nowrap">Commission %</TableHead>
            <TableHead className="text-right whitespace-nowrap">Affiliate Fees</TableHead>
            <TableHead className="whitespace-nowrap">Status</TableHead>
            <TableHead className="whitespace-nowrap">Transaction ID</TableHead>
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
                <TableCell className="whitespace-nowrap">{transaction.created_at}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{transaction.user_name}</div>
                    <div className="text-sm text-muted-foreground">{transaction.user_email}</div>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">{transaction.partnership_name}</TableCell>
                <TableCell className="text-right font-mono whitespace-nowrap">
                  ${transaction.amount.toFixed(2)}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    {transaction.commission_percentage}%
                    {transaction.is_boosted && (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {renderAffiliateFees(transaction)}
                </TableCell>
                <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                <TableCell>
                  <button
                    onClick={() => copyTransactionId(transaction.transaction_uuid)}
                    className="flex items-center gap-1 font-mono text-sm hover:bg-muted/50 rounded px-1 py-0.5 transition-colors"
                  >
                    <span className="truncate max-w-[120px]">{transaction.transaction_uuid}</span>
                    <Copy className="h-3 w-3 opacity-50" />
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
