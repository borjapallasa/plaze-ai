
import React from "react";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

export type LayoutType = "grid" | "list";

interface AffiliateOffersLayoutSwitcherProps {
  layout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
}

export function AffiliateOffersLayoutSwitcher({ layout, onLayoutChange }: AffiliateOffersLayoutSwitcherProps) {
  return (
    <div className="flex gap-0.5 border rounded-md p-0.5">
      <Button
        variant={layout === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => onLayoutChange("grid")}
        className="h-7 px-2"
      >
        <LayoutGrid className="h-3 w-3" />
      </Button>
      <Button
        variant={layout === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => onLayoutChange("list")}
        className="h-7 px-2"
      >
        <List className="h-3 w-3" />
      </Button>
    </div>
  );
}
