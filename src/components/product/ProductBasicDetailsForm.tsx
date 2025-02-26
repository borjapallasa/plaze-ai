
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductEditor } from "@/components/product/ProductEditor";

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
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Enter product name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <ProductEditor 
          value={productDescription}
          onChange={setProductDescription}
        />
      </div>
    </div>
  );
}
