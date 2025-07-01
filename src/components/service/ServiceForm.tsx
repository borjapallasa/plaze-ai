
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ProductEditor } from "@/components/product/ProductEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ServiceFeatures } from "@/components/service/ServiceFeatures";
import { ServiceCategories } from "@/components/service/ServiceCategories";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
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
  dangerZone?: React.ReactNode;
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
  dangerZone,
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
    <div className="w-full max-w-[1400px] mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 pt-2 sm:pt-3">
          <Link to="/seller/services">
            <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 mt-1">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="w-full">
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold break-words pr-2">Edit Service</h1>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-muted-foreground">Service details and configuration</p>
              <div className="flex items-center gap-4">
                <Select value={status} onValueChange={onStatusChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
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
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-8">
          <div className="space-y-3 sm:space-y-6">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-3 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
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
                    placeholder="Write your service description..."
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
          </div>
        </div>

        <div className="lg:col-span-4 self-start">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-3 sm:p-6">
            <ServiceCategories
              category={category}
              selectedSubcategories={selectedSubcategories}
              onCategoryChange={onCategoryChange}
              onSubcategoriesChange={onSubcategoriesChange}
              onRemoveSubcategory={onRemoveSubcategory}
            />
            
            {dangerZone}
          </div>
        </div>
      </div>
    </div>
  );
}
