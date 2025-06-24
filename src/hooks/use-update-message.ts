
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useUpdateMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageUuid, content }: { messageUuid: string; content: string }) => {
      console.log('Updating message:', messageUuid, 'with content:', content);
      
      const { data, error } = await supabase
        .from('messages')
        .update({ content })
        .eq('message_uuid', messageUuid)
        .select()
        .single();

      if (error) {
        console.error('Error updating message:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate the conversation messages query to refresh the messages
      queryClient.invalidateQueries({
        queryKey: ['conversation-messages']
      });
      
      toast.success("Message updated successfully");
    },
    onError: (error) => {
      console.error('Failed to update message:', error);
      toast.error("Failed to update message. Please try again.");
    },
  });
}
