
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
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
    <>
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
                className="relative"
              >
                <div className="flex items-center">
                  {subcat.label}
                  {selectedSubcategories.includes(subcat.value) && (
                    <div className="ml-auto">✓</div>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedSubcategories.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedSubcategories.map((sub) => {
              const subcatLabel = availableSubcategories.find(s => s.value === sub)?.label;
              return (
                <div
                  key={sub}
                  className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1"
                >
                  {subcatLabel}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => onRemoveSubcategory(sub)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
