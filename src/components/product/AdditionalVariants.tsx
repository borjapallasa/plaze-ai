
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Package, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AdditionalVariantsProps {
  relatedProductsWithVariants: any[]
  onAdditionalSelect?: (variantId: string, selected: boolean) => void;
  className?: string;
}

export function AdditionalVariants({
  relatedProductsWithVariants,
  onAdditionalSelect,
  className = ""
}: AdditionalVariantsProps) {
  const [selectedAdditional, setSelectedAdditional] = useState<string[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  // Group related products by UUID to create product groups
  const productGroups = relatedProductsWithVariants.reduce<Record<string, { productName: string; variants: any[] }>>((groups, product) => {
    const productUuid = product.related_product_uuid;

    if (!groups[productUuid]) {
      groups[productUuid] = {
        productName: product.related_product_name,
        variants: []
      };
    }

    groups[productUuid].variants.push(product);
    return groups;
  }, {} as Record<string, { productName: string; variants: any[] }>);

  // Log product groups for debugging
  useEffect(() => {
    console.log("Product groups:", productGroups);
  }, [productGroups]);

  if (Object.keys(productGroups).length === 0) {
    return null;
  }

  const handleCheckboxChange = (productUuid: string, checked: boolean) => {
    const variants = productGroups[productUuid].variants;
    const variantId = selectedVariants[productUuid] || variants[0].variant_uuid;

    console.log("Toggle variant:", variantId, checked);
    
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

  const handleVariantChange = (productUuid: string, variantId: string) => {
    // Deselect old variant if it was selected
    const oldVariantId = selectedVariants[productUuid];
    if (oldVariantId && selectedAdditional.includes(oldVariantId)) {
      if (onAdditionalSelect) {
        onAdditionalSelect(oldVariantId, false);
      }
      setSelectedAdditional(prev => prev.filter(id => id !== oldVariantId));
    }

    // Update the selected variant for this product
    setSelectedVariants(prev => ({
      ...prev,
      [productUuid]: variantId
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
        className="absolute -top-2 left-4 z-10 bg-primary text-primary-foreground px-2 py-0.5 text-xs font-medium flex items-center gap-1.5"
      >
        <Package className="h-3 w-3" />
        Bundle & Save
      </Badge>

      <Card className="p-4 pt-3 bg-gray-50/50">
        <div className="space-y-3">
          {Object.entries(productGroups).map(([productUuid, { productName, variants }]) => {
            // Initialize and get the selected variant
            if (!selectedVariants[productUuid]) {
              setTimeout(() => {
                setSelectedVariants(prev => ({
                  ...prev,
                  [productUuid]: variants[0].variant_uuid
                }));
              }, 0);
            }
            
            const selectedVariantId = selectedVariants[productUuid] || variants[0].variant_uuid;
            const selectedVariant = variants.find(v => v.variant_uuid === selectedVariantId);
            const isSelected = selectedAdditional.includes(selectedVariantId);
            
            // Check if this is a default variant (product with no variants)
            const isDefaultVariant = selectedVariantId.startsWith('default-');
            const hasMultipleVariants = variants.length > 1;

            return (
              <div key={productName} className="grid grid-cols-[auto_1fr_auto_auto] gap-4 items-start py-2 px-2 rounded hover:bg-muted/50 transition-colors">
                {/* Checkbox */}
                <div className="pt-0.5">
                  <Checkbox
                    id={`product-${productUuid}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => handleCheckboxChange(productUuid, checked === true)}
                    className="h-4 w-4"
                  />
                </div>

                {/* Bundle Info - Two Line Layout */}
                <div className="flex flex-col min-w-0">
                  {/* Line 1: Product Title */}
                  <div className="bundle-primary">
                    <label
                      htmlFor={`product-${productUuid}`}
                      className="text-base font-semibold cursor-pointer text-foreground"
                    >
                      {productName}
                    </label>
                  </div>
                  
                  {/* Line 2: Variant Info */}
                  <div className="bundle-secondary flex items-center gap-1 mt-1">
                    <span className="text-sm text-muted-foreground">Variant:</span>
                    <span className="text-sm text-muted-foreground">
                      {selectedVariant?.variant_name || "Option"}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="bundle-price text-base font-medium text-foreground ml-4">
                  ${formatPrice(selectedVariant?.variant_price || 0)}
                </div>

                {/* Variant Picker */}
                {hasMultipleVariants && !isDefaultVariant && (
                  <Select
                    value={selectedVariantId}
                    onValueChange={(value) => handleVariantChange(productUuid, value)}
                  >
                    <SelectTrigger 
                      className={cn(
                        "bundle-variant-picker w-[200px] h-8 text-xs bg-white border border-gray-200 hover:bg-gray-50",
                        !isSelected && "opacity-50"
                      )}
                    >
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </SelectTrigger>
                    <SelectContent className="min-w-[220px] bg-white border border-gray-200 shadow-lg z-50">
                      {variants.map((variant) => (
                        <SelectItem key={variant.variant_uuid} value={variant.variant_uuid} className="text-xs hover:bg-gray-50">
                          {variant.variant_name || "Option"} — ${formatPrice(variant.variant_price)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
