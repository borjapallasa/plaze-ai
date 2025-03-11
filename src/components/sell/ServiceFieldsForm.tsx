
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, SUBCATEGORIES, CategoryType, SERVICE_TYPES, ServiceType } from "@/constants/service-categories";

interface ServiceFieldsFormProps {
  formData: {
    servicePrice: string;
    serviceType: ServiceType;
    category: CategoryType | "";
    selectedSubcategories: string[];
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleServiceTypeChange: (value: ServiceType) => void;
  handleCategoryChange: (value: CategoryType) => void;
  handleSubcategoriesChange: (value: string) => void;
  handleRemoveSubcategory: (value: string) => void;
}

export function ServiceFieldsForm({
  formData,
  handleInputChange,
  handleServiceTypeChange,
  handleCategoryChange,
  handleSubcategoriesChange,
  handleRemoveSubcategory
}: ServiceFieldsFormProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="servicePrice" className="font-medium text-gray-700">
          Price <span className="text-red-500">*</span>
        </Label>
        <Input
          type="number"
          id="servicePrice"
          name="servicePrice"
          value={formData.servicePrice}
          onChange={handleInputChange}
          className="w-full"
          placeholder="0.00"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="serviceType" className="font-medium text-gray-700">
          Service Type <span className="text-red-500">*</span>
        </Label>
        <Select 
          value={formData.serviceType} 
          onValueChange={handleServiceTypeChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {SERVICE_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="font-medium text-gray-700">
          Category <span className="text-red-500">*</span>
        </Label>
        <Select 
          value={formData.category} 
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-full">
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

      {formData.category && (
        <div className="space-y-2">
          <Label htmlFor="subcategories" className="font-medium text-gray-700">
            Subcategories
          </Label>
          <Select 
            value=""
            onValueChange={handleSubcategoriesChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select subcategories" />
            </SelectTrigger>
            <SelectContent>
              {SUBCATEGORIES[formData.category as CategoryType].map((subcat) => (
                <SelectItem 
                  key={subcat.value} 
                  value={subcat.value}
                  className="relative py-2.5"
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{subcat.label}</span>
                    {formData.selectedSubcategories.includes(subcat.value) && (
                      <span className="text-primary">✓</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {formData.selectedSubcategories.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.selectedSubcategories.map((sub) => {
                const subcatLabel = SUBCATEGORIES[formData.category as CategoryType].find(s => s.value === sub)?.label;
                return (
                  <span
                    key={sub}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {subcatLabel}
                    <button
                      type="button"
                      onClick={() => handleRemoveSubcategory(sub)}
                      className="h-4 w-4 rounded-full bg-gray-200 hover:bg-gray-300 inline-flex items-center justify-center text-gray-600"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}
