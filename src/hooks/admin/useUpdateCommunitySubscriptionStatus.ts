
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type CommunitySubscriptionStatus = "active" | "inactive" | "pending";

export function useUpdateCommunitySubscriptionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ subscriptionId, status }: { subscriptionId: string; status: CommunitySubscriptionStatus }) => {
      const { error } = await supabase
        .from('community_subscriptions')
        .update({ 
          status,
          cancelled_at: status === 'inactive' ? new Date().toISOString() : null
        })
        .eq('community_subscription_uuid', subscriptionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-community-subscriptions'] });
      toast.success("Subscription status updated successfully");
    },
    onError: (error) => {
      console.error('Error updating subscription status:', error);
      toast.error("Failed to update subscription status");
    }
  });
}
