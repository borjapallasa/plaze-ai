
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainHeader } from "@/components/MainHeader";
import { AffiliateTable } from "@/components/affiliates/AffiliateTable";
import { AffiliateDetailsDialog } from "@/components/affiliates/AffiliateDetailsDialog";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Affiliates() {
  const [selectedAffiliateId, setSelectedAffiliateId] = useState<string | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const { data: affiliates, isLoading, error } = useQuery({
    queryKey: ['affiliates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching affiliates:", error);
        throw error;
      }

      return data;
    },
  });

  const handleAffiliateClick = (affiliateId: string) => {
    setSelectedAffiliateId(affiliateId);
    setIsDetailsDialogOpen(true);
  };

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Affiliates</h1>
            <p className="text-muted-foreground">
              Manage affiliate partnerships and track performance
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive">Error loading affiliates</p>
          </div>
        ) : (
          <AffiliateTable 
            affiliates={affiliates || []} 
            onAffiliateClick={handleAffiliateClick}
          />
        )}

        <AffiliateDetailsDialog
          affiliateUuid={selectedAffiliateId}
          isOpen={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
        />
      </div>
    </>
  );
}
