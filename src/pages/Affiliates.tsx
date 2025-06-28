import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainHeader } from "@/components/MainHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Copy, DollarSign, Users, TrendingUp, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AffiliateTable } from "@/components/affiliates/AffiliateTable";
import { AffiliateDashboard } from "@/components/affiliates/AffiliateDashboard";
import { PaymentSettingsDialog } from "@/components/affiliates/PaymentSettingsDialog";
import { useAuth } from "@/lib/auth";

export default function Affiliates() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const { data: affiliateData, isLoading, error } = useQuery({
    queryKey: ['affiliate-data', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.error('No user ID provided for affiliate data query');
        return null;
      }

      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_uuid', user.id)
        .single();

      if (error) {
        console.error("Error fetching affiliate data:", error);
        return null;
      }

      return data;
    },
    enabled: !!user?.id,
  });

  const { data: referrals, isLoading: isReferralsLoading, error: referralsError } = useQuery({
    queryKey: ['affiliate-referrals', affiliateData?.affiliate_uuid],
    queryFn: async () => {
      if (!affiliateData?.affiliate_uuid) {
        console.warn('No affiliate UUID available, skipping referrals query');
        return [];
      }

      const { data, error } = await supabase
        .from('referrals')
        .select(`
          *,
          referred_user: referred_user_uuid (
            user_uuid,
            first_name,
            last_name,
            email
          )
        `)
        .eq('affiliate_uuid', affiliateData.affiliate_uuid);

      if (error) {
        console.error("Error fetching affiliate referrals:", error);
        return [];
      }

      return data || [];
    },
    enabled: !!affiliateData?.affiliate_uuid,
  });

  const handleCopyClick = () => {
    if (affiliateData?.referral_link) {
      navigator.clipboard.writeText(affiliateData.referral_link);
      toast({
        title: "Referral link copied!",
        description: "Share this link with your friends.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No referral link available.",
      });
    }
  };

  if (isLoading) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-muted rounded-lg"></div>
            <div className="h-8 w-1/3 bg-muted rounded"></div>
            <div className="h-4 w-2/3 bg-muted rounded"></div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 mt-16">
          <Card className="p-6">
            <h1 className="text-xl font-semibold">Error</h1>
            <p className="text-muted-foreground mt-2">
              Failed to load affiliate data. Please try again later.
            </p>
          </Card>
        </div>
      </>
    );
  }

  if (!affiliateData) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 mt-16">
          <Card className="p-6">
            <h1 className="text-xl font-semibold">Affiliate Program</h1>
            <p className="text-muted-foreground mt-2">
              You are not currently an affiliate. Contact support to become an affiliate.
            </p>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 mt-16">
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="space-y-4">
            <AffiliateDashboard affiliateData={affiliateData} referrals={referrals} />
          </TabsContent>
          <TabsContent value="referrals" className="space-y-4">
            <AffiliateTable referrals={referrals} isLoading={isReferralsLoading} />
          </TabsContent>
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>Update your payment information.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setIsPaymentDialogOpen(true)}>Update Payment Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <PaymentSettingsDialog
          open={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
          affiliateUuid={affiliateData.affiliate_uuid}
        />
      </div>
    </>
  );
}
