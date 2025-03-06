
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Variant } from "./types/variants";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

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

  const handleCheckboxChange = (productName: string, checked: boolean) => {
    const variants = productGroups[productName];
    const variantId = selectedVariants[productName] || variants[0].id;
    
    if (checked) {
      // Select this variant
      if (!selectedAdditional.includes(variantId)) {
        setSelectedAdditional(prev => [...prev, variantId]);
        
        if (onAdditionalSelect) {
          onAdditionalSelect(variantId, true);
        }
      }
    } else {
      // Deselect this variant
      if (selectedAdditional.includes(variantId)) {
        setSelectedAdditional(prev => prev.filter(id => id !== variantId));
        
        if (onAdditionalSelect) {
          onAdditionalSelect(variantId, false);
        }
      }
    }
  };

  const handleVariantChange = (productName: string, variantId: string) => {
    // Deselect old variant if it was selected
    const oldVariantId = selectedVariants[productName];
    if (oldVariantId && selectedAdditional.includes(oldVariantId)) {
      if (onAdditionalSelect) {
        onAdditionalSelect(oldVariantId, false);
      }
      setSelectedAdditional(prev => prev.filter(id => id !== oldVariantId));
    }
    
    // Update the selected variant for this product
    setSelectedVariants(prev => ({
      ...prev,
      [productName]: variantId
    }));
    
    // If the product is checked, also select the new variant
    if (oldVariantId && selectedAdditional.includes(oldVariantId)) {
      setSelectedAdditional(prev => [...prev, variantId]);
      
      if (onAdditionalSelect) {
        onAdditionalSelect(variantId, true);
      }
    }
  };

  const formatPrice = (price: string | number) => {
    if (typeof price === 'number') {
      return price.toFixed(2);
    }
    return price;
  };

  return (
    <Card className={cn("p-4 bg-background border border-border shadow-sm", className)}>
      <h3 className="text-base font-semibold mb-3">Frequently Purchased Together</h3>
      <div className="space-y-2.5">
        {Object.entries(productGroups).map(([productName, productVariants]) => {
          const selectedVariantId = selectedVariants[productName] || productVariants[0].id;
          const selectedVariant = productVariants.find(v => v.id === selectedVariantId);
          const isSelected = selectedAdditional.includes(selectedVariantId);
          
          // Initialize selected variant if not set
          if (!selectedVariants[productName]) {
            setTimeout(() => {
              setSelectedVariants(prev => ({
                ...prev,
                [productName]: productVariants[0].id
              }));
            }, 0);
          }
          
          return (
            <div key={productName} className="flex items-center gap-3 p-1.5 rounded hover:bg-accent/5 transition-colors">
              {/* Checkbox for selection */}
              <Checkbox 
                id={`product-${productName}`}
                checked={isSelected}
                onCheckedChange={(checked) => handleCheckboxChange(productName, checked === true)}
                className="h-4 w-4"
              />
              
              {/* Product name and price */}
              <div className="flex-1 flex items-center justify-between min-w-0">
                <label 
                  htmlFor={`product-${productName}`}
                  className="font-medium text-sm cursor-pointer flex-1 truncate"
                >
                  {productName}
                  <span className="ml-2 text-sm font-semibold text-muted-foreground">
                    ${formatPrice(selectedVariant?.price || 0)}
                  </span>
                </label>
              </div>
              
              {/* Variant selection dropdown */}
              <Select
                value={selectedVariantId}
                onValueChange={(value) => handleVariantChange(productName, value)}
                disabled={!isSelected}
              >
                <SelectTrigger className="w-[100px] h-8 text-xs">
                  <SelectValue placeholder="Options" />
                </SelectTrigger>
                <SelectContent>
                  {productVariants.map((variant) => (
                    <SelectItem key={variant.id} value={variant.id} className="text-xs">
                      {variant.label || "Option"} - ${formatPrice(variant.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
