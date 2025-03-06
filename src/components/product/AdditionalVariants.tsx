import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Variant } from "./types/variants";
import { Package, ChevronDown, ChevronUp } from "lucide-react";
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

  const handleCheckboxChange = (productName: string, checked: boolean) => {
    const selectedVariantId = selectedVariants[productName] || 
      (productGroups[productName]?.[0]?.id || '');
    
    if (selectedVariantId) {
      const newSelected = checked 
        ? [...selectedAdditional, selectedVariantId]
        : selectedAdditional.filter(id => id !== selectedVariantId);
      
      setSelectedAdditional(newSelected);
      
      if (onAdditionalSelect) {
        onAdditionalSelect(selectedVariantId, checked);
      }
    }
  };

  const handleVariantChange = (productName: string, variantId: string) => {
    // If the product was already selected (checkbox checked)
    const isProductSelected = selectedAdditional.some(id => 
      productGroups[productName].some(v => v.id === id)
    );
    
    // Remove any previously selected variant for this product
    const filtered = selectedAdditional.filter(id => 
      !productGroups[productName].some(v => v.id === id)
    );
    
    // Add the newly selected variant if the product was checked
    const newSelected = isProductSelected ? [...filtered, variantId] : filtered;
    
    setSelectedVariants(prev => ({
      ...prev,
      [productName]: variantId
    }));
    
    setSelectedAdditional(newSelected);
    
    if (isProductSelected && onAdditionalSelect) {
      // First deselect old variant if there was one
      const oldVariantId = selectedVariants[productName];
      if (oldVariantId) {
        onAdditionalSelect(oldVariantId, false);
      }
      // Then select the new variant
      onAdditionalSelect(variantId, true);
    }
  };

  const isProductSelected = (productName: string) => {
    return selectedAdditional.some(id => 
      productGroups[productName].some(v => v.id === id)
    );
  };

  const getSelectedVariantPrice = (productName: string) => {
    const variantId = selectedVariants[productName] || productGroups[productName][0].id;
    const variant = productGroups[productName].find(v => v.id === variantId);
    return variant ? variant.price : 0;
  };

  const formatPrice = (price: string | number) => {
    if (typeof price === 'number') {
      return price.toFixed(2);
    }
    return price;
  };

  return (
    <Card className={`p-4 border border-dashed ${className}`}>
      <h3 className="text-sm font-medium mb-3">Often purchased together:</h3>
      <div className="space-y-3">
        {Object.entries(productGroups).map(([productName, productVariants]) => {
          const isSelected = isProductSelected(productName);
          const selectedVariantId = selectedVariants[productName] || productVariants[0].id;
          
          return (
            <div key={productName} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id={`addon-${productName}`} 
                    checked={isSelected}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(productName, checked === true)
                    }
                  />
                  <Label 
                    htmlFor={`addon-${productName}`} 
                    className="text-sm cursor-pointer font-medium"
                  >
                    {productName}
                  </Label>
                </div>
                <div className="text-sm font-semibold">
                  ${formatPrice(getSelectedVariantPrice(productName))}
                </div>
              </div>
              
              {productVariants.length > 1 && (
                <div className="ml-7">
                  <Select
                    value={selectedVariantId}
                    onValueChange={(value) => handleVariantChange(productName, value)}
                    disabled={!isSelected}
                  >
                    <SelectTrigger className="w-full h-8 text-xs bg-background">
                      <SelectValue placeholder="Select variant" />
                    </SelectTrigger>
                    <SelectContent>
                      {productVariants.map((variant) => (
                        <SelectItem key={variant.id} value={variant.id} className="text-xs">
                          {variant.label || 'Standard'} - ${formatPrice(variant.price)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
