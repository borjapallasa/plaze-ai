
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useAffiliateData } from "@/hooks/use-affiliate-data";
import { AffiliateDashboard } from "@/components/affiliates/AffiliateDashboard";
import { toast } from "sonner";
import { Loader2, UserPlus, Clock } from "lucide-react";

export default function AffiliatesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const { data: affiliateData, isLoading: affiliateLoading, refetch } = useAffiliateData();
  const [isCreating, setIsCreating] = useState(false);

  const generateAffiliateCode = (firstName: string, lastName: string) => {
    const fullName = `${firstName} ${lastName}`;
    return fullName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };

  const handleCreateAffiliate = async () => {
    if (!user || !userProfile) {
      toast.error("Please log in to become an affiliate");
      return;
    }

    if (!userProfile.first_name || !userProfile.last_name) {
      toast.error("Please complete your profile with first and last name");
      return;
    }

    setIsCreating(true);

    try {
      const affiliateCode = generateAffiliateCode(userProfile.first_name, userProfile.last_name);

      const { error } = await supabase
        .from('affiliates')
        .insert({
          user_uuid: user.id,
          email: user.email,
          status: 'new',
          affiliate_code: affiliateCode
        });

      if (error) {
        console.error('Error creating affiliate record:', error);
        toast.error("Failed to create affiliate account. Please try again.");
        return;
      }

      toast.success("Affiliate account created successfully!");
      // Redirect to dashboard after successful creation
      navigate('/affiliates/dashboard');
    } catch (error) {
      console.error('Error creating affiliate:', error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  if (!user) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 pt-24">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Please log in to access the affiliates program.</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (profileLoading || affiliateLoading) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  // Check if we're on the dashboard route and user has affiliate data with status 'new'
  const isDashboardRoute = window.location.pathname === '/affiliates/dashboard';
  
  if (isDashboardRoute && affiliateData?.status === 'new') {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <Clock className="h-5 w-5" />
                  Request Pending Review
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Your affiliate application has been submitted and is currently under review. 
                  You'll receive an email notification once your application has been processed.
                </p>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">Application Details:</h3>
                  <p><strong>Email:</strong> {affiliateData.email}</p>
                  <p><strong>Affiliate Code:</strong> {affiliateData.affiliate_code}</p>
                  <p><strong>Status:</strong> <span className="capitalize text-orange-600">{affiliateData.status}</span></p>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p><strong>What happens next?</strong></p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Our team will review your application</li>
                    <li>You'll receive an email notification with the decision</li>
                    <li>Once approved, you can start earning commissions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  // Show dashboard for approved affiliates
  if (isDashboardRoute && affiliateData && affiliateData.status !== 'new') {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 pt-24">
          <AffiliateDashboard />
        </div>
      </>
    );
  }

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Affiliate Program</h1>
            <p className="text-muted-foreground mt-2">
              Join our affiliate program and start earning commissions
            </p>
          </div>

          {!affiliateData ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Become an Affiliate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Ready to start earning? Join our affiliate program and get your unique affiliate code.
                </p>
                
                {userProfile && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-medium mb-2">Your Details:</h3>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Name:</strong> {userProfile.first_name} {userProfile.last_name}</p>
                    {userProfile.first_name && userProfile.last_name && (
                      <p><strong>Affiliate Code:</strong> {generateAffiliateCode(userProfile.first_name, userProfile.last_name)}</p>
                    )}
                  </div>
                )}

                <Button 
                  onClick={handleCreateAffiliate}
                  disabled={isCreating || !userProfile?.first_name || !userProfile?.last_name}
                  className="w-full"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Affiliate Account
                    </>
                  )}
                </Button>

                {(!userProfile?.first_name || !userProfile?.last_name) && (
                  <p className="text-sm text-muted-foreground text-center">
                    Please complete your profile with first and last name to continue.
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Welcome, Affiliate!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Your affiliate account is active. Here are your details:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-medium text-sm text-muted-foreground">Affiliate Code</h3>
                    <p className="font-mono text-lg">{affiliateData.affiliate_code}</p>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-medium text-sm text-muted-foreground">Status</h3>
                    <p className="capitalize">{affiliateData.status}</p>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-medium text-sm text-muted-foreground">Commissions Made</h3>
                    <p className="text-lg">${affiliateData.commissions_made || 0}</p>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-medium text-sm text-muted-foreground">Available</h3>
                    <p className="text-lg">${affiliateData.commissions_available || 0}</p>
                  </div>
                </div>

                <Button 
                  onClick={() => navigate('/affiliates/dashboard')}
                  className="w-full"
                >
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
