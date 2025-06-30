
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { AffiliateDetailsDialog } from "./AffiliateDetailsDialog";

interface Affiliate {
  name: string;
  joinedAt: string;
  activeTemplates: number;
  multiplier: number | null;
  fees: string;
  status: string;
  totalSales: string;
}

const affiliates: Affiliate[] = [
  {
    name: "Borja P.",
    joinedAt: "January 1, 2024 8:44pm",
    activeTemplates: 14,
    multiplier: 0.03,
    fees: "$121.14",
    status: "Active Affiliate",
    totalSales: "$4,038.00"
  },
  {
    name: "Arturo M.",
    joinedAt: "January 27, 2024 10:17am",
    activeTemplates: 1,
    multiplier: 0.03,
    fees: "$0.00",
    status: "Not Affiliate",
    totalSales: "$0.00"
  },
  {
    name: "Geovanni H.",
    joinedAt: "February 5, 2024 11:00pm",
    activeTemplates: 0,
    multiplier: null,
    fees: "$0.00",
    status: "Not Affiliate",
    totalSales: "$0.00"
  },
  {
    name: "Dan H.",
    joinedAt: "February 15, 2024 7:48pm",
    activeTemplates: 2,
    multiplier: 0.03,
    fees: "$0.00",
    status: "Not Affiliate",
    totalSales: "$0.00"
  }
];

export function AffiliateTable() {
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Type here to search"
          className="pl-10"
        />
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[800px] rounded-lg border">
          <div className="grid grid-cols-5 gap-4 p-4 bg-muted/50">
            <div className="font-medium">Affiliate</div>
            <div className="font-medium">Joined @</div>
            <div className="font-medium text-center">Active Templates</div>
            <div className="font-medium text-center">Multiplier</div>
            <div className="font-medium text-right">Affiliate Fees</div>
          </div>
          <div className="divide-y">
            {affiliates.map((affiliate, index) => (
              <div
                key={index}
                className="grid grid-cols-5 gap-4 p-4 hover:bg-muted/50 cursor-pointer"
                onClick={() => setSelectedAffiliate(affiliate)}
              >
                <div>{affiliate.name}</div>
                <div>{affiliate.joinedAt}</div>
                <div className="text-center">{affiliate.activeTemplates}</div>
                <div className="text-center">{affiliate.multiplier || "-"}</div>
                <div className="text-right">{affiliate.fees}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedAffiliate && (
        <AffiliateDetailsDialog
          isOpen={!!selectedAffiliate}
          onClose={() => setSelectedAffiliate(null)}
          affiliate={{
            name: selectedAffiliate.name,
            status: selectedAffiliate.status,
            activeTemplates: selectedAffiliate.activeTemplates,
            totalSales: selectedAffiliate.totalSales,
            affiliateFees: selectedAffiliate.fees
          }}
        />
      )}
    </div>
  );
}
