
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CATEGORIES, SUBCATEGORIES } from "@/constants/service-categories";
import type { ExpertiseAreaInfo } from "./types";

interface ExpertiseAreasDropdownProps {
  selectedAreas: string[];
  onToggleArea: (areaValue: string) => void;
}

// Flatten all subcategories into a single array for easier selection
const allExpertiseAreas: ExpertiseAreaInfo[] = [
  ...CATEGORIES.map(cat => ({ value: cat.value, label: cat.label, group: "General Categories" })),
  ...Object.entries(SUBCATEGORIES).flatMap(([category, subcats]) => 
    subcats.map(subcat => ({ 
      value: subcat.value, 
      label: subcat.label, 
      group: CATEGORIES.find(c => c.value === category)?.label || category 
    }))
  )
];

// Group expertise areas by category for better organization in the dropdown
const groupedAreas = allExpertiseAreas.reduce((acc, area) => {
  if (!acc[area.group]) {
    acc[area.group] = [];
  }
  acc[area.group].push(area);
  return acc;
}, {} as Record<string, ExpertiseAreaInfo[]>);

export function ExpertiseAreasDropdown({ selectedAreas, onToggleArea }: ExpertiseAreasDropdownProps) {
  return (
    <div className="space-y-2">
      <Label>Expertise Areas</Label>
      <div className="relative">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between"
            >
              Select Areas of Expertise
              <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium">
                {selectedAreas.length}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[220px] max-h-[300px] overflow-y-auto">
            {Object.entries(groupedAreas).map(([group, areas]) => (
              <React.Fragment key={group}>
                <DropdownMenuLabel>{group}</DropdownMenuLabel>
                <DropdownMenuGroup>
                  {areas.map((area) => (
                    <DropdownMenuCheckboxItem
                      key={area.value}
                      checked={selectedAreas.includes(area.value)}
                      onCheckedChange={() => onToggleArea(area.value)}
                    >
                      {area.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Display selected areas as badges */}
      {selectedAreas.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedAreas.map(area => {
            const areaInfo = allExpertiseAreas.find(a => a.value === area);
            return (
              <Badge 
                key={area} 
                variant="secondary"
                className="flex items-center gap-1"
              >
                {areaInfo?.label || area}
                <button 
                  type="button" 
                  onClick={() => onToggleArea(area)}
                  className="ml-1 rounded-full hover:bg-primary/20 p-0.5"
                >
                  <span className="sr-only">Remove</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { allExpertiseAreas };
