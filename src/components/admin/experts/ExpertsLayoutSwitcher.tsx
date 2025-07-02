
import { Button } from "@/components/ui/button";
import { LayoutGrid, Grid3X3, LayoutList } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type LayoutType = 'gallery' | 'grid' | 'list';

interface ExpertsLayoutSwitcherProps {
  layout: LayoutType;
  setLayout: (layout: LayoutType) => void;
}

export function ExpertsLayoutSwitcher({ layout, setLayout }: ExpertsLayoutSwitcherProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex gap-2">
      <Button
        variant={layout === 'gallery' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLayout('gallery')}
        className="p-2"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={layout === 'grid' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLayout('grid')}
        className="p-2"
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
      {/* Hide list view on mobile and tablet (only show on desktop) */}
      <Button
        variant={layout === 'list' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLayout('list')}
        className="p-2 hidden lg:flex"
      >
        <LayoutList className="h-4 w-4" />
      </Button>
    </div>
  );
}
