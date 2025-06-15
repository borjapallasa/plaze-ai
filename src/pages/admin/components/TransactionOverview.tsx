
import { User, Calendar, Mail } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
}

export function TransactionOverview({ buyerUser, sellerUser, transactionDate }: TransactionOverviewProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-[#8E9196]" />
            <span className="text-xs font-semibold text-[#8E9196] uppercase tracking-wide">Buyer</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={buyerUser?.avatar} alt={buyerUser?.name} />
              <AvatarFallback className="text-xs font-medium bg-blue-100 text-blue-700">
                {buyerUser?.name ? getInitials(buyerUser.name) : 'BU'}
              </AvatarFallback>
            </Avatar>
            
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
                          className="inline-flex items-center justify-center w-5 h-5 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
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
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-[#8E9196]" />
            <span className="text-xs font-semibold text-[#8E9196] uppercase tracking-wide">Seller</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={sellerUser?.avatar} alt={sellerUser?.name} />
              <AvatarFallback className="text-xs font-medium bg-green-100 text-green-700">
                {sellerUser?.name ? getInitials(sellerUser.name) : 'SE'}
              </AvatarFallback>
            </Avatar>
            
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
                          className="inline-flex items-center justify-center w-5 h-5 rounded-full text-green-600 hover:bg-green-50 transition-colors"
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
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-[#8E9196]" />
            <span className="text-xs font-semibold text-[#8E9196] uppercase tracking-wide">Transaction Date</span>
          </div>
          
          <div>
            <span className="font-medium text-[#1A1F2C] text-sm">
              {transactionDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
