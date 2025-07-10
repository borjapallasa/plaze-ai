
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UpdateThreadParams {
  threadUuid: string;
  updates: {
    status?: 'open' | 'closed';
    title?: string;
    initial_message?: string;
  };
}

export function useUpdateThread() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ threadUuid, updates }: UpdateThreadParams) => {
      console.log('Updating thread:', { threadUuid, updates });
      
      const { data, error } = await supabase
        .from('threads')
        .update(updates)
        .eq('thread_uuid', threadUuid)
        .select()
        .single();

      if (error) {
        console.error('Error updating thread:', error);
        throw error;
      }

      console.log('Thread updated successfully:', data);
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate all thread-related queries to ensure consistency
      queryClient.invalidateQueries({
        queryKey: ['community-threads']
      });
      
      // Also invalidate specific community threads
      queryClient.invalidateQueries({
        predicate: (query) => 
          Array.isArray(query.queryKey) && 
          query.queryKey[0] === 'community-threads'
      });
      
      // Show appropriate success message based on the action
      if (variables.updates.status === 'closed') {
        toast.success("Thread archived successfully");
      } else if (variables.updates.status === 'open') {
        toast.success("Thread restored successfully");
      } else {
        toast.success("Thread updated successfully");
      }
    },
    onError: (error) => {
      console.error('Failed to update thread:', error);
      toast.error("Failed to update thread. Please try again.");
    },
  });
}
