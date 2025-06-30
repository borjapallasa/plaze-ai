
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LayoutGrid, LayoutList } from "lucide-react";

interface AffiliateLayoutSwitcherProps {
  layout: "table" | "grid";
  onLayoutChange: (layout: "table" | "grid") => void;
}

export function AffiliateLayoutSwitcher({ layout, onLayoutChange }: AffiliateLayoutSwitcherProps) {
  return (
    <ToggleGroup
      type="single"
      value={layout}
      onValueChange={(value) => value && onLayoutChange(value as "table" | "grid")}
      className="border rounded-lg"
    >
      <ToggleGroupItem value="table" aria-label="Table view">
        <LayoutList className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="grid" aria-label="Grid view">
        <LayoutGrid className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
