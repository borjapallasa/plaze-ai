
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { MainHeader } from "@/components/MainHeader";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { useIsMobile } from "@/hooks/use-mobile";
import { useConversations, type Conversation } from "@/hooks/use-conversations";
import { useConversationMessages } from "@/hooks/use-conversation-messages";
import { useUpdateMessage } from "@/hooks/use-update-message";
import { useSendMessage } from "@/hooks/use-send-message";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useAuth } from "@/lib/auth";
import { useUpdateConversation } from "@/hooks/use-update-conversation";

export default function Chats() {
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const isMobile = useIsMobile();
  
  const { user, loading: authLoading } = useAuth();
  const { data: conversations, isLoading, error } = useConversations();
  const { data: messages, isLoading: messagesLoading } = useConversationMessages(selectedChat?.conversation_uuid || null);
  const { data: userProfile } = useUserProfile();
  const updateMessage = useUpdateMessage();
  const sendMessage = useSendMessage();
  const updateConversation = useUpdateConversation();

  const handlePinChat = () => {
    if (selectedChat) {
      updateConversation.mutate({
        conversationUuid: selectedChat.conversation_uuid,
        updates: { pinned: true }
      });
    }
  };

  const handleArchiveChat = () => {
    if (selectedChat) {
      updateConversation.mutate({
        conversationUuid: selectedChat.conversation_uuid,
        updates: { archived: true }
      });
    }
  };

  const handleInviteUser = () => {
    console.log('Invite user action');
  };

  const handleReportChat = () => {
    if (selectedChat) {
      updateConversation.mutate({
        conversationUuid: selectedChat.conversation_uuid,
        updates: { reported: true }
      });
    }
  };

  const handleEditMessage = (messageId: string, currentContent: string) => {
    setEditingMessageId(messageId);
    setMessageInput(currentContent);
  };

  const handleSaveEdit = () => {
    if (editingMessageId && messageInput.trim()) {
      updateMessage.mutate({
        messageUuid: editingMessageId,
        content: messageInput.trim()
      });
      setEditingMessageId(null);
      setMessageInput("");
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setMessageInput("");
  };

  const handleSendMessage = () => {
    if (editingMessageId) {
      handleSaveEdit();
    } else if (messageInput.trim() && selectedChat && user && userProfile) {
      // Send new message
      const userName = `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 'Anonymous';
      
      sendMessage.mutate({
        content: messageInput.trim(),
        conversationUuid: selectedChat.conversation_uuid,
        userUuid: user.id,
        userName: userName,
        email: user.email || ''
      });
      setMessageInput("");
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader />
        <div className="container mx-auto max-w-[1400px] px-2 md:px-4 lg:px-8 py-6 pt-28">
          <div className="flex h-[calc(100vh-140px)] rounded-lg border bg-card shadow-sm overflow-hidden">
            <div className="flex-1 flex items-center justify-center">
              <p>Loading conversations...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader />
        <div className="container mx-auto max-w-[1400px] px-2 md:px-4 lg:px-8 py-6 pt-28">
          <div className="flex h-[calc(100vh-140px)] rounded-lg border bg-card shadow-sm overflow-hidden">
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-2">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <p>Please sign in to view your conversations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading conversations:', error);
  }

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      
      <div className="container mx-auto max-w-[1400px] px-2 md:px-4 lg:px-8 py-6 pt-28">
        <div className="flex h-[calc(100vh-140px)] rounded-lg border bg-card shadow-sm overflow-hidden">
          <ChatSidebar
            conversations={conversations || []}
            selectedChat={selectedChat}
            onSelectChat={setSelectedChat}
            isVisible={!isMobile || !selectedChat}
          />

          <ChatArea
            selectedChat={selectedChat}
            messages={messages}
            messagesLoading={messagesLoading}
            currentUserId={user.id}
            messageInput={messageInput}
            editingMessageId={editingMessageId}
            onBackClick={() => setSelectedChat(null)}
            onPinChat={handlePinChat}
            onArchiveChat={handleArchiveChat}
            onInviteUser={handleInviteUser}
            onReportChat={handleReportChat}
            onEditMessage={handleEditMessage}
            onCancelEdit={handleCancelEdit}
            onMessageInputChange={setMessageInput}
            onSendMessage={handleSendMessage}
            isUpdating={updateConversation.isPending}
            isSendingDisabled={updateMessage.isPending || sendMessage.isPending}
            isVisible={!isMobile || selectedChat}
          />
        </div>
      </div>
    </div>
  );
}
