
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
  partnership_name?: string;
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
      
      // First fetch transactions
      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_uuid', userUuid)
        .order('created_at', { ascending: false });

      if (transactionError) {
        console.error('Error fetching transactions:', transactionError);
        throw transactionError;
      }

      console.log('Raw transaction data from database:', transactionData);

      // Debug: Let's also check what's in the affiliate_partnerships table
      const { data: allPartnerships, error: partnershipListError } = await supabase
        .from('affiliate_partnerships')
        .select('*');
      
      console.log('All partnerships in database:', allPartnerships);
      if (partnershipListError) {
        console.error('Error fetching all partnerships:', partnershipListError);
      }

      // Then fetch partnership names for transactions that have affiliate_partnership_uuid
      const transactionPromises = (transactionData || []).map(async (transaction) => {
        let partnership_name = 'N/A';
        
        if (transaction.affiliate_partnership_uuid) {
          console.log('Fetching partnership for UUID:', transaction.affiliate_partnership_uuid);
          
          const { data: partnershipData, error: partnershipError } = await supabase
            .from('affiliate_partnerships')
            .select('name')
            .eq('affiliate_partnership_uuid', transaction.affiliate_partnership_uuid)
            .maybeSingle();
          
          if (partnershipError) {
            console.error('Error fetching partnership:', partnershipError);
          } else if (partnershipData?.name) {
            partnership_name = partnershipData.name;
            console.log('Found partnership name:', partnership_name);
          } else {
            console.log('No partnership data found for UUID:', transaction.affiliate_partnership_uuid);
          }
        }

        return {
          transaction_uuid: transaction.transaction_uuid,
          amount: transaction.amount || 0,
          afiliate_fees: transaction.afiliate_fees || 0,
          created_at: transaction.created_at,
          type: transaction.type || 'unknown',
          status: transaction.status || 'unknown',
          partnership_name
        };
      });

      const result = await Promise.all(transactionPromises);
      console.log('Processed transactions with partnerships:', result);
      return result;
    },
    enabled: !!userUuid && isOpen,
  });

  const filteredTransactions = transactions.filter(transaction =>
    transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (transaction.partnership_name && transaction.partnership_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate total affiliate fees from all transactions
  const totalAffiliateFees = transactions.reduce((sum, transaction) => sum + (transaction.afiliate_fees || 0), 0);
  
  // Calculate total sales as the sum of all transaction amounts
  const totalSpent = transactions.reduce((sum, transaction) => sum + (transaction.amount || 0), 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] w-[95vw] flex flex-col">
        <DialogHeader className="space-y-4 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl font-bold">{affiliate.name}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{affiliate.status}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 p-4 rounded-xl border">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Transactions</h3>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{transactions.length}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/50 p-4 rounded-xl border">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Spent</h3>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">${totalSpent.toFixed(2)}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 p-4 rounded-xl border">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Affiliate Fees</h3>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">${totalAffiliateFees.toFixed(2)}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search transactions by type, status, or partnership..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Transactions Table */}
          <div className="flex-1 min-h-0 border rounded-xl overflow-hidden bg-card">
            {/* Table Header - Hidden on mobile, visible on tablet+ */}
            <div className="hidden md:block bg-muted/50 border-b px-6 py-4">
              <div className="grid grid-cols-6 gap-4 text-sm font-medium text-muted-foreground">
                <div>Transaction ID</div>
                <div>Type</div>
                <div>Partnership</div>
                <div className="text-right">Amount</div>
                <div className="text-right">Affiliate Fee</div>
                <div className="text-right">Date</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin mr-3" />
                  <span className="text-sm text-muted-foreground">Loading transactions...</span>
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="flex items-center justify-center py-12">
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
                    <div key={transaction.transaction_uuid} className="p-4 hover:bg-muted/30 transition-colors">
                      {/* Mobile Layout */}
                      <div className="md:hidden space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="font-mono text-xs text-muted-foreground">
                            {transaction.transaction_uuid.slice(0, 8)}...
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">${(transaction.amount || 0).toFixed(2)}</div>
                            <div className="text-sm text-emerald-600 font-medium">
                              +${(transaction.afiliate_fees || 0).toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Type: </span>
                            <span className="capitalize">{transaction.type}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Date: </span>
                            <span>{new Date(transaction.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}</span>
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Partnership: </span>
                          <span>{transaction.partnership_name}</span>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden md:grid grid-cols-6 gap-4 text-sm items-center">
                        <div className="font-mono text-xs">
                          {transaction.transaction_uuid.slice(0, 8)}...
                        </div>
                        <div className="capitalize">
                          {transaction.type}
                        </div>
                        <div className="truncate">
                          {transaction.partnership_name}
                        </div>
                        <div className="text-right font-semibold">
                          ${(transaction.amount || 0).toFixed(2)}
                        </div>
                        <div className="text-right font-semibold text-emerald-600">
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
