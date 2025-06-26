
import React, { useState } from "react";
import { useProductVariants } from "@/hooks/use-product-variants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";

interface ProductVariant {
  variant_uuid: string;
  name: string;
  price: number;
  compare_price?: number;
  files_link?: string;
  additional_details?: string;
}

interface VariantSelectorProps {
  productUuid: string;
  onSelect: (variant: ProductVariant) => void;
  selectedVariant: ProductVariant | null;
}

export function VariantSelector({ productUuid, onSelect, selectedVariant }: VariantSelectorProps) {
  const { data: variants, isLoading, error } = useProductVariants(productUuid);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Select Variant</Label>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading variants...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <Label>Select Variant</Label>
        <div className="text-center py-4 text-muted-foreground">
          <p>Error loading variants. Please try again.</p>
        </div>
      </div>
    );
  }

  if (!variants?.length) {
    return (
      <div className="space-y-2">
        <Label>Select Variant</Label>
        <div className="text-center py-4 text-muted-foreground">
          <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No variants found for this product.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>Select Variant</Label>
      <div className="max-h-48 overflow-y-auto space-y-2">
        {variants.map((variant) => {
          const variantData: ProductVariant = {
            variant_uuid: variant.id,
            name: variant.name,
            price: variant.price,
            compare_price: variant.comparePrice,
            files_link: variant.filesLink,
            additional_details: variant.additionalDetails,
          };

          return (
            <Card
              key={variant.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedVariant?.variant_uuid === variant.id
                  ? "ring-2 ring-primary border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => onSelect(variantData)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{variant.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="default" className="text-xs font-medium">
                        ${variant.price}
                      </Badge>
                      {variant.comparePrice > 0 && variant.comparePrice !== variant.price && (
                        <Badge variant="outline" className="text-xs line-through text-muted-foreground">
                          ${variant.comparePrice}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
