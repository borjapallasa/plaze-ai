
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
      className="inline-flex items-center gap-1"
    >
      <ToggleGroupItem
        value="table"
        aria-label="Table view"
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-[#E5E7EB] data-[state=on]:bg-[#1A1F2C] data-[state=on]:text-white data-[state=on]:border-[#1A1F2C] hover:bg-gray-50"
      >
        <Table className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="list"
        aria-label="List view"
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-[#E5E7EB] data-[state=on]:bg-[#1A1F2C] data-[state=on]:text-white data-[state=on]:border-[#1A1F2C] hover:bg-gray-50"
      >
        <List className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
