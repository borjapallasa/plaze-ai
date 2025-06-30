
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Loader2, TrendingUp } from "lucide-react";
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
  affiliate_boosted?: boolean;
  affiliate_amount_boosted?: number;
  original_affiliate_fees?: number;
  boosted_amount?: number;
  commission_percentage?: number;
  base_commission_percentage?: number;
  additional_commission_percentage?: number;
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

        // Calculate affiliate fee breakdown similar to useAffiliateTransactions
        const baseAmount = transaction.amount || 0;
        const isBoosted = transaction.affiliate_boosted || false;
        const totalAffiliateFees = transaction.afiliate_fees || 0;
        
        const additionalPercentageDecimal = transaction.affiliate_amount_boosted || 0;
        const additionalPercentage = Math.round(additionalPercentageDecimal * 100);
        
        let originalAffiliateFees = totalAffiliateFees;
        let baseCommissionPercentage = 0; // Start with 0 instead of 5
        let totalCommissionPercentage = 0; // Start with 0
        let boostedAmount = 0;
        
        if (isBoosted && additionalPercentage > 0 && baseAmount > 0) {
          boostedAmount = baseAmount * additionalPercentageDecimal;
          originalAffiliateFees = totalAffiliateFees - boostedAmount;
          
          if (originalAffiliateFees > 0) {
            baseCommissionPercentage = Math.round((originalAffiliateFees / baseAmount) * 100);
          }
          totalCommissionPercentage = baseCommissionPercentage + additionalPercentage;
        } else if (baseAmount > 0 && totalAffiliateFees > 0) {
          totalCommissionPercentage = Math.round((totalAffiliateFees / baseAmount) * 100);
          baseCommissionPercentage = totalCommissionPercentage;
        }

        return {
          transaction_uuid: transaction.transaction_uuid,
          amount: baseAmount,
          afiliate_fees: totalAffiliateFees,
          created_at: transaction.created_at,
          type: transaction.type || 'unknown',
          status: transaction.status || 'unknown',
          partnership_name,
          affiliate_boosted: isBoosted,
          affiliate_amount_boosted: additionalPercentageDecimal,
          original_affiliate_fees: originalAffiliateFees,
          boosted_amount: boostedAmount,
          commission_percentage: totalCommissionPercentage,
          base_commission_percentage: baseCommissionPercentage,
          additional_commission_percentage: additionalPercentage
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

  const renderAffiliateFees = (transaction: Transaction) => {
    const originalFees = transaction.original_affiliate_fees || 0;
    const boostedAmount = transaction.boosted_amount || 0;
    const finalAmount = transaction.afiliate_fees;
    
    if (transaction.affiliate_boosted && boostedAmount > 0) {
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

  const renderCommission = (transaction: Transaction) => {
    const basePercentage = transaction.base_commission_percentage || 0;
    const additionalPercentage = transaction.additional_commission_percentage || 0;
    const originalFees = transaction.original_affiliate_fees || 0;
    
    if (transaction.affiliate_boosted && additionalPercentage > 0) {
      return (
        <div className="text-right whitespace-nowrap">
          <div className="flex items-center justify-end gap-1">
            <span className="text-xs text-muted-foreground">
              {originalFees > 0 ? `${basePercentage}%` : '0%'} + {additionalPercentage}%
            </span>
            <TrendingUp className="h-3 w-3 text-green-600" />
          </div>
          <div className="font-medium">
            {transaction.commission_percentage}%
          </div>
        </div>
      );
    }
    
    return (
      <div className="text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1">
          {transaction.commission_percentage}%
          {transaction.affiliate_boosted && (
            <TrendingUp className="h-3 w-3 text-green-600" />
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] w-[95vw] flex flex-col p-4 sm:p-6">
        <DialogHeader className="space-y-3 sm:space-y-4 pb-4 sm:pb-6">
          <div className="flex flex-col space-y-2">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-center sm:text-left">{affiliate.name}</DialogTitle>
            <p className="text-sm text-muted-foreground text-center sm:text-left">{affiliate.status}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-card border rounded-lg p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">{transactions.length}</div>
              <div className="text-sm text-muted-foreground">Transactions</div>
            </div>
            <div className="bg-card border rounded-lg p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">${totalSpent.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Spent</div>
            </div>
            <div className="bg-card border rounded-lg p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">${totalAffiliateFees.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Affiliate Fees</div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 space-y-4 sm:space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 sm:h-12"
            />
          </div>

          {/* Transactions Table */}
          <div className="flex-1 min-h-0 border rounded-xl overflow-hidden bg-card">
            {/* Table Header - Hidden on mobile */}
            <div className="hidden sm:block bg-muted/50 border-b px-4 sm:px-6 py-3 sm:py-4">
              <div className="grid grid-cols-8 gap-4 text-sm font-medium text-muted-foreground">
                <div>Transaction ID</div>
                <div>Type</div>
                <div>Partnership</div>
                <div className="text-right">Amount</div>
                <div className="text-right">Commission %</div>
                <div className="text-right">Base Fee</div>
                <div className="text-right">Boost</div>
                <div className="text-right">Total Fee</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="max-h-64 sm:max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8 sm:py-12">
                  <Loader2 className="h-6 w-6 animate-spin mr-3" />
                  <span className="text-sm text-muted-foreground">Loading transactions...</span>
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="flex items-center justify-center py-8 sm:py-12">
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
                    <div key={transaction.transaction_uuid} className="p-3 sm:p-4 hover:bg-muted/30 transition-colors">
                      {/* Mobile Layout */}
                      <div className="sm:hidden space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="font-mono text-xs text-muted-foreground">
                            {transaction.transaction_uuid.slice(0, 8)}...
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">${(transaction.amount || 0).toFixed(2)}</div>
                            <div className="text-sm text-emerald-600 font-medium">
                              +${(transaction.afiliate_fees || 0).toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="capitalize font-medium">{transaction.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Partnership:</span>
                            <span className="font-medium">{transaction.partnership_name}</span>
                          </div>
                          {transaction.affiliate_boosted && (
                            <div className="grid grid-cols-3 gap-2 text-xs bg-muted/50 p-2 rounded">
                              <div className="text-center">
                                <div className="text-muted-foreground">Base Fee</div>
                                <div className="font-medium">${(transaction.original_affiliate_fees || 0).toFixed(2)}</div>
                                <div className="text-blue-600">
                                  {(transaction.original_affiliate_fees || 0) > 0 ? `${transaction.base_commission_percentage}%` : '0%'}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-muted-foreground">Boost</div>
                                <div className="font-medium text-green-600">+${(transaction.boosted_amount || 0).toFixed(2)}</div>
                                <div className="text-green-600">+{transaction.additional_commission_percentage}%</div>
                              </div>
                              <div className="text-center">
                                <div className="text-muted-foreground">Total</div>
                                <div className="font-medium">${(transaction.afiliate_fees || 0).toFixed(2)}</div>
                                <div className="text-emerald-600">{transaction.commission_percentage}%</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden sm:grid grid-cols-8 gap-4 text-sm items-center">
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
                        <div>
                          {renderCommission(transaction)}
                        </div>
                        <div className="text-right">
                          {transaction.affiliate_boosted ? (
                            <div>
                              <div className="font-semibold text-blue-600">
                                ${(transaction.original_affiliate_fees || 0).toFixed(2)}
                              </div>
                              <div className="text-xs text-blue-600">
                                {(transaction.original_affiliate_fees || 0) > 0 ? `${transaction.base_commission_percentage}%` : '0%'}
                              </div>
                            </div>
                          ) : (
                            <div className="font-semibold">
                              ${(transaction.original_affiliate_fees || 0).toFixed(2)}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          {transaction.affiliate_boosted && transaction.boosted_amount ? (
                            <div>
                              <div className="font-semibold text-green-600">
                                +${transaction.boosted_amount.toFixed(2)}
                              </div>
                              <div className="text-xs text-green-600">
                                +{transaction.additional_commission_percentage}%
                              </div>
                            </div>
                          ) : (
                            <div className="text-muted-foreground text-xs">-</div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-emerald-600">
                            ${(transaction.afiliate_fees || 0).toFixed(2)}
                          </div>
                          <div className="text-xs text-emerald-600">
                            {transaction.commission_percentage}%
                          </div>
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
