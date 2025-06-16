
import { FileText, Link as LinkIcon, Copy, Package, MoreHorizontal, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useTransactionItems } from "@/hooks/use-transaction-items";
import { Skeleton } from "@/components/ui/skeleton";
import { toStartCase } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface TransactionFilesProps {
  transactionId: string;
  filesUrl?: string;
  guidesUrl?: string;
  customRequest?: string;
}

export function TransactionFiles({ 
  transactionId, 
  filesUrl, 
  guidesUrl, 
  customRequest
}: TransactionFilesProps) {
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

  const handleMarkCompleted = (itemId: string) => {
    // TODO: Implement mark as completed functionality
    toast.success("Item marked as completed");
    console.log("Mark as completed:", itemId);
  };

  const handleOpenDispute = (itemId: string) => {
    // TODO: Implement open dispute functionality
    toast.success("Dispute opened");
    console.log("Open dispute:", itemId);
  };

  const handleViewFiles = async (variantUuid: string | null) => {
    if (!variantUuid) {
      toast.error("No variant found for this item");
      return;
    }

    try {
      const { data: variant, error } = await supabase
        .from('variants')
        .select('files_link')
        .eq('variant_uuid', variantUuid)
        .single();

      if (error) {
        console.error('Error fetching variant files:', error);
        toast.error("Error fetching files link");
        return;
      }

      if (variant?.files_link) {
        window.open(variant.files_link, '_blank');
        toast.success("Opening files in new tab");
      } else {
        toast.error("No files link available for this variant");
      }
    } catch (error) {
      console.error('Error opening files:', error);
      toast.error("Error opening files");
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
          <div className="border rounded-lg overflow-hidden">
            <ScrollArea className="w-full">
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[25%]">Product</TableHead>
                    <TableHead className="w-[12%]">Variant</TableHead>
                    <TableHead className="w-[10%]">View Files</TableHead>
                    <TableHead className="w-[8%] text-center">Qty</TableHead>
                    <TableHead className="w-[10%] text-right">Price</TableHead>
                    <TableHead className="w-[10%] text-right">Total</TableHead>
                    <TableHead className="w-[10%]">Status</TableHead>
                    <TableHead className="w-[8%] text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionItems.map((item) => (
                    <TableRow key={item.product_transaction_item_uuid}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-50 p-2 rounded-full shrink-0">
                            <Package className="h-4 w-4 text-[#9b87f5]" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-sm">
                              {item.product_name || 'Unknown Product'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {item.variant_name || 'No variant'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewFiles(item.variant_uuid)}
                          className="text-[#9b87f5] hover:text-[#8b7ae5]"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-sm font-medium">
                          {item.quantity || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-sm font-medium">
                          ${item.price?.toFixed(2) || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-sm font-semibold">
                          ${item.total_price?.toFixed(2) || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {toStartCase(item.status || 'N/A')}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-[#8E9196] hover:text-[#1A1F2C]"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleMarkCompleted(item.product_transaction_item_uuid)}>
                              Mark as Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenDispute(item.product_transaction_item_uuid)}>
                              Open Dispute
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-[#8E9196]">No transaction items found</p>
          </div>
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
