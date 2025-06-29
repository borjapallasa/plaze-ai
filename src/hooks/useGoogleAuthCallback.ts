
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
      try {
        // Check if this is a callback from Google OAuth
        const urlParams = new URLSearchParams(window.location.search);
        const hasAuthParams = urlParams.has('code') || window.location.hash.includes('access_token');
        
        // Only process if we have auth parameters and are on a community sign-up/sign-in page
        if (!hasAuthParams || !id) {
          return;
        }

        console.log('Detected Google OAuth callback for community:', id);
        setIsProcessing(true);

        // Wait a moment for Supabase to process the auth session
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get the current user session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log('No user session found after OAuth callback');
          setIsProcessing(false);
          return;
        }

        console.log('Processing Google OAuth callback for user:', session.user.id);

        // Get community details
        const { data: community, error: communityError } = await supabase
          .from('communities')
          .select('community_uuid, expert_uuid, price')
          .eq('community_uuid', id)
          .single();

        if (communityError || !community) {
          console.error('Error fetching community:', communityError);
          toast.error('Community not found');
          setIsProcessing(false);
          return;
        }

        // Check if subscription already exists
        const { data: existingSubscription } = await supabase
          .from('community_subscriptions')
          .select('community_subscription_uuid')
          .eq('user_uuid', session.user.id)
          .eq('community_uuid', id)
          .maybeSingle();

        if (existingSubscription) {
          console.log('Community subscription already exists');
          toast.success('Welcome back! You\'re already a member of this community.');
          setIsProcessing(false);
          navigate(`/community/${id}`);
          return;
        }

        // Create community subscription
        const price = community.price || 0;
        const subscriptionData = {
          user_uuid: session.user.id,
          community_uuid: id,
          expert_user_uuid: community.expert_uuid,
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
          setIsProcessing(false);
          return;
        }

        // Show success message
        if (price > 0) {
          toast.success('Account created! Please complete payment to access the community.');
        } else {
          toast.success('Welcome! You\'ve successfully joined the community.');
        }

        // Clean up URL and redirect
        const cleanUrl = `${window.location.origin}/community/${id}`;
        window.history.replaceState({}, document.title, cleanUrl);
        navigate(`/community/${id}`);
        
      } catch (error) {
        console.error('Error in Google OAuth callback:', error);
        toast.error('An error occurred while joining the community.');
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate, id]);

  return { isProcessing };
};
