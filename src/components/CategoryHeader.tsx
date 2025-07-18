
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TrendingUp, Sparkles, Trophy, ThumbsUp, Star, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

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
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const checkScroll = React.useCallback(() => {
    const el = scrollContainerRef.current;
    if (el) {
      setShowLeftArrow(el.scrollLeft > 0);
      setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth);
    }
  }, []);

  React.useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      checkScroll();
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      
      const resizeObserver = new ResizeObserver(checkScroll);
      resizeObserver.observe(el);
      
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
        resizeObserver.disconnect();
      };
    }
  }, [checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (el) {
      const scrollAmount = 200;
      el.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const showScrollArrows = typeof window !== 'undefined' && window.innerWidth < 1024;

  const handleViewModeChange = (mode: "products" | "communities") => {
    if (onViewModeChange) {
      onViewModeChange(mode);
    }
    
    // Update URL hash
    const newHash = mode === "products" ? "#products" : "#communities";
    navigate(location.pathname + location.search + newHash, { replace: true });
  };

  return (
    <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        {/* Desktop: Category Filters and Toggle on same row, Mobile: Stack vertically */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-4">
          {/* Category Filters with horizontal scroll */}
          <div className="relative overflow-hidden flex-1">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none lg:hidden"
              style={{ opacity: showScrollArrows && showLeftArrow ? 1 : 0, transition: 'opacity 0.2s' }}
            />
            {showScrollArrows && showLeftArrow && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-1 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm shadow-sm lg:hidden"
                onClick={() => scroll('left')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            
            <div 
              ref={scrollContainerRef}
              className="flex items-center gap-2 overflow-x-auto scrollbar-hide lg:flex-wrap lg:overflow-x-visible"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {categoryOptions.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                
                return (
                  <Button
                    key={category.id}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={`
                      h-9 px-4 rounded-full font-medium transition-all whitespace-nowrap flex-shrink-0
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

            {showScrollArrows && showRightArrow && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm shadow-sm lg:hidden"
                onClick={() => scroll('right')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none lg:hidden"
              style={{ opacity: showScrollArrows && showRightArrow ? 1 : 0, transition: 'opacity 0.2s' }}
            />
          </div>

          {/* Tab Selector - Full width on tablet/mobile, darker grey */}
          {onViewModeChange && (
            <div className="mt-4 lg:mt-0 w-full lg:w-auto flex justify-center lg:justify-end">
              <div className="w-full md:w-full lg:w-auto border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="flex w-full">
                  <button
                    type="button"
                    onClick={() => handleViewModeChange("products")}
                    className={`
                      flex-1 lg:flex-none px-4 py-2 text-sm font-medium border-r border-gray-300 transition-all duration-300 ease-in-out transform
                      ${viewMode === "products" 
                        ? "bg-gray-700 text-white scale-[1.02]" 
                        : "bg-white text-gray-700 hover:bg-gray-50 hover:scale-[1.01]"
                      }
                    `}
                  >
                    Products
                  </button>
                  <button
                    type="button"
                    onClick={() => handleViewModeChange("communities")}
                    className={`
                      flex-1 lg:flex-none px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out transform
                      ${viewMode === "communities" 
                        ? "bg-gray-700 text-white scale-[1.02]" 
                        : "bg-white text-gray-700 hover:bg-gray-50 hover:scale-[1.01]"
                      }
                    `}
                  >
                    Communities
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
