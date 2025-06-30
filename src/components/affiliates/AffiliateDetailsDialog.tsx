import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface Transaction {
  transaction_uuid: string;
  amount: number;
  afiliate_fees: number;
  created_at: string;
  type: string;
  status: string;
  product_name?: string;
  community_name?: string;
}

interface AffiliateDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  affiliate: {
    name: string;
    status: string;
    activeTemplates: number;
    totalSales: string;
    affiliateFees: string;
  };
  userUuid?: string;
}

export function AffiliateDetailsDialog({ isOpen, onClose, affiliate, userUuid }: AffiliateDetailsDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['affiliate-user-transactions', userUuid],
    queryFn: async (): Promise<Transaction[]> => {
      if (!userUuid) {
        console.log('No userUuid provided for transaction fetch');
        return [];
      }

      console.log('Fetching transactions for user UUID:', userUuid);
      
      // Fetch transactions with related product and community information
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          products_transactions!inner(
            products!inner(name)
          ),
          community_subscriptions_transactions!inner(
            communities!inner(name)
          )
        `)
        .eq('user_uuid', userUuid)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }

      console.log('Raw transaction data from database:', data);

      // Transform the data to include product and community names
      const transformedTransactions: Transaction[] = [];
      
      for (const transaction of data || []) {
        let productName = null;
        let communityName = null;
        
        // Get product name for product transactions
        if (transaction.type === 'product' && transaction.products_transactions?.products?.name) {
          productName = transaction.products_transactions.products.name;
        }
        
        // Get community name for community transactions
        if (transaction.type === 'community' && transaction.community_subscriptions_transactions?.communities?.name) {
          communityName = transaction.community_subscriptions_transactions.communities.name;
        }

        transformedTransactions.push({
          transaction_uuid: transaction.transaction_uuid,
          amount: transaction.amount || 0,
          afiliate_fees: transaction.afiliate_fees || 0,
          created_at: transaction.created_at,
          type: transaction.type || 'unknown',
          status: transaction.status || 'unknown',
          product_name: productName,
          community_name: communityName
        });
      }

      console.log('Transformed transaction data:', transformedTransactions);
      return transformedTransactions;
    },
    enabled: !!userUuid && isOpen,
  });

  const filteredTransactions = transactions.filter(transaction =>
    transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (transaction.product_name && transaction.product_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (transaction.community_name && transaction.community_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate total affiliate fees from all transactions
  const totalAffiliateFees = transactions.reduce((sum, transaction) => sum + (transaction.afiliate_fees || 0), 0);
  
  // Calculate total sales as the sum of all transaction amounts
  const totalSales = transactions.reduce((sum, transaction) => sum + (transaction.amount || 0), 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold">{affiliate.name}</DialogTitle>
          <p className="text-sm text-muted-foreground">{affiliate.status}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-muted/50 p-3 rounded-lg">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Transactions</h3>
              <p className="text-lg font-semibold mt-1">{transactions.length}</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Sales</h3>
              <p className="text-lg font-semibold text-green-600 mt-1">${totalSales.toFixed(2)}</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Affiliate Fees</h3>
              <p className="text-lg font-semibold text-blue-600 mt-1">${totalAffiliateFees.toFixed(2)}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search transactions by type, status, product, or community..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Transactions Table */}
          <div className="flex-1 overflow-hidden border rounded-lg">
            {/* Table Header */}
            <div className="bg-muted/50 border-b px-4 py-3">
              <div className="grid grid-cols-6 gap-4 text-sm font-medium">
                <div>Transaction ID</div>
                <div>Type</div>
                <div>Partnership</div>
                <div className="text-right">Amount</div>
                <div className="text-right">Affiliate Fee</div>
                <div className="text-right">Date</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">Loading transactions...</span>
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">No transactions found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {searchTerm ? 'Try adjusting your search terms' : `This user (${userUuid}) has no transactions yet`}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredTransactions.map((transaction) => (
                    <div key={transaction.transaction_uuid} className="grid grid-cols-6 gap-4 px-4 py-3 hover:bg-muted/50 transition-colors text-sm">
                      <div className="font-mono text-xs truncate">
                        {transaction.transaction_uuid.slice(0, 8)}...
                      </div>
                      <div className="capitalize">
                        {transaction.type}
                      </div>
                      <div className="truncate">
                        {transaction.product_name || transaction.community_name || 'N/A'}
                      </div>
                      <div className="text-right font-medium">
                        ${(transaction.amount || 0).toFixed(2)}
                      </div>
                      <div className="text-right font-medium text-green-600">
                        ${(transaction.afiliate_fees || 0).toFixed(2)}
                      </div>
                      <div className="text-right text-muted-foreground">
                        {new Date(transaction.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
