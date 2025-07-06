
import React from "react";
import { LayoutGrid, List, Table } from "lucide-react";
import { Button } from "@/components/ui/button";

export type LayoutType = "gallery" | "grid" | "list";

interface AffiliatesLayoutSwitcherProps {
  layout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
}

export function AffiliatesLayoutSwitcher({ layout, onLayoutChange }: AffiliatesLayoutSwitcherProps) {
  return (
    <div className="flex gap-1 border rounded-md p-1">
      <Button
        variant={layout === "gallery" ? "default" : "ghost"}
        size="sm"
        onClick={() => onLayoutChange("gallery")}
        className="h-8 px-3"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={layout === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => onLayoutChange("grid")}
        className="h-8 px-3"
      >
        <Table className="h-4 w-4" />
      </Button>
      <Button
        variant={layout === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => onLayoutChange("list")}
        className="h-8 px-3"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}
