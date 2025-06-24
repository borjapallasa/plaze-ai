
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SendMessageParams {
  content: string;
  conversationUuid: string;
  userUuid: string;
  userName: string;
  email: string;
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, conversationUuid, userUuid, userName, email }: SendMessageParams) => {
      console.log('Sending message:', { content, conversationUuid, userUuid, userName, email });
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          content,
          conversation_uuid: conversationUuid,
          user_uuid: userUuid,
          user_name: userName,
          email,
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate the conversation messages query to refresh the messages
      queryClient.invalidateQueries({
        queryKey: ['conversation-messages', variables.conversationUuid]
      });
      
      // Also invalidate conversations to update last message info
      queryClient.invalidateQueries({
        queryKey: ['conversations']
      });
      
      toast.success("Message sent successfully");
    },
    onError: (error) => {
      console.error('Failed to send message:', error);
      toast.error("Failed to send message. Please try again.");
    },
  });
}
