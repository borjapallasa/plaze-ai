
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useDeactivatePartnership() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (partnershipUuid: string) => {
      const { data, error } = await supabase
        .from('affiliate_partnerships')
        .update({ status: 'inactive' })
        .eq('affiliate_partnership_uuid', partnershipUuid)
        .select()
        .single();

      if (error) {
        console.error('Error deactivating partnership:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch partnerships data
      queryClient.invalidateQueries({ queryKey: ['affiliate-partnerships'] });
      
      toast({
        title: "Partnership deactivated",
        description: "The partnership has been successfully deactivated.",
      });
    },
    onError: (error) => {
      console.error('Partnership deactivation failed:', error);
      toast({
        title: "Deactivation failed",
        description: "Failed to deactivate partnership. Please try again.",
        variant: "destructive",
      });
    },
  });
}
