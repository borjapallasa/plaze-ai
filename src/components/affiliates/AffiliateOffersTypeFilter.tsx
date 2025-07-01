
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FilterType = "all" | "product" | "community" | "service" | "course";

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
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <span className="text-sm text-muted-foreground whitespace-nowrap hidden sm:inline">Filter by type:</span>
      <Select value={filterType} onValueChange={handleFilterChange}>
        <SelectTrigger className="w-full sm:w-[160px] h-10 text-sm bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg z-50">
          <SelectItem 
            value="all"
            className="cursor-pointer hover:bg-gray-50 px-3 py-2 text-sm text-gray-900 [&>span:first-child]:hidden"
          >
            All Types
          </SelectItem>
          <SelectItem 
            value="product"
            className="cursor-pointer hover:bg-gray-50 px-3 py-2 text-sm text-gray-900 [&>span:first-child]:hidden"
          >
            Digital Products
          </SelectItem>
          <SelectItem 
            value="community"
            className="cursor-pointer hover:bg-gray-50 px-3 py-2 text-sm text-gray-900 [&>span:first-child]:hidden"
          >
            Community Access
          </SelectItem>
          <SelectItem 
            value="service"
            className="cursor-pointer hover:bg-gray-50 px-3 py-2 text-sm text-gray-900 [&>span:first-child]:hidden"
          >
            Services
          </SelectItem>
          <SelectItem 
            value="course"
            className="cursor-pointer hover:bg-gray-50 px-3 py-2 text-sm text-gray-900 [&>span:first-child]:hidden"
          >
            Online Courses
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
