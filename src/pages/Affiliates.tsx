
import { MainHeader } from "@/components/MainHeader";
import { AffiliateDashboard } from "@/components/affiliates/AffiliateDashboard";
import { AffiliateTable } from "@/components/affiliates/AffiliateTable";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, ThumbsUp, TrendingUp, Sparkle, Trophy, Tags } from "lucide-react";
import { useState } from "react";

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
          <AffiliateTable />
        </div>
        <div className="mt-16">
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
