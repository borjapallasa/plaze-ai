
import { FileText, Link as LinkIcon, Copy, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useTransactionItems } from "@/hooks/use-transaction-items";
import { Skeleton } from "@/components/ui/skeleton";

interface TransactionFilesProps {
  transactionId: string;
  filesUrl?: string;
  guidesUrl?: string;
  customRequest?: string;
}

export function TransactionFiles({ transactionId, filesUrl, guidesUrl, customRequest }: TransactionFilesProps) {
  const { data: transactionItems, isLoading, error } = useTransactionItems(transactionId);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleFileClick = () => {
    if (filesUrl) {
      copyToClipboard(filesUrl, "Project files URL");
    } else {
      toast.error("No project files URL available");
    }
  };

  const handleGuideClick = () => {
    if (guidesUrl) {
      copyToClipboard(guidesUrl, "Project guides URL");
    } else {
      toast.error("No project guides URL available");
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
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Transaction Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500">Error loading transaction items</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Transaction Items</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactionItems && transactionItems.length > 0 ? (
          transactionItems.map((item) => (
            <div 
              key={item.product_transaction_item_uuid}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-4"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="bg-white p-2 rounded-full shrink-0">
                  <Package className="h-5 w-5 text-[#9b87f5]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium">
                    {item.product_type || 'Product Item'}
                  </div>
                  <div className="text-sm text-[#8E9196] space-y-1">
                    <div>Quantity: {item.quantity || 'N/A'}</div>
                    <div>Price: ${item.price?.toFixed(2) || 'N/A'}</div>
                    {item.total_price && (
                      <div>Total: ${item.total_price.toFixed(2)}</div>
                    )}
                    <div>Status: {item.status || 'N/A'}</div>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#8E9196] hover:text-[#1A1F2C] shrink-0"
                onClick={() => copyToClipboard(item.product_transaction_item_uuid, "Item ID")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-[#8E9196]">No transaction items found</p>
          </div>
        )}

        {/* Legacy files and guides section */}
        {(filesUrl || guidesUrl) && (
          <>
            <div className="border-t pt-4 mt-6">
              <h4 className="font-medium mb-3">Additional Resources</h4>
              <div className="space-y-4">
                {filesUrl && (
                  <div 
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-4 cursor-pointer"
                    onClick={handleFileClick}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-full shrink-0">
                        <FileText className="h-5 w-5 text-[#9b87f5]" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium">View Project Files</div>
                        <div className="text-sm text-[#8E9196]">Access all project deliverables</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#8E9196] hover:text-[#1A1F2C] shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileClick();
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {guidesUrl && (
                  <div 
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-4 cursor-pointer"
                    onClick={handleGuideClick}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-full shrink-0">
                        <LinkIcon className="h-5 w-5 text-[#9b87f5]" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium">View Project Guide</div>
                        <div className="text-sm text-[#8E9196]">Access setup instructions</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#8E9196] hover:text-[#1A1F2C] shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGuideClick();
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {customRequest && (
          <div className="mt-6">
            <div className="font-medium mb-3">Custom Requirements</div>
            <div className="p-4 bg-[#F8F9FC] rounded-lg text-[#1A1F2C] break-words">
              {customRequest}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
