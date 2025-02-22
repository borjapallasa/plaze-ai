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
    menuTrigger: "cursor-pointer",
    menuContent: "z-50 min-w-[200px] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
    menuItem: "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
  }
} as const;

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
  const handleBadgeClick = useCallback((category: string | null) => {
    onCategoryChange(selectedCategory === category ? null : category);
  }, [selectedCategory, onCategoryChange]);

  return (
    <div className={STYLES.container.wrapper}>
      <div className={STYLES.container.inner}>
        <div className="flex items-center justify-between">
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  type="button" 
                  className="p-2 rounded-md hover:bg-accent/50 border border-input"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start"
                className={STYLES.mobile.menuContent}
              >
                {BADGES.map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <DropdownMenuItem 
                      key={`${badge.label}-${badge.category}`}
                      onClick={() => handleBadgeClick(badge.category)}
                      className={cn(
                        STYLES.mobile.menuItem,
                        selectedCategory === badge.category && "bg-accent text-accent-foreground"
                      )}
                    >
                      <Icon className={STYLES.badge.icon} />
                      {badge.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="hidden md:flex flex-wrap gap-3">
            {BADGES.map((badge) => (
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
    </div>
  );
});

CategoryHeader.displayName = "CategoryHeader";
