
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Variant } from "./types/variants";

interface VariantPickerProps {
  variants: Variant[];
  selectedVariant?: string;
  onVariantChange?: (variantId: string) => void;
  onAddToCart?: () => void;
  className?: string;
}

export function VariantPicker({
  variants,
  selectedVariant,
  onVariantChange,
  onAddToCart,
  className = ""
}: VariantPickerProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-lg font-semibold">Choose your package</h2>
      <div className="grid gap-4">
        {variants.map((variant) => (
          <Card
            key={variant.id}
            className={`p-4 cursor-pointer transition-all ${
              selectedVariant === variant.id
                ? "ring-2 ring-primary"
                : "hover:border-primary"
            }`}
            onClick={() => onVariantChange?.(variant.id)}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1.5">
                <h3 className="font-medium">{variant.name}</h3>
                {variant.features && variant.features.length > 0 && (
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {variant.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                )}
                {variant.tags && variant.tags.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {variant.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-secondary text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="font-medium">€{variant.price}</div>
                {variant.comparePrice && (
                  <div className="text-sm text-muted-foreground line-through">
                    €{variant.comparePrice}
                  </div>
                )}
                {variant.highlight && (
                  <div className="text-xs text-primary font-medium mt-1">
                    Best value
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
      {onAddToCart && (
        <Button
          className="w-full"
          size="lg"
          onClick={onAddToCart}
          disabled={!selectedVariant}
        >
          Add to Cart
        </Button>
      )}
    </div>
  );
}
