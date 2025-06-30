
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useUserTransactions } from "@/hooks/admin/useUserTransactions";
import { useState } from "react";

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
  const { transactions, isLoading } = useUserTransactions(userUuid || '');

  // Filter transactions based on search term
  const filteredTransactions = transactions?.filter(transaction =>
    transaction.seller_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.type?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-8 pb-6">
          <DialogTitle className="text-4xl font-bold">{affiliate.name}</DialogTitle>
          <p className="text-muted-foreground text-lg">{affiliate.status}</p>
        </DialogHeader>

        <div className="px-8 pb-8 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Active Templates</h3>
              <p className="text-3xl font-semibold">{affiliate.activeTemplates}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Sales</h3>
              <p className="text-3xl font-semibold">{affiliate.totalSales}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Affiliate Fees</h3>
              <p className="text-3xl font-semibold">{affiliate.affiliateFees}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Type here to search"
                className="pl-12 py-4 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading transactions...</span>
              </div>
            ) : (
              <div className="overflow-auto border rounded-lg">
                <div className="min-w-[800px]">
                  <div className="sticky top-0 bg-muted/50 z-10">
                    <div className="grid grid-cols-5 gap-6 p-4">
                      <div className="font-medium text-base">Template</div>
                      <div className="font-medium text-right text-base">Transaction Amount</div>
                      <div className="font-medium text-right text-base">Multiplier</div>
                      <div className="font-medium text-right text-base">Affiliate Fee</div>
                      <div className="font-medium text-right text-base">Transaction Date</div>
                    </div>
                  </div>
                  <div className="divide-y">
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction) => (
                        <div key={transaction.transaction_uuid} className="grid grid-cols-5 gap-6 p-4 hover:bg-muted/50">
                          <div className="truncate text-base">
                            {transaction.seller_name || 'Unknown Template'}
                          </div>
                          <div className="text-right text-base">
                            ${(transaction.amount || 0).toFixed(2)}
                          </div>
                          <div className="text-right text-base">0.03</div>
                          <div className="text-right text-base">
                            ${(transaction.afiliate_fees || 0).toFixed(2)}
                          </div>
                          <div className="text-right text-base">
                            {new Date(transaction.created_at).toLocaleDateString('en-US', {
                              month: 'numeric',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: true
                            })}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        {searchTerm ? 'No transactions found matching your search.' : 'No transactions found for this user.'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
