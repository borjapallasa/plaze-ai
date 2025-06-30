
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { AffiliateTransaction } from "@/hooks/use-affiliate-transactions";

interface AffiliateTransactionsTableProps {
  transactions: AffiliateTransaction[];
  loading: boolean;
  sortField: keyof AffiliateTransaction;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof AffiliateTransaction) => void;
}

export function AffiliateTransactionsTable({ 
  transactions, 
  loading, 
  sortField, 
  sortDirection, 
  onSort 
}: AffiliateTransactionsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "failed":
      case "cancelled":
      case "chargeback":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getSortIcon = (field: keyof AffiliateTransaction) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-[#E5E7EB] bg-white">
        <div className="p-8 text-center text-[#8E9196]">
          Loading affiliate transactions...
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white overflow-hidden">
      <ScrollArea className="w-full">
        <div className="min-w-[1200px]">
          <table className="w-full">
            <thead className="bg-[#F8F9FC] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-6 py-4 text-left min-w-[200px] w-[200px]">
                  <span className="font-medium text-sm text-[#8E9196] whitespace-nowrap">Transaction ID</span>
                </th>
                <th className="px-6 py-4 text-left min-w-[150px] w-[150px]">
                  <button 
                    onClick={() => onSort("created_at")}
                    className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] whitespace-nowrap"
                  >
                    Date {getSortIcon("created_at")}
                  </button>
                </th>
                <th className="px-6 py-4 text-left min-w-[200px] w-[200px]">
                  <button 
                    onClick={() => onSort("user_name")}
                    className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] whitespace-nowrap"
                  >
                    User {getSortIcon("user_name")}
                  </button>
                </th>
                <th className="px-6 py-4 text-left min-w-[200px] w-[200px]">
                  <button 
                    onClick={() => onSort("partnership_name")}
                    className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] whitespace-nowrap"
                  >
                    Partnership {getSortIcon("partnership_name")}
                  </button>
                </th>
                <th className="px-6 py-4 text-left min-w-[120px] w-[120px]">
                  <button 
                    onClick={() => onSort("amount")}
                    className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] whitespace-nowrap"
                  >
                    Amount {getSortIcon("amount")}
                  </button>
                </th>
                <th className="px-6 py-4 text-left min-w-[120px] w-[120px]">
                  <button 
                    onClick={() => onSort("percentage_commission")}
                    className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] whitespace-nowrap"
                  >
                    Commission % {getSortIcon("percentage_commission")}
                  </button>
                </th>
                <th className="px-6 py-4 text-left min-w-[120px] w-[120px]">
                  <button 
                    onClick={() => onSort("affiliate_fees")}
                    className="flex items-center gap-2 font-medium text-sm text-[#8E9196] hover:text-[#1A1F2C] whitespace-nowrap"
                  >
                    Affiliate Fees {getSortIcon("affiliate_fees")}
                  </button>
                </th>
                <th className="px-6 py-4 text-left min-w-[100px] w-[100px]">
                  <span className="font-medium text-sm text-[#8E9196] whitespace-nowrap">Status</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-[#8E9196]">
                    No affiliate transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr
                    key={transaction.transaction_uuid}
                    className="hover:bg-[#F8F9FC] transition-colors duration-200"
                  >
                    <td className="px-6 py-4 min-w-[200px] w-[200px]">
                      <div className="text-sm text-[#1A1F2C] font-mono text-xs truncate">
                        {transaction.transaction_uuid.slice(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 min-w-[150px] w-[150px]">
                      <div className="text-sm text-[#8E9196] whitespace-nowrap">
                        {new Date(transaction.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 min-w-[200px] w-[200px]">
                      <div className="space-y-1">
                        <div className="text-sm text-[#1A1F2C] font-medium truncate">
                          {transaction.user_name}
                        </div>
                        <div className="text-xs text-[#8E9196] truncate">
                          {transaction.user_email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 min-w-[200px] w-[200px]">
                      <div className="text-sm text-[#8E9196] truncate">
                        {transaction.partnership_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 min-w-[120px] w-[120px]">
                      <div className="text-sm text-[#1A1F2C] font-medium whitespace-nowrap">
                        ${transaction.amount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 min-w-[120px] w-[120px]">
                      <div className="text-sm text-[#1A1F2C] font-medium whitespace-nowrap">
                        {transaction.percentage_commission.toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 min-w-[120px] w-[120px]">
                      <div className="text-sm text-[#1A1F2C] font-medium whitespace-nowrap">
                        ${transaction.affiliate_fees.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 min-w-[100px] w-[100px]">
                      <Badge 
                        variant="secondary" 
                        className={`${getStatusColor(transaction.status)} capitalize whitespace-nowrap`}
                      >
                        {transaction.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
