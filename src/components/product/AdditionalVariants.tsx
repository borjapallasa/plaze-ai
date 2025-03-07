
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
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    <div className={cn("relative", className)}>
      <Badge 
        variant="outline" 
        className="absolute -top-2.5 left-4 z-10 bg-background px-2.5 py-0.5 text-xs font-medium flex items-center gap-1.5 border-muted-foreground/20"
      >
        <Package className="h-3 w-3 text-primary" />
        Bundle & Save
      </Badge>
      
      <Card className="pt-4 pb-2.5 px-4 bg-gray-50/70 border border-gray-200/70 shadow-sm rounded-xl">
        <div className="space-y-1.5">
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
              <div key={productName} className="flex items-center gap-3 py-2 px-1.5 rounded hover:bg-white/90 transition-colors">
                <Checkbox 
                  id={`product-${productName}`}
                  checked={isSelected}
                  onCheckedChange={(checked) => handleCheckboxChange(productName, checked === true)}
                  className="h-4 w-4 mt-0.5"
                />
                
                <div className="flex items-center justify-between min-w-0 flex-1 gap-3">
                  <label 
                    htmlFor={`product-${productName}`}
                    className="text-sm cursor-pointer truncate flex items-center gap-1.5"
                  >
                    <span className="font-medium">{productName}</span>
                    <span className="mx-1">-</span>
                    <span className="font-medium">${formatPrice(selectedVariant?.price || 0)}</span>
                  </label>
                  
                  <Select
                    value={selectedVariantId}
                    onValueChange={(value) => handleVariantChange(productName, value)}
                    disabled={!isSelected}
                  >
                    <SelectTrigger className="w-[150px] h-8 text-xs border-muted">
                      <SelectValue placeholder="Options" />
                    </SelectTrigger>
                    <SelectContent className="min-w-[200px]">
                      {productVariants.map((variant) => (
                        <SelectItem key={variant.id} value={variant.id} className="text-xs">
                          {variant.label || "Option"} - ${formatPrice(variant.price)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
