
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ServiceCategories } from "@/components/service/ServiceCategories";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { ServiceType } from "@/constants/service-categories";
import type { CategoryType } from "@/constants/service-categories";
import type { ServiceStatus } from "@/components/expert/types";

interface NewServiceFormProps {
  serviceName: string;
  price: string;
  serviceType: ServiceType;
  category: CategoryType | "";
  selectedSubcategories: string[];
  status: ServiceStatus;
  isSaving?: boolean;
  onServiceNameChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onServiceTypeChange: (value: ServiceType) => void;
  onCategoryChange: (value: CategoryType | "") => void;
  onSubcategoriesChange: (value: string) => void;
  onRemoveSubcategory: (value: string) => void;
  onStatusChange: (value: ServiceStatus) => void;
  onSave: () => void;
}

export function NewServiceForm({
  serviceName,
  price,
  serviceType,
  category,
  selectedSubcategories,
  status,
  isSaving = false,
  onServiceNameChange,
  onPriceChange,
  onServiceTypeChange,
  onCategoryChange,
  onSubcategoriesChange,
  onRemoveSubcategory,
  onStatusChange,
  onSave,
}: NewServiceFormProps) {
  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 pt-2 sm:pt-3">
          <Link to="/sell">
            <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 mt-1">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="w-full">
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold break-words pr-2">Create New Service</h1>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-muted-foreground">Enter the details for your new service</p>
              <div className="flex items-center gap-4">
                <Select value={status} onValueChange={onStatusChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={onSave}
                  disabled={isSaving || !serviceName.trim()}
                >
                  {isSaving ? "Creating..." : "Create service"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="space-y-4">
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
              <Label htmlFor="category" className="text-base font-medium mb-2 block">
                Category
              </Label>
              <ServiceCategories
                category={category}
                selectedSubcategories={selectedSubcategories}
                onCategoryChange={onCategoryChange}
                onSubcategoriesChange={onSubcategoriesChange}
                onRemoveSubcategory={onRemoveSubcategory}
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
      </div>
    </div>
  );
}
