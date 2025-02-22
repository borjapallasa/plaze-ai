
import { MainHeader } from "@/components/MainHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Music, Users, Banknote, Zap, Monitor, Heart, Dumbbell, BookOpen, Heart as HeartIcon } from "lucide-react";

export default function Communities() {
  const categories = [
    { id: 'all', label: 'All', icon: Users },
    { id: 'hobbies', label: 'Hobbies', icon: BookOpen },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'money', label: 'Money', icon: Banknote },
    { id: 'spirituality', label: 'Spirituality', icon: Zap },
    { id: 'tech', label: 'Tech', icon: Monitor },
    { id: 'health', label: 'Health', icon: Heart },
    { id: 'sports', label: 'Sports', icon: Dumbbell },
    { id: 'relationships', label: 'Relationships', icon: HeartIcon },
  ];

  const communities = [
    {
      id: 1,
      name: "UX Design Masters",
      description: "Learn and share UX design knowledge with fellow designers. Weekly workshops and design critiques.",
      image: "/lovable-uploads/50385371-4590-48ee-b814-7f6ce488745f.png",
      members: "5.3k",
      price: "Free",
      badge: "#1"
    },
    {
      id: 2,
      name: "Digital Marketing Hub",
      description: "Master the art of digital marketing with industry experts. Get access to exclusive resources and case studies.",
      image: "/lovable-uploads/50385371-4590-48ee-b814-7f6ce488745f.png",
      members: "3.2k",
      price: "$9/month",
      badge: "#2"
    },
    {
      id: 3,
      name: "Startup Founders Circle",
      description: "Connect with fellow founders, share experiences, and get advice on growing your startup.",
      image: "/lovable-uploads/50385371-4590-48ee-b814-7f6ce488745f.png",
      members: "2.1k",
      price: "$49/month",
      badge: "#3"
    }
  ];

  return (
    <>
      <MainHeader />
      <main className="container mx-auto px-4 py-8 max-w-[1200px] space-y-8 mt-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Discover communities
          </h1>
          <p className="text-xl text-muted-foreground">
            or <a href="/create-community" className="text-primary hover:underline">create your own</a>
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search for anything" className="pl-9" />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={category.id === 'all' ? "default" : "outline"}
                className="flex-shrink-0"
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.label}
              </Button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community) => (
            <Card key={community.id} className="group hover:shadow-lg transition-shadow">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={community.image} 
                  alt={community.name}
                  className="w-full h-full object-cover"
                />
                <Badge 
                  className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm" 
                  variant="outline"
                >
                  {community.badge}
                </Badge>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={community.image} />
                    <AvatarFallback>
                      {community.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold truncate">{community.name}</h3>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm line-clamp-2">
                  {community.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="text-muted-foreground">
                    {community.members} Members
                  </div>
                  <div className="font-medium">
                    {community.price}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
