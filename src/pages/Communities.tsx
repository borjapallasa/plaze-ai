import { MainHeader } from "@/components/MainHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Music, Users, Banknote, Zap, Monitor, Heart, Dumbbell, BookOpen, Heart as HeartIcon, ArrowRight, Menu, User } from "lucide-react";
import { useState, useEffect } from "react";
import Typewriter from 'typewriter-effect';
import { Link } from "react-router-dom";

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
    },
    {
      id: 4,
      name: "AI Enthusiasts",
      description: "Explore the latest in artificial intelligence with fellow enthusiasts. Weekly discussions and project showcases.",
      image: "/lovable-uploads/50385371-4590-48ee-b814-7f6ce488745f.png",
      members: "4.2k",
      price: "Free",
      badge: "#4"
    },
    {
      id: 5,
      name: "Web3 Developers",
      description: "Join the future of web development. Learn blockchain, smart contracts, and decentralized applications.",
      image: "/lovable-uploads/50385371-4590-48ee-b814-7f6ce488745f.png",
      members: "3.8k",
      price: "$19/month",
      badge: "#5"
    },
    {
      id: 6,
      name: "Content Creators Lab",
      description: "A community for content creators to share tips, get feedback, and collaborate on projects.",
      image: "/lovable-uploads/50385371-4590-48ee-b814-7f6ce488745f.png",
      members: "6.1k",
      price: "$29/month",
      badge: "#6"
    },
    {
      id: 7,
      name: "Data Science Hub",
      description: "Learn data science from experts. Weekly workshops on machine learning, statistics, and data visualization.",
      image: "/lovable-uploads/50385371-4590-48ee-b814-7f6ce488745f.png",
      members: "4.5k",
      price: "$39/month",
      badge: "#7"
    },
    {
      id: 8,
      name: "Product Managers Circle",
      description: "Connect with product managers worldwide. Share experiences and best practices in product development.",
      image: "/lovable-uploads/50385371-4590-48ee-b814-7f6ce488745f.png",
      members: "3.9k",
      price: "$29/month",
      badge: "#8"
    },
    {
      id: 9,
      name: "Mobile App Developers",
      description: "Community for mobile app developers. Share knowledge about iOS, Android, and cross-platform development.",
      image: "/lovable-uploads/50385371-4590-48ee-b814-7f6ce488745f.png",
      members: "5.7k",
      price: "Free",
      badge: "#9"
    },
    {
      id: 10,
      name: "DevOps Professionals",
      description: "Learn about DevOps practices, tools, and automation. Regular discussions about CI/CD and cloud services.",
      image: "/lovable-uploads/50385371-4590-48ee-b814-7f6ce488745f.png",
      members: "4.2k",
      price: "$49/month",
      badge: "#10"
    },
    {
      id: 11,
      name: "UI/UX Research Group",
      description: "Dedicated to user research and experience design. Share research methods and usability testing insights.",
      image: "/lovable-uploads/50385371-4590-48ee-b814-7f6ce488745f.png",
      members: "3.3k",
      price: "$19/month",
      badge: "#11"
    },
    {
      id: 12,
      name: "Game Developers United",
      description: "For game developers of all levels. Discuss game design, development techniques, and industry trends.",
      image: "/lovable-uploads/50385371-4590-48ee-b814-7f6ce488745f.png",
      members: "6.5k",
      price: "$39/month",
      badge: "#12"
    },
    {
      id: 13,
      name: "Cloud Architecture Masters",
      description: "Expert discussions on cloud architecture, scalability, and best practices across major cloud platforms.",
      image: "/lovable-uploads/50385371-4590-48ee-b814-7f6ce488745f.png",
      members: "4.8k",
      price: "$59/month",
      badge: "#13"
    },
    {
      id: 14,
      name: "Frontend Developers Hub",
      description: "Stay updated with the latest in frontend development. Regular code reviews and framework discussions.",
      image: "/lovable-uploads/50385371-4590-48ee-b814-7f6ce488745f.png",
      members: "7.2k",
      price: "$29/month",
      badge: "#14"
    },
    {
      id: 15,
      name: "Cybersecurity Experts",
      description: "Join security professionals in discussions about the latest threats, defense strategies, and best practices.",
      image: "/lovable-uploads/50385371-4590-48ee-b814-7f6ce488745f.png",
      members: "3.6k",
      price: "$69/month",
      badge: "#15"
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
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm transition-all duration-200 ease-out bg-background/95 ${
        isScrolled ? 'bg-background' : ''
      }`}>
        <div className="container mx-auto px-4">
          <div className="hidden sm:flex relative py-2">
            <div className="w-[20%] flex items-start">
              <h1 className="text-2xl font-semibold mt-[12px] ml-[15px]">Logo</h1>
            </div>

            <div className="w-[60%] flex flex-col items-center">
              <div className={`transition-all duration-300 ease-out mt-[12px] ${
                isScrolled ? 'opacity-0 h-0 mb-0 overflow-hidden' : 'opacity-100 h-[32px] mb-[16px]'
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
                        <SelectTrigger className="border-0 w-[140px] focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-9">
                          <SelectValue className="pr-4" />
                        </SelectTrigger>
                        <SelectContent className="w-[180px]">
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
              <div className="flex items-center gap-3 mt-[12px] mr-[15px]">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="font-medium text-primary hover:text-primary/90 hover:bg-primary/10"
                >
                  Sell on Plaze
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="rounded-full px-2.5 py-1.5 h-8 border-2 hover:border-primary/20 transition-colors"
                    >
                      <Menu className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <Link to="/">
                      <DropdownMenuItem>
                        Home
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>Sign In</DropdownMenuItem>
                    <DropdownMenuItem>Sign Up</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <Link to="/affiliates">
                      <DropdownMenuItem>Affiliates</DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>Sell on Plaze</DropdownMenuItem>
                    <DropdownMenuItem>Help Center</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="sm:hidden py-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full border shadow-sm hover:shadow-md transition-shadow bg-background">
                  <Select defaultValue="Communities">
                    <SelectTrigger className="border-0 w-[140px] focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-7">
                      <SelectValue className="pr-4" />
                    </SelectTrigger>
                    <SelectContent className="w-[180px]">
                      <SelectItem value="Products">Products</SelectItem>
                      <SelectItem value="Experts">Experts</SelectItem>
                      <SelectItem value="Communities">Communities</SelectItem>
                      <SelectItem value="Jobs">Jobs</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 bg-transparent h-7 text-sm flex-1"
                    placeholder="Search communities..."
                    type="search"
                  />
                  <Button size="icon" variant="default" className="rounded-full bg-primary hover:bg-primary/90 h-7 w-7">
                    <Search className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="rounded-full px-2.5 py-1.5 h-8 border-2 hover:border-primary/20 transition-colors"
                  >
                    <Menu className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <Link to="/">
                    <DropdownMenuItem>
                      Home
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>Sign In</DropdownMenuItem>
                  <DropdownMenuItem>Sign Up</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <Link to="/affiliates">
                    <DropdownMenuItem>Affiliates</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>Sell on Plaze</DropdownMenuItem>
                  <DropdownMenuItem>Help Center</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-border" />
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
