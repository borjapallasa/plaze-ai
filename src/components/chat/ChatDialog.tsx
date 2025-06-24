
import React from "react";
import { MessageCircle, Users, Clock } from "lucide-react";
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
import { useConversations } from "@/hooks/use-conversations";
import { useNavigate } from "react-router-dom";

export function ChatDialog() {
  const navigate = useNavigate();
  const { data: conversations, isLoading } = useConversations();

  const handleConversationClick = (conversationUuid: string) => {
    navigate(`/chats?conversation=${conversationUuid}`);
  };

  return (
    <Dialog>
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Conversations
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[400px] w-full">
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
                onClick={() => navigate('/experts')}
                variant="outline"
                size="sm"
              >
                Find Experts
              </Button>
            </div>
          )}
        </ScrollArea>
        
        {conversations && conversations.length > 0 && (
          <div className="flex justify-center pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/chats')}
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
