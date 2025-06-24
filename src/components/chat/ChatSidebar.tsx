
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Settings, User } from "lucide-react";
import { type Conversation } from "@/hooks/use-conversations";

interface ChatSidebarProps {
  conversations: Conversation[];
  selectedChat: Conversation | null;
  onSelectChat: (chat: Conversation) => void;
  isVisible: boolean;
}

export function ChatSidebar({ conversations, selectedChat, onSelectChat, isVisible }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = conversations?.filter(chat => 
    chat.otherParticipantName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    chat.subject.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (!isVisible) return null;

  return (
    <div className="w-full md:w-80 border-r flex-col flex">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl md:text-2xl font-bold">Messages</h1>
          <Button variant="ghost" size="icon" className="hover:bg-accent">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            className="pl-9 bg-secondary" 
            placeholder="Search messages" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <p>No conversations found</p>
          </div>
        ) : (
          filteredChats.map(chat => (
            <div 
              key={chat.conversation_uuid} 
              className={`p-4 cursor-pointer transition-all hover:bg-accent/50 border-l-2 ${
                selectedChat?.conversation_uuid === chat.conversation_uuid 
                  ? "bg-accent border-l-primary" 
                  : "border-l-transparent"
              }`} 
              onClick={() => onSelectChat(chat)}
            >
              <div className="flex gap-3">
                <div className="relative flex-shrink-0">
                  <Avatar className="h-12 w-12 border-2 border-background ring-2 ring-background">
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  {chat.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className="font-semibold truncate leading-none mb-1.5">
                      {chat.otherParticipantName}
                    </p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                      {chat.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mb-1">
                    {chat.lastMessage}
                  </p>
                  {chat.unread && (
                    <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
