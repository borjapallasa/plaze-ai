
import React, { useMemo, useCallback } from "react";
import { TrendingUp, Sparkle, Trophy, ThumbsUp, Star, Tags, LucideProps, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
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

// Memoize static styles object outside component
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
    button: "p-2 rounded-md hover:bg-accent/50 border border-input",
    menuContent: "z-50 min-w-[200px] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
    menuItem: "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
  }
} as const;

// Memoize badges array outside component to prevent recreation
const BADGES: ReadonlyArray<BadgeItem> = [
  { label: "Trending", icon: TrendingUp, category: null },
  { label: "Newest", icon: Sparkle, category: "template" },
  { label: "Top Seller", icon: Trophy, category: "prompt" },
  { label: "Best Reviews", icon: ThumbsUp, category: "community" },
  { label: "Our Pick", icon: Star, category: "expert" },
  { label: "Affiliate Offers", icon: Tags, category: null }
] as const;

// Pure component for rendering icon
const Icon = React.memo(({ icon: IconComponent, className }: { icon: React.ComponentType<LucideProps>; className: string }) => (
  <IconComponent className={className} aria-hidden="true" />
));

Icon.displayName = "Icon";

// Memoized badge component with minimal props
const CategoryBadge = React.memo(({ 
  label,
  icon,
  isSelected, 
  onClick 
}: { 
  label: string;
  icon: React.ComponentType<LucideProps>;
  isSelected: boolean; 
  onClick: () => void;
}) => {
  const badgeClassName = useMemo(() => 
    cn(
      STYLES.badge.base,
      isSelected ? STYLES.badge.selected : STYLES.badge.unselected
    ),
    [isSelected]
  );
  
  return (
    <div onClick={onClick} className={badgeClassName}>
      <Icon icon={icon} className={STYLES.badge.icon} />
      {label}
    </div>
  );
});

CategoryBadge.displayName = "CategoryBadge";

// Memoized mobile menu item with minimal props
const MobileMenuItem = React.memo(({ 
  label,
  icon,
  isSelected, 
  onClick 
}: { 
  label: string;
  icon: React.ComponentType<LucideProps>;
  isSelected: boolean; 
  onClick: () => void;
}) => (
  <DropdownMenuItem 
    onClick={onClick}
    className={cn(
      STYLES.mobile.menuItem,
      isSelected && "bg-accent text-accent-foreground"
    )}
  >
    <Icon icon={icon} className={STYLES.badge.icon} />
    {label}
  </DropdownMenuItem>
));

MobileMenuItem.displayName = "MobileMenuItem";

// Memoized trigger button
const MenuTrigger = React.memo(() => (
  <button type="button" className={STYLES.mobile.button}>
    <Menu className="h-6 w-6" />
  </button>
));

MenuTrigger.displayName = "MenuTrigger";

export const CategoryHeader = React.memo(({ selectedCategory, onCategoryChange }: CategoryHeaderProps) => {
  const handleBadgeClick = useCallback((category: string | null) => {
    onCategoryChange(selectedCategory === category ? null : category);
  }, [selectedCategory, onCategoryChange]);

  const badges = useMemo(() => (
    BADGES.map(({ label, icon, category }) => (
      <CategoryBadge
        key={`${label}-${category}`}
        label={label}
        icon={icon}
        isSelected={selectedCategory === category}
        onClick={() => handleBadgeClick(category)}
      />
    ))
  ), [selectedCategory, handleBadgeClick]);

  const mobileMenuItems = useMemo(() => (
    BADGES.map(({ label, icon, category }) => (
      <MobileMenuItem
        key={`${label}-${category}`}
        label={label}
        icon={icon}
        isSelected={selectedCategory === category}
        onClick={() => handleBadgeClick(category)}
      />
    ))
  ), [selectedCategory, handleBadgeClick]);

  return (
    <div className={STYLES.container.wrapper}>
      <div className={STYLES.container.inner}>
        <div className="flex items-center justify-between">
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MenuTrigger />
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start"
                className={STYLES.mobile.menuContent}
              >
                {mobileMenuItems}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="hidden md:flex flex-wrap gap-3">
            {badges}
          </div>
        </div>
      </div>
    </div>
  );
});

CategoryHeader.displayName = "CategoryHeader";
