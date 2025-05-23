
import { useState } from "react";
import { MainHeader } from "@/components/MainHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Search, User, Settings, Video, MessageSquare, Image, SmilePlus, Send, ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Chat {
  id: string;
  subject: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
  online?: boolean;
}

const mockChats: Chat[] = [
  {
    id: "1",
    subject: "Ihor Poltavtsev",
    lastMessage: "E-commerce Email Marketing I...",
    timestamp: "6/3/23",
    online: false,
  },
  {
    id: "2",
    subject: "Elisha Adeniyi",
    lastMessage: "Quick Fix: CSS Conflict Style in ...",
    timestamp: "1/24/25",
    online: true,
  },
  {
    id: "3",
    subject: "Arslan Ahmad",
    lastMessage: "LinkedIn API Trouble Shooting ...",
    timestamp: "1/24/25",
    online: true,
  },
  {
    id: "4",
    subject: "Manoj Kargar",
    lastMessage: "FlutterFlow Developer for Saa...",
    timestamp: "1/22/25",
    unread: 2,
    online: true,
  }
];

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  avatar?: string;
  outgoing?: boolean;
  read?: boolean;
}

const mockMessages: Message[] = [
  {
    id: "1",
    sender: "Borja Pallasa Alvarez",
    content: "Hey man, was super busy yesterday, can you show the themes?",
    timestamp: "Jan 16, 2025 | 3:49 PM",
    outgoing: false,
    read: true
  },
  {
    id: "2",
    sender: "Elisha Adeniyi",
    content: "go through the messages I sent",
    timestamp: "4:04 PM",
    outgoing: true,
    read: true
  },
  {
    id: "3",
    sender: "Elisha Adeniyi",
    content: "I tagged you on the other chat",
    timestamp: "5:13 PM",
    outgoing: true,
    read: false
  }
];

export default function Chats() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const isMobile = useIsMobile();

  const filteredChats = mockChats.filter(chat =>
    chat.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      
      <div className="container mx-auto max-w-[1400px] px-2 md:px-4 lg:px-8 py-6 pt-28">
        <div className="flex h-[calc(100vh-140px)] rounded-lg border bg-card shadow-sm overflow-hidden">
          {/* Sidebar */}
          <div className={`${
            isMobile && selectedChat ? 'hidden' : 'flex'
          } w-full md:w-80 border-r flex-col`}>
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-4 cursor-pointer transition-all hover:bg-accent/50 border-l-2 ${
                    selectedChat?.id === chat.id 
                      ? "bg-accent border-l-primary" 
                      : "border-l-transparent"
                  }`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="flex gap-3">
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-12 w-12 border-2 border-background ring-2 ring-background">
                        <AvatarFallback>
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                        {chat.avatar && <AvatarImage src={chat.avatar} />}
                      </Avatar>
                      {chat.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-semibold truncate leading-none mb-1.5">
                          {chat.subject}
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
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`${
            isMobile && !selectedChat ? 'hidden' : 'flex'
          } flex-1 flex-col bg-background`}>
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="px-4 md:px-6 py-4 border-b flex items-center justify-between bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    {isMobile && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="mr-1 md:hidden" 
                        onClick={() => setSelectedChat(null)}
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                    )}
                    <Avatar className="h-10 w-10 ring-2 ring-background">
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                      {selectedChat.avatar && <AvatarImage src={selectedChat.avatar} />}
                    </Avatar>
                    <div>
                      <h2 className="font-semibold leading-none mb-1">{selectedChat.subject}</h2>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${selectedChat.online ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                        {selectedChat.online ? "Active now" : "Offline"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="hover:bg-accent hidden md:inline-flex">
                      <Video className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:bg-accent hidden md:inline-flex">
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:bg-accent">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                  {mockMessages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex gap-3 ${message.outgoing ? 'flex-row-reverse' : ''}`}
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-background">
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                        {message.avatar && <AvatarImage src={message.avatar} />}
                      </Avatar>
                      <div className={`flex flex-col ${message.outgoing ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[80%]`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm font-medium ${message.outgoing ? 'order-2' : ''}`}>
                            {message.sender}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {message.timestamp}
                          </span>
                        </div>
                        <div 
                          className={`rounded-2xl px-4 py-2.5 ${
                            message.outgoing 
                              ? 'bg-primary text-primary-foreground rounded-br-none' 
                              : 'bg-accent rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        </div>
                        {message.outgoing && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {message.read ? 'Read' : 'Sent'}
                            </span>
                            <Check className={`h-3 w-3 ${message.read ? 'text-primary' : 'text-muted-foreground'}`} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-3 md:p-4 border-t bg-card/50 backdrop-blur-sm">
                  <div className="flex gap-2 items-center">
                    <Button variant="ghost" size="icon" className="flex-shrink-0 hover:bg-accent hidden md:inline-flex">
                      <Image className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="flex-shrink-0 hover:bg-accent hidden md:inline-flex">
                      <SmilePlus className="h-5 w-5" />
                    </Button>
                    <Input 
                      className="flex-1 bg-background" 
                      placeholder="Type your message..." 
                    />
                    <Button size="icon" className="flex-shrink-0">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center space-y-2">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <p>Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
