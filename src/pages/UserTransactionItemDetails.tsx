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
  
  // Fetch the specific transaction item details
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
            experts (
              name
            )
          ),
          variants (
            name,
            files_link
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
                Transaction Item Details
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
            {/* Product Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#1A1F2C]">Product Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-[#8E9196] text-sm">Product Name:</span>
                    <p className="font-medium">{transactionItem.products?.name || 'Unknown Product'}</p>
                  </div>
                  <div>
                    <span className="text-[#8E9196] text-sm">Seller:</span>
                    <p className="font-medium">{transactionItem.products?.experts?.name || 'Unknown Seller'}</p>
                  </div>
                  {transactionItem.variants?.name && (
                    <div>
                      <span className="text-[#8E9196] text-sm">Variant:</span>
                      <p className="font-medium">{transactionItem.variants.name}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#1A1F2C]">Purchase Information</h3>
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
                    <p className="font-medium">${transactionItem.total_price?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div>
                    <span className="text-[#8E9196] text-sm">Status:</span>
                    <p className="font-medium capitalize">{transactionItem.status || 'Unknown'}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Transaction Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1A1F2C]">Transaction Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-[#8E9196] text-sm">Transaction Date:</span>
                  <p className="font-medium">
                    {transactionItem.products_transactions?.created_at 
                      ? new Date(transactionItem.products_transactions.created_at).toLocaleString()
                      : 'Unknown'
                    }
                  </p>
                </div>
                <div>
                  <span className="text-[#8E9196] text-sm">Transaction Status:</span>
                  <p className="font-medium capitalize">
                    {transactionItem.products_transactions?.status || 'Unknown'}
                  </p>
                </div>
              </div>
            </div>

            {/* Files Section */}
            {transactionItem.variants?.files_link && (
              <>
                <Separator className="my-8" />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#1A1F2C]">Download Files</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#8E9196]">Files are available for download</span>
                      <Button asChild>
                        <a 
                          href={transactionItem.variants.files_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Download Files
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Product Description */}
            {transactionItem.products?.description && (
              <>
                <Separator className="my-8" />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#1A1F2C]">Product Description</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-[#8E9196]">{transactionItem.products.description}</p>
                  </div>
                </div>
              </>
            )}

            {/* Reviews section - specific to this transaction item */}
            <Separator className="my-8" />
            <TransactionReview 
              transactionUuid={itemId || ''} 
              sellerUserUuid={undefined}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
