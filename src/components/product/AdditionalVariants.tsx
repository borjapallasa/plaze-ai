
import React, { useState, useEffect } from "react";
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
        className="absolute -top-2 left-4 z-10 bg-background px-2 py-0.5 text-xs font-medium flex items-center gap-1.5 border-muted-foreground/20"
      >
        <Package className="h-3 w-3 text-primary" />
        Bundle & Save
      </Badge>

      <Card className="pt-4 pb-2.5 px-4 bg-gray-50 border border-gray-200/70 shadow-sm rounded-xl">
        <div className="space-y-1">
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
              <div key={productName} className="flex items-center gap-3 py-2 px-2 rounded hover:bg-white transition-colors">
                <div className="flex items-start pt-0.5">
                  <Checkbox
                    id={`product-${productUuid}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => handleCheckboxChange(productUuid, checked === true)}
                    className="h-4 w-4"
                  />
                </div>

                <div className="flex items-center justify-between min-w-0 flex-1 gap-3">
                  <label
                    htmlFor={`product-${productUuid}`}
                    className="text-sm cursor-pointer truncate flex items-center gap-1.5"
                  >
                    <span className="font-medium">{productName}</span>
                    <span className="mx-1">-</span>
                    <span className="font-medium">${formatPrice(selectedVariant?.variant_price || 0)}</span>
                  </label>

                  <Select
                    value={selectedVariantId}
                    onValueChange={(value) => handleVariantChange(productUuid, value)}
                    disabled={!isSelected || isDefaultVariant || !hasMultipleVariants}
                  >
                    <SelectTrigger 
                      className={cn(
                        "w-[180px] h-8 text-xs border-muted",
                        (isDefaultVariant || !hasMultipleVariants) && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <SelectValue placeholder="Options" />
                    </SelectTrigger>
                    <SelectContent className="min-w-[220px]">
                      {variants.map((variant) => (
                        <SelectItem key={variant.variant_uuid} value={variant.variant_uuid} className="text-xs">
                          {variant.variant_name || "Option"} - ${formatPrice(variant.variant_price)}
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
