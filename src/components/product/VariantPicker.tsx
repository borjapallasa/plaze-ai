
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VariantPickerProps {
  variants: any[];
  selectedVariant?: string;
  onVariantChange: (variantId: string) => void;
  onAddToCart: () => void;
  className?: string;
}

export function VariantPicker({
  variants,
  selectedVariant,
  onVariantChange,
  onAddToCart,
  className
}: VariantPickerProps) {
  return (
    <div className={className}>
      <div className="grid gap-4 mb-4">
        {variants.map((variant) => (
          <Card
            key={variant.id}
            className={cn(
              "relative p-4 cursor-pointer transition-all hover:border-primary",
              selectedVariant === variant.id && "border-primary"
            )}
            onClick={() => onVariantChange(variant.id)}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{variant.name}</h3>
                  {variant.highlight && (
                    <Badge className="bg-primary hover:bg-primary">Popular</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {variant.label}
                </p>
              </div>
              <div className="text-right">
                <div className="font-medium">${variant.price}</div>
                {variant.comparePrice && (
                  <div className="text-sm text-muted-foreground line-through">
                    ${variant.comparePrice}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="space-y-2">
        <Button className="w-full" onClick={onAddToCart}>
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
