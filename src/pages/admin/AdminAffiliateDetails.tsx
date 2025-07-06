
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainHeader } from "@/components/MainHeader";
import { DefaultHeader } from "@/components/DefaultHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DollarSign, Users, TrendingUp, CreditCard, MoreHorizontal, CheckCircle, XCircle, Pause } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useAdminCheck } from "@/hooks/use-admin-check";
import { useEffect } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface AffiliateDetails {
  id: number;
  affiliate_uuid: string;
  user_uuid: string | null;
  email: string | null;
  status: string | null;
  affiliate_code: string | null;
  paypal: string | null;
  commissions_made: number | null;
  commissions_available: number | null;
  commissions_paid: number | null;
  created_at: string;
}

export default function AdminAffiliateDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: adminData, isLoading: adminLoading } = useAdminCheck();
  const queryClient = useQueryClient();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!authLoading && !adminLoading) {
      if (!user) {
        navigate('/sign-in');
        return;
      }
      
      if (adminData && !adminData.isAdmin) {
        navigate('/');
        return;
      }
    }
  }, [user, adminData, authLoading, adminLoading, navigate]);

  // Fetch affiliate details
  const { data: affiliate, isLoading, error } = useQuery({
    queryKey: ['admin-affiliate-details', id],
    queryFn: async (): Promise<AffiliateDetails | null> => {
      if (!id) throw new Error('No affiliate ID provided');

      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .eq('affiliate_uuid', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching affiliate details:', error);
        throw error;
      }

      return data;
    },
    enabled: !!id && !!user && adminData?.isAdmin,
  });

  // Fetch referred users count
  const { data: referredUsersCount = 0 } = useQuery({
    queryKey: ['referred-users-count', affiliate?.affiliate_code],
    queryFn: async () => {
      if (!affiliate?.affiliate_code) return 0;

      const { count, error } = await supabase
        .from('users')
        .select('user_uuid', { count: 'exact', head: true })
        .eq('referral_affiliate_code', affiliate.affiliate_code);

      if (error) {
        console.error('Error counting referred users:', error);
        return 0;
      }

      return count || 0;
    },
    enabled: !!affiliate?.affiliate_code,
  });

  const handleUpdateStatus = async (newStatus: 'accepted' | 'rejected' | 'suspended') => {
    if (!affiliate) return;

    try {
      const { error } = await supabase
        .from('affiliates')
        .update({ status: newStatus })
        .eq('affiliate_uuid', affiliate.affiliate_uuid);

      if (error) {
        console.error('Error updating affiliate status:', error);
        toast.error("Failed to update affiliate status");
        return;
      }

      toast.success(`Affiliate status updated to ${newStatus}`);
      queryClient.invalidateQueries({ queryKey: ['admin-affiliate-details', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-affiliates'] });
    } catch (error) {
      console.error('Error updating affiliate status:', error);
      toast.error("An unexpected error occurred");
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'suspended':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Suspended</Badge>;
      case 'new':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">New</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Show loading while checking authentication and admin status
  if (authLoading || adminLoading) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Checking permissions...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Don't render anything if user is not admin (redirect will happen)
  if (!user || (adminData && !adminData.isAdmin)) {
    return null;
  }

  if (isLoading) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
          <DefaultHeader title="Affiliate Details" backLink="/admin/affiliates" />
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading affiliate details...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !affiliate) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
          <DefaultHeader title="Affiliate Details" backLink="/admin/affiliates" />
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-muted-foreground">Affiliate not found</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
        <DefaultHeader 
          title="Affiliate Details" 
          backLink="/admin/affiliates"
          action={
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal className="h-4 w-4 mr-2" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleUpdateStatus('accepted')}
                  className="text-green-600"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleUpdateStatus('rejected')}
                  className="text-red-600"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleUpdateStatus('suspended')}
                  className="text-yellow-600"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Suspend
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          }
        />

        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                {affiliate.email || 'Unknown Affiliate'}
                {getStatusBadge(affiliate.status)}
              </h1>
              <p className="text-muted-foreground">
                Affiliate Code: <code className="text-sm bg-muted px-2 py-1 rounded">{affiliate.affiliate_code}</code>
              </p>
              <p className="text-sm text-muted-foreground">
                Member since {new Date(affiliate.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(affiliate.commissions_made || 0).toFixed(2)}
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
                ${(affiliate.commissions_available || 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Ready for payout
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Referrals</CardTitle>
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
                ${(affiliate.commissions_paid || 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total withdrawn
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Account Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Account Information
                {getStatusBadge(affiliate.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="font-medium">{affiliate.email || 'Not available'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Affiliate Code</p>
                <p className="font-medium">
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {affiliate.affiliate_code || 'Not available'}
                  </code>
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">PayPal Account</p>
                <p className="font-medium text-muted-foreground">
                  {affiliate.paypal || 'Not connected'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">User UUID</p>
                <p className="font-medium text-xs">
                  {affiliate.user_uuid || 'Not available'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Affiliate Link</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <code className="flex-1 text-sm break-all">
                  https://plaze.ai/sign-up?ref={affiliate.affiliate_code || 'DEFAULT'}
                </code>
              </div>
              <p className="text-xs text-muted-foreground">
                This is the affiliate link for referrals. Users who sign up through this link will be tracked to this affiliate.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
