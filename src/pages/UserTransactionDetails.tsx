
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MainHeader } from "@/components/MainHeader";
import { ArrowLeft, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { TransactionOverview } from "./admin/components/TransactionOverview";
import { TransactionFiles } from "./admin/components/TransactionFiles";
import { TransactionReview } from "./admin/components/TransactionReview";
import { CommunityTransactionOverview } from "./admin/components/CommunityTransactionOverview";
import { useTransactionDetails } from "@/hooks/use-transaction-details";
import { useCommunityTransactionDetails } from "@/hooks/use-community-transaction-details";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserTransactionDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const transactionId = params.id;
  
  console.log('URL params:', params);
  console.log('Transaction ID from params:', transactionId);
  
  // Try to fetch both product transaction and community transaction
  const {
    data: transaction,
    isLoading: isLoadingProduct,
    error: productError
  } = useTransactionDetails(transactionId || '');

  const {
    data: communityTransaction,
    isLoading: isLoadingCommunity,
    error: communityError
  } = useCommunityTransactionDetails(transactionId || '');

  // Fetch the actual transaction_uuid from the transactions table for product transactions
  const { data: actualTransactionUuid } = useQuery({
    queryKey: ['actual-transaction-uuid', transactionId],
    queryFn: async () => {
      if (!transactionId || !transaction) return null;
      
      console.log('Fetching actual transaction_uuid for products_transaction_uuid:', transactionId);
      
      const { data, error } = await supabase
        .from('transactions')
        .select('transaction_uuid')
        .eq('products_transactions_uuid', transactionId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching actual transaction_uuid:', error);
        return null;
      }

      console.log('Found actual transaction_uuid:', data?.transaction_uuid);
      return data?.transaction_uuid || null;
    },
    enabled: !!transactionId && !!transaction,
  });

  const isLoading = isLoadingProduct || isLoadingCommunity;
  const error = productError || communityError;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleGoBack = () => {
    navigate('/account/transactions');
  };

  if (isLoading) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
          <Skeleton className="h-6 w-48 mb-6" />
          <Card className="shadow-lg">
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardHeader>
            <CardContent className="space-y-8">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </>
    );
  }
  
  if ((error || (!transaction && !communityTransaction))) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
          <button 
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 text-[#8E9196] hover:text-[#1A1F2C] mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Transactions
          </button>
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Transaction Not Found</h2>
              <p className="text-[#8E9196]">The transaction you're looking for doesn't exist or couldn't be loaded.</p>
              <p className="text-sm text-[#8E9196] mt-2">Transaction ID: {transactionId}</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Determine if this is a community transaction or product transaction
  const isCommunityTransaction = !!communityTransaction;
  const displayTransaction = communityTransaction || transaction;

  if (!displayTransaction) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
          <button 
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 text-[#8E9196] hover:text-[#1A1F2C] mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Transactions
          </button>
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Transaction Not Found</h2>
              <p className="text-[#8E9196]">The transaction you're looking for doesn't exist or couldn't be loaded.</p>
              <p className="text-sm text-[#8E9196] mt-2">Transaction ID: {transactionId}</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Get the transaction UUID for display
  const transactionUuid = isCommunityTransaction 
    ? communityTransaction.community_subscription_transaction_uuid
    : transaction.transaction_uuid;

  // Get the first item's files link for the main files section (only for product transactions)
  const filesUrl = !isCommunityTransaction && transaction ? transaction.items[0]?.files_link || '' : '';
  
  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
        {/* Back Button */}
        <button 
          onClick={handleGoBack}
          className="inline-flex items-center gap-2 text-[#8E9196] hover:text-[#1A1F2C] mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Transactions
        </button>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col gap-4">
              <CardTitle className="text-2xl font-semibold">
                {isCommunityTransaction ? 'Community Subscription Details' : 'Purchase Details'}
              </CardTitle>
              
              {/* Transaction ID near the top */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm bg-gray-50 p-3 rounded-lg">
                <span className="text-[#8E9196] whitespace-nowrap">
                  {isCommunityTransaction ? 'Subscription ID:' : 'Transaction ID:'}
                </span>
                <span className="font-medium flex-1 break-all">{transactionUuid}</span>
                <Button variant="ghost" size="sm" className="text-[#8E9196] hover:text-[#1A1F2C] ml-auto" onClick={() => copyToClipboard(transactionUuid, isCommunityTransaction ? "Subscription ID" : "Transaction ID")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {isCommunityTransaction ? (
              <>
                <CommunityTransactionOverview 
                  buyerUser={communityTransaction.buyer_user} 
                  buyerEmail={communityTransaction.buyer_email}
                  sellerUser={communityTransaction.seller_user} 
                  sellerEmail={communityTransaction.seller_email}
                  transactionDate={new Date(communityTransaction.created_at).toLocaleString()}
                  transactionType={communityTransaction.type}
                  transactionStatus={communityTransaction.status}
                  paymentProvider={communityTransaction.payment_provider}
                  paymentReferenceId={communityTransaction.payment_reference_id}
                  communityName={communityTransaction.community_name}
                />

                <Separator className="my-8" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-[#1A1F2C]">Payment Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#8E9196]">Amount:</span>
                        <span className="font-medium">${communityTransaction.total_amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8E9196]">Status:</span>
                        <span className="font-medium capitalize">{communityTransaction.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <TransactionOverview 
                  buyerUser={transaction.buyer_user} 
                  sellerUser={transaction.seller_user} 
                  transactionDate={new Date(transaction.created_at).toLocaleString()}
                  transactionType={transaction.type}
                  transactionStatus={transaction.status}
                  paymentProvider={transaction.payment_provider}
                  paymentReferenceId={transaction.payment_reference_id}
                />

                <Separator className="my-8" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-[#1A1F2C]">Payment Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#8E9196]">Total Amount:</span>
                        <span className="font-medium">${transaction.total_amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8E9196]">Status:</span>
                        <span className="font-medium capitalize">{transaction.status}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                <TransactionFiles 
                  transactionId={transactionId || ''} 
                  filesUrl={filesUrl} 
                  guidesUrl="" 
                  customRequest=""
                />

                {/* Reviews section - only show for product transactions when we have the actual transaction_uuid */}
                {actualTransactionUuid && (
                  <>
                    <Separator className="my-8" />
                    <TransactionReview transactionUuid={actualTransactionUuid} />
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
