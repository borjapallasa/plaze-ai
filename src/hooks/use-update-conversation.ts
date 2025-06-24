
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UpdateConversationParams {
  conversationUuid: string;
  updates: {
    pinned?: boolean;
    archived?: boolean;
    reported?: boolean;
  };
}

export function useUpdateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationUuid, updates }: UpdateConversationParams) => {
      console.log('Updating conversation:', { conversationUuid, updates });
      
      const { data, error } = await supabase
        .from('conversations')
        .update(updates)
        .eq('conversation_uuid', conversationUuid)
        .select()
        .single();

      if (error) {
        console.error('Error updating conversation:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate the conversations query to refresh the list
      queryClient.invalidateQueries({
        queryKey: ['conversations']
      });
      
      // Show appropriate success message
      if (variables.updates.pinned) {
        toast.success("Conversation pinned");
      } else if (variables.updates.archived) {
        toast.success("Conversation archived");
      } else if (variables.updates.reported) {
        toast.success("Conversation reported");
      }
    },
    onError: (error) => {
      console.error('Failed to update conversation:', error);
      toast.error("Failed to update conversation. Please try again.");
    },
  });
}
