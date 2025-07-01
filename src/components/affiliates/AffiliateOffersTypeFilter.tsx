
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FilterType = "all" | "product" | "community";

interface AffiliateOffersTypeFilterProps {
  filterType: FilterType;
  onFilterChange: (filterType: FilterType) => void;
}

export function AffiliateOffersTypeFilter({ 
  filterType, 
  onFilterChange 
}: AffiliateOffersTypeFilterProps) {
  const handleFilterChange = (value: string) => {
    onFilterChange(value as FilterType);
  };

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-muted-foreground whitespace-nowrap">Filter by type:</span>
      <Select value={filterType} onValueChange={handleFilterChange}>
        <SelectTrigger className="w-[120px] h-8 text-xs bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg z-50">
          <SelectItem 
            value="all"
            className="cursor-pointer hover:bg-gray-50 px-3 py-1.5 text-xs text-gray-900 [&>span:first-child]:hidden"
          >
            All Types
          </SelectItem>
          <SelectItem 
            value="product"
            className="cursor-pointer hover:bg-gray-50 px-3 py-1.5 text-xs text-gray-900 [&>span:first-child]:hidden"
          >
            Product
          </SelectItem>
          <SelectItem 
            value="community"
            className="cursor-pointer hover:bg-gray-50 px-3 py-1.5 text-xs text-gray-900 [&>span:first-child]:hidden"
          >
            Community
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
