
import { MainHeader } from "@/components/MainHeader";
import { AffiliateDashboard } from "@/components/affiliates/AffiliateDashboard";
import { AffiliateTable } from "@/components/affiliates/AffiliateTable";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, ThumbsUp, TrendingUp, Sparkle, Trophy, Tags } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const badges = [
  { label: "Trending", icon: TrendingUp, category: null },
  { label: "Newest", icon: Sparkle, category: "template" },
  { label: "Top Seller", icon: Trophy, category: "prompt" },
  { label: "Best Reviews", icon: ThumbsUp, category: "community" },
  { label: "Our Pick", icon: Star, category: "expert" },
  { label: "Affiliate Offers", icon: Tags, category: null }
];

const affiliateOffers = [
  {
    title: "AI Marketing Suite",
    price: "$99.99",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    seller: "Marketing AI",
    description: "Complete suite of AI-powered marketing tools for automated campaigns, social media management, and analytics.",
    tags: ["marketing", "ai", "automation"],
    category: "software",
    split: "70/30"
  },
  {
    title: "SEO Optimizer Pro",
    price: "$79.99",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    seller: "SEO Tools Inc",
    description: "Professional SEO optimization toolkit with keyword research, rank tracking, and content optimization features.",
    tags: ["seo", "marketing", "tools"],
    category: "software",
    split: "75/25"
  },
  {
    title: "Content Creator AI",
    price: "$129.99",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    seller: "AI Solutions",
    description: "AI-powered content creation platform with smart templates, multilingual support, and brand voice customization.",
    tags: ["content", "ai", "writing"],
    category: "software",
    split: "65/35"
  },
  {
    title: "Data Analytics Dashboard",
    price: "$149.99",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    seller: "Data Insights Pro",
    description: "Comprehensive data visualization and analytics platform for business intelligence and reporting.",
    tags: ["analytics", "data", "business"],
    category: "software",
    split: "60/40"
  },
  {
    title: "AI Development Kit",
    price: "$199.99",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    seller: "AI Labs",
    description: "Complete toolkit for developing and deploying AI models with pre-trained algorithms.",
    tags: ["ai", "development", "ml"],
    category: "software",
    split: "80/20"
  },
  {
    title: "Cybersecurity Suite",
    price: "$299.99",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    seller: "SecureNet",
    description: "Enterprise-grade security solution with threat detection, encryption, and network protection.",
    tags: ["security", "enterprise", "protection"],
    category: "software",
    split: "70/30"
  },
  {
    title: "Remote Work Platform",
    price: "$89.99",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    seller: "Remote Solutions",
    description: "Integrated platform for remote team collaboration, project management, and communication.",
    tags: ["remote", "collaboration", "teams"],
    category: "software",
    split: "75/25"
  },
  {
    title: "Digital Learning System",
    price: "$159.99",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    seller: "EduTech Pro",
    description: "Complete e-learning platform with course creation, student management, and analytics.",
    tags: ["education", "learning", "online"],
    category: "software",
    split: "65/35"
  },
  {
    title: "Cloud Infrastructure Manager",
    price: "$249.99",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
    seller: "Cloud Tech Solutions",
    description: "Advanced cloud infrastructure management and monitoring platform for enterprises.",
    tags: ["cloud", "infrastructure", "management"],
    category: "software",
    split: "70/30"
  },
  {
    title: "Smart Project Manager",
    price: "$119.99",
    image: "https://images.unsplash.com/photo-1488591534298-04dcbce3278c",
    seller: "Project Tech",
    description: "AI-powered project management tool with automated task allocation and progress tracking.",
    tags: ["project", "management", "automation"],
    category: "software",
    split: "75/25"
  },
  {
    title: "Digital Asset Platform",
    price: "$179.99",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    seller: "Asset Solutions",
    description: "Comprehensive digital asset management platform with AI-powered organization and tracking.",
    tags: ["assets", "digital", "management"],
    category: "software",
    split: "65/35"
  },
  {
    title: "Design Automation Tool",
    price: "$139.99",
    image: "https://images.unsplash.com/photo-1473091534298-04dcbce3278c",
    seller: "Creative AI",
    description: "AI-powered design automation tool for creating professional marketing materials and graphics.",
    tags: ["design", "automation", "creative"],
    category: "software",
    split: "70/30"
  },
  {
    title: "Customer Success Platform",
    price: "$189.99",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    seller: "Customer Pro",
    description: "All-in-one customer success platform with support ticketing, chat, and analytics.",
    tags: ["customer", "support", "success"],
    category: "software",
    split: "75/25"
  }
];

export default function Affiliates() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filterType, setFilterType] = useState("Products");

  const handleBadgeClick = (category: string | null) => {
    setSelectedCategory(prevCategory => 
      prevCategory === category ? null : category
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <main className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Your affiliate dashboard</h1>
        <AffiliateDashboard />
        <div className="mt-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Your affiliates</h2>
          <p className="text-muted-foreground mb-8">
            Click on your affiliate to see all transactions.
          </p>
          
          <Tabs defaultValue="affiliates" className="space-y-6">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
              <TabsTrigger value="payouts">Payouts</TabsTrigger>
            </TabsList>

            <TabsContent value="affiliates">
              <AffiliateTable />
            </TabsContent>

            <TabsContent value="transactions" className="min-h-[300px] flex items-center justify-center text-muted-foreground">
              Transactions tab content
            </TabsContent>

            <TabsContent value="partnerships" className="min-h-[300px] flex items-center justify-center text-muted-foreground">
              Partnerships tab content
            </TabsContent>

            <TabsContent value="payouts" className="min-h-[300px] flex items-center justify-center text-muted-foreground">
              Payouts tab content
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-8">
          <div className="flex flex-col space-y-8 mb-8">
            <h2 className="text-4xl font-bold text-foreground">Affiliate offers</h2>
            
            <div className="flex flex-wrap items-center justify-between gap-4">
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
              
              <Select 
                defaultValue="Products" 
                onValueChange={setFilterType}
                value={filterType}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Products">Products</SelectItem>
                  <SelectItem value="Experts">Experts</SelectItem>
                  <SelectItem value="Communities">Communities</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {affiliateOffers.map((offer, index) => (
              <ProductCard
                key={index}
                title={offer.title}
                price={offer.price}
                image={offer.image}
                seller={offer.seller}
                description={offer.description}
                tags={offer.tags}
                category={offer.category}
                split={offer.split}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
