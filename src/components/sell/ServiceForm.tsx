
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServiceCategories } from "@/components/service/ServiceCategories";
import { CategoryType, SERVICE_TYPES } from "@/constants/service-categories";
import { Textarea } from "@/components/ui/textarea";

interface ServiceFormProps {
  serviceData: {
    name: string;
    description: string;
    servicePrice: string;
    serviceType: string;
    category: CategoryType | "";
    selectedSubcategories: string[];
  };
  onChange: (name: string, value: any) => void;
  onCategoryChange: (value: CategoryType) => void;
  onSubcategoriesChange: (value: string) => void;
  onRemoveSubcategory: (value: string) => void;
}

export const ServiceForm = ({
  serviceData,
  onChange,
  onCategoryChange,
  onSubcategoriesChange,
  onRemoveSubcategory
}: ServiceFormProps) => {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={serviceData.name}
          onChange={(e) => onChange("name", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          placeholder="Your service name"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Brief Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={serviceData.description}
          onChange={(e) => onChange("description", e.target.value)}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          placeholder="Describe what you're offering"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="servicePrice" className="block text-sm font-medium text-gray-700">
          Price
        </Label>
        <Input
          type="number"
          id="servicePrice"
          name="servicePrice"
          value={serviceData.servicePrice}
          onChange={(e) => onChange("servicePrice", e.target.value)}
          className="w-full"
          placeholder="0.00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">
          Service Type
        </Label>
        <Select 
          value={serviceData.serviceType} 
          onValueChange={(value) => onChange("serviceType", value)}
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

      <ServiceCategories
        category={serviceData.category}
        selectedSubcategories={serviceData.selectedSubcategories}
        onCategoryChange={onCategoryChange}
        onSubcategoriesChange={onSubcategoriesChange}
        onRemoveSubcategory={onRemoveSubcategory}
      />
    </>
  );
};
