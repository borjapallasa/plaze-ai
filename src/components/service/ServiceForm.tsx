
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductEditor } from "@/components/product/ProductEditor";
import { ServiceFeatures } from "@/components/service/ServiceFeatures";
import { ServiceCategories } from "@/components/service/ServiceCategories";
import { SERVICE_TYPES, CategoryType, ServiceType } from "@/constants/service-categories";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface ServiceFormProps {
  serviceName: string;
  serviceDescription: string;
  features: string[];
  price: string;
  serviceType: ServiceType;
  category: CategoryType | "";
  selectedSubcategories: string[];
  isSaving: boolean;
  onServiceNameChange: (value: string) => void;
  onServiceDescriptionChange: (value: string) => void;
  onAddFeature: () => void;
  onRemoveFeature: (index: number) => void;
  onFeatureChange: (index: number, value: string) => void;
  onPriceChange: (value: string) => void;
  onServiceTypeChange: (value: ServiceType) => void;
  onCategoryChange: (value: CategoryType) => void;
  onSubcategoriesChange: (value: string) => void;
  onRemoveSubcategory: (value: string) => void;
  onSave: () => void;
}

export function ServiceForm({
  serviceName,
  serviceDescription,
  features,
  price,
  serviceType,
  category,
  selectedSubcategories,
  isSaving,
  onServiceNameChange,
  onServiceDescriptionChange,
  onAddFeature,
  onRemoveFeature,
  onFeatureChange,
  onPriceChange,
  onServiceTypeChange,
  onCategoryChange,
  onSubcategoriesChange,
  onRemoveSubcategory,
  onSave,
}: ServiceFormProps) {
  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <div className="flex items-center justify-between mb-6">
        <Link to="/seller/services" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Link>
        <Button onClick={onSave} disabled={isSaving} className="min-w-[120px]">
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </div>

      <div className="space-y-4 sm:space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8">
          <Card className="p-4 sm:p-6">
            <div className="space-y-8">
              <div>
                <Label htmlFor="name" className="text-base font-medium mb-2 block">
                  Service Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter a clear, descriptive name for your service"
                  value={serviceName}
                  onChange={(e) => onServiceNameChange(e.target.value)}
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

              <ServiceFeatures 
                features={features}
                onAddFeature={onAddFeature}
                onRemoveFeature={onRemoveFeature}
                onFeatureChange={onFeatureChange}
              />

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="price" className="text-base font-medium mb-2 block">
                    Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Enter service price"
                    value={price}
                    onChange={(e) => onPriceChange(e.target.value)}
                    className="h-11 w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="type" className="text-base font-medium mb-2 block">
                    Service Type
                  </Label>
                  <Select 
                    value={serviceType} 
                    onValueChange={onServiceTypeChange}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select service type" />
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
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card className="p-4 sm:p-6 border border-border/40 bg-card/40">
            <h2 className="text-lg font-semibold tracking-tight mb-4">Service Organization</h2>
            <div className="space-y-4">
              <ServiceCategories 
                category={category}
                selectedSubcategories={selectedSubcategories}
                onCategoryChange={(value: CategoryType) => {
                  onCategoryChange(value);
                  onSubcategoriesChange("");
                }}
                onSubcategoriesChange={onSubcategoriesChange}
                onRemoveSubcategory={onRemoveSubcategory}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
