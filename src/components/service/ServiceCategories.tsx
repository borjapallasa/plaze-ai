
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, SUBCATEGORIES, CategoryType } from "@/constants/service-categories";

interface ServiceCategoriesProps {
  category: CategoryType | "";
  selectedSubcategories: string[];
  onCategoryChange: (value: CategoryType) => void;
  onSubcategoriesChange: (value: string) => void;
  onRemoveSubcategory: (value: string) => void;
}

export function ServiceCategories({
  category,
  selectedSubcategories,
  onCategoryChange,
  onSubcategoriesChange,
  onRemoveSubcategory,
}: ServiceCategoriesProps) {
  const availableSubcategories = category ? SUBCATEGORIES[category] : [];

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="category" className="text-sm font-medium mb-1.5 block">
          Category
        </Label>
        <Select 
          value={category} 
          onValueChange={onCategoryChange}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="subcategories" className="text-sm font-medium mb-1.5 block">
          Subcategories
        </Label>
        <Select 
          value=""
          onValueChange={onSubcategoriesChange}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select subcategories" />
          </SelectTrigger>
          <SelectContent>
            {availableSubcategories.map((subcat) => (
              <SelectItem 
                key={subcat.value} 
                value={subcat.value}
                className="relative py-2.5"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-base">{subcat.label}</span>
                  {selectedSubcategories.includes(subcat.value) && (
                    <span className="text-primary">✓</span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedSubcategories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedSubcategories.map((sub) => {
              const subcatLabel = availableSubcategories.find(s => s.value === sub)?.label;
              return (
                <Badge
                  key={sub}
                  variant="secondary"
                  className="py-1 pl-3 pr-2 text-sm font-normal flex items-center gap-1"
                >
                  {subcatLabel}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveSubcategory(sub)}
                    className="h-4 w-4 p-0 hover:bg-transparent opacity-60 hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
