
import React from "react";
import { TrendingUp, Sparkle, Trophy, ThumbsUp, Star, Tags } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CategoryHeaderProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export const CategoryHeader = ({ selectedCategory, onCategoryChange }: CategoryHeaderProps) => {
  const badges = [
    { label: "Trending", icon: TrendingUp, category: null },
    { label: "Newest", icon: Sparkle, category: "template" },
    { label: "Top Seller", icon: Trophy, category: "prompt" },
    { label: "Best Reviews", icon: ThumbsUp, category: "community" },
    { label: "Our Pick", icon: Star, category: "expert" },
    { label: "Affiliate Offers", icon: Tags, category: null }
  ];

  const handleBadgeClick = (category: string | null) => {
    onCategoryChange(selectedCategory === category ? null : category);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="space-y-4 pt-8 pb-6">
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
  );
};
