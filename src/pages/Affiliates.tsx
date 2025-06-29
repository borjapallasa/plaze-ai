
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainHeader } from "@/components/MainHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      
      if (error) {
        console.error('Error fetching affiliate data:', error);
        return null;
      }
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
      
      if (error) {
        console.error('Error fetching all affiliates:', error);
        return [];
      }
      return data || [];
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

  if (isLoadingAffiliate) {
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
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Affiliate Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Commissions Made</span>
                    </div>
                    <p className="text-2xl font-bold">${affiliateData.commissions_made || 0}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Available</span>
                    </div>
                    <p className="text-2xl font-bold">${affiliateData.commissions_available || 0}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Referrals</span>
                    </div>
                    <p className="text-2xl font-bold">{affiliateData.affiliate_count || 0}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Transactions</span>
                    </div>
                    <p className="text-2xl font-bold">{affiliateData.transaction_count || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Affiliate Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Affiliate Code</p>
                  <p className="font-medium">{affiliateData.affiliate_code}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{affiliateData.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">PayPal Account</p>
                  <p className="font-medium">{affiliateData.paypal || 'Not set'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
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

        {allAffiliates && allAffiliates.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>All Affiliates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allAffiliates.map((affiliate) => (
                  <div key={affiliate.affiliate_uuid} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{affiliate.email}</p>
                      <p className="text-sm text-muted-foreground">Code: {affiliate.affiliate_code}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${affiliate.commissions_made || 0}</p>
                      <p className="text-sm text-muted-foreground">{affiliate.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
