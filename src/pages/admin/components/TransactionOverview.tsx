
import { User, Calendar, Mail } from "lucide-react";

interface TransactionOverviewProps {
  buyerUser?: {
    name: string;
    email: string;
  };
  sellerUser?: {
    name: string;
    email: string;
  };
  transactionDate: string;
}

export function TransactionOverview({ buyerUser, sellerUser, transactionDate }: TransactionOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Buyer Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-[#8E9196]">
          <div className="bg-[#F8F9FC] p-2 rounded-full shrink-0">
            <User className="h-4 w-4" />
          </div>
          <span>Buyer User</span>
        </div>
        <div className="pl-10 space-y-1">
          <div className="font-medium break-all">
            {buyerUser?.name || 'Unknown User'}
          </div>
          {buyerUser?.email && (
            <a 
              href={`mailto:${buyerUser.email}`}
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 break-all"
            >
              <Mail className="h-3 w-3 shrink-0" />
              {buyerUser.email}
            </a>
          )}
        </div>
      </div>

      {/* Seller Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-[#8E9196]">
          <div className="bg-[#F8F9FC] p-2 rounded-full shrink-0">
            <User className="h-4 w-4" />
          </div>
          <span>Seller User</span>
        </div>
        <div className="pl-10 space-y-1">
          <div className="font-medium break-all">
            {sellerUser?.name || 'Unknown Expert'}
          </div>
          {sellerUser?.email && (
            <a 
              href={`mailto:${sellerUser.email}`}
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 break-all"
            >
              <Mail className="h-3 w-3 shrink-0" />
              {sellerUser.email}
            </a>
          )}
        </div>
      </div>

      {/* Date/Time */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-[#8E9196]">
          <div className="bg-[#F8F9FC] p-2 rounded-full shrink-0">
            <Calendar className="h-4 w-4" />
          </div>
          <span>Transaction Date</span>
        </div>
        <div className="font-medium pl-10">{transactionDate}</div>
      </div>
    </div>
  );
}
