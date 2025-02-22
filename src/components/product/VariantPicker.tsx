
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
          const isSelected = selectedVariant === variant.id;
          
          return (
            <Card
              key={variant.id}
              className={`p-4 cursor-pointer transition-all relative overflow-visible shadow-sm hover:shadow-md ${
                isSelected
                  ? "ring-2 ring-black shadow-md"
                  : "hover:ring-1 hover:ring-black/50"
              } ${variant.highlight && !isSelected ? "ring-1 ring-black/10" : ""}`}
              onClick={() => onVariantChange?.(variant.id)}
            >
              {badge && (
                <div className={`absolute -top-3 left-6 ${
                  variant.highlight 
                    ? "bg-black text-white" 
                    : "bg-white text-black border border-gray-200"
                } px-3 py-0.5 rounded-full text-xs font-medium shadow-sm`}>
                  {badge}
                </div>
              )}
              
              <div className="space-y-2">
                {/* Header section with name and price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? "border-black" : "border-gray-300"
                    }`}>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-black" />
                      )}
                    </div>
                    <h3 className="text-base font-medium">{variant.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-lg font-bold">${variant.price}</div>
                    {variant.comparePrice && (
                      <div className="text-xs text-gray-500 line-through">
                        ${variant.comparePrice}
                      </div>
                    )}
                  </div>
                </div>

                {/* Features section */}
                <div className="flex flex-row gap-2 flex-wrap">
                  {variant.features && variant.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs"
                    >
                      <Star className="h-3 w-3" />
                      {feature}
                    </span>
                  ))}
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
