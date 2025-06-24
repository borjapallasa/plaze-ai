
import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Users, Clock, ArrowLeft, Send, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useConversations } from "@/hooks/use-conversations";
import { useConversationMessages } from "@/hooks/use-conversation-messages";
import { useSendMessage } from "@/hooks/use-send-message";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

export function ChatDialog() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: conversations, isLoading } = useConversations();
  const { data: userProfile } = useUserProfile();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { data: messages, isLoading: messagesLoading } = useConversationMessages(selectedConversation);
  const sendMessage = useSendMessage();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleConversationClick = (conversationUuid: string) => {
    setSelectedConversation(conversationUuid);
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  const handleViewAllConversations = () => {
    setOpen(false);
    navigate('/chats');
  };

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedConversation && user && userProfile) {
      const userName = `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 'Anonymous';
      
      sendMessage.mutate({
        content: messageInput.trim(),
        conversationUuid: selectedConversation,
        userUuid: user.id,
        userName: userName,
        email: user.email || ''
      });
      setMessageInput("");
    }
  };

  const selectedConversationData = conversations?.find(
    conv => conv.conversation_uuid === selectedConversation
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative hover:bg-accent rounded-full"
          aria-label="Open chats"
        >
          <MessageCircle className="h-5 w-5" />
          {conversations && conversations.length > 0 && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-pulse" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {selectedConversation && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToList}
                className="h-6 w-6 -ml-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <MessageCircle className="h-5 w-5" />
            {selectedConversation ? selectedConversationData?.subject || 'Conversation' : 'Conversations'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          {selectedConversation ? (
            <div className="h-full flex flex-col">
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p>Loading messages...</p>
                  </div>
                ) : messages && messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isOutgoing = message.user_uuid === user?.id;
                      
                      return (
                        <div key={message.message_uuid} className={`flex gap-3 ${isOutgoing ? 'flex-row-reverse' : ''}`}>
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className={`flex flex-col ${isOutgoing ? 'items-end' : 'items-start'} max-w-[80%]`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-sm font-medium ${isOutgoing ? 'order-2' : ''}`}>
                                {message.user_name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(message.created_at).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className={`rounded-2xl px-4 py-2.5 ${
                              isOutgoing 
                                ? 'bg-primary text-primary-foreground rounded-br-sm' 
                                : 'bg-accent rounded-bl-sm'
                            }`}>
                              <p className="text-sm whitespace-pre-wrap break-words">
                                {message.content || "No content available"}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>No messages in this conversation yet</p>
                  </div>
                )}
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2 items-center">
                  <Input 
                    className="flex-1" 
                    placeholder="Type your message..." 
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    size="icon" 
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || sendMessage.isPending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-full">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : conversations && conversations.length > 0 ? (
                <div className="space-y-2">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.conversation_uuid}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => handleConversationClick(conversation.conversation_uuid)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {conversation.otherParticipantName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm truncate">
                            {conversation.otherParticipantName}
                          </h4>
                          <div className="flex items-center gap-1">
                            {conversation.online && (
                              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {conversation.timestamp}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {conversation.subject}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {conversation.lastMessage}
                          </span>
                          {conversation.unread && conversation.unread > 0 && (
                            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">No conversations yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start a conversation with an expert or community member
                  </p>
                  <Button 
                    onClick={() => {
                      setOpen(false);
                      navigate('/experts');
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Find Experts
                  </Button>
                </div>
              )}
            </ScrollArea>
          )}
        </div>
        
        {conversations && conversations.length > 0 && !selectedConversation && (
          <div className="flex justify-center pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleViewAllConversations}
              className="w-full"
            >
              View All Conversations
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
