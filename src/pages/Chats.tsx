
import { useState } from "react";
import { MainHeader } from "@/components/MainHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, MessageSquare } from "lucide-react";

interface Chat {
  id: string;
  subject: string;
  participants: string;
  lastMessageDate: string;
  startDate: string;
  totalMessages: number;
}

const mockChats: Chat[] = [
  {
    id: "1",
    subject: "Automated Onboarding (Contract, Payments & Channels) Process to Discord",
    participants: "Automated Onboarding (Contract, Payments & Channels) Process to Discord - Phil, Borja",
    lastMessageDate: "Saturday, 22/02/2025 08:45",
    startDate: "4/1/2025 14:03",
    totalMessages: 4
  },
  // Add more mock chats as needed
];

export default function Chats() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const filteredChats = mockChats.filter(chat =>
    chat.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <MainHeader />
      </div>

      <main className="container mx-auto px-4 pt-[126px] pb-8 max-w-6xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-4">Your inbox</h1>
            <p className="text-muted-foreground text-lg">
              Here you can find all your active conversations. If you want to delete one. Just select the conversation, 
              click on Archive and then select "Close" in the Pop-Up. This action is irreversible.
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Start typing to search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {filteredChats.map((chat) => (
              <Card
                key={chat.id}
                className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedChat?.id === chat.id ? "border-primary" : ""
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="grid md:grid-cols-[1fr,2fr] gap-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold">{chat.subject}</h3>
                    <p className="text-sm text-muted-foreground">
                      Last Message @ {chat.lastMessageDate}
                    </p>
                    <div className="inline-block bg-secondary px-3 py-1 rounded-full text-sm">
                      Total Messages: {chat.totalMessages}
                    </div>
                  </div>
                  
                  {selectedChat?.id === chat.id && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Subject:</p>
                        <p>{chat.subject}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Conversation:</p>
                        <p>{chat.participants}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Last Message Date:</p>
                        <p>{chat.lastMessageDate}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Conversation Started Date:</p>
                        <p>{chat.startDate}</p>
                      </div>
                      <div className="flex gap-3 mt-4">
                        <Button className="gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Open Chat
                        </Button>
                        <Button variant="outline">
                          Archive
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
