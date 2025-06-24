
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
      // Invalidate and refetch community subscriptions
      queryClient.invalidateQueries({ queryKey: ['community-subscriptions'] });
    },
    onError: (error) => {
      console.error('Failed to leave community:', error);
      toast.error("Failed to leave community. Please try again.");
    },
  });
}
