
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MainHeader } from "@/components/MainHeader";
import { Users, Globe } from "lucide-react";

const categories = [
  { id: "all", label: "All", icon: "🌟" },
  { id: "hobbies", label: "Hobbies", icon: "🎨" },
  { id: "music", label: "Music", icon: "🎵" },
  { id: "money", label: "Money", icon: "💰" },
  { id: "spirituality", label: "Spirituality", icon: "🙏" },
  { id: "tech", label: "Tech", icon: "💻" },
  { id: "health", label: "Health", icon: "🌿" },
  { id: "sports", label: "Sports", icon: "⚽" },
  { id: "self-improvement", label: "Self-improvement", icon: "🎯" },
  { id: "relationships", label: "Relationships", icon: "❤️" },
] as const;

const communities = [
  {
    id: 1,
    title: "Brotherhood Of Scent",
    description: "#1 Fragrance Community 🏆 Our mission is to help YOU leverage the power of scent to become the man you know yourself to be.",
    members: "5.3k",
    price: "Free",
    category: "hobbies",
    image: "https://images.unsplash.com/photo-1618160140288-8967b76f1c56",
    avatar: "https://images.unsplash.com/photo-1618160140288-8967b76f1c56"
  },
  {
    id: 2,
    title: "Calligraphy Skool",
    description: "Modern calligraphy made easy! ✍️",
    members: "1.1k",
    price: "$9/month",
    category: "hobbies",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    avatar: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
  },
  {
    id: 3,
    title: "The Lady Change",
    description: "THE #1 community for menopausal (peri & post) women to come together, lose weight, get healthier and regain their confidence.",
    members: "1.3k",
    price: "$49/month",
    category: "health",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    avatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
  },
  {
    id: 4,
    title: "School of Mentors",
    description: "🌎 💰 Join The #1 Community In The World For Entrepreneurs And Get Mentored Every Week By The Millionaires And Billionaires Inside",
    members: "3.6k",
    price: "$39/month",
    category: "money",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    avatar: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
  },
  {
    id: 5,
    title: "That Pickleball School",
    description: "Join a community of obsessed pickleball players, learn the strategies pros rely on & get personalized help so you play consistently better",
    members: "690",
    price: "$39/month",
    category: "sports",
    image: "https://images.unsplash.com/photo-1519861531473-9200262188bf",
    avatar: "https://images.unsplash.com/photo-1519861531473-9200262188bf"
  },
  {
    id: 6,
    title: "Adonis Gang",
    description: "Join the #1 masculine self-improvement community... Level up in all areas of your life and finally leave Jeffery behind.",
    members: "176.4k",
    price: "Free",
    category: "self-improvement",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
    avatar: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48"
  }
];

const CommunityCard = ({ community }) => {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-200">
      <div className="aspect-[1.5] relative overflow-hidden">
        <img 
          src={community.image}
          alt={community.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-sm font-medium">
          <span>#{community.id}</span>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <img 
              src={community.avatar} 
              alt={`${community.title} avatar`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight truncate">{community.title}</h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{community.members} Members</span>
              <span>•</span>
              <span>{community.price}</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{community.description}</p>
      </CardContent>
    </Card>
  );
};

export default function Communities() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredCommunities = selectedCategory === "all"
    ? communities
    : communities.filter(community => community.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      
      <main className="container mx-auto px-4 pt-[140px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Communities</h1>
            <p className="text-muted-foreground mt-1">Join communities that match your interests</p>
          </div>
          <Button className="hidden sm:flex" size="lg">
            <Globe className="w-4 h-4 mr-2" />
            Create Community
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none -mx-4 px-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className="flex-shrink-0"
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="mr-1.5">{category.icon}</span>
              {category.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredCommunities.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      </main>
    </div>
  );
}
