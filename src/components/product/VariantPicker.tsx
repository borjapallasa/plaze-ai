
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Variant } from "./types/variants";

interface VariantPickerProps {
  variants: Variant[];
  selectedVariant?: string;
  onVariantChange?: (variantId: string) => void;
  onAddToCart?: () => void;
  className?: string;
}

const getBadgeLabel = (index: number, variant: Variant) => {
  if (index === 0) return "Most Popular";
  if (variant.highlight) return "Best Value";
  if (index === 2) return "Most Complete";
  return null;
};

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
        {variants.map((variant, index) => {
          const badge = getBadgeLabel(index, variant);
          
          return (
            <Card
              key={variant.id}
              className={`p-6 cursor-pointer transition-all relative overflow-visible ${
                selectedVariant === variant.id
                  ? "ring-2 ring-black"
                  : "hover:ring-1 hover:ring-black/50"
              } ${variant.highlight ? "ring-2 ring-black" : ""}`}
              onClick={() => onVariantChange?.(variant.id)}
            >
              {badge && (
                <div className={`absolute -top-3 left-6 ${
                  variant.highlight 
                    ? "bg-black text-white" 
                    : "bg-white text-black border border-gray-200"
                } px-4 py-1 rounded-full text-sm font-medium`}>
                  {badge}
                </div>
              )}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedVariant === variant.id ? "border-black" : "border-gray-300"
                    }`}>
                      {selectedVariant === variant.id && (
                        <div className="w-3 h-3 rounded-full bg-black" />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold">{variant.name}</h3>
                  </div>
                  {variant.features && variant.features.length > 0 && (
                    <ul className="mt-3 space-y-2 text-gray-600">
                      {variant.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Star className="h-4 w-4 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                  {variant.tags && variant.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-3">
                      {variant.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs whitespace-nowrap"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="text-2xl font-bold">${variant.price}</div>
                  {variant.comparePrice && (
                    <div className="text-sm text-gray-500 line-through">
                      ${variant.comparePrice}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
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
