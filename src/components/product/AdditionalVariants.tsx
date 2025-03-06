
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Variant } from "./types/variants";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

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
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  
  // Filter out the main selected variant
  const additionalVariants = variants.filter(v => v.id !== selectedMainVariant);
  
  // Group variants by name to create product groups
  const productGroups = additionalVariants.reduce((groups, variant) => {
    const name = variant.name || 'Unknown Product';
    if (!groups[name]) {
      groups[name] = [];
    }
    groups[name].push(variant);
    return groups;
  }, {} as Record<string, Variant[]>);
  
  if (Object.keys(productGroups).length === 0) {
    return null;
  }

  const handleVariantChange = (productName: string, variantId: string) => {
    // Automatically select the variant when it changes
    const oldVariantId = selectedVariants[productName] || 
      productGroups[productName].find(v => selectedAdditional.includes(v.id))?.id;
    
    if (oldVariantId && oldVariantId !== variantId) {
      // Deselect old variant
      if (onAdditionalSelect) {
        onAdditionalSelect(oldVariantId, false);
      }
    }
    
    // Always select the new variant
    if (!selectedAdditional.includes(variantId)) {
      setSelectedAdditional(prev => [...prev.filter(id => id !== oldVariantId), variantId]);
      
      if (onAdditionalSelect) {
        onAdditionalSelect(variantId, true);
      }
    }
    
    // Update the selected variant for this product
    setSelectedVariants(prev => ({
      ...prev,
      [productName]: variantId
    }));
  };

  const formatPrice = (price: string | number) => {
    if (typeof price === 'number') {
      return price.toFixed(2);
    }
    return price;
  };

  return (
    <Card className={`p-4 border border-dashed ${className}`}>
      <h3 className="text-lg font-medium mb-4">Frequently Purchased Together</h3>
      <div className="space-y-5">
        {Object.entries(productGroups).map(([productName, productVariants]) => {
          const selectedVariantId = selectedVariants[productName] || productVariants[0].id;
          const selectedVariant = productVariants.find(v => v.id === selectedVariantId);
          
          // Select the first variant by default when component mounts
          if (!selectedVariants[productName]) {
            setTimeout(() => {
              handleVariantChange(productName, productVariants[0].id);
            }, 0);
          }
          
          return (
            <div key={productName} className="border rounded-md p-3 hover:border-primary/50 transition-colors">
              <div className="flex flex-col gap-3">
                {/* Product name and price */}
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-base">{productName}</h4>
                  <div className="text-sm font-semibold">
                    ${formatPrice(selectedVariant?.price || 0)}
                  </div>
                </div>
                
                {/* Variant selection dropdown */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Select Option:
                  </label>
                  <Select
                    value={selectedVariantId}
                    onValueChange={(value) => handleVariantChange(productName, value)}
                  >
                    <SelectTrigger className="w-full h-9 text-sm">
                      <SelectValue placeholder="Select variant" />
                    </SelectTrigger>
                    <SelectContent>
                      {productVariants.map((variant) => (
                        <SelectItem key={variant.id} value={variant.id} className="text-sm">
                          {variant.label || productName} - ${formatPrice(variant.price)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
