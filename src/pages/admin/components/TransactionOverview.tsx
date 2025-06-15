
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Buyer Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm font-medium text-[#8E9196]">
          <div className="bg-[#F8F9FC] p-2.5 rounded-lg">
            <User className="h-4 w-4 text-[#6B7280]" />
          </div>
          <span>Buyer User</span>
        </div>
        <div className="ml-12">
          <div className="flex items-center gap-2 text-[#1A1F2C] font-medium">
            <span className="break-all">
              {buyerUser?.name || 'Unknown User'}
            </span>
            {buyerUser?.email && (
              <a 
                href={`mailto:${buyerUser.email}`}
                className="text-blue-600 hover:text-blue-800 transition-colors shrink-0"
                title={buyerUser.email}
              >
                <Mail className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Seller Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm font-medium text-[#8E9196]">
          <div className="bg-[#F8F9FC] p-2.5 rounded-lg">
            <User className="h-4 w-4 text-[#6B7280]" />
          </div>
          <span>Seller User</span>
        </div>
        <div className="ml-12">
          <div className="flex items-center gap-2 text-[#1A1F2C] font-medium">
            <span className="break-all">
              {sellerUser?.name || 'Unknown Expert'}
            </span>
            {sellerUser?.email && (
              <a 
                href={`mailto:${sellerUser.email}`}
                className="text-blue-600 hover:text-blue-800 transition-colors shrink-0"
                title={sellerUser.email}
              >
                <Mail className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Date/Time */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm font-medium text-[#8E9196]">
          <div className="bg-[#F8F9FC] p-2.5 rounded-lg">
            <Calendar className="h-4 w-4 text-[#6B7280]" />
          </div>
          <span>Transaction Date</span>
        </div>
        <div className="ml-12 text-[#1A1F2C] font-medium">
          {transactionDate}
        </div>
      </div>
    </div>
  );
}
