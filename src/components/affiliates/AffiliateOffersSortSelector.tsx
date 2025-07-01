
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUp, ArrowDown } from "lucide-react";

export type SortField = "earnings" | "commission" | "name";
export type SortDirection = "asc" | "desc";

export interface SortOption {
  field: SortField;
  direction: SortDirection;
  label: string;
}

const sortOptions: SortOption[] = [
  { field: "earnings", direction: "desc", label: "Earnings (High to Low)" },
  { field: "earnings", direction: "asc", label: "Earnings (Low to High)" },
  { field: "commission", direction: "desc", label: "Commission (High to Low)" },
  { field: "commission", direction: "asc", label: "Commission (Low to High)" },
  { field: "name", direction: "asc", label: "Name (A to Z)" },
  { field: "name", direction: "desc", label: "Name (Z to A)" },
];

interface AffiliateOffersSortSelectorProps {
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
}

export function AffiliateOffersSortSelector({ 
  sortBy, 
  onSortChange 
}: AffiliateOffersSortSelectorProps) {
  const handleSortChange = (value: string) => {
    const selectedOption = sortOptions.find(option => 
      `${option.field}-${option.direction}` === value
    );
    if (selectedOption) {
      onSortChange(selectedOption);
    }
  };

  const currentValue = `${sortBy.field}-${sortBy.direction}`;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
      <Select value={currentValue} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[200px] bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg z-50">
          {sortOptions.map((option) => (
            <SelectItem 
              key={`${option.field}-${option.direction}`} 
              value={`${option.field}-${option.direction}`}
              className="flex items-center justify-between cursor-pointer hover:bg-gray-50 px-3 py-2.5 text-sm"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-gray-900">{option.label}</span>
                <div className="ml-2 flex-shrink-0">
                  {option.direction === "asc" ? (
                    <ArrowUp className="w-3 h-3 text-gray-400" />
                  ) : (
                    <ArrowDown className="w-3 h-3 text-gray-400" />
                  )}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
