
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useLeaveCommunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subscriptionUuid: string) => {
      console.log('Leaving community for subscription:', subscriptionUuid);
      
      const { error } = await supabase
        .from('community_subscriptions')
        .update({ status: 'inactive' })
        .eq('community_subscription_uuid', subscriptionUuid);

      if (error) {
        console.error('Error leaving community:', error);
        throw error;
      }

      return { success: true };
    },
    onSuccess: () => {
      toast.success("Successfully left the community");
      // Invalidate and refetch both community subscriptions queries
      queryClient.invalidateQueries({ queryKey: ['community-subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['user-community-subscriptions'] });
      // Force refetch to ensure immediate UI update
      queryClient.refetchQueries({ queryKey: ['user-community-subscriptions'] });
    },
    onError: (error) => {
      console.error('Failed to leave community:', error);
      toast.error("Failed to leave community. Please try again.");
    },
  });
}
