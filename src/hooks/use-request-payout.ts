
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export function useRequestPayout() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error('No authenticated user');
      }

      console.log('Starting payout request for user:', user.id);

      // First, get the affiliate data for the authenticated user
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('affiliates')
        .select('affiliate_uuid, paypal, commissions_available')
        .eq('user_uuid', user.id)
        .maybeSingle();

      if (affiliateError) {
        console.error('Error fetching affiliate data:', affiliateError);
        throw new Error('Failed to fetch affiliate data');
      }

      if (!affiliateData) {
        throw new Error('No affiliate data found');
      }

      // Get the user's email from the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('user_uuid', user.id)
        .maybeSingle();

      if (userError) {
        console.error('Error fetching user data:', userError);
        throw new Error('Failed to fetch user data');
      }

      if (!userData?.email) {
        throw new Error('No user email found');
      }

      // Check if there's an available balance to request
      if (!affiliateData.commissions_available || affiliateData.commissions_available <= 0) {
        throw new Error('No available balance to request payout');
      }

      console.log('Creating payout request with amount:', affiliateData.commissions_available);

      // Insert the payout request
      const { data: payoutData, error: payoutError } = await supabase
        .from('payouts')
        .insert({
          status: 'requested',
          user_uuid: user.id,
          amount: affiliateData.commissions_available,
          paypal: affiliateData.paypal,
          email: userData.email,
          method: 'paypal',
          affiliate_uuid: affiliateData.affiliate_uuid,
          type: 'affiliate'
        })
        .select()
        .single();

      if (payoutError) {
        console.error('Error creating payout request:', payoutError);
        throw new Error('Failed to create payout request');
      }

      console.log('Payout request created successfully:', payoutData);

      // Deduct the payout amount from commissions_available
      const { error: updateError } = await supabase
        .from('affiliates')
        .update({
          commissions_available: 0
        })
        .eq('affiliate_uuid', affiliateData.affiliate_uuid);

      if (updateError) {
        console.error('Error updating affiliate commissions:', updateError);
        throw new Error('Failed to update affiliate balance');
      }

      console.log('Affiliate balance updated successfully');
      return payoutData;
    },
    onSuccess: (data) => {
      console.log('Payout request mutation succeeded, showing toast');
      toast({
        title: "Payout Requested Successfully!",
        description: "Your payout request has been submitted and will be processed soon.",
      });
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['affiliate-data'] });
      queryClient.invalidateQueries({ queryKey: ['affiliate-payouts'] });
    },
    onError: (error: Error) => {
      console.error('Payout request failed:', error);
      toast({
        title: "Payout Request Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
