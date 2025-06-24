
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
      
      // First check if the conversation exists and get current values
      const { data: existingConversation, error: checkError } = await supabase
        .from('conversations')
        .select('conversation_uuid, pinned, archived, reported')
        .eq('conversation_uuid', conversationUuid)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking conversation existence:', checkError);
        throw checkError;
      }

      if (!existingConversation) {
        console.error('Conversation not found:', conversationUuid);
        throw new Error('Conversation not found');
      }

      // For boolean fields, toggle the current value if not explicitly provided
      const finalUpdates = {
        ...updates,
        pinned: updates.pinned !== undefined ? updates.pinned : !existingConversation.pinned,
        archived: updates.archived !== undefined ? updates.archived : !existingConversation.archived,
        reported: updates.reported !== undefined ? updates.reported : !existingConversation.reported,
      };

      // Now update the conversation
      const { data, error } = await supabase
        .from('conversations')
        .update(finalUpdates)
        .eq('conversation_uuid', conversationUuid)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating conversation:', error);
        throw error;
      }

      console.log('Conversation updated successfully:', data);
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate the conversations query to refresh the list
      queryClient.invalidateQueries({
        queryKey: ['conversations']
      });
      
      // Show appropriate success message based on the action
      if (variables.updates.pinned !== undefined) {
        toast.success(variables.updates.pinned ? "Conversation pinned" : "Conversation unpinned");
      } else if (variables.updates.archived !== undefined) {
        toast.success(variables.updates.archived ? "Conversation archived" : "Conversation unarchived");
      } else if (variables.updates.reported !== undefined) {
        toast.success(variables.updates.reported ? "Conversation reported" : "Report removed");
      }
    },
    onError: (error) => {
      console.error('Failed to update conversation:', error);
      toast.error("Failed to update conversation. Please try again.");
    },
  });
}
