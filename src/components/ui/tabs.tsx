import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import { useIsMobile } from "@/hooks/use-mobile"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const tabsListRef = React.useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(false);
  const isMobile = useIsMobile();

  const checkScroll = React.useCallback(() => {
    const el = tabsListRef.current;
    if (el) {
      setShowLeftArrow(el.scrollLeft > 0);
      setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth);
    }
  }, []);

  React.useEffect(() => {
    const el = tabsListRef.current;
    if (el) {
      checkScroll();
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      
      // Initial check after content loads
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
    const el = tabsListRef.current;
    if (el) {
      const scrollAmount = 200;
      el.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Show scroll arrows on tablet and mobile (screens smaller than lg)
  const showScrollArrows = typeof window !== 'undefined' && window.innerWidth < 1024;

  return (
    <div className="relative flex items-center">
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none lg:hidden"
        style={{ opacity: showScrollArrows && showLeftArrow ? 1 : 0, transition: 'opacity 0.2s' }}
      />
      {showScrollArrows && showLeftArrow && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-1 z-20 h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm shadow-sm lg:hidden"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      <TabsPrimitive.List
        ref={(element) => {
          if (typeof ref === 'function') {
            ref(element);
          } else if (ref) {
            ref.current = element;
          }
          if (tabsListRef) {
            tabsListRef.current = element;
          }
        }}
        className={cn(
          "inline-flex h-9 items-center justify-start rounded-lg bg-muted p-1 text-muted-foreground relative w-full",
          "overflow-x-auto scrollbar-hide",
          "lg:overflow-x-visible lg:justify-center", // Center on desktop, scroll on mobile/tablet
          className
        )}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
        {...props}
      />
      {showScrollArrows && showRightArrow && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 z-20 h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm shadow-sm lg:hidden"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none lg:hidden"
        style={{ opacity: showScrollArrows && showRightArrow ? 1 : 0, transition: 'opacity 0.2s' }}
      />
    </div>
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      "flex-shrink-0", // Prevent tabs from shrinking on mobile
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
