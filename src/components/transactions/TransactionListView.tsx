
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserTransaction {
  id: string;
  concept: string;
  type: 'product' | 'community';
  createdAt: string;
  amount: number;
  status: string;
  seller: string;
  itemCount?: number;
  linkId: string;
}

interface TransactionListViewProps {
  transactions: UserTransaction[];
  loading: boolean;
  onRowClick: (transaction: UserTransaction) => void;
  activeTab: string;
}

export function TransactionListView({ 
  transactions, 
  loading, 
  onRowClick, 
  activeTab 
}: TransactionListViewProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <Card key={index} className="p-6 animate-pulse">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-[#8E9196]">No transactions found matching your criteria</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction, index) => (
        <Card 
          key={index}
          className="p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
          onClick={() => onRowClick(transaction)}
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <h3 className="font-medium text-[#1A1F2C] truncate">
                  {transaction.concept}
                </h3>
                {activeTab !== "communities" && (
                  <span className="text-xs text-[#8E9196] capitalize bg-gray-100 px-2 py-1 rounded">
                    {transaction.type}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-[#8E9196]">
                <span>
                  {activeTab === "communities" ? "Community:" : "Seller:"} {transaction.seller}
                </span>
                <span>•</span>
                <span>{transaction.createdAt}</span>
                {activeTab === "products" && transaction.itemCount && (
                  <>
                    <span>•</span>
                    <span>{transaction.itemCount} items</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-medium text-[#1A1F2C]">
                  ${transaction.amount.toFixed(2)}
                </div>
              </div>
              <Badge 
                variant="secondary" 
                className={`${getStatusColor(transaction.status)} capitalize`}
              >
                {transaction.status}
              </Badge>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
