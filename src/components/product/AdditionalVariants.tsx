
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Plus } from "lucide-react";

interface AdditionalVariant {
  related_product_uuid: string;
  related_product_name: string;
  related_product_price_from: number;
  variant_uuid: string;
  variant_name: string;
  variant_price: number;
  variant_tags?: string[];
  variant_files_link?: string;
}

interface AdditionalVariantsProps {
  relatedProductsWithVariants: AdditionalVariant[];
  onAdditionalSelect: (variantId: string, selected: boolean) => void;
  className?: string;
}

export function AdditionalVariants({
  relatedProductsWithVariants,
  onAdditionalSelect,
  className = ""
}: AdditionalVariantsProps) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [addedVariants, setAddedVariants] = useState<Set<string>>(new Set());

  if (!relatedProductsWithVariants || relatedProductsWithVariants.length === 0) {
    return null;
  }

  // Group variants by product
  const productGroups = relatedProductsWithVariants.reduce((acc, variant) => {
    if (!acc[variant.related_product_uuid]) {
      acc[variant.related_product_uuid] = {
        productName: variant.related_product_name,
        productPrice: variant.related_product_price_from,
        variants: []
      };
    }
    acc[variant.related_product_uuid].variants.push(variant);
    return acc;
  }, {} as Record<string, { productName: string; productPrice: number; variants: AdditionalVariant[] }>);

  const handleVariantSelect = (productUuid: string, variantUuid: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productUuid]: variantUuid
    }));
  };

  const handleAddVariant = (productUuid: string) => {
    const variants = productGroups[productUuid].variants;
    const selectedVariantUuid = selectedVariants[productUuid] || variants[0]?.variant_uuid;
    
    if (selectedVariantUuid) {
      const isAdding = !addedVariants.has(selectedVariantUuid);
      
      if (isAdding) {
        setAddedVariants(prev => new Set([...prev, selectedVariantUuid]));
      } else {
        setAddedVariants(prev => {
          const newSet = new Set(prev);
          newSet.delete(selectedVariantUuid);
          return newSet;
        });
      }
      
      onAdditionalSelect(selectedVariantUuid, isAdding);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold">Bundle & Save</h3>
      <div className="space-y-3">
        {Object.entries(productGroups).map(([productUuid, group]) => {
          const hasMultipleVariants = group.variants.length > 1;
          const selectedVariantUuid = selectedVariants[productUuid] || group.variants[0]?.variant_uuid;
          const selectedVariant = group.variants.find(v => v.variant_uuid === selectedVariantUuid);
          const isAdded = selectedVariantUuid && addedVariants.has(selectedVariantUuid);

          return (
            <Card key={productUuid} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{group.productName}</CardTitle>
                    {selectedVariant && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg font-bold">${selectedVariant.variant_price}</span>
                        {selectedVariant.variant_tags && selectedVariant.variant_tags.length > 0 && (
                          <div className="flex gap-1">
                            {selectedVariant.variant_tags.map((tag, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-3">
                  {hasMultipleVariants && (
                    <div className="flex-1">
                      <Select 
                        value={selectedVariantUuid || ""} 
                        onValueChange={(value) => handleVariantSelect(productUuid, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select variant" />
                        </SelectTrigger>
                        <SelectContent>
                          {group.variants.map((variant) => (
                            <SelectItem key={variant.variant_uuid} value={variant.variant_uuid}>
                              <div className="flex items-center justify-between w-full">
                                <span>{variant.variant_name}</span>
                                <span className="ml-2 font-medium">${variant.variant_price}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <Button
                    variant={isAdded ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleAddVariant(productUuid)}
                    className="whitespace-nowrap"
                  >
                    {isAdded ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Added
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
