
import React, { useMemo, useCallback } from "react";
import { TrendingUp, Sparkle, Trophy, ThumbsUp, Star, Tags, LucideProps, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface CategoryHeaderProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

interface BadgeItem {
  label: string;
  icon: React.ComponentType<LucideProps>;
  category: string | null;
}

// Memoize styles
const STYLES = {
  badge: {
    base: "inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium cursor-pointer transition-all duration-200",
    selected: "border-transparent bg-primary text-primary-foreground shadow-md",
    unselected: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary hover:shadow-sm",
    icon: "w-4 h-4 mr-2"
  },
  container: {
    wrapper: "container mx-auto px-4",
    inner: "space-y-4 pt-8 pb-6",
    badgeContainer: "flex flex-wrap gap-3"
  },
  mobile: {
    menuButton: "md:hidden inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium cursor-pointer transition-all duration-200 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary hover:shadow-sm",
    menuItem: "flex items-center gap-2"
  }
} as const;

// Memoize badges data
const BADGES: ReadonlyArray<BadgeItem> = [
  { label: "Trending", icon: TrendingUp, category: null },
  { label: "Newest", icon: Sparkle, category: "template" },
  { label: "Top Seller", icon: Trophy, category: "prompt" },
  { label: "Best Reviews", icon: ThumbsUp, category: "community" },
  { label: "Our Pick", icon: Star, category: "expert" },
  { label: "Affiliate Offers", icon: Tags, category: null }
] as const;

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
  
  // Memoize the combined class names
  const badgeClassName = useMemo(() => 
    cn(
      STYLES.badge.base,
      isSelected ? STYLES.badge.selected : STYLES.badge.unselected
    ),
    [isSelected]
  );
  
  return (
    <div onClick={onClick} className={badgeClassName}>
      <Icon className={STYLES.badge.icon} aria-hidden="true" />
      {badge.label}
    </div>
  );
});

CategoryBadge.displayName = "CategoryBadge";

export const CategoryHeader = React.memo(({ selectedCategory, onCategoryChange }: CategoryHeaderProps) => {
  const isMobile = useIsMobile();

  // Single callback for all badge clicks
  const handleBadgeClick = useCallback((category: string | null) => {
    onCategoryChange(selectedCategory === category ? null : category);
  }, [selectedCategory, onCategoryChange]);

  return (
    <div className={STYLES.container.wrapper}>
      <div className={STYLES.container.inner}>
        <div className={STYLES.container.badgeContainer}>
          {isMobile ? (
            <DropdownMenu>
              <DropdownMenuTrigger className={STYLES.mobile.menuButton}>
                <Menu className={STYLES.badge.icon} aria-hidden="true" />
                Categories
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {BADGES.map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <DropdownMenuItem 
                      key={`${badge.label}-${badge.category}`}
                      className={STYLES.mobile.menuItem}
                      onClick={() => handleBadgeClick(badge.category)}
                    >
                      <Icon className={STYLES.badge.icon} />
                      {badge.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            BADGES.map((badge) => (
              <CategoryBadge
                key={`${badge.label}-${badge.category}`}
                badge={badge}
                isSelected={selectedCategory === badge.category}
                onClick={() => handleBadgeClick(badge.category)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
});

CategoryHeader.displayName = "CategoryHeader";
