
import React, { useMemo, useCallback } from "react";
import { TrendingUp, Sparkle, Trophy, ThumbsUp, Star, Tags, LucideIcon } from "lucide-react";

interface CategoryHeaderProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

interface BadgeItem {
  label: string;
  icon: LucideIcon;
  category: string | null;
}

const CategoryBadge = React.memo(({ 
  badge, 
  isSelected, 
  onClick 
}: { 
  badge: BadgeItem; 
  isSelected: boolean; 
  onClick: () => void;
}) => {
  const Icon = badge.icon;
  
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'border-transparent bg-primary text-primary-foreground shadow-md' 
          : 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary hover:shadow-sm'
      }`}
    >
      <Icon className="w-4 h-4 mr-2" aria-hidden="true" />
      {badge.label}
    </div>
  );
});

CategoryBadge.displayName = "CategoryBadge";

export const CategoryHeader = ({ selectedCategory, onCategoryChange }: CategoryHeaderProps) => {
  const badges = useMemo(() => [
    { label: "Trending", icon: TrendingUp, category: null },
    { label: "Newest", icon: Sparkle, category: "template" },
    { label: "Top Seller", icon: Trophy, category: "prompt" },
    { label: "Best Reviews", icon: ThumbsUp, category: "community" },
    { label: "Our Pick", icon: Star, category: "expert" },
    { label: "Affiliate Offers", icon: Tags, category: null }
  ], []);

  const handleBadgeClick = useCallback((category: string | null) => {
    onCategoryChange(selectedCategory === category ? null : category);
  }, [selectedCategory, onCategoryChange]);

  return (
    <div className="container mx-auto px-4">
      <div className="space-y-4 pt-8 pb-6">
        <div className="flex flex-wrap gap-3">
          {badges.map((badge) => (
            <CategoryBadge
              key={`${badge.label}-${badge.category}`}
              badge={badge}
              isSelected={selectedCategory === badge.category}
              onClick={() => handleBadgeClick(badge.category)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
