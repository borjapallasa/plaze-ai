
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function usePartnershipMutations() {
  const queryClient = useQueryClient();

  const updatePartnershipStatus = useMutation({
    mutationFn: async ({ partnershipUuid, status }: { partnershipUuid: string; status: string }) => {
      const { data, error } = await supabase
        .from('affiliate_partnerships')
        .update({ status })
        .eq('affiliate_partnership_uuid', partnershipUuid)
        .select()
        .single();

      if (error) {
        console.error('Error updating partnership status:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch partnerships data
      queryClient.invalidateQueries({ queryKey: ['expert-partnerships'] });
      
      // Show success message based on action
      const actionMessages = {
        'active': 'Partnership accepted successfully',
        'rejected': 'Partnership rejected successfully',
        'paused': 'Partnership paused successfully',
        'pending': 'Partnership resumed successfully'
      };
      
      toast.success(actionMessages[variables.status as keyof typeof actionMessages] || 'Partnership updated successfully');
    },
    onError: (error) => {
      console.error('Partnership update failed:', error);
      toast.error('Failed to update partnership. Please try again.');
    },
  });

  const deletePartnership = useMutation({
    mutationFn: async (partnershipUuid: string) => {
      const { error } = await supabase
        .from('affiliate_partnerships')
        .delete()
        .eq('affiliate_partnership_uuid', partnershipUuid);

      if (error) {
        console.error('Error deleting partnership:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch partnerships data
      queryClient.invalidateQueries({ queryKey: ['expert-partnerships'] });
      toast.success('Partnership deleted successfully');
    },
    onError: (error) => {
      console.error('Partnership deletion failed:', error);
      toast.error('Failed to delete partnership. Please try again.');
    },
  });

  return {
    updatePartnershipStatus,
    deletePartnership,
  };
}
