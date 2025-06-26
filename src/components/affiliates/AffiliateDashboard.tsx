
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Copy, DollarSign, Users, TrendingUp, CreditCard, ExternalLink } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAffiliateData } from "@/hooks/use-affiliate-data";
import { useUserProfile } from "@/hooks/use-user-profile";

export function AffiliateDashboard() {
  const { data: affiliateData, isLoading: affiliateLoading } = useAffiliateData();
  const { data: userProfile } = useUserProfile();

  const handleCopyLink = () => {
    const affiliateCode = affiliateData?.affiliate_code || 'DEFAULT';
    navigator.clipboard.writeText(`https://nocodeclick.com/sign-up?ref=${affiliateCode}`);
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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-foreground">Your affiliate dashboard</h1>
          <p className="text-muted-foreground">Track your performance and manage your affiliate network</p>
        </div>
        <div className="flex items-center gap-2 md:self-start">
          <Button>Request Payout</Button>
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
              <DropdownMenuItem>
                <CreditCard className="h-4 w-4 mr-2" />
                Payment Settings
              </DropdownMenuItem>
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
            <CardTitle className="text-sm font-medium">Affiliates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {affiliateData?.affiliate_count || 0}
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
              <Badge variant={affiliateData?.status === 'active' ? "default" : "secondary"}>
                {affiliateData?.status === 'active' ? 'Verified' : 'Pending'}
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
                https://nocodeclick.com/sign-up?ref={affiliateData?.affiliate_code || 'DEFAULT'}
              </code>
              <Button variant="ghost" size="icon" onClick={handleCopyLink} className="shrink-0">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Share this link to earn commissions on referrals
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
