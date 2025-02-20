import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, Globe, Menu, User, Target, ShoppingBag, Settings, Users, Truck, ChartBar, ArrowRight, Sparkle, Star, Flame, DollarSign, Briefcase, Handshake, Building, Factory, CreditCard, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import Typewriter from 'typewriter-effect';
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const typewriterStrings = [
  "The Best AI & Automation Communities",
  "The Leading AI Resources",
  "The Top AI Products & Services",
  "The Best AI Learning Platform"
];

const products = [
  {
    title: "AI Video Editor",
    price: "Free",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    seller: "Video AI",
    description: "Edit your videos automatically with AI powered tools and effects.",
    tags: ["marketing", "social media", "e-commerce"],
    fromPrice: "$49.95",
    category: "template"
  },
  {
    title: "ChatGPT Prompts",
    price: "Free",
    image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
    seller: "Prompt Engineering",
    description: "Access a curated collection of effective prompts for ChatGPT.",
    tags: ["marketing", "social media", "e-commerce"],
    fromPrice: "$49.95",
    category: "prompt"
  },
  {
    title: "AI Templates",
    price: "Free",
    image: "https://images.unsplash.com/photo-1498936178812-4b2e558d2937",
    seller: "Template Hub",
    description: "Ready-to-use AI templates for various business needs.",
    tags: ["marketing", "social media", "e-commerce"],
    fromPrice: "$49.95",
    category: "template"
  },
  {
    title: "Expert Network",
    price: "Free",
    image: "https://images.unsplash.com/photo-1501286353178-1ec881214838",
    seller: "AI Experts",
    description: "Connect with AI experts for guidance and consultation.",
    tags: ["marketing", "social media", "e-commerce"],
    fromPrice: "$49.95",
    category: "expert"
  },
  {
    title: "AI Community Hub",
    price: "Free",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    seller: "Community Leaders",
    description: "Join a vibrant community of AI enthusiasts and professionals.",
    tags: ["community", "networking", "learning"],
    fromPrice: "$0",
    category: "community"
  },
  {
    title: "Prompt Engineering Course",
    price: "Free",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    seller: "AI Academy",
    description: "Master the art of prompt engineering with hands-on exercises.",
    tags: ["education", "prompts", "course"],
    fromPrice: "$149",
    category: "prompt"
  },
  {
    title: "AI Developers Community",
    price: "Free",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    seller: "Dev Network",
    description: "Connect with other AI developers and share knowledge.",
    tags: ["community", "development", "networking"],
    fromPrice: "$0",
    category: "community"
  }
];

const banners = [
  {
    title: "Special Offer",
    description: "Get 20% off on your first purchase when you sign up today.",
  },
  {
    title: "Special Offer",
    description: "Get 20% off on your first purchase when you sign up today.",
  },
  {
    title: "Special Offer",
    description: "Get 20% off on your first purchase when you sign up today.",
  }
];

const badges = [
  { label: "Trending", icon: Sparkle, category: null },
  { label: "Templates", icon: Star, category: "template" },
  { label: "Prompt", icon: Flame, category: "prompt" },
  { label: "Communities", icon: Users, category: "community" },
  { label: "Experts", icon: Target, category: "expert" }
];

const departments = [
  { name: "Business", icon: Building },
  { name: "Jobs", icon: Briefcase },
  { name: "Partners", icon: Handshake },
  { name: "Finance", icon: DollarSign },
  { name: "Analytics", icon: ChartBar },
  { name: "Teams", icon: Users },
  { name: "Logistics", icon: Truck },
  { name: "Manufacturing", icon: Factory },
  { name: "Payments", icon: CreditCard },
  { name: "Commerce", icon: ShoppingBag },
  { name: "Marketing", icon: Target },
  { name: "Settings", icon: Settings }
];

const Index = () => {
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchCategory, setSearchCategory] = useState("Products");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;

  const handleBadgeClick = (category: string | null) => {
    setSelectedCategory(prevCategory => 
      prevCategory === category ? null : category
    );
  };

  return (
    <div className="min-h-screen">
      <header className={`sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-semibold">Logo</h1>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="font-medium">
                Add Product
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Globe className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full p-1 h-10">
                    <Menu className="h-4 w-4 mr-2" />
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    Sign up
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Log in
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    List your product
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Help
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className={`flex flex-col items-center transition-all duration-300 ${isScrolled ? 'mt-0' : 'mt-4'}`}>
            {/* Center Section with Typewriter */}
            <div className={`transition-all duration-300 ${isScrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-8 mb-4'}`}>
              <div className="text-lg font-medium text-center">
                <Typewriter
                  options={{
                    strings: typewriterStrings,
                    autoStart: true,
                    loop: true,
                    delay: 50,
                    deleteSpeed: 30,
                  }}
                />
              </div>
            </div>

            {/* Search Bar */}
            <div className={`transition-all duration-300 ${isScrolled ? 'w-[300px] -mt-10' : 'w-[450px]'}`}>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm bg-background">
                <div className="flex-1 flex items-center gap-6 divide-x">
                  <div className="flex-1">
                    <Input
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 bg-transparent"
                      placeholder="Search anywhere"
                      type="search"
                    />
                  </div>
                  <div className="pl-6">
                    <button className="text-sm font-medium">Any week</button>
                  </div>
                  <div className="pl-6">
                    <button className="text-sm text-muted-foreground">Add guests</button>
                  </div>
                </div>
                <Button size="icon" variant="default" className="rounded-full bg-primary hover:bg-primary/90">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="p-6 border-b border-gray-200">
          <div className="space-y-6">
            {isMobile ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {banners.map((banner, index) => (
                    <CarouselItem key={index}>
                      <div className="bg-accent rounded-lg p-3 relative group cursor-pointer hover:bg-accent/90 transition-colors">
                        <h3 className="text-lg font-semibold mb-1">{banner.title}</h3>
                        <p className="text-muted-foreground text-sm pr-6">{banner.description}</p>
                        <ArrowRight className="absolute bottom-3 right-3 h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {banners.map((banner, index) => (
                  <div key={index} className="bg-accent rounded-lg p-3 relative group cursor-pointer hover:bg-accent/90 transition-colors">
                    <h3 className="text-lg font-semibold mb-1">{banner.title}</h3>
                    <p className="text-muted-foreground text-sm pr-6">{banner.description}</p>
                    <ArrowRight className="absolute bottom-3 right-3 h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              {badges.map((badge, index) => {
                const Icon = badge.icon;
                const isSelected = selectedCategory === badge.category;
                return (
                  <Badge
                    key={index}
                    variant={isSelected ? "default" : "secondary"}
                    className={`px-4 py-2 text-sm font-medium cursor-pointer hover:bg-secondary/80 transition-colors ${
                      isSelected ? 'bg-primary text-primary-foreground' : ''
                    }`}
                    onClick={() => handleBadgeClick(badge.category)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {badge.label}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
