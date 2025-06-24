
import { MessageSquare } from "lucide-react";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { type Conversation } from "@/hooks/use-conversations";
import { type ConversationMessage } from "@/hooks/use-conversation-messages";

interface ChatAreaProps {
  selectedChat: Conversation | null;
  messages: ConversationMessage[] | undefined;
  messagesLoading: boolean;
  currentUserId: string;
  messageInput: string;
  editingMessageId: string | null;
  onBackClick: () => void;
  onPinChat: () => void;
  onArchiveChat: () => void;
  onInviteUser: () => void;
  onReportChat: () => void;
  onEditMessage: (messageId: string, currentContent: string) => void;
  onCancelEdit: () => void;
  onMessageInputChange: (value: string) => void;
  onSendMessage: () => void;
  isUpdating: boolean;
  isSendingDisabled: boolean;
  isVisible: boolean;
}

export function ChatArea({ 
  selectedChat, 
  messages, 
  messagesLoading, 
  currentUserId,
  messageInput,
  editingMessageId,
  onBackClick,
  onPinChat,
  onArchiveChat,
  onInviteUser,
  onReportChat,
  onEditMessage,
  onCancelEdit,
  onMessageInputChange,
  onSendMessage,
  isUpdating,
  isSendingDisabled,
  isVisible
}: ChatAreaProps) {
  if (!isVisible) return null;

  if (!selectedChat) {
    return (
      <div className="flex-1 flex-col bg-background flex">
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center space-y-2">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <p>Select a conversation to start chatting</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex-col bg-background flex">
      <ChatHeader
        selectedChat={selectedChat}
        onBackClick={onBackClick}
        onPinChat={onPinChat}
        onArchiveChat={onArchiveChat}
        onInviteUser={onInviteUser}
        onReportChat={onReportChat}
        isUpdating={isUpdating}
      />
      
      <MessageList
        messages={messages || []}
        currentUserId={currentUserId}
        isLoading={messagesLoading}
        onEditMessage={onEditMessage}
        editingMessageId={editingMessageId}
      />

      <MessageInput
        messageInput={messageInput}
        onMessageInputChange={onMessageInputChange}
        onSendMessage={onSendMessage}
        editingMessageId={editingMessageId}
        onCancelEdit={onCancelEdit}
        isDisabled={isSendingDisabled}
      />
    </div>
  );
}
