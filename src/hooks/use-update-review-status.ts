
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reviewId, status }: { reviewId: string; status: 'published' | 'rejected' }) => {
      const { error } = await supabase
        .from('reviews')
        .update({ status })
        .eq('review_uuid', reviewId);

      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      // Invalidate and refetch reviews
      queryClient.invalidateQueries({ queryKey: ['expert-reviews'] });
      
      toast.success(
        status === 'published' 
          ? "Review approved and published" 
          : "Review rejected"
      );
    },
    onError: (error) => {
      console.error('Error updating review status:', error);
      toast.error("Failed to update review status");
    },
  });
}
