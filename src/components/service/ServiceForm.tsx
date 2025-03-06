
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
import type { ServiceStatus } from "@/components/expert/types";

interface ServiceFormProps {
  serviceName: string;
  serviceDescription: string;
  price: string;
  serviceType: ServiceType;
  features: string[];
  category: CategoryType | "";
  selectedSubcategories: string[];
  isSaving?: boolean;
  status: ServiceStatus;
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
  onStatusChange: (value: ServiceStatus) => void;
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
  status,
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
  onStatusChange,
  onSave,
}: ServiceFormProps) {
  return (
    <div className="container mx-auto px-4 pb-8">
      {/* Header with status dropdown and save button */}
      <div className="sticky top-24 z-30 bg-background py-4 mb-6 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-semibold">{serviceName || "New Service"}</h1>
          <div className="flex items-center gap-4 self-end sm:self-auto">
            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={onSave}
              disabled={isSaving || !serviceName.trim()}
            >
              {isSaving ? "Saving..." : "Save Service"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - Left side (2/3 width on large screens) */}
        <div className="lg:col-span-2 space-y-6">
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
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
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

          <div className="bg-white rounded-lg shadow-sm p-6">
            <ServiceFeatures
              features={features}
              onAddFeature={onAddFeature}
              onRemoveFeature={onRemoveFeature}
              onFeatureChange={onFeatureChange}
            />
          </div>
        </div>

        {/* Sidebar - Right side (1/3 width on large screens) */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <ServiceCategories
              category={category}
              selectedSubcategories={selectedSubcategories}
              onCategoryChange={onCategoryChange}
              onSubcategoriesChange={onSubcategoriesChange}
              onRemoveSubcategory={onRemoveSubcategory}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
