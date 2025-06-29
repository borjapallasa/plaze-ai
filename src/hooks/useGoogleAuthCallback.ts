
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useGoogleAuthCallback = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Check if this is a callback from Google OAuth
      const urlParams = new URLSearchParams(window.location.search);
      const communityId = urlParams.get('community_id');
      const expertUuid = urlParams.get('expert_uuid');
      const communityPrice = urlParams.get('community_price');

      // Only process if we have community parameters from OAuth redirect
      if (!communityId || !expertUuid) {
        return;
      }

      setIsProcessing(true);

      try {
        // Get the current user session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log('No user session found');
          return;
        }

        console.log('Processing Google OAuth callback for community:', communityId);

        // Check if subscription already exists
        const { data: existingSubscription } = await supabase
          .from('community_subscriptions')
          .select('community_subscription_uuid')
          .eq('user_uuid', session.user.id)
          .eq('community_uuid', communityId)
          .maybeSingle();

        if (existingSubscription) {
          console.log('Community subscription already exists');
          return;
        }

        // Create community subscription
        const price = parseFloat(communityPrice || '0');
        const subscriptionData = {
          user_uuid: session.user.id,
          community_uuid: communityId,
          expert_user_uuid: expertUuid,
          email: session.user.email,
          status: (price > 0 ? 'pending' : 'active') as 'active' | 'inactive' | 'pending',
          type: (price > 0 ? 'paid' : 'free') as 'free' | 'paid',
          amount: price,
        };

        console.log('Creating community subscription via Google OAuth:', subscriptionData);

        const { error } = await supabase
          .from('community_subscriptions')
          .insert(subscriptionData);

        if (error) {
          console.error('Error creating community subscription:', error);
          toast.error('Failed to join community. Please try again.');
          return;
        }

        // Show success message
        if (price > 0) {
          toast.success('Account created! Please complete payment to access the community.');
        } else {
          toast.success('Welcome! You\'ve successfully joined the community.');
        }

        // Clean up URL parameters and redirect
        const cleanUrl = `${window.location.origin}/community/${communityId}`;
        window.history.replaceState({}, document.title, cleanUrl);
        
      } catch (error) {
        console.error('Error in Google OAuth callback:', error);
        toast.error('An error occurred while joining the community.');
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate, id]);

  return { isProcessing };
};
