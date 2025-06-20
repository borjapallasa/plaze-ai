
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface CommunityTransactionOverviewProps {
  buyerUser: string;
  buyerEmail: string;
  sellerUser: string;
  sellerEmail: string;
  transactionDate: string;
  transactionType: string;
  transactionStatus: string;
  paymentProvider: string;
  paymentReferenceId: string | null;
  communityName: string;
}

export function CommunityTransactionOverview({
  buyerUser,
  buyerEmail,
  sellerUser,
  sellerEmail,
  transactionDate,
  transactionType,
  transactionStatus,
  paymentProvider,
  paymentReferenceId,
  communityName
}: CommunityTransactionOverviewProps) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "failed":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Community Subscription Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Community Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-sm text-[#8E9196] mb-2">Community</h4>
            <p className="text-[#1A1F2C] font-medium">{communityName}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-[#8E9196] mb-2">Subscription Type</h4>
            <Badge variant="secondary" className="capitalize">
              {transactionType}
            </Badge>
          </div>
        </div>

        {/* User Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-sm text-[#8E9196] mb-2">Buyer</h4>
            <div className="space-y-1">
              <p className="text-[#1A1F2C] font-medium">{buyerUser}</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-[#8E9196]">{buyerEmail}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 text-[#8E9196] hover:text-[#1A1F2C]"
                  onClick={() => copyToClipboard(buyerEmail, "Buyer email")}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-sm text-[#8E9196] mb-2">Community Owner</h4>
            <div className="space-y-1">
              <p className="text-[#1A1F2C] font-medium">{sellerUser}</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-[#8E9196]">{sellerEmail}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 text-[#8E9196] hover:text-[#1A1F2C]"
                  onClick={() => copyToClipboard(sellerEmail, "Seller email")}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium text-sm text-[#8E9196] mb-2">Subscription Date</h4>
            <p className="text-[#1A1F2C]">{transactionDate}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-[#8E9196] mb-2">Status</h4>
            <Badge variant="secondary" className={getStatusColor(transactionStatus)}>
              {transactionStatus}
            </Badge>
          </div>
          <div>
            <h4 className="font-medium text-sm text-[#8E9196] mb-2">Payment Provider</h4>
            <p className="text-[#1A1F2C] capitalize">{paymentProvider}</p>
          </div>
        </div>

        {/* Payment Reference */}
        {paymentReferenceId && (
          <div>
            <h4 className="font-medium text-sm text-[#8E9196] mb-2">Payment Reference ID</h4>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
              <span className="font-mono text-sm flex-1 break-all">{paymentReferenceId}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[#8E9196] hover:text-[#1A1F2C]"
                onClick={() => copyToClipboard(paymentReferenceId, "Payment Reference ID")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
