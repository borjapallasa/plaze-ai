
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ConversationMessage {
  message_uuid: string;
  user_uuid: string;
  user_name: string;
  conversation_uuid: string;
  content: string;
  created_at: string;
}

export function useConversationMessages(conversationUuid: string | null) {
  return useQuery({
    queryKey: ['conversation-messages', conversationUuid],
    queryFn: async (): Promise<ConversationMessage[]> => {
      if (!conversationUuid) {
        console.log('No conversation UUID provided');
        return [];
      }

      console.log('Fetching messages for conversation:', conversationUuid);
      
      const { data: messages, error } = await supabase
        .from('messages')
        .select('message_uuid, user_uuid, user_name, conversation_uuid, content, created_at')
        .eq('conversation_uuid', conversationUuid)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversation messages:', error);
        throw error;
      }

      console.log('Messages found for conversation:', messages);

      return messages || [];
    },
    enabled: !!conversationUuid,
  });
}
