
import { MainHeader } from "@/components/MainHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Music, Users, Banknote, Zap, Monitor, Heart, Dumbbell, BookOpen, Heart as HeartIcon, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import Typewriter from 'typewriter-effect';

export default function Communities() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const updateScrollState = () => {
      setIsScrolled(window.scrollY > 10);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  const typewriterStrings = [
    "To Learn",
    "To Connect",
    "To Grow",
    "To Share"
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm transition-all duration-200 ease-out bg-background border-b ${
        isScrolled ? 'h-[80px] bg-[#FFFFFF] mt-[5px]' : ''
      }`}>
        <div className="container mx-auto px-4">
          <div className="hidden sm:flex relative pb-[20px]">
            <div className="w-[20%] flex items-start">
              <h1 className="text-2xl font-semibold mt-[15px] ml-[15px]">Logo</h1>
            </div>

            <div className="w-[60%] flex flex-col items-center">
              <div className={`transition-all duration-300 ease-out mt-[15px] ${
                isScrolled ? 'opacity-0 h-0 mb-0 overflow-hidden' : 'opacity-100 h-[32px] mb-[20px]'
              }`}>
                <div className="text-[1.5rem] leading-relaxed font-bold whitespace-nowrap flex items-center justify-center">
                  <span>Join Communities</span>
                  <span className="text-muted-foreground ml-1">
                    <Typewriter
                      options={{
                        strings: typewriterStrings,
                        autoStart: true,
                        loop: true,
                        delay: 50,
                        deleteSpeed: 30,
                      }}
                    />
                  </span>
                </div>
              </div>

              <div className={`flex justify-center transition-transform duration-300 ease-in-out ${
                isScrolled ? 'transform -translate-y-[10px]' : ''
              }`}>
                <div className={`transition-all duration-200 ease-out ${
                  isScrolled ? 'w-[360px]' : 'w-[540px]'
                }`}>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full border shadow-md hover:shadow-lg transition-shadow bg-background">
                    <div className="flex-1 flex items-center gap-2">
                      <Select 
                        defaultValue="Communities"
                      >
                        <SelectTrigger className="border-0 w-[120px] focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-9">
                          <SelectValue className="pr-4" />
                        </SelectTrigger>
                        <SelectContent className="w-[150px]">
                          <SelectItem value="Products">Products</SelectItem>
                          <SelectItem value="Experts">Experts</SelectItem>
                          <SelectItem value="Communities">Communities</SelectItem>
                          <SelectItem value="Jobs">Jobs</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 bg-transparent h-9"
                        placeholder="Search communities..."
                        type="search"
                      />
                    </div>
                    <Button size="icon" variant="default" className="rounded-full bg-primary hover:bg-primary/90">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-[20%] flex items-start justify-end">
              <div className="flex items-center gap-3 mt-[15px] mr-[15px]">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="font-medium text-primary hover:text-primary/90 hover:bg-primary/10"
                >
                  Sell on Plaze
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="sm:hidden">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border shadow-md hover:shadow-lg transition-shadow bg-background">
              <div className="flex-1 flex items-center gap-2">
                <Select 
                  defaultValue="Communities"
                >
                  <SelectTrigger className="border-0 w-[120px] focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-9">
                    <SelectValue className="pr-4" />
                  </SelectTrigger>
                  <SelectContent className="w-[150px]">
                    <SelectItem value="Products">Products</SelectItem>
                    <SelectItem value="Experts">Experts</SelectItem>
                    <SelectItem value="Communities">Communities</SelectItem>
                    <SelectItem value="Jobs">Jobs</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 bg-transparent h-9"
                  placeholder="Search communities..."
                  type="search"
                />
              </div>
              <Button size="icon" variant="default" className="rounded-full bg-primary hover:bg-primary/90">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-[1200px] space-y-8 mt-32">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Discover communities
          </h1>
          <p className="text-xl text-muted-foreground">
            or <a href="/create-community" className="text-primary hover:underline">create your own</a>
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Badge
                key={category.id}
                variant={category.id === 'all' ? "default" : "secondary"}
                className={`px-4 py-2 text-sm font-medium cursor-pointer transition-all duration-200 ${
                  category.id === 'all' 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'hover:bg-secondary hover:shadow-sm'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.label}
              </Badge>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community) => (
            <Card key={community.id} className="group hover:shadow-lg transition-shadow relative">
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
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
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

                <p className="text-muted-foreground text-sm line-clamp-2 text-left mb-4">
                  {community.description}
                </p>

                <div className="flex items-center justify-between text-sm mb-12">
                  <div className="text-muted-foreground">
                    {community.members} Members
                  </div>
                  <div className="font-medium">
                    {community.price}
                  </div>
                </div>

                <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-primary opacity-0 transform translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
