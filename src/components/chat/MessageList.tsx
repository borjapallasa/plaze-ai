
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, User, Edit2 } from "lucide-react";
import { type ConversationMessage } from "@/hooks/use-conversation-messages";

interface MessageListProps {
  messages: ConversationMessage[];
  currentUserId: string;
  isLoading: boolean;
  onEditMessage: (messageId: string, currentContent: string) => void;
  editingMessageId: string | null;
}

export function MessageList({ 
  messages, 
  currentUserId, 
  isLoading, 
  onEditMessage, 
  editingMessageId 
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Helper function to check if a message should show user info
  const shouldShowUserInfo = (currentIndex: number, messages: ConversationMessage[]) => {
    if (currentIndex === 0) return true;
    const currentMessage = messages[currentIndex];
    const previousMessage = messages[currentIndex - 1];
    return currentMessage.user_uuid !== previousMessage.user_uuid;
  };

  // Helper function to check if a message should show timestamp
  const shouldShowTimestamp = (currentIndex: number, messages: ConversationMessage[]) => {
    if (currentIndex === 0) return true;
    const currentMessage = messages[currentIndex];
    const previousMessage = messages[currentIndex - 1];
    
    // Show timestamp if different user or more than 5 minutes apart
    if (currentMessage.user_uuid !== previousMessage.user_uuid) return true;
    
    const currentTime = new Date(currentMessage.created_at).getTime();
    const previousTime = new Date(previousMessage.created_at).getTime();
    const timeDifference = currentTime - previousTime;
    
    return timeDifference > 5 * 60 * 1000; // 5 minutes
  };

  // Helper function to check if a message should show "Sent" status
  const shouldShowSentStatus = (currentIndex: number, messages: ConversationMessage[]) => {
    if (currentIndex !== messages.length - 1) return false; // Only show for last message
    const currentMessage = messages[currentIndex];
    return currentMessage.user_uuid === currentUserId; // Only show for outgoing messages
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-1">
        <div className="flex items-center justify-center h-full">
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-1">
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <p>No messages in this conversation yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-1">
      {messages.map((message, index) => {
        const isOutgoing = message.user_uuid === currentUserId;
        const isBeingEdited = editingMessageId === message.message_uuid;
        const showUserInfo = shouldShowUserInfo(index, messages);
        const showTimestamp = shouldShowTimestamp(index, messages);
        const showSentStatus = shouldShowSentStatus(index, messages);
        
        return (
          <div 
            key={message.message_uuid} 
            className={`flex gap-3 ${isOutgoing ? 'flex-row-reverse' : ''} ${
              showUserInfo ? 'mt-6 first:mt-0' : 'mt-1'
            }`}
          >
            {showUserInfo && (
              <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-background">
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
            {!showUserInfo && <div className="w-8 flex-shrink-0" />}
            <div className={`flex flex-col ${isOutgoing ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[80%]`}>
              {showUserInfo && (
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-medium ${isOutgoing ? 'order-2' : ''}`}>
                    {message.user_name}
                  </span>
                  {showTimestamp && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.created_at).toLocaleString()}
                    </span>
                  )}
                </div>
              )}
              <div className={`rounded-2xl px-4 py-2.5 ${
                isOutgoing 
                  ? 'bg-primary text-primary-foreground rounded-br-none' 
                  : 'bg-accent rounded-bl-none'
              } relative group ${isBeingEdited ? 'ring-2 ring-primary' : ''} ${
                !showUserInfo ? (isOutgoing ? 'rounded-br-2xl' : 'rounded-bl-2xl') : ''
              }`}>
                <p className="text-sm whitespace-pre-wrap break-words">
                  {message.content || "No content available"}
                </p>
                {isOutgoing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onEditMessage(message.message_uuid, message.content || "")}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
              {isOutgoing && showSentStatus && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-muted-foreground">Sent</span>
                  <Check className="h-3 w-3 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
