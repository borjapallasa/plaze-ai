
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

export type LayoutType = "table" | "gallery";

interface UsersLayoutSwitcherProps {
  layout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
}

export function UsersLayoutSwitcher({ layout, onLayoutChange }: UsersLayoutSwitcherProps) {
  return (
    <div className="flex gap-1 border rounded-md p-1">
      <Button
        variant={layout === "table" ? "default" : "ghost"}
        size="sm"
        onClick={() => onLayoutChange("table")}
        className="h-8 px-3"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={layout === "gallery" ? "default" : "ghost"}
        size="sm"
        onClick={() => onLayoutChange("gallery")}
        className="h-8 px-3"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </div>
  );
}
