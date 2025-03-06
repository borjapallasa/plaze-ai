
import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductEditor } from "@/components/product/ProductEditor";
import { ProductVariantsEditor } from "@/components/product/ProductVariants";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProductMainInfoPanelProps {
  productName: string;
  setProductName: (name: string) => void;
  productDescription: string;
  setProductDescription: (desc: string) => void;
  localVariants: any[];
  onAddVariant: () => void;
  onVariantsChange: (variants: any[]) => void;
}

export function ProductMainInfoPanel({
  productName,
  setProductName,
  productDescription,
  setProductDescription,
  localVariants,
  onAddVariant,
  onVariantsChange
}: ProductMainInfoPanelProps) {
  return (
    <Card className="p-3 sm:p-6">
      <div className="space-y-3 sm:space-y-4">
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
        <div className="pt-2">
          <div className="flex items-center justify-between mb-4">
            <Label>Variants</Label>
            <Button 
              onClick={onAddVariant} 
              variant="outline" 
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add variant
            </Button>
          </div>
          <ProductVariantsEditor
            variants={localVariants}
            onVariantsChange={onVariantsChange}
          />
        </div>
      </div>
    </Card>
  );
}
