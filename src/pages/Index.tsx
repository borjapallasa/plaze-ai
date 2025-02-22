
import React, { useState, useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import {
  Search, 
  Menu, 
  User,
  Star,
  TrendingUp,
  Sparkle,
  Trophy,
  ThumbsUp,
  Tags,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Typewriter from 'typewriter-effect';
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
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

const typewriterStrings = [
  "Products To Scale",
  "Experts To Hire",
  "Jobs To Earn",
  "Communities To Learn"
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
  },
  {
    title: "AI Content Generator",
    price: "Free",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    seller: "Content AI",
    description: "Generate high-quality content using advanced AI algorithms.",
    tags: ["content", "writing", "marketing"],
    fromPrice: "$29.99",
    category: "template"
  },
  {
    title: "Machine Learning Workshop",
    price: "Free",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    seller: "ML Experts",
    description: "Learn machine learning fundamentals through practical workshops.",
    tags: ["education", "ML", "AI"],
    fromPrice: "$199",
    category: "expert"
  },
  {
    title: "AI Trading Bot",
    price: "Free",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    seller: "Trading AI",
    description: "Automated trading solutions powered by artificial intelligence.",
    tags: ["finance", "trading", "automation"],
    fromPrice: "$79.99",
    category: "template"
  },
  {
    title: "NLP Toolkit",
    price: "Free",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    seller: "NLP Solutions",
    description: "Comprehensive toolkit for natural language processing tasks.",
    tags: ["NLP", "AI", "development"],
    fromPrice: "$59.99",
    category: "template"
  },
  {
    title: "AI Mentorship Program",
    price: "Free",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998",
    seller: "AI Mentors",
    description: "Get personalized guidance from experienced AI professionals.",
    tags: ["mentorship", "career", "learning"],
    fromPrice: "$299",
    category: "expert"
  },
  {
    title: "Computer Vision Suite",
    price: "Free",
    image: "https://images.unsplash.com/photo-1563770660941-20978e870e26",
    seller: "Vision AI",
    description: "Complete suite of computer vision tools and models.",
    tags: ["vision", "AI", "development"],
    fromPrice: "$89.99",
    category: "template"
  },
  {
    title: "AI Startup Community",
    price: "Free",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd",
    seller: "Startup Network",
    description: "Connect with other AI startup founders and entrepreneurs.",
    tags: ["startup", "networking", "business"],
    fromPrice: "$0",
    category: "community"
  },
  {
    title: "Data Science Bootcamp",
    price: "Free",
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3",
    seller: "DS Academy",
    description: "Intensive training program in data science and AI.",
    tags: ["education", "data", "career"],
    fromPrice: "$499",
    category: "expert"
  },
  {
    title: "AI Ethics Framework",
    price: "Free",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
    seller: "Ethics AI",
    description: "Comprehensive framework for ethical AI development.",
    tags: ["ethics", "AI", "compliance"],
    fromPrice: "$149",
    category: "template"
  },
  {
    title: "Robotics Community",
    price: "Free",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    seller: "Robotics Hub",
    description: "Connect with robotics enthusiasts and professionals.",
    tags: ["robotics", "community", "automation"],
    fromPrice: "$0",
    category: "community"
  },
  {
    title: "AI Research Network",
    price: "Free",
    image: "https://images.unsplash.com/photo-1532619187608-e5375cab36aa",
    seller: "Research Hub",
    description: "Platform for AI researchers to collaborate and share findings.",
    tags: ["research", "academic", "collaboration"],
    fromPrice: "$0",
    category: "community"
  },
  {
    title: "Healthcare AI Solutions",
    price: "Free",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d",
    seller: "Health AI",
    description: "AI-powered solutions for healthcare professionals.",
    tags: ["healthcare", "AI", "medical"],
    fromPrice: "$199",
    category: "template"
  }
];

const badges = [
  { label: "Trending", icon: TrendingUp, category: null },
  { label: "Newest", icon: Sparkle, category: "template" },
  { label: "Top Seller", icon: Trophy, category: "prompt" },
  { label: "Best Reviews", icon: ThumbsUp, category: "community" },
  { label: "Our Pick", icon: Star, category: "expert" },
  { label: "Affiliate Offers", icon: Tags, category: null }
];

const Header = ({ searchCategory, setSearchCategory }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background border-b">
      <div className="container mx-auto px-4 h-full">
        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between h-full gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full border shadow-sm hover:shadow-md transition-shadow bg-background">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0 hover:bg-transparent"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                  <DropdownMenuItem onClick={() => setSearchCategory("Products")}>
                    Products
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSearchCategory("Experts")}>
                    Experts
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSearchCategory("Communities")}>
                    Communities
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSearchCategory("Jobs")}>
                    Jobs
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Input
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 bg-transparent h-7 text-sm flex-1"
                placeholder={`Search ${searchCategory.toLowerCase()}...`}
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

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between h-full gap-4">
          <Link to="/" className="text-lg font-semibold w-[140px]">
            Logo
          </Link>

          <div className="flex-1 max-w-2xl mx-auto">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full border shadow-sm hover:shadow-md transition-shadow bg-background">
              <div className="flex-1 flex items-center gap-1">
                <Select 
                  defaultValue="Products"
                  onValueChange={setSearchCategory}
                >
                  <SelectTrigger className="border-0 w-[200px] focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-7 text-sm [&>span]:whitespace-nowrap [&>span]:overflow-visible">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="w-[240px]">
                    <SelectItem value="Products">Products</SelectItem>
                    <SelectItem value="Experts">Experts</SelectItem>
                    <SelectItem value="Communities">Communities</SelectItem>
                    <SelectItem value="Jobs">Jobs</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 bg-transparent h-7 text-sm"
                  placeholder={`Search ${searchCategory.toLowerCase()}...`}
                  type="search"
                />
              </div>
              <Button size="icon" variant="default" className="rounded-full bg-primary hover:bg-primary/90 h-7 w-7">
                <Search className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 w-[140px] justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              className="font-medium text-primary hover:text-primary/90 hover:bg-primary/10 h-8"
            >
              Sell on Plaze
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="rounded-full px-2.5 py-1.5 h-8 border-2 hover:border-primary/20 transition-colors"
                >
                  <Menu className="h-3.5 w-3.5 mr-1.5" />
                  <User className="h-3.5 w-3.5" />
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
    </header>
  );
};

const MemoizedHeader = React.memo(Header);

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchCategory, setSearchCategory] = useState("Products");

  const filteredProducts = useMemo(() => 
    selectedCategory
      ? products.filter(product => product.category === selectedCategory)
      : products,
    [selectedCategory]
  );

  const handleBadgeClick = (category: string | null) => {
    setSelectedCategory(prevCategory => 
      prevCategory === category ? null : category
    );
  };

  return (
    <div className="min-h-screen">
      <MemoizedHeader 
        searchCategory={searchCategory}
        setSearchCategory={setSearchCategory}
      />

      <main>
        <div className="container mx-auto px-4">
          <div className="pt-24 pb-6">
            <div className="text-[1.5rem] leading-relaxed font-bold whitespace-nowrap flex items-center justify-center mb-6">
              <span>The Best AI & Automation</span>
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

            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {badges.map((badge, index) => {
                  const Icon = badge.icon;
                  const isSelected = selectedCategory === badge.category;
                  return (
                    <Badge
                      key={index}
                      variant={isSelected ? "default" : "secondary"}
                      className={`px-4 py-2 text-sm font-medium cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'bg-primary text-primary-foreground shadow-md' 
                          : 'hover:bg-secondary hover:shadow-sm'
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
