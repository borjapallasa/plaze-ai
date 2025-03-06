
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
import { Plus } from "lucide-react";

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
    <div className="container max-w-[1200px] mx-auto px-4 pb-8 pt-14">
      {/* Header with status dropdown and save button */}
      <div className="fixed top-[72px] left-0 right-0 z-30 bg-white border-b border-gray-200 py-4">
        <div className="container max-w-[1200px] mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">{serviceName ? serviceName : "New Service"}</h1>
          <div className="flex items-center gap-4">
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
              variant="default"
              className="bg-gray-500 hover:bg-gray-600"
            >
              {isSaving ? "Saving..." : "Save Service"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        {/* Main content - Left side (2/3 width on large screens) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-8">
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
                placeholder="Write your product description..."
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

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-base font-medium">Features</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 px-4"
                  onClick={onAddFeature}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>
              <ServiceFeatures
                features={features}
                onAddFeature={onAddFeature}
                onRemoveFeature={onRemoveFeature}
                onFeatureChange={onFeatureChange}
              />
            </div>
          </div>
        </div>

        {/* Sidebar - Right side (1/3 width on large screens) */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 p-6">
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
