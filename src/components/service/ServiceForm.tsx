
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ProductEditor } from "@/components/product/ProductEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ServiceFeatures } from "@/components/service/ServiceFeatures";
import { ServiceCategories } from "@/components/service/ServiceCategories";
import type { ServiceType } from "@/constants/service-categories";
import type { CategoryType } from "@/constants/service-categories";

interface ServiceFormProps {
  serviceName: string;
  serviceDescription: string;
  price: string;
  serviceType: ServiceType;
  features: string[];
  category: CategoryType | "";
  selectedSubcategories: string[];
  isSaving?: boolean;
  onServiceNameChange: (value: string) => void;
  onServiceDescriptionChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onServiceTypeChange: (value: ServiceType) => void;
  onAddFeature: () => void;
  onRemoveFeature: (index: number) => void;
  onFeatureChange: (index: number, value: string) => void;
  onCategoryChange: (value: CategoryType | "") => void;
  onSubcategoriesChange: (value: string) => void;
  onRemoveSubcategory: (value: string) => void;
  onSave: () => void;
}

export function ServiceForm({
  serviceName,
  serviceDescription,
  price,
  serviceType,
  features,
  category,
  selectedSubcategories,
  isSaving = false,
  onServiceNameChange,
  onServiceDescriptionChange,
  onPriceChange,
  onServiceTypeChange,
  onAddFeature,
  onRemoveFeature,
  onFeatureChange,
  onCategoryChange,
  onSubcategoriesChange,
  onRemoveSubcategory,
  onSave,
}: ServiceFormProps) {
  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-base font-medium mb-2 block">
                Service Name
              </Label>
              <Input
                id="name"
                value={serviceName}
                onChange={(e) => onServiceNameChange(e.target.value)}
                placeholder="Enter your service name"
                className="h-11"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-base font-medium mb-2 block">
                Description
              </Label>
              <ProductEditor
                value={serviceDescription}
                onChange={onServiceDescriptionChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="price" className="text-base font-medium mb-2 block">
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => onPriceChange(e.target.value)}
                  placeholder="Enter service price"
                  className="h-11"
                />
              </div>

              <div>
                <Label htmlFor="type" className="text-base font-medium mb-2 block">
                  Service Type
                </Label>
                <Select value={serviceType} onValueChange={onServiceTypeChange}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one time">One Time</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <ServiceFeatures
            features={features}
            onAddFeature={onAddFeature}
            onRemoveFeature={onRemoveFeature}
            onFeatureChange={onFeatureChange}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <ServiceCategories
            category={category}
            selectedSubcategories={selectedSubcategories}
            onCategoryChange={onCategoryChange}
            onSubcategoriesChange={onSubcategoriesChange}
            onRemoveSubcategory={onRemoveSubcategory}
          />
        </div>

        <div className="flex justify-end">
          <Button
            onClick={onSave}
            disabled={isSaving || !serviceName.trim()}
            className="px-6"
          >
            {isSaving ? "Saving..." : "Save Service"}
          </Button>
        </div>
      </div>
    </div>
  );
}
