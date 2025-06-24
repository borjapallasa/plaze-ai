
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export interface Conversation {
  conversation_uuid: string;
  subject: string;
  user_starter_uuid: string;
  user_recipient_uuid: string;
  user_starter_name: string;
  user_recipient_name: string;
  message_count: number;
  created_at: string;
  status: string;
  // Computed fields for UI
  otherParticipantName: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
  online?: boolean;
}

export function useConversations() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async (): Promise<Conversation[]> => {
      if (!user?.id) {
        console.log('No authenticated user');
        return [];
      }

      console.log('Fetching conversations for user:', user.id);

      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`user_starter_uuid.eq.${user.id},user_recipient_uuid.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        throw error;
      }

      console.log('Conversations found:', conversations);

      return (conversations || []).map(conversation => {
        // Determine the other participant's name
        const otherParticipantName = conversation.user_starter_uuid === user.id 
          ? conversation.user_recipient_name 
          : conversation.user_starter_name;

        // Show message count or appropriate message
        const messageCount = conversation.message_count || 0;
        const lastMessage = messageCount > 0 
          ? `${messageCount} message${messageCount === 1 ? '' : 's'}`
          : "No messages yet";

        return {
          conversation_uuid: conversation.conversation_uuid,
          subject: conversation.subject || otherParticipantName,
          user_starter_uuid: conversation.user_starter_uuid,
          user_recipient_uuid: conversation.user_recipient_uuid,
          user_starter_name: conversation.user_starter_name,
          user_recipient_name: conversation.user_recipient_name,
          message_count: messageCount,
          created_at: conversation.created_at,
          status: conversation.status || 'active',
          // UI fields
          otherParticipantName,
          lastMessage,
          timestamp: new Date(conversation.created_at).toLocaleDateString(),
          online: Math.random() > 0.5, // Random for now, can be enhanced with real presence data
        };
      });
    },
    enabled: !!user?.id,
  });
}
