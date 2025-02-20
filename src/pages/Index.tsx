import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Search, Target, ShoppingBag, Settings, Users, Truck, ChartBar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import Typewriter from 'typewriter-effect';
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const typewriterStrings = [
  "Experts To Hire",
  "Communities To Learn",
  "Templates To Use",
  "Jobs To Earn"
];

const badges = [
  { label: "Trending", icon: Sparkles, category: null },
  { label: "Templates", icon: Star, category: "template" },
  { label: "Prompt", icon: Flame, category: "prompt" },
  { label: "Communities", icon: Users, category: "community" },
  { label: "Experts", icon: Target, category: "expert" }
];

const departments = [
  { name: "Marketing", icon: Target },
  { name: "Sales", icon: ShoppingBag },
  { name: "Operations", icon: Settings },
  { name: "Human Resources", icon: Users },
  { name: "Logistics", icon: Truck },
  { name: "Data", icon: ChartBar },
];

const searchCategories = ["Jobs", "Experts", "Products", "Communities"];

const Index = () => {
  const isMobile = useIsMobile();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchCategory, setSearchCategory] = useState("Products");

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
      <main>
        <div className="border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-4 overflow-x-auto hide-scrollbar">
              {departments.map((dept, index) => {
                const Icon = dept.icon;
                return (
                  <div 
                    key={index}
                    className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer group"
                  >
                    <div className="p-3 rounded-full bg-accent group-hover:bg-accent/80 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {dept.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4 max-w-3xl mx-auto">
              <div className="flex-1 flex items-center gap-2 rounded-full border bg-background shadow-sm">
                <Select value={searchCategory} onValueChange={setSearchCategory}>
                  <SelectTrigger className="w-[140px] border-0 focus:ring-0 focus:ring-offset-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {searchCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="h-6 w-[1px] bg-border" />
                <div className="flex-1 flex items-center">
                  <Input
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder={`Search ${searchCategory.toLowerCase()}...`}
                    type="search"
                  />
                </div>
                <Button size="icon" className="rounded-full mr-1">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
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
