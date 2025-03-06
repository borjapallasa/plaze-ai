
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ProductEditor } from "@/components/product/ProductEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ServiceType } from "@/components/expert/types";

interface ServiceFormProps {
  serviceName: string;
  serviceDescription: string;
  price: string;
  serviceType: ServiceType;
  onServiceNameChange: (value: string) => void;
  onServiceDescriptionChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onServiceTypeChange: (value: ServiceType) => void;
}

export function ServiceForm({
  serviceName,
  serviceDescription,
  price,
  serviceType,
  onServiceNameChange,
  onServiceDescriptionChange,
  onPriceChange,
  onServiceTypeChange,
}: ServiceFormProps) {
  return (
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

      <div className="grid grid-cols-2 gap-6">
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
  );
}
