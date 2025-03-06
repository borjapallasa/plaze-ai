
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Variant } from "./types/variants";

interface AdditionalVariantsProps {
  variants: Variant[];
  selectedMainVariant?: string;
  onAdditionalSelect?: (variantId: string, selected: boolean) => void;
  className?: string;
}

export function AdditionalVariants({
  variants,
  selectedMainVariant,
  onAdditionalSelect,
  className = ""
}: AdditionalVariantsProps) {
  const [selectedAdditional, setSelectedAdditional] = useState<string[]>([]);
  
  // Filter out the main selected variant
  const additionalVariants = variants.filter(v => v.id !== selectedMainVariant);
  
  if (additionalVariants.length === 0) {
    return null;
  }

  const handleCheckboxChange = (variantId: string, checked: boolean) => {
    const newSelected = checked 
      ? [...selectedAdditional, variantId]
      : selectedAdditional.filter(id => id !== variantId);
    
    setSelectedAdditional(newSelected);
    
    if (onAdditionalSelect) {
      onAdditionalSelect(variantId, checked);
    }
  };

  return (
    <Card className={`p-4 border border-dashed ${className}`}>
      <h3 className="text-sm font-medium mb-3">Often purchased together:</h3>
      <div className="space-y-3">
        {additionalVariants.map((variant) => (
          <div key={variant.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Checkbox 
                id={`addon-${variant.id}`} 
                checked={selectedAdditional.includes(variant.id)}
                onCheckedChange={(checked) => 
                  handleCheckboxChange(variant.id, checked === true)
                }
              />
              <Label htmlFor={`addon-${variant.id}`} className="text-sm cursor-pointer">
                {variant.name}
              </Label>
            </div>
            <div className="text-sm font-semibold">
              ${typeof variant.price === 'number' ? variant.price.toFixed(2) : variant.price}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
