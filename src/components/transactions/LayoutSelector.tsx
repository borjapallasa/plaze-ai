
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
      className="inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground"
    >
      <ToggleGroupItem
        value="table"
        aria-label="Table view"
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
      >
        <Table className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="list"
        aria-label="List view"
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
      >
        <List className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
