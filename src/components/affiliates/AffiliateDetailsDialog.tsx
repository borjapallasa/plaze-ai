
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
  product_name?: string;
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
    queryKey: ['user-affiliate-transactions', userUuid],
    queryFn: async (): Promise<Transaction[]> => {
      if (!userUuid) {
        console.log('No userUuid provided');
        return [];
      }

      console.log('Fetching transactions for user UUID:', userUuid);
      
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          transaction_uuid,
          amount,
          afiliate_fees,
          created_at,
          type,
          products_transactions!inner(
            product_transaction_uuid,
            products_transaction_items!inner(
              product_uuid,
              products!inner(name)
            )
          )
        `)
        .eq('user_uuid', userUuid)
        .not('afiliate_fees', 'is', null)
        .gt('afiliate_fees', 0)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching affiliate transactions:', error);
        throw error;
      }

      console.log('Raw affiliate transactions data:', data);

      return (data || []).map(transaction => ({
        transaction_uuid: transaction.transaction_uuid,
        amount: transaction.amount || 0,
        afiliate_fees: transaction.afiliate_fees || 0,
        created_at: transaction.created_at,
        type: transaction.type || 'unknown',
        product_name: transaction.products_transactions?.[0]?.products_transaction_items?.[0]?.products?.name || 'Unknown Product'
      }));
    },
    enabled: !!userUuid && isOpen,
  });

  const filteredTransactions = transactions.filter(transaction =>
    transaction.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col p-0">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">{affiliate.name}</h2>
            <p className="text-lg text-gray-600">{affiliate.status}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Active Templates</h3>
              <p className="text-xl font-bold text-gray-900 mt-1">{affiliate.activeTemplates}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Sales</h3>
              <p className="text-xl font-bold text-green-600 mt-1">{affiliate.totalSales}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Affiliate Fees Earned</h3>
              <p className="text-xl font-bold text-blue-600 mt-1">{affiliate.affiliateFees}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-6">
          <div className="space-y-4 h-full flex flex-col">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-2 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Transactions Table */}
            <div className="flex-1 overflow-hidden">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-full flex flex-col">
                {/* Table Header */}
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="font-semibold text-gray-700">Template</div>
                    <div className="font-semibold text-gray-700 text-right">Transaction Amount</div>
                    <div className="font-semibold text-gray-700 text-right">Affiliate Fee</div>
                    <div className="font-semibold text-gray-700 text-right">Date</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="flex-1 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                      <span className="ml-2 text-gray-600">Loading transactions...</span>
                    </div>
                  ) : filteredTransactions.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <p className="text-gray-500 text-lg">No affiliate transactions found</p>
                        <p className="text-gray-400 text-sm mt-1">
                          {searchTerm ? 'Try adjusting your search terms' : 'This user has no affiliate earnings yet'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {filteredTransactions.map((transaction) => (
                        <div key={transaction.transaction_uuid} className="grid grid-cols-4 gap-4 px-4 py-3 hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900 truncate">
                              {transaction.product_name}
                            </span>
                            <span className="text-sm text-gray-500 capitalize">
                              {transaction.type}
                            </span>
                          </div>
                          <div className="text-right font-semibold text-gray-900">
                            ${(transaction.amount || 0).toFixed(2)}
                          </div>
                          <div className="text-right font-semibold text-green-600">
                            ${(transaction.afiliate_fees || 0).toFixed(2)}
                          </div>
                          <div className="text-right text-gray-600">
                            {new Date(transaction.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
