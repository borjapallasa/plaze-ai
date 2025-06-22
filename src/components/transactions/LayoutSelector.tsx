
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Table, List } from "lucide-react";

interface LayoutSelectorProps {
  layout: "table" | "list";
  onLayoutChange: (layout: "table" | "list") => void;
}

export function LayoutSelector({ layout, onLayoutChange }: LayoutSelectorProps) {
  return (
    <ToggleGroup
      type="single"
      value={layout}
      onValueChange={(value) => {
        if (value && (value === "table" || value === "list")) {
          onLayoutChange(value);
        }
      }}
      className="border border-[#E5E7EB] rounded-lg"
    >
      <ToggleGroupItem
        value="table"
        aria-label="Table view"
        className="data-[state=on]:bg-[#1A1F2C] data-[state=on]:text-white"
      >
        <Table className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="list"
        aria-label="List view"
        className="data-[state=on]:bg-[#1A1F2C] data-[state=on]:text-white"
      >
        <List className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
