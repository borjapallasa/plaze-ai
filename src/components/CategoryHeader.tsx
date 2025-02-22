
import React, { useMemo, useCallback } from "react";
import { TrendingUp, Sparkle, Trophy, ThumbsUp, Star, Tags, LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryHeaderProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

interface BadgeItem {
  label: string;
  icon: React.ComponentType<LucideProps>;
  category: string | null;
}

const baseBadgeStyles = "inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium cursor-pointer transition-all duration-200";
const selectedBadgeStyles = "border-transparent bg-primary text-primary-foreground shadow-md";
const unselectedBadgeStyles = "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary hover:shadow-sm";

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
  const badgeStyles = useMemo(() => 
    cn(baseBadgeStyles, isSelected ? selectedBadgeStyles : unselectedBadgeStyles),
    [isSelected]
  );
  
  return (
    <div onClick={onClick} className={badgeStyles}>
      <Icon className="w-4 h-4 mr-2" aria-hidden="true" />
      {badge.label}
    </div>
  );
});

CategoryBadge.displayName = "CategoryBadge";

const containerStyles = {
  wrapper: "container mx-auto px-4",
  inner: "space-y-4 pt-8 pb-6",
  badgeContainer: "flex flex-wrap gap-3"
} as const;

export const CategoryHeader = React.memo(({ selectedCategory, onCategoryChange }: CategoryHeaderProps) => {
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

  const getBadgeClickHandler = useCallback((category: string | null) => {
    return () => handleBadgeClick(category);
  }, [handleBadgeClick]);

  return (
    <div className={containerStyles.wrapper}>
      <div className={containerStyles.inner}>
        <div className={containerStyles.badgeContainer}>
          {badges.map((badge) => (
            <CategoryBadge
              key={`${badge.label}-${badge.category}`}
              badge={badge}
              isSelected={selectedCategory === badge.category}
              onClick={getBadgeClickHandler(badge.category)}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

CategoryHeader.displayName = "CategoryHeader";
