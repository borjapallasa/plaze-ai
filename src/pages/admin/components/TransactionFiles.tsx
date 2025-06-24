
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, ExternalLink, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

interface TransactionFilesProps {
  transactionId: string;
  filesUrl: string;
  guidesUrl: string;
  customRequest: string;
}

export function TransactionFiles({ transactionId, filesUrl, guidesUrl, customRequest }: TransactionFilesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  console.log('TransactionFiles - transactionId:', transactionId);

  const { data: transactionItems, isLoading } = useQuery({
    queryKey: ['transaction-items', transactionId],
    queryFn: async () => {
      if (!transactionId) return [];
      
      console.log('Fetching transaction items for transaction:', transactionId);
      
      const { data, error } = await supabase
        .from('products_transaction_items')
        .select(`
          product_transaction_item_uuid,
          product_uuid,
          variant_uuid,
          quantity,
          price,
          total_price,
          status,
          product_type,
          products (
            name,
            thumbnail
          ),
          variants (
            name,
            files_link
          )
        `)
        .eq('product_transaction_uuid', transactionId);

      if (error) {
        console.error('Error fetching transaction items:', error);
        return [];
      }

      console.log('Found transaction items:', data);
      return data || [];
    },
    enabled: !!transactionId,
  });

  const handleItemClick = (itemId: string) => {
    navigate(`/account/transactions/transaction/item/${itemId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Transaction Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Transaction Items ({transactionItems?.length || 0})</CardTitle>
          {transactionItems && transactionItems.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#8E9196] hover:text-[#1A1F2C]"
            >
              {isExpanded ? (
                <>
                  Show Less <ChevronUp className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  Show All <ChevronDown className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!transactionItems || transactionItems.length === 0 ? (
          <div className="text-center py-8 text-[#8E9196]">
            <p>No items found for this transaction</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(isExpanded ? transactionItems : transactionItems.slice(0, 3)).map((item) => (
              <div
                key={item.product_transaction_item_uuid}
                onClick={() => handleItemClick(item.product_transaction_item_uuid)}
                className="border border-[#E5E7EB] rounded-lg p-4 hover:bg-[#F8F9FC] transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {item.products?.thumbnail && (
                      <img
                        src={item.products.thumbnail}
                        alt={item.products.name || 'Product'}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-[#1A1F2C] group-hover:text-blue-600 transition-colors">
                        {item.products?.name || 'Unknown Product'}
                      </h4>
                      {item.variants?.name && (
                        <p className="text-sm text-[#8E9196] mt-1">
                          Variant: {item.variants.name}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-[#8E9196]">
                        <span>Qty: {item.quantity}</span>
                        <span>Price: ${item.price?.toFixed(2)}</span>
                        <span>Total: ${item.total_price?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className={`${getStatusColor(item.status)} capitalize`}
                    >
                      {item.status}
                    </Badge>
                    <Eye className="h-4 w-4 text-[#8E9196] group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
                
                {item.variants?.files_link && (
                  <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(item.variants.files_link, '_blank');
                      }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Download Files
                    </Button>
                  </div>
                )}
              </div>
            ))}
            
            {!isExpanded && transactionItems.length > 3 && (
              <div className="text-center pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setIsExpanded(true)}
                  className="text-[#8E9196] hover:text-[#1A1F2C]"
                >
                  Show {transactionItems.length - 3} more items
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
