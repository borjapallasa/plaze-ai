
import { User, Calendar, Mail } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toStartCase } from "@/lib/utils";

interface TransactionOverviewProps {
  buyerUser?: {
    name: string;
    email: string;
    avatar?: string;
  };
  sellerUser?: {
    name: string;
    email: string;
    avatar?: string;
  };
  transactionDate: string;
  transactionType?: string;
  transactionStatus?: string;
  paymentProvider?: string;
  paymentReferenceId?: string;
}

export function TransactionOverview({ 
  buyerUser, 
  sellerUser, 
  transactionDate,
  transactionType,
  transactionStatus,
  paymentProvider,
  paymentReferenceId
}: TransactionOverviewProps) {
  const formatEmail = (email: string) => {
    if (email.length > 25) {
      const [local, domain] = email.split('@');
      if (local.length > 15) {
        return `${local.slice(0, 12)}...@${domain}`;
      }
    }
    return email;
  };

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div>
        <h3 className="text-lg font-semibold text-[#1A1F2C] mb-1">Transaction Overview</h3>
        <p className="text-sm text-[#8E9196]">Buyer and seller information for this transaction</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Buyer Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-[#9b87f5]" />
            <span className="text-xs font-semibold text-[#8E9196] uppercase tracking-wide">Buyer</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#1A1F2C] text-sm truncate">
                  {buyerUser?.name || 'John Doe'}
                </span>
                {buyerUser?.email && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={`mailto:${buyerUser.email}`}
                          className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[#9b87f5] hover:bg-[#9b87f5]/10 transition-colors"
                          aria-label={`Email ${buyerUser.name || 'buyer'}`}
                        >
                          <Mail className="h-3 w-3" />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{formatEmail(buyerUser.email)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Seller Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-[#9b87f5]" />
            <span className="text-xs font-semibold text-[#8E9196] uppercase tracking-wide">Seller</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#1A1F2C] text-sm truncate">
                  {sellerUser?.name || 'Expert Name'}
                </span>
                {sellerUser?.email && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={`mailto:${sellerUser.email}`}
                          className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[#9b87f5] hover:bg-[#9b87f5]/10 transition-colors"
                          aria-label={`Email ${sellerUser.name || 'seller'}`}
                        >
                          <Mail className="h-3 w-3" />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{formatEmail(sellerUser.email)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Date Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#9b87f5]" />
            <span className="text-xs font-semibold text-[#8E9196] uppercase tracking-wide">Transaction Date</span>
          </div>
          
          <div>
            <span className="font-medium text-[#1A1F2C] text-sm">
              {transactionDate}
            </span>
          </div>
        </div>
      </div>

      {/* Additional Information section */}
      {(transactionType || transactionStatus || paymentProvider || paymentReferenceId) && (
        <div className="space-y-6 mt-8">
          <div>
            <h3 className="text-lg font-semibold text-[#1A1F2C] mb-1">Additional Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {transactionType && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#8E9196] uppercase tracking-wide">Type</span>
                </div>
                <div>
                  <span className="font-medium text-[#1A1F2C] text-sm">
                    {toStartCase(transactionType)}
                  </span>
                </div>
              </div>
            )}
            
            {transactionStatus && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#8E9196] uppercase tracking-wide">Status</span>
                </div>
                <div>
                  <span className="font-medium text-[#1A1F2C] text-sm">
                    {toStartCase(transactionStatus)}
                  </span>
                </div>
              </div>
            )}
            
            {paymentProvider && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#8E9196] uppercase tracking-wide">Payment Provider</span>
                </div>
                <div>
                  <span className="font-medium text-[#1A1F2C] text-sm">
                    {toStartCase(paymentProvider)}
                  </span>
                </div>
              </div>
            )}

            {paymentReferenceId && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#8E9196] uppercase tracking-wide">Payment Reference ID</span>
                </div>
                <div>
                  <span className="font-medium text-[#1A1F2C] text-sm font-mono break-all">
                    {paymentReferenceId}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
