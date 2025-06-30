
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";
import { AffiliateDetailsDialog } from "./AffiliateDetailsDialog";
import { useAffiliates, AffiliateData } from "@/hooks/use-affiliates";

export function AffiliateTable() {
  const [selectedAffiliate, setSelectedAffiliate] = useState<AffiliateData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: affiliates = [], isLoading, error } = useAffiliates();

  // Filter affiliates based on search term
  const filteredAffiliates = useMemo(() => {
    if (!searchTerm) return affiliates;
    
    const term = searchTerm.toLowerCase();
    return affiliates.filter(affiliate => 
      affiliate.user_name?.toLowerCase().includes(term) ||
      affiliate.email?.toLowerCase().includes(term) ||
      affiliate.affiliate_code?.toLowerCase().includes(term)
    );
  }, [affiliates, searchTerm]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading affiliates: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search by name, email, or affiliate code"
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredAffiliates.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {searchTerm ? 'No affiliates found matching your search.' : 'No affiliates found.'}
          </p>
        </div>
      ) : (
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
              {filteredAffiliates.map((affiliate) => (
                <div
                  key={affiliate.affiliate_uuid}
                  className="grid grid-cols-5 gap-4 p-4 hover:bg-muted/50 cursor-pointer"
                  onClick={() => setSelectedAffiliate(affiliate)}
                >
                  <div>{affiliate.user_name}</div>
                  <div>{affiliate.joined_at}</div>
                  <div className="text-center">{affiliate.active_templates}</div>
                  <div className="text-center">{affiliate.multiplier || "-"}</div>
                  <div className="text-right">{affiliate.fees}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedAffiliate && (
        <AffiliateDetailsDialog
          isOpen={!!selectedAffiliate}
          onClose={() => setSelectedAffiliate(null)}
          affiliate={{
            name: selectedAffiliate.user_name || 'Unknown',
            status: selectedAffiliate.status === 'accepted' ? 'Active Affiliate' : 'Not Affiliate',
            activeTemplates: selectedAffiliate.active_templates || 0,
            totalSales: selectedAffiliate.total_sales || '$0.00',
            affiliateFees: selectedAffiliate.fees || '$0.00'
          }}
        />
      )}
    </div>
  );
}
