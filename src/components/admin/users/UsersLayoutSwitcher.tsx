
import { Button } from "@/components/ui/button";
import { LayoutGrid, Grid3X3, LayoutList } from "lucide-react";

type LayoutType = 'gallery' | 'grid' | 'list';

interface UsersLayoutSwitcherProps {
  layout: LayoutType;
  setLayout: (layout: LayoutType) => void;
}

export function UsersLayoutSwitcher({ layout, setLayout }: UsersLayoutSwitcherProps) {
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
      <Button
        variant={layout === 'list' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLayout('list')}
        className="p-2 hidden sm:flex"
      >
        <LayoutList className="h-4 w-4" />
      </Button>
    </div>
  );
}
