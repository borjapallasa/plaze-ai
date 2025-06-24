
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MainHeader } from "@/components/MainHeader";
import { ArrowLeft, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { AddReviewForm } from "@/components/AddReviewForm";

interface VariantTransactionDetails {
  variant_uuid: string;
  variant_name: string;
  variant_price: number;
  quantity: number;
  total_price: number;
  product_name: string;
  product_uuid: string;
  transaction_uuid: string;
  product_transaction_uuid: string;
  created_at: string;
  buyer_user?: {
    name: string;
    email: string;
  };
  seller_user?: {
    name: string;
    email: string;
  };
  files_link?: string;
}

export default function UserVariantTransactionDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const variantId = params.id;
  
  console.log('URL params:', params);
  console.log('Variant ID from params:', variantId);
  
  const {
    data: variantTransaction,
    isLoading,
    error
  } = useQuery({
    queryKey: ['variant-transaction-details', variantId],
    queryFn: async (): Promise<VariantTransactionDetails | null> => {
      if (!variantId) return null;
      
      console.log('Fetching variant transaction details for variant_uuid:', variantId);
      
      // Fetch the transaction item with variant details
      const { data: transactionItem, error: itemError } = await supabase
        .from('products_transaction_items')
        .select(`
          *,
          variants!inner(name, files_link),
          products!inner(name),
          products_transactions!inner(
            created_at,
            product_transaction_uuid,
            users!products_transactions_user_uuid_fkey(first_name, last_name, email),
            experts!products_transactions_expert_uuid_fkey(name, email)
          )
        `)
        .eq('variant_uuid', variantId)
        .maybeSingle();

      if (itemError) {
        console.error('Error fetching transaction item:', itemError);
        throw itemError;
      }

      if (!transactionItem) {
        console.log('No transaction item found for variant_uuid:', variantId);
        return null;
      }

      console.log('Transaction item found:', transactionItem);

      // Get the actual transaction_uuid from the transactions table
      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .select('transaction_uuid')
        .eq('products_transactions_uuid', transactionItem.product_transaction_uuid)
        .maybeSingle();

      if (transactionError) {
        console.error('Error fetching transaction_uuid:', transactionError);
        throw transactionError;
      }

      console.log('Transaction data found:', transactionData);

      // Construct buyer and seller info
      let buyerUser = undefined;
      let sellerUser = undefined;

      if (transactionItem.products_transactions?.users) {
        const user = transactionItem.products_transactions.users;
        buyerUser = {
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown User',
          email: user.email || ''
        };
      }

      if (transactionItem.products_transactions?.experts) {
        const expert = transactionItem.products_transactions.experts;
        sellerUser = {
          name: expert.name || 'Unknown Expert',
          email: expert.email || ''
        };
      }

      return {
        variant_uuid: transactionItem.variant_uuid || '',
        variant_name: transactionItem.variants?.name || 'Unknown Variant',
        variant_price: transactionItem.price || 0,
        quantity: transactionItem.quantity || 1,
        total_price: transactionItem.total_price || 0,
        product_name: transactionItem.products?.name || 'Unknown Product',
        product_uuid: transactionItem.product_uuid || '',
        transaction_uuid: transactionData?.transaction_uuid || '',
        product_transaction_uuid: transactionItem.product_transaction_uuid || '',
        created_at: transactionItem.products_transactions?.created_at || new Date().toISOString(),
        buyer_user: buyerUser,
        seller_user: sellerUser,
        files_link: transactionItem.variants?.files_link || ''
      };
    },
    enabled: !!variantId,
  });

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
            </CardHeader>
            <CardContent className="space-y-8">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </>
    );
  }
  
  if (error || !variantTransaction) {
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
              <h2 className="text-xl font-semibold mb-2">Variant Transaction Not Found</h2>
              <p className="text-[#8E9196]">The variant transaction you're looking for doesn't exist or couldn't be loaded.</p>
              <p className="text-sm text-[#8E9196] mt-2">Variant ID: {variantId}</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

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
                Variant Purchase Details
              </CardTitle>
              
              {/* Variant ID */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm bg-gray-50 p-3 rounded-lg">
                <span className="text-[#8E9196] whitespace-nowrap">Variant ID:</span>
                <span className="font-medium flex-1 break-all">{variantTransaction.variant_uuid}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-[#8E9196] hover:text-[#1A1F2C] ml-auto" 
                  onClick={() => copyToClipboard(variantTransaction.variant_uuid, "Variant ID")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Product and Variant Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-[#1A1F2C]">Product Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#8E9196]">Product:</span>
                    <span className="font-medium">{variantTransaction.product_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E9196]">Variant:</span>
                    <span className="font-medium">{variantTransaction.variant_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E9196]">Purchase Date:</span>
                    <span className="font-medium">{new Date(variantTransaction.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-[#1A1F2C]">Purchase Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#8E9196]">Unit Price:</span>
                    <span className="font-medium">${variantTransaction.variant_price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E9196]">Quantity:</span>
                    <span className="font-medium">{variantTransaction.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E9196]">Total Price:</span>
                    <span className="font-medium">${variantTransaction.total_price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* User Information */}
            {(variantTransaction.buyer_user || variantTransaction.seller_user) && (
              <>
                <Separator className="my-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {variantTransaction.buyer_user && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-[#1A1F2C]">Buyer Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-[#8E9196]">Name:</span>
                          <span className="font-medium">{variantTransaction.buyer_user.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#8E9196]">Email:</span>
                          <span className="font-medium">{variantTransaction.buyer_user.email}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {variantTransaction.seller_user && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-[#1A1F2C]">Seller Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-[#8E9196]">Name:</span>
                          <span className="font-medium">{variantTransaction.seller_user.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#8E9196]">Email:</span>
                          <span className="font-medium">{variantTransaction.seller_user.email}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Files Section */}
            {variantTransaction.files_link && (
              <>
                <Separator className="my-8" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-[#1A1F2C]">Files & Downloads</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8E9196]">Download Link:</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(variantTransaction.files_link, '_blank')}
                      >
                        Download Files
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Review Section */}
            <Separator className="my-8" />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1A1F2C]">Leave a Review</h3>
              <AddReviewForm 
                transactionUuid={variantTransaction.transaction_uuid}
                sellerUserUuid={variantTransaction.seller_user?.email ? 'seller_placeholder' : undefined}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
