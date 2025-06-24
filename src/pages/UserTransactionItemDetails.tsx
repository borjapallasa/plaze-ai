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
import { TransactionReview } from "./admin/components/TransactionReview";

export default function UserTransactionItemDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const itemId = params.id;
  
  console.log('Transaction Item ID from params:', itemId);
  
  const { data: transactionItem, isLoading, error } = useQuery({
    queryKey: ['transaction-item-details', itemId],
    queryFn: async () => {
      if (!itemId) return null;
      
      console.log('Fetching transaction item details for:', itemId);
      
      const { data, error } = await supabase
        .from('products_transaction_items')
        .select(`
          *,
          products (
            name,
            description,
            thumbnail,
            expert_uuid,
            experts!products_expert_uuid_fkey (
              name,
              expert_uuid,
              user_uuid
            )
          ),
          variants (
            name,
            files_link,
            additional_details
          ),
          products_transactions (
            product_transaction_uuid,
            created_at,
            status,
            total_amount,
            user_uuid
          )
        `)
        .eq('product_transaction_item_uuid', itemId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching transaction item:', error);
        throw error;
      }

      console.log('Found transaction item:', data);
      console.log('Expert data from products:', data?.products?.experts);
      console.log('Expert UUID from products:', data?.products?.expert_uuid);
      return data;
    },
    enabled: !!itemId,
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleGoBack = () => {
    if (transactionItem?.products_transactions?.product_transaction_uuid) {
      navigate(`/account/transactions/transaction/${transactionItem.products_transactions.product_transaction_uuid}`);
    } else {
      navigate('/account/transactions');
    }
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
  
  if (error || !transactionItem) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
          <button 
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 text-[#8E9196] hover:text-[#1A1F2C] mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Transaction
          </button>
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Transaction Item Not Found</h2>
              <p className="text-[#8E9196]">The transaction item you're looking for doesn't exist or couldn't be loaded.</p>
              <p className="text-sm text-[#8E9196] mt-2">Item ID: {itemId}</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Get the expert UUID - try from the direct expert_uuid field first, then from the joined experts table
  const expertUuid = transactionItem.products?.expert_uuid || transactionItem.products?.experts?.expert_uuid;
  
  console.log('Final expert UUID to pass:', expertUuid);

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
          Back to Transaction
        </button>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col gap-4">
              <CardTitle className="text-2xl font-semibold">
                Purchase Details
              </CardTitle>
              
              {/* Item ID near the top */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm bg-gray-50 p-3 rounded-lg">
                <span className="text-[#8E9196] whitespace-nowrap">Item ID:</span>
                <span className="font-medium flex-1 break-all">{transactionItem.product_transaction_item_uuid}</span>
                <Button variant="ghost" size="sm" className="text-[#8E9196] hover:text-[#1A1F2C] ml-auto" onClick={() => copyToClipboard(transactionItem.product_transaction_item_uuid, "Item ID")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Files and Instructions Section - First and most prominent */}
            {transactionItem.variants?.files_link && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#1A1F2C]">Your Download</h3>
                
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#1A1F2C] mb-1">{transactionItem.variants.name}</h4>
                      <p className="text-sm text-[#8E9196]">Your purchased files are ready for download</p>
                    </div>
                    <Button asChild size="lg" className="w-full sm:w-auto">
                      <a 
                        href={transactionItem.variants.files_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Download Files
                      </a>
                    </Button>
                  </div>
                  
                  {/* Instructions for using the files */}
                  {transactionItem.variants?.additional_details && (
                    <div className="border-t border-gray-200 pt-4">
                      <h5 className="text-sm font-semibold text-[#1A1F2C] mb-2">Instructions for Use</h5>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-[#8E9196] text-sm whitespace-pre-wrap">{transactionItem.variants.additional_details}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Separator className="my-8" />

            {/* Purchase Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1A1F2C]">Purchase Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-[#8E9196] text-sm">Product:</span>
                    <p className="font-medium">{transactionItem.products?.name || 'Unknown Product'}</p>
                  </div>
                  <div>
                    <span className="text-[#8E9196] text-sm">Variant:</span>
                    <p className="font-medium">{transactionItem.variants?.name || 'Default'}</p>
                  </div>
                  <div>
                    <span className="text-[#8E9196] text-sm">Seller:</span>
                    <p className="font-medium">{transactionItem.products?.experts?.name || 'Unknown Seller'}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[#8E9196] text-sm">Price:</span>
                    <p className="font-medium">${transactionItem.price?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div>
                    <span className="text-[#8E9196] text-sm">Quantity:</span>
                    <p className="font-medium">{transactionItem.quantity || 1}</p>
                  </div>
                  <div>
                    <span className="text-[#8E9196] text-sm">Total:</span>
                    <p className="font-semibold text-lg">${transactionItem.total_price?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Transaction Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1A1F2C]">Transaction Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-[#8E9196] text-sm">Purchase Date:</span>
                  <p className="font-medium">
                    {transactionItem.products_transactions?.created_at 
                      ? new Date(transactionItem.products_transactions.created_at).toLocaleString()
                      : 'Unknown'
                    }
                  </p>
                </div>
                <div>
                  <span className="text-[#8E9196] text-sm">Status:</span>
                  <p className="font-medium capitalize">
                    {transactionItem.status || 'Unknown'}
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews section - specific to this transaction item */}
            <Separator className="my-8" />
            <TransactionReview 
              transactionUuid={itemId || ''} 
              productUuid={transactionItem.product_uuid}
              expertUuid={expertUuid}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
