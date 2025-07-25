import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Copy, DollarSign, Users, TrendingUp, CreditCard, ExternalLink } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAffiliateData } from "@/hooks/use-affiliate-data";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PaymentSettingsDialog } from "./PaymentSettingsDialog";
import { useRequestPayout } from "@/hooks/use-request-payout";
import { AffiliateOffersSection } from "./AffiliateOffersSection";
import { AffiliateTabsInterface } from "./AffiliateTabsInterface";

export function AffiliateDashboard() {
  const { user } = useAuth();
  const { data: affiliateData, isLoading: affiliateLoading } = useAffiliateData();
  const { data: userProfile } = useUserProfile();
  const requestPayout = useRequestPayout();

  // Fetch referred users count
  const { data: referredUsersCount = 0 } = useQuery({
    queryKey: ['referred-users-count', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;

      // First, get the current user's affiliate code
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('affiliates')
        .select('affiliate_code')
        .eq('user_uuid', user.id)
        .maybeSingle();

      if (affiliateError || !affiliateData?.affiliate_code) {
        return 0;
      }

      // Then, count users who have this affiliate code as their referral code
      const { count, error: countError } = await supabase
        .from('users')
        .select('user_uuid', { count: 'exact', head: true })
        .eq('referral_affiliate_code', affiliateData.affiliate_code);

      if (countError) {
        console.error('Error counting referred users:', countError);
        return 0;
      }

      return count || 0;
    },
    enabled: !!user?.id,
  });

  const handleCopyLink = () => {
    const affiliateCode = affiliateData?.affiliate_code || 'DEFAULT';
    navigator.clipboard.writeText(`https://plaze.ai/sign-up?ref=${affiliateCode}`);
  };

  const handleRequestPayout = () => {
    requestPayout.mutate();
  };

  if (affiliateLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Your affiliate dashboard</h1>
          <p className="text-muted-foreground">Track your performance and manage your affiliate network</p>
        </div>
        <div className="flex items-center gap-2 md:self-start">
          <Button 
            onClick={handleRequestPayout}
            disabled={requestPayout.isPending || !affiliateData?.commissions_available || affiliateData.commissions_available <= 0}
          >
            {requestPayout.isPending ? "Requesting..." : "Request Payout"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <ExternalLink className="h-4 w-4 mr-2" />
                View Analytics
              </DropdownMenuItem>
              <PaymentSettingsDialog>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Settings
                </DropdownMenuItem>
              </PaymentSettingsDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(affiliateData?.commissions_made || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total earned commissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(affiliateData?.commissions_available || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for payout
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sign Ups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {referredUsersCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Active referrals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Out</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(affiliateData?.commissions_paid || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total withdrawn
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Account & Link Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Account Information
              <Badge variant={affiliateData?.status === 'accepted' ? "default" : "secondary"}>
                {affiliateData?.status === 'accepted' ? 'Verified' : affiliateData?.status || 'Pending'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Email Address</p>
              <p className="font-medium">{affiliateData?.email || userProfile?.email || 'Not available'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">PayPal Account</p>
              <p className="font-medium text-muted-foreground">
                {affiliateData?.paypal || 'Not connected'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Affiliate Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <code className="flex-1 text-sm break-all">
                https://plaze.ai/sign-up?ref={affiliateData?.affiliate_code || 'DEFAULT'}
              </code>
              <Button variant="ghost" size="icon" onClick={handleCopyLink} className="shrink-0">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Share this link to earn commission from people who sign up through your link: 3% of their spending during the first 12 months after signup, then 1% of all their spending for life
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Affiliate Tabs Interface */}
      <AffiliateTabsInterface />

      {/* Affiliate Offers Section */}
      <AffiliateOffersSection />
    </div>
  );
}
