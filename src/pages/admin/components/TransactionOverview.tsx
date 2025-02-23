
import { User, Calendar } from "lucide-react";

interface TransactionOverviewProps {
  buyerUser: string;
  sellerUser: string;
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
        <div className="font-medium pl-10 break-all">{buyerUser}</div>
      </div>

      {/* Seller Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-[#8E9196]">
          <div className="bg-[#F8F9FC] p-2 rounded-full shrink-0">
            <User className="h-4 w-4" />
          </div>
          <span>Seller User</span>
        </div>
        <div className="font-medium pl-10 break-all">{sellerUser}</div>
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
