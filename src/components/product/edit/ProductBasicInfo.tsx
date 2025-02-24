
import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ProductEditor } from "@/components/product/ProductEditor";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductVariantsEditor } from "@/components/product/ProductVariants";
import { Variant } from "@/components/product/types/variants";

interface ProductBasicInfoProps {
  productName: string;
  productDescription: string;
  variants: Variant[];
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onVariantsChange: (variants: Variant[]) => void;
  onAddVariant: () => void;
}

export function ProductBasicInfo({
  productName,
  productDescription,
  variants,
  onNameChange,
  onDescriptionChange,
  onVariantsChange,
  onAddVariant,
}: ProductBasicInfoProps) {
  return (
    <Card className="p-3 sm:p-6">
      <div className="space-y-3 sm:space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Enter product name"
            value={productName}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <ProductEditor value={productDescription} onChange={onDescriptionChange} />
        </div>
        <div className="pt-2">
          <div className="flex items-center justify-between mb-4">
            <Label>Variants</Label>
            <Button onClick={onAddVariant} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add variant
            </Button>
          </div>
          <ProductVariantsEditor variants={variants} onVariantsChange={onVariantsChange} />
        </div>
      </div>
    </Card>
  );
}
