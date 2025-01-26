import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, Sparkles, Star, Flame, Target, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import Typewriter from 'typewriter-effect';
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
    category: "prompts"
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
    category: "experts"
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
    category: "prompts"
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

const typewriterStrings = [
  "Experts To Hire",
  "Communities To Learn",
  "Templates To Use",
  "Jobs To Earn"
];

const badges = [
  { label: "Trending", icon: Sparkles },
  { label: "Templates", icon: Star },
  { label: "Prompts", icon: Flame },
  { label: "Experts", icon: Target },
  { label: "Jobs", icon: DollarSign },
  { label: "Communities", icon: Users }
];

const Index = () => {
  const isMobile = useIsMobile();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = selectedCategory
    ? products.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase() ||
        product.tags.includes(selectedCategory.toLowerCase())
      )
    : products;

  const handleBadgeClick = (label: string) => {
    setSelectedCategory(prevCategory => 
      prevCategory === label.toLowerCase() ? null : label.toLowerCase()
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1">
                <h2 className="text-2xl font-semibold whitespace-nowrap">The Best AI & Automation</h2>
                <div className="text-2xl font-semibold text-muted-foreground">
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
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  className="pl-10"
                  placeholder="Search"
                  type="search"
                />
              </div>
            </div>
          </div>
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
                  const isSelected = selectedCategory === badge.label.toLowerCase();
                  return (
                    <Badge
                      key={index}
                      variant={isSelected ? "default" : "secondary"}
                      className={`px-4 py-2 text-sm font-medium cursor-pointer hover:bg-secondary/80 transition-colors ${
                        isSelected ? 'bg-primary text-primary-foreground' : ''
                      }`}
                      onClick={() => handleBadgeClick(badge.label)}
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
    </SidebarProvider>
  );
};

export default Index;