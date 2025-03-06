
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Variant } from "./types/variants";
import { Package, ShoppingCart } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
    // Check if the product has a selected variant
    const isProductSelected = selectedAdditional.some(id => 
      productGroups[productName].some(v => v.id === id)
    );
    
    // If not selected, add it to selected items
    if (!isProductSelected) {
      const newSelected = [...selectedAdditional, variantId];
      setSelectedAdditional(newSelected);
      
      if (onAdditionalSelect) {
        onAdditionalSelect(variantId, true);
      }
    } else {
      // If already selected but changing variant
      // Remove the old variant and add the new one
      const oldVariantId = selectedVariants[productName] || 
        productGroups[productName].find(v => selectedAdditional.includes(v.id))?.id;
      
      const filtered = selectedAdditional.filter(id => id !== oldVariantId);
      const newSelected = [...filtered, variantId];
      
      setSelectedAdditional(newSelected);
      
      if (onAdditionalSelect && oldVariantId) {
        // Deselect old variant
        onAdditionalSelect(oldVariantId, false);
        // Select new variant
        onAdditionalSelect(variantId, true);
      }
    }
    
    // Update the selected variant for this product
    setSelectedVariants(prev => ({
      ...prev,
      [productName]: variantId
    }));
  };

  const handleAddToCart = (productName: string) => {
    const variantId = selectedVariants[productName] || productGroups[productName][0].id;
    
    // Toggle selection
    const isSelected = selectedAdditional.includes(variantId);
    
    if (isSelected) {
      // Remove from selected
      const newSelected = selectedAdditional.filter(id => id !== variantId);
      setSelectedAdditional(newSelected);
      
      if (onAdditionalSelect) {
        onAdditionalSelect(variantId, false);
      }
    } else {
      // Add to selected
      const newSelected = [...selectedAdditional, variantId];
      setSelectedAdditional(newSelected);
      
      if (onAdditionalSelect) {
        onAdditionalSelect(variantId, true);
      }
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
      <h3 className="text-lg font-medium mb-4">Frequently Purchased Together</h3>
      <div className="space-y-5">
        {Object.entries(productGroups).map(([productName, productVariants]) => {
          const isSelected = isProductSelected(productName);
          const selectedVariantId = selectedVariants[productName] || productVariants[0].id;
          const selectedVariant = productVariants.find(v => v.id === selectedVariantId);
          
          return (
            <div key={productName} className="border rounded-md p-3 hover:border-primary/50 transition-colors">
              <div className="flex flex-col gap-3">
                {/* Product name and price */}
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-base">{productName}</h4>
                  <div className="text-sm font-semibold">
                    ${formatPrice(getSelectedVariantPrice(productName))}
                  </div>
                </div>
                
                {/* Variant selection dropdown */}
                <div className="mb-2">
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
                
                {/* Add/Remove button */}
                <Button 
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className="w-full"
                  onClick={() => handleAddToCart(productName)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isSelected ? "Remove" : "Add to Cart"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
