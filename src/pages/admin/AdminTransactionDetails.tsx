import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MainHeader } from "@/components/MainHeader";
import { ArrowLeft, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { TransactionOverview } from "./components/TransactionOverview";
import { TransactionFinancials } from "./components/TransactionFinancials";
import { TransactionFiles } from "./components/TransactionFiles";
import { TransactionReview } from "./components/TransactionReview";
import { CommunityTransactionOverview } from "./components/CommunityTransactionOverview";
import { CommunityTransactionFinancials } from "./components/CommunityTransactionFinancials";
import { useTransactionDetails } from "@/hooks/use-transaction-details";
import { useCommunityTransactionDetails } from "@/hooks/use-community-transaction-details";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useCallback } from "react";

// Mock data for sections not yet connected to database
const mockData = {
  title: "Find Customer Email List Of Competitors From Social Media Instagram Account",
  buyerUser: "adamcic.ziga@gmail.com",
  sellerUser: "info@optimalpath.ai",
  transactionDate: "June 13, 2024, 8:33 PM",
  transactionFees: 15.00,
  affiliateFees: 4.50,
  grossMargin: 7.98,
  stripeFees: 2.52,
  netMargin: 7.98,
  guidesUrl: "https://docs.google.com/document/d/1Tu4aBhms9OvovbPHGj7yVA7DX7r99X3Beupqm77HoNc/edit?usp=sharing",
  review: "Template is amazing! Everything works as it should. Borja is a very friendly. He set everything up and helped me. Highly recommend! :)",
  rating: 5,
  customRequest: "Custom requirements for the template setup"
};

export default function AdminTransactionDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const transactionId = params.id;
  const [actualTransactionUuid, setActualTransactionUuid] = useState<string>('');
  
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

  const isLoading = isLoadingProduct || isLoadingCommunity;
  const error = productError || communityError;

  const handleTransactionUuidReceived = useCallback((transactionUuid: string) => {
    console.log('Received actual transaction_uuid from financials:', transactionUuid);
    setActualTransactionUuid(transactionUuid);
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <>
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
      </>;
  }
  
  if ((error || (!transaction && !communityTransaction))) {
    return <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
          <button 
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 text-[#8E9196] hover:text-[#1A1F2C] mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Transaction Not Found</h2>
              <p className="text-[#8E9196]">The transaction you're looking for doesn't exist or couldn't be loaded.</p>
              <p className="text-sm text-[#8E9196] mt-2">Transaction ID: {transactionId}</p>
            </CardContent>
          </Card>
        </div>
      </>;
  }

  // Determine if this is a community transaction or product transaction
  const isCommunityTransaction = !!communityTransaction;
  const displayTransaction = communityTransaction || transaction;

  if (!displayTransaction) {
    return <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
          <button 
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 text-[#8E9196] hover:text-[#1A1F2C] mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Transaction Not Found</h2>
              <p className="text-[#8E9196]">The transaction you're looking for doesn't exist or couldn't be loaded.</p>
              <p className="text-sm text-[#8E9196] mt-2">Transaction ID: {transactionId}</p>
            </CardContent>
          </Card>
        </div>
      </>;
  }

  // Get the transaction UUID for display
  const transactionUuid = isCommunityTransaction 
    ? communityTransaction.community_subscription_transaction_uuid
    : transaction.transaction_uuid;

  // Get the first item's files link for the main files section (only for product transactions)
  const filesUrl = !isCommunityTransaction && transaction ? transaction.items[0]?.files_link || '' : '';
  
  return <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
        {/* Back Button */}
        <button 
          onClick={handleGoBack}
          className="inline-flex items-center gap-2 text-[#8E9196] hover:text-[#1A1F2C] mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col gap-4">
              <CardTitle className="text-2xl font-semibold">
                {isCommunityTransaction ? 'Community Subscription Details' : 'Transaction Details'}
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

                <CommunityTransactionFinancials 
                  transactionAmount={communityTransaction.total_amount} 
                />
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

                <TransactionFinancials 
                  transactionAmount={transaction.total_amount} 
                  productsTransactionUuid={transaction.transaction_uuid}
                  onTransactionUuidReceived={handleTransactionUuidReceived}
                />

                <Separator className="my-8" />

                <TransactionFiles 
                  transactionId={transactionId || ''} 
                  filesUrl={filesUrl} 
                  guidesUrl={mockData.guidesUrl} 
                  customRequest={mockData.customRequest}
                />

                {/* Only render TransactionReview when we have the actual transaction_uuid */}
                {actualTransactionUuid && (
                  <TransactionReview 
                    transactionUuid={actualTransactionUuid} 
                    isAdminView={true}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>;
}
