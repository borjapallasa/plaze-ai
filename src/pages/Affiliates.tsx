
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainHeader } from "@/components/MainHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AffiliateDashboard } from "@/components/affiliates/AffiliateDashboard";
import { AffiliateTable } from "@/components/affiliates/AffiliateTable";
import { AffiliateDetailsDialog } from "@/components/affiliates/AffiliateDetailsDialog";
import { PaymentSettingsDialog } from "@/components/affiliates/PaymentSettingsDialog";
import { useAuth } from "@/lib/auth";
import { DollarSign, Users, TrendingUp, Calendar } from "lucide-react";

export default function AffiliatesPage() {
  const { user } = useAuth();
  const [selectedAffiliate, setSelectedAffiliate] = useState<string | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  // Fetch affiliate data
  const { data: affiliateData, isLoading: isLoadingAffiliate } = useQuery({
    queryKey: ['affiliate-data', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_uuid', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch all affiliates (for admin/management view)
  const { data: allAffiliates, isLoading: isLoadingAll } = useQuery({
    queryKey: ['all-affiliates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('affiliates')
        .select(`
          affiliate_uuid,
          email,
          affiliate_code,
          status,
          commissions_made,
          commissions_paid,
          commissions_available,
          affiliate_count,
          transaction_count,
          created_at,
          paypal
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleViewDetails = (affiliateUuid: string) => {
    setSelectedAffiliate(affiliateUuid);
    setIsDetailsDialogOpen(true);
  };

  const handleOpenPaymentSettings = (affiliateUuid: string) => {
    setSelectedAffiliate(affiliateUuid);
    setIsPaymentDialogOpen(true);
  };

  if (isLoadingAffiliate || isLoadingAll) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="space-y-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 mt-16 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Affiliate Program</h1>
            <p className="text-muted-foreground mt-2">
              Manage your affiliate partnerships and track commissions
            </p>
          </div>
          
          {affiliateData && (
            <Button
              onClick={() => handleOpenPaymentSettings(affiliateData.affiliate_uuid)}
              variant="outline"
            >
              Payment Settings
            </Button>
          )}
        </div>

        {affiliateData ? (
          <AffiliateDashboard affiliate={affiliateData} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Join Our Affiliate Program</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Start earning commissions by referring customers to our platform.
              </p>
              <Button>Apply to Become an Affiliate</Button>
            </CardContent>
          </Card>
        )}

        <Separator />

        {allAffiliates && allAffiliates.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">All Affiliates</h2>
            <AffiliateTable
              affiliates={allAffiliates}
              onViewDetails={handleViewDetails}
              onManagePayment={handleOpenPaymentSettings}
            />
          </div>
        )}

        <AffiliateDetailsDialog
          affiliateUuid={selectedAffiliate}
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
        />

        <PaymentSettingsDialog
          affiliateUuid={selectedAffiliate || ''}
          isOpen={isPaymentDialogOpen}
          onClose={() => setIsPaymentDialogOpen(false)}
        />
      </div>
    </>
  );
}
