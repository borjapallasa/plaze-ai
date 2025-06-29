
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { MainHeader } from "@/components/MainHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, DollarSign, Users, TrendingUp, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AffiliateDashboard } from "@/components/affiliates/AffiliateDashboard";
import { AffiliateTable } from "@/components/affiliates/AffiliateTable";
import { PaymentSettingsDialog } from "@/components/affiliates/PaymentSettingsDialog";

export default function Affiliates() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const { data: affiliateData, isLoading } = useQuery({
    queryKey: ['affiliate-data', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');
      
      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_uuid', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: referrals, isLoading: isReferralsLoading } = useQuery({
    queryKey: ['affiliate-referrals', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');
      
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          users!transactions_buyer_uuid_fkey(first_name, last_name, email)
        `)
        .eq('affiliate_uuid', affiliateData?.affiliate_uuid)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!affiliateData?.affiliate_uuid,
  });

  const copyAffiliateLink = () => {
    if (affiliateData?.affiliate_code) {
      const link = `${window.location.origin}?ref=${affiliateData.affiliate_code}`;
      navigator.clipboard.writeText(link);
      toast({
        title: "Link copied!",
        description: "Your affiliate link has been copied to clipboard.",
      });
    }
  };

  if (isLoading) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!affiliateData) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Affiliate Program</CardTitle>
              <CardDescription>
                You're not enrolled in the affiliate program yet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button>Join Affiliate Program</Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 mt-16 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Affiliate Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Track your referrals and commissions
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsPaymentDialogOpen(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Payment Settings
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${affiliateData.commissions_made}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${affiliateData.commissions_available}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Out</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${affiliateData.commissions_paid}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Referrals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{affiliateData.affiliate_count}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Affiliate Link</CardTitle>
            <CardDescription>
              Share this link to earn commissions on referrals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <code className="flex-1 p-2 bg-muted rounded text-sm">
                {window.location.origin}?ref={affiliateData.affiliate_code}
              </code>
              <Button onClick={copyAffiliateLink} size="sm">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div>Referrals Table Placeholder</div>

        <PaymentSettingsDialog
          affiliateUuid={affiliateData.affiliate_uuid}
          isOpen={isPaymentDialogOpen}
          onClose={() => setIsPaymentDialogOpen(false)}
        />
      </div>
    </>
  );
}
