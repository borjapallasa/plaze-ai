
import React from "react";
import { MainHeader } from "@/components/MainHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  PenLine, Coins, Flame, Heart, Music, 
  Brain, MonitorSmartphone, Activity, Target, Users,
  ArrowRight, TrendingUp, Sparkle, Trophy, ThumbsUp, Star, Tags
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const categories = [
  { id: "trending", label: "Trending", icon: TrendingUp, dark: true },
  { id: "newest", label: "Newest", icon: Sparkle },
  { id: "top-seller", label: "Top Seller", icon: Trophy },
  { id: "best-reviews", label: "Best Reviews", icon: ThumbsUp },
  { id: "our-pick", label: "Our Pick", icon: Star },
  { id: "affiliate-offers", label: "Affiliate Offers", icon: Tags, dark: true }
];

const communities = [
  {
    id: 1,
    name: "Brotherhood Of Scent",
    description: "#1 Fragrance Community 🏆 Our mission is to help YOU leverage the power of scent to become the man you know yourself to be.",
    members: "5.3k",
    pricing: "Free",
    image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23",
    category: "hobbies"
  },
  {
    id: 2,
    name: "Calligraphy Skool",
    description: "Modern calligraphy made easy! ✍️",
    members: "1.1k",
    pricing: "$9/month",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    category: "hobbies"
  },
  {
    id: 3,
    name: "The Lady Change",
    description: "THE #1 community for menopausal (peri & post) women to come together, lose weight, get healthier and regain their confidence.",
    members: "1.3k",
    pricing: "$49/month",
    image: "https://images.unsplash.com/photo-1498936178812-4b2e558d2937",
    category: "health"
  },
  {
    id: 4,
    name: "School of Mentors",
    description: "🌎 💰 Join The #1 Community In The World For Entrepreneurs And Get Mentored Every Week By The Millionaires And Billionaires Who've Done It.",
    members: "3.6k",
    pricing: "$39/month",
    image: "https://images.unsplash.com/photo-1501286353178-1ec881214838",
    category: "money"
  },
  {
    id: 5,
    name: "That Pickleball School",
    description: "Join a community of obsessed pickleball players, learn the strategies pros rely on & get personalized help so you play confidently.",
    members: "690",
    pricing: "$39/month",
    image: "https://images.unsplash.com/photo-1469041797191-50ace28483c3",
    category: "sports"
  },
  {
    id: 6,
    name: "Adonis Gang",
    description: "Join the #1 masculine self-improvement community... Level up in all areas of your life and finally leave Jeffery behind.",
    members: "176.4k",
    pricing: "Free",
    image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23",
    category: "self-improvement"
  }
];

const Communities = () => {
  const [selectedCategory, setSelectedCategory] = React.useState("all");

  const filteredCommunities = communities.filter(community => 
    selectedCategory === "all" || community.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16">
        <MainHeader />
        
        <div className="container mx-auto px-4 py-8">
          {/* Categories */}
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-3 pb-4">
              {categories.map(({ id, label, icon: Icon, dark }) => (
                <Button
                  key={id}
                  variant="outline"
                  className={cn(
                    "rounded-full px-6 h-11 shadow-sm",
                    dark ? "bg-[#1A1F2C] text-white hover:bg-[#1A1F2C]/90" : "bg-white hover:bg-white/90",
                    selectedCategory === id && "ring-2 ring-primary"
                  )}
                  onClick={() => setSelectedCategory(id)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Communities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredCommunities.map((community) => (
              <Card 
                key={community.id} 
                className="group relative overflow-hidden flex flex-col transition-all duration-200 hover:bg-gray-50"
              >
                {/* Community Image */}
                <div className="relative aspect-[2/1] overflow-hidden">
                  <img
                    src={community.image}
                    alt={community.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    #{community.id}
                  </div>
                </div>

                <div className="p-6 pb-8 flex-1 flex flex-col">
                  <h3 className="font-semibold text-lg leading-none mb-4">
                    {community.name}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm mb-6">
                    {community.description}
                  </p>

                  {/* Footer */}
                  <div className="mt-auto flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{community.members} Members</span>
                    </div>
                    <Badge variant="outline">{community.pricing}</Badge>
                  </div>

                  {/* Arrow */}
                  <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communities;
