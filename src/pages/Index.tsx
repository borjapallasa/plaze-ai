import React, { useState, useEffect, useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";
import { MainHeader } from "@/components/MainHeader";
import {
  Star,
  TrendingUp,
  Sparkle,
  Trophy,
  ThumbsUp,
  Tags
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
      <MainHeader initialSearchCategory={searchCategory} />

      <main>
        <div className="container mx-auto px-4">
          <div className="space-y-4 pt-24 pb-6">
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
