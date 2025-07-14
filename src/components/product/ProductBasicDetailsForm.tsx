
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProductBasicDetailsFormProps {
  productName: string;
  setProductName: (value: string) => void;
  productDescription: string;
  setProductDescription: (value: string) => void;
}

export function ProductBasicDetailsForm({
  productName,
  setProductName,
  productDescription,
  setProductDescription,
}: ProductBasicDetailsFormProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-4">Basic Details</h2>
      
      <div className="space-y-2">
        <Label htmlFor="product-name">Product Name *</Label>
        <Input
          id="product-name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Enter product name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="product-description">Description</Label>
        <Textarea
          id="product-description"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          placeholder="Describe your product"
          rows={4}
        />
      </div>
    </div>
  );
}
