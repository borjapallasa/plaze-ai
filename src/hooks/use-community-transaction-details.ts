
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CommunityTransactionDetails {
  community_subscription_transaction_uuid: string;
  amount: number;
  created_at: string;
  community_uuid: string;
  user_uuid: string;
  transaction_uuid: string | null;
  community_name: string;
  buyer_user: string;
  buyer_email: string;
  seller_user: string;
  seller_email: string;
  status: string;
  payment_provider: string;
  payment_reference_id: string | null;
  type: string;
  total_amount: number;
}

export function useCommunityTransactionDetails(communityTransactionId: string) {
  return useQuery({
    queryKey: ['community-transaction-details', communityTransactionId],
    queryFn: async (): Promise<CommunityTransactionDetails | null> => {
      console.log('Fetching community transaction details for ID:', communityTransactionId);
      
      if (!communityTransactionId) {
        return null;
      }

      // Fetch community subscription transaction with related data
      const { data: communityTransaction, error } = await supabase
        .from('community_subscriptions_transactions')
        .select(`
          community_subscription_transaction_uuid,
          amount,
          created_at,
          community_uuid,
          user_uuid,
          transaction_uuid,
          stripe_reference_id,
          communities!community_subscriptions_transactions_community_uuid_fkey(name),
          users!community_subscriptions_transactions_user_uuid_fkey(first_name, last_name, email)
        `)
        .eq('community_subscription_transaction_uuid', communityTransactionId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching community transaction:', error);
        throw error;
      }

      if (!communityTransaction) {
        console.log('No community transaction found with ID:', communityTransactionId);
        return null;
      }

      console.log('Community transaction found:', communityTransaction);

      // Get the expert/seller information from the community
      const { data: communityData, error: communityError } = await supabase
        .from('communities')
        .select(`
          expert_uuid,
          experts!communities_expert_uuid_fkey(name, email)
        `)
        .eq('community_uuid', communityTransaction.community_uuid)
        .maybeSingle();

      if (communityError) {
        console.error('Error fetching community expert:', communityError);
      }

      const buyerName = communityTransaction.users 
        ? `${communityTransaction.users.first_name || ''} ${communityTransaction.users.last_name || ''}`.trim()
        : 'Unknown User';
      
      const buyerEmail = communityTransaction.users?.email || 'Unknown Email';
      const communityName = communityTransaction.communities?.name || 'Unknown Community';
      const sellerName = communityData?.experts?.name || 'Unknown Expert';
      const sellerEmail = communityData?.experts?.email || 'Unknown Email';

      return {
        community_subscription_transaction_uuid: communityTransaction.community_subscription_transaction_uuid,
        amount: communityTransaction.amount || 0,
        created_at: communityTransaction.created_at,
        community_uuid: communityTransaction.community_uuid,
        user_uuid: communityTransaction.user_uuid,
        transaction_uuid: communityTransaction.transaction_uuid,
        community_name: communityName,
        buyer_user: buyerName,
        buyer_email: buyerEmail,
        seller_user: sellerName,
        seller_email: sellerEmail,
        status: 'paid', // Community subscriptions are typically paid
        payment_provider: 'stripe', // Assuming stripe for communities
        payment_reference_id: communityTransaction.stripe_reference_id,
        type: 'community',
        total_amount: communityTransaction.amount || 0,
      };
    },
    enabled: !!communityTransactionId,
  });
}
