
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, User, Package, ExternalLink } from "lucide-react";

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

interface TransactionsGridProps {
  transactions: AffiliateTransaction[];
}

export function TransactionsGrid({ transactions }: TransactionsGridProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {transactions.map((transaction) => (
        <Card key={transaction.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{new Date(transaction.date).toLocaleDateString()}</span>
              </div>
              {getStatusBadge(transaction.status)}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-3 w-3 text-muted-foreground" />
                <div className="min-w-0">
                  <div className="font-medium truncate">{transaction.userName}</div>
                  <div className="text-xs text-muted-foreground truncate">{transaction.userEmail}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Package className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm truncate">{transaction.productName}</span>
              </div>
            </div>
            
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-mono">${transaction.amount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Rate</span>
                <span>{(transaction.commissionRate * 100).toFixed(0)}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Commission</span>
                <span className="font-mono">${transaction.commissionEarned.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
              <span className="font-mono">{transaction.referenceId}</span>
              <ExternalLink className="h-3 w-3" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
