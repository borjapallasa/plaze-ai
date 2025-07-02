
import { Button } from "@/components/ui/button";
import { LayoutGrid, LayoutList } from "lucide-react";

type LayoutType = 'table' | 'list' | 'gallery';

interface UsersLayoutSwitcherProps {
  layout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
}

export function UsersLayoutSwitcher({ layout, onLayoutChange }: UsersLayoutSwitcherProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={layout === 'table' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onLayoutChange('table')}
        className="p-2"
      >
        <LayoutList className="h-4 w-4" />
      </Button>
      <Button
        variant={layout === 'list' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onLayoutChange('list')}
        className="p-2"
      >
        <LayoutList className="h-4 w-4" />
      </Button>
      <Button
        variant={layout === 'gallery' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onLayoutChange('gallery')}
        className="p-2"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </div>
  );
}
