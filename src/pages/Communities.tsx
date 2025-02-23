
import React from "react";
import { MainHeader } from "@/components/MainHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, Users, ArrowRight
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const communities = [
  {
    id: 1,
    name: "Optimal Path Automations",
    description: "Scale your business with our proven automation strategies and expert guidance.",
    members: "199",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    joined: true
  },
  {
    id: 2,
    name: "Brotherhood Of Scent",
    description: "#1 Fragrance Community 🏆 Our mission is to help YOU leverage the power of scent.",
    members: "5.3k",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    joined: false
  },
  {
    id: 3,
    name: "Calligraphy Skool",
    description: "Modern calligraphy made easy! Join our creative community ✍️",
    members: "1.1k",
    image: "https://images.unsplash.com/photo-1487252665478-49b61b47f302",
    joined: true
  },
  {
    id: 4,
    name: "The Lady Change",
    description: "THE #1 community for menopausal women to come together and regain their confidence.",
    members: "1.3k",
    image: "https://images.unsplash.com/photo-1501286353178-1ec881214838",
    joined: false
  },
  {
    id: 5,
    name: "School of Mentors",
    description: "Get mentored by millionaires and billionaires who've done it.",
    members: "3.6k",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
    joined: true
  }
];

export default function Communities() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-background min-h-screen">
      <MainHeader />
      <main className="container mx-auto px-4 py-4 pt-24">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Type here to search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Communities Scroll Area */}
          <ScrollArea className="w-full whitespace-nowrap pb-4">
            <div className="flex space-x-4">
              {filteredCommunities.map((community) => (
                <Card
                  key={community.id}
                  className="w-[300px] flex-none group hover:shadow-md transition-all duration-200"
                >
                  <div className="relative h-32 overflow-hidden rounded-t-lg">
                    <img
                      src={community.image}
                      alt={community.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg leading-tight mb-2">
                        {community.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {community.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{community.members} Members</span>
                      </div>
                      <Button
                        variant={community.joined ? "outline" : "default"}
                        size="sm"
                        className="rounded-full gap-1"
                      >
                        {community.joined ? "Open Community" : "Join Community"}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* See More Button */}
          <div className="flex justify-center">
            <Button variant="outline" size="lg" className="rounded-full">
              See more communities
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
