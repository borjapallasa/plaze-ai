
import React from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

interface ChatButtonProps {
  expertUuid: string;
  expertName: string;
}

export function ChatButton({ expertUuid, expertName }: ChatButtonProps) {
  const { user } = useAuth();

  const handleChatClick = async () => {
    if (!user) {
      // Redirect to sign in if not authenticated
      window.open('/sign-in', '_blank');
      return;
    }

    try {
      console.log('ChatButton: Checking for existing conversation between', user.id, 'and', expertUuid);
      
      // Check if conversation already exists between these users
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('conversation_uuid')
        .or(`and(user_starter_uuid.eq.${user.id},user_recipient_uuid.eq.${expertUuid}),and(user_starter_uuid.eq.${expertUuid},user_recipient_uuid.eq.${user.id})`)
        .maybeSingle();

      console.log('ChatButton: Existing conversation:', existingConversation);

      if (existingConversation) {
        // Open existing conversation
        console.log('ChatButton: Opening existing conversation');
        window.open(`/chats?conversation=${existingConversation.conversation_uuid}`, '_blank');
      } else {
        // Create new conversation
        console.log('ChatButton: Creating new conversation');
        const { data: newConversation, error } = await supabase
          .from('conversations')
          .insert({
            user_starter_uuid: user.id,
            user_recipient_uuid: expertUuid,
            user_starter_name: user.email || 'User',
            user_recipient_name: expertName,
            subject: `Chat with ${expertName}`,
            source: 'information request',
            status: 'open'
          })
          .select('conversation_uuid')
          .single();

        console.log('ChatButton: New conversation result:', newConversation, error);

        if (error) {
          console.error('Error creating conversation:', error);
          return;
        }

        // Open new conversation
        console.log('ChatButton: Opening new conversation');
        window.open(`/chats?conversation=${newConversation.conversation_uuid}`, '_blank');
      }
    } catch (error) {
      console.error('Error handling chat:', error);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleChatClick}
      className="h-8 w-8 p-0 hover:bg-accent"
    >
      <MessageCircle className="h-4 w-4" />
    </Button>
  );
}
