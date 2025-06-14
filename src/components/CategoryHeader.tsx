
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TrendingUp, Sparkles, Trophy, ThumbsUp, Star, Heart } from "lucide-react";

interface CategoryHeaderProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  viewMode?: "products" | "communities";
  onViewModeChange?: (mode: "products" | "communities") => void;
}

const categoryOptions = [
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "newest", label: "Newest", icon: Sparkles },
  { id: "top-seller", label: "Top Seller", icon: Trophy },
  { id: "best-reviews", label: "Best Reviews", icon: ThumbsUp },
  { id: "our-pick", label: "Our Pick", icon: Star },
  { id: "affiliate-offers", label: "Affiliate Offers", icon: Heart },
];

export const CategoryHeader = ({ 
  selectedCategory, 
  onCategoryChange,
  viewMode = "products",
  onViewModeChange 
}: CategoryHeaderProps) => {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Category Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {categoryOptions.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              
              return (
                <Button
                  key={category.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={`
                    h-9 px-4 rounded-full font-medium transition-all
                    ${isSelected 
                      ? "bg-black text-white hover:bg-black/90" 
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }
                  `}
                  onClick={() => onCategoryChange(isSelected ? null : category.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.label}
                </Button>
              );
            })}
          </div>

          {/* View Mode Toggle */}
          {onViewModeChange && (
            <ToggleGroup 
              type="single" 
              value={viewMode} 
              onValueChange={(value) => value && onViewModeChange(value as "products" | "communities")}
              className="border rounded-lg p-1 bg-gray-50"
            >
              <ToggleGroupItem 
                value="products" 
                className="px-4 py-2 text-sm font-medium rounded-md data-[state=on]:bg-white data-[state=on]:shadow-sm"
              >
                Products
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="communities" 
                className="px-4 py-2 text-sm font-medium rounded-md data-[state=on]:bg-white data-[state=on]:shadow-sm"
              >
                Communities
              </ToggleGroupItem>
            </ToggleGroup>
          )}
        </div>
      </div>
    </div>
  );
};
